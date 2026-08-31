import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/SofaSet/couchsofa_set/optimized_sofa.glb'

// Centralized in Hub3DV2 preloadInBatches
// useGLTF.preload(MODEL_PATH)

export default function SofaGLTF({
  position = [0, -0.6, 0],
  scale = [1.3, 1.3, 1.3],
  rotation = [0, 0, 0],
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

    // Force matrix update for exact 3D bounding box calculation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003

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
