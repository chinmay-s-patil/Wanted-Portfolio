import React, { useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'

const MODEL_PATH = '/hubModels/EasterEggs/TVRemote/tv_remote/scene.gltf'
useGLTF.preload(MODEL_PATH)

/**
 * TvRemote Component (Easter Egg TV Remote Pause Button)
 *
 * Vintage TV remote placed on the center coffee table.
 * Highlighted with bright neon yellow outline whenever an Easter egg video is playing.
 * Clicking the remote pauses or resumes TV video playback.
 */
export default function TvRemote({
  position = [0.35, -0.24, 2.60],
  scale = [1, 1, 1],
  rotation = [0, 0.4, 0],
  isActive = false,
  outlineColor = '#ffea00',
  outlineThickness = 0.008,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const { scene } = useGLTF(MODEL_PATH)

  const remoteGroup = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone()
          child.material.side = THREE.DoubleSide
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
          child.material.needsUpdate = true
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
    const targetHeight = 0.04 // ~4cm flat height on desk
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.scale.setScalar(normScale)
    cloned.position.x = -centerX * normScale
    cloned.position.z = -centerZ * normScale
    cloned.position.y = -box.min.y * normScale

    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    return wrapper
  }, [scene])

  if (!remoteGroup) return null

  const showHighlight = hovered || isActive

  return (
    <group
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
        if (onClick) onClick(e)
      }}
    >
      <primitive object={remoteGroup} />
      {showHighlight && (
        <TightSilhouetteOutline
          scene={remoteGroup}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
