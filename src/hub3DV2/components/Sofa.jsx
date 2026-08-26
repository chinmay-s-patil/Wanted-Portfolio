import React, { useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'

const MODEL_PATH = '/hubModels/sofa/sofa/scene.gltf'

useGLTF.preload(MODEL_PATH)

/**
 * Sofa Component
 *
 * Interactive 3D executive sofa model.
 * Supports hover state, cursor pointer change, and customizable silhouette outline.
 */
export default function Sofa({
  position = [0, -0.6, 0],
  scale = [1.3, 1.3, 1.3],
  rotation = [0, 0, 0],
  outlineColor = '#ffaa00', // Warm amber silhouette outline
  outlineThickness = 0.035,
  alwaysShowOutline = false,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
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
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick(e)
        }
      }}
      onPointerOver={(e) => {
        if (onClick) {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <group scale={scale}>
        <primitive object={clonedScene} />
        {(hovered || alwaysShowOutline) && (
          <TightSilhouetteOutline
            scene={clonedScene}
            color={outlineColor}
            thickness={outlineThickness}
          />
        )}
      </group>
    </group>
  )
}
