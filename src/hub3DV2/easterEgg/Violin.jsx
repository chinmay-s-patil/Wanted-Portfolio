import React, { useMemo, useState, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/EasterEggs/ViolinStanding/violin/optimized_violin.glb'
// Centralized in Hub3DV2 preloadInBatches
// useGLTF.preload(MODEL_PATH)

/**
 * Violin Component (Easter Egg)
 */
export default function Violin({
  position = [-3.8, -0.6, 5.8],
  scale = [1.2, 1.2, 1.2],
  rotation = [0, Math.PI / 4, 0],
  onClick,
  onDoubleClick
}) {
  const [, setHovered] = useState(false)
  const { scene } = useGLTF(MODEL_PATH)
  const clickTimerRef = useRef(null)

  const violinGroup = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace
        }
      }
    })

    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    const rawHeight = box.max.y - box.min.y
    const targetHeight = 0.85 // ~85cm standing violin height
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.scale.setScalar(normScale)
    cloned.position.x = -centerX * normScale
    cloned.position.z = -centerZ * normScale
    cloned.position.y = -box.min.y * normScale
    cloned.updateMatrixWorld(true)

    cloned.traverse((child) => {
    })

    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    return wrapper
  }, [scene])

  if (!violinGroup) return null

  const handlePointerDown = (e) => {
    if (e.detail === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
      if (onDoubleClick) {
        onDoubleClick(e)
      }
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.detail === 1) {
      clickTimerRef.current = setTimeout(() => {
        if (onClick) {
          onClick(e)
        }
      }, 250)
    }
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    if (onDoubleClick) {
      onDoubleClick(e)
    }
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
      <primitive object={violinGroup} />
    </group>
  )
}
