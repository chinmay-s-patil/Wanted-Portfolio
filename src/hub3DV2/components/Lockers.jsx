import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/Lockers2/school_locker_row/optimized_lockers.gltf'
useGLTF.preload(MODEL_PATH)
/**
 * Lockers Component
 *
 * 3D School Locker Row placed against the front wall to the left.
 * Clickable component linking to /education (School Lockers Section) with drag-protected click handling.
 * Automatically snaps open locker doors closed flush with frame while preserving root FBX scale.
 */
export default function Lockers({
  position = [6.2, -0.6, 6.35],
  scale = [1.2, 1.2, 1.2],
  rotation = [0, -Math.PI / 2, 0],
  outlineColor = '#00ff66', // High contrast neon lime outline
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
      // 1. Close open locker doors by resetting rotated door matrices
      // ONLY target specific door mesh nodes (Cube.* and Cylinder.*), NEVER touch root nodes 0/1!
      const name = child.name || ''
      const isDoorNode = name.startsWith('Cube.') || name.startsWith('Cylinder.')
      if (isDoorNode && child.matrix && child.matrix.elements) {
        const e = child.matrix.elements
        const m0 = e[0]
        const m5 = e[5]
        // Detect rotated open door nodes and snap matrix flush
        if (Math.abs(m0 - 100) > 1 || Math.abs(m5) > 1) {
          const tx = e[12]
          const ty = e[13]
          const tz = e[14]
          child.matrix.set(
            100, 0, 0, 0,
            0, -0.00001629206793918314, -99.99999999999868, 0,
            0, 99.99999999999868, -0.00001629206793918314, 0,
            tx, ty, tz, 1
          )
          child.matrix.decompose(child.position, child.quaternion, child.scale)
        }
      }
      // 2. Material & shadow setup for all meshes
      if (child.isMesh) {
        if (child.material) {
          child.material.side = THREE.DoubleSide
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
          child.material.needsUpdate = true
        }
      }
    })
    // Force world matrix update for accurate 3D bounding box computation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)
    // Center X & Z midpoints and align bottom flush to Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.002
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
