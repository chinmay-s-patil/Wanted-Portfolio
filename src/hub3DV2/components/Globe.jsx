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
      if (child.isMesh && child.material) {
        const processMat = (mat) => {
          if (!mat || typeof mat.clone !== 'function') return mat
          const cm = mat.clone()
          cm.side = THREE.DoubleSide
          if (cm.map && typeof cm.map.clone === 'function') {
            cm.map = cm.map.clone()
            cm.map.colorSpace = THREE.SRGBColorSpace
            cm.map.wrapS = THREE.RepeatWrapping
            cm.map.needsUpdate = true

            const name = (child.name || '').toLowerCase()
            const matName = (cm.name || '').toLowerCase()
            if (matName.includes('globe') || name.includes('globe')) {
              foundTexture = cm.map
            }
          }
          cm.needsUpdate = true
          return cm
        }

        if (Array.isArray(child.material)) {
          child.material = child.material.map(processMat)
        } else {
          child.material = processMat(child.material)
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
