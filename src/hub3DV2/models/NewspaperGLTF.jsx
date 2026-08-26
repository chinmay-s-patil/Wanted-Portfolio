import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/Newspaper/newspaper/scene.gltf'

useGLTF.preload(MODEL_PATH)

export default function NewspaperGLTF({
  position = [0.1, -0.36, 1.65],
  scale = [0.045, 0.045, 0.045],
  rotation = [0, 2.95, 0],
  onClick
}) {
  const { scene } = useGLTF(MODEL_PATH)

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.material) {
          child.material.side = THREE.DoubleSide
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
          child.material.needsUpdate = true
        }
      }
    })

    // Force matrix update to ensure 100% accurate bounding box computation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)

    // Center X & Z bounding box midpoints so the model origin is geometrically centered
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.002

    return cloned
  }, [scene])

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <group scale={scale}>
        <primitive object={clonedScene} />
      </group>
    </group>
  )
}
