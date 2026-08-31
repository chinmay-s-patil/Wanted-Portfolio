import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/Lockers2/school_locker_row/optimized_lockers.glb'
// Centralized in Hub3DV2 preloadInBatches
// useGLTF.preload(MODEL_PATH)

/**
 * Lockers Component
 */
export default function Lockers({
  position = [6.2, -0.6, 6.35],
  scale = [1.2, 1.2, 1.2],
  rotation = [0, -Math.PI / 2, 0],
  outlineColor = '#00ff66',
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
      navigate('/education')
    }
  })
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      // 1. Close open locker doors by resetting door rotation
      const name = child.name || ''
      const isDoorNode = name.startsWith('Cube.') || name.startsWith('Cylinder.')
      if (isDoorNode) {
        child.rotation.set(0, 0, 0)
        child.quaternion.identity()
      }
      // 2. Material setup for all meshes
      if (child.isMesh && child.material) {
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace
        }
      }
    })
    // Force world matrix update for accurate 3D bounding box computation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)
    // Center X & Z midpoints and align bottom flush to Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    if (isFinite(centerX) && isFinite(centerZ) && isFinite(box.min.y)) {
      cloned.position.x = -centerX
      cloned.position.z = -centerZ
      cloned.position.y = -box.min.y + 0.002
      cloned.updateMatrix()
      cloned.updateMatrixWorld(true)
    }
    cloned.traverse((c) => { if (c !== cloned) c.matrixAutoUpdate = false; c.frustumCulled = true })
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
