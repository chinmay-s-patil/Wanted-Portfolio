import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TvEasterEggScreen from '../easterEgg/TvEasterEggScreen'

const MODEL_PATH = '/hubModels/TvTable/childhood_-_a_diorama/optimized_tv.gltf'
useGLTF.preload(MODEL_PATH)

/**
 * TvTable Component
 *
 * Displays the isolated 3D TV Stand table and Vintage TV.
 * Clones materials to prevent shared material mutation across scene props.
 */
export default function TvTable({
  position = [0, -0.6, 4.2],
  scale = [0.3, 0.3, 0.3],
  rotation = [0, Math.PI, 0],
  isActive = false,
  activeEgg,
  isPaused = false,
  onClose
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const isScreenOn = isActive || Boolean(activeEgg)

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh) {
        const name = (child.name || '').toLowerCase()
        const parentName = (child.parent?.name || '').toLowerCase()
        const isTV = name.includes('tv_') || name === 'tv' || parentName === 'tv'
        const isTVStand = name.includes('tv_stand') || parentName === 'tv_stand'
        if (isTV || isTVStand) {
          child.visible = true
          if (child.material) {
            const processMat = (mat) => {
              if (!mat || typeof mat.clone !== 'function') return mat
              const cm = mat.clone()
              cm.side = THREE.DoubleSide
              if (cm.map) cm.map.colorSpace = THREE.SRGBColorSpace
              if (isScreenOn && (name.includes('screen') || cm.name?.includes('screen'))) {
                cm.emissive = new THREE.Color('#38ef7d')
                cm.emissiveIntensity = 2.5
              } else if (cm.emissiveMap) {
                cm.emissiveMap.colorSpace = THREE.SRGBColorSpace
                cm.emissiveIntensity = isScreenOn ? 3.0 : 1.5
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
        } else {
          child.visible = false
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

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003
    return cloned
  }, [scene, isScreenOn])

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation}>
      <group scale={scale}>
        <primitive object={clonedScene} />

        {/* Easter Egg TV Screen Integration */}
        <TvEasterEggScreen isActive={isScreenOn} activeEgg={activeEgg} isPaused={isPaused} onClose={onClose} />
      </group>
    </group>
  )
}
