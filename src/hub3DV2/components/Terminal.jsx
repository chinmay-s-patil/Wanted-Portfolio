import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/Terminal/display_terminal/scene.gltf'

useGLTF.preload(MODEL_PATH)

/**
 * Terminal Component
 *
 * Interactive 3D Retro Display Terminal Workstation placed along the right wall.
 * Clicking navigates directly to /solvers (Interactive Terminal Section) with drag-protected click handling.
 * Features glowing CRT emissive screen, neon green silhouette outline, and floor alignment.
 */
export default function Terminal({
  position = [8.2, -0.6, 1.5],
  scale = [0.55, 0.55, 0.55],
  rotation = [0, -Math.PI / 2, 0],
  outlineColor = '#00ff66', // High contrast neon green outline
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/solvers')
    }
  })

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
          if (child.material.emissiveMap) {
            child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
            child.material.emissiveIntensity = 1.6
          }
          child.material.needsUpdate = true
        }
      }
    })

    // Compute bounding box strictly over child meshes
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh) {
        box.expandByObject(child)
      }
    })

    // Center X & Z midpoints and align bottom flush to local Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y

    return cloned
  }, [scene])

  if (!clonedScene) return null

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
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
