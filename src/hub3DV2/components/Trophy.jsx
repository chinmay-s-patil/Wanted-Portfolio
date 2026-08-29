import React, { useRef, useState, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'

const MODEL_PATH = '/hubModels/Trophy/low_poly_trophy.glb'

/**
 * Trophy Component
 *
 * Golden low-poly trophy sitting on top of the fireplace mantel.
 * Interactive hover outline and click handler opening the Attribution Modal.
 */
export default function Trophy({
  position = [1.8, 1.02, -6.3],
  rotation = [0, 0, 0],
  scale = [0.45, 0.45, 0.45],
  alwaysShowOutline = false,
  onClick,
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef()

  // Auto-center and apply polished brass/gold metalness
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.updateMatrixWorld(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#ffd700',
            metalness: 0.92,
            roughness: 0.22
          })
        }
      }
    })

    const box = new THREE.Box3().setFromObject(cloned)
    if (!box.isEmpty()) {
      const center = new THREE.Vector3()
      box.getCenter(center)
      cloned.position.x = -center.x
      cloned.position.z = -center.z
      cloned.position.y = -box.min.y
    }
    return cloned
  }, [scene])

  if (!clonedScene) return null

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick()
      }}
    >
      <primitive object={clonedScene} />

      {/* Golden Highlight Outline */}
      <TightSilhouetteOutline
        targetMesh={clonedScene}
        color="#ffd700"
        thickness={0.012}
        visible={hovered || alwaysShowOutline}
        pulse={hovered}
      />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
