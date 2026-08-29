import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/Binder/binder_notebook/optimized_binder.glb'
useGLTF.preload(MODEL_PATH)

/**
 * Binder Component
 */
export default function Binder({
  position = [-0.35, -0.25, 1.60],
  scale = [2.5, 2.5, 2.5],
  rotation = [0, 0.2, 0],
  outlineColor = '#ffea00',
  outlineThickness = 0.007,
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
      navigate('/professionaldiary')
    }
  })
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh) {
        const name = (child.name || '').toLowerCase()
        const parentName = (child.parent?.name || '').toLowerCase()
        // Hide opened binder mesh so only closed binder is rendered
        if (name.includes('opened') || parentName.includes('opened')) {
          child.visible = false
        } else {
          child.visible = true
          if (child.material && child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
        }
      }
    })
    // Force matrix update to compute bounding box of ONLY visible meshes
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })
    // Center X & Z midpoints and align bottom flush to Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    if (isFinite(centerX) && isFinite(centerZ)) {
      cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.002
    }
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
