import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/Props/Globe2/antique_globe (1)/scene.gltf'
useGLTF.preload(MODEL_PATH)

/**
 * Globe Component (Globe2)
 *
 * Vintage Antique Globe model from /public/hubModels/Props/Globe2/
 * - Entire model rotated 180 degrees.
 * - Rotates the globe surface texture continuously via UV map offset scrolling while model geometry stays still.
 */
export default function Globe({
  position = [-6.9, 0.9, 5.4],
  scale = [2, 2, 2],
  rotation = [0, 0, 0]
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const textureRef = useRef(null)

  const globeData = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    let foundTexture = null

    cloned.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          // Clone material and texture to allow independent UV animation
          child.material = child.material.clone()
          child.material.side = THREE.DoubleSide
          if (child.material.map) {
            child.material.map = child.material.map.clone()
            child.material.map.colorSpace = THREE.SRGBColorSpace
            child.material.map.wrapS = THREE.RepeatWrapping
            child.material.map.needsUpdate = true

            const name = (child.name || '').toLowerCase()
            const matName = (child.material.name || '').toLowerCase()
            if (
              matName.includes('globe_texture') ||
              name.includes('globe') ||
              name.includes('globe_globe_texture')
            ) {
              foundTexture = child.material.map
            }
          }
          child.material.needsUpdate = true
        }
      }
    })

    textureRef.current = foundTexture

    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    const rawHeight = box.max.y - box.min.y
    const targetHeight = 0.45 // ~45cm standing desk globe height
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.scale.setScalar(normScale)
    cloned.position.x = -centerX * normScale
    cloned.position.z = -centerZ * normScale
    cloned.position.y = -box.min.y * normScale

    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    return { wrapper, textureMap: foundTexture }
  }, [scene])

  useFrame((state, delta) => {
    const map = textureRef.current || globeData?.textureMap
    if (map) {
      // Scroll texture horizontally to simulate globe rotation
      map.offset.x -= delta * 0.08
    }
  })

  if (!globeData) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Turn entire model 180 degrees around Y */}
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={globeData.wrapper} />
      </group>
    </group>
  )
}
