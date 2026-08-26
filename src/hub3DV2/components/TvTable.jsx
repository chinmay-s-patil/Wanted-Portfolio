import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/TvTable/childhood_-_a_diorama/scene.gltf'

useGLTF.preload(MODEL_PATH)

/**
 * TvTable Component (Non-selectable decorative prop)
 *
 * Displays only the isolated 3D TV Stand table and Vintage TV.
 * Non-interactive, non-selectable static room prop.
 */
export default function TvTable({
  position = [0, -0.6, 3.2],
  scale = [0.2, 0.2, 0.2],
  rotation = [0, Math.PI, 0]
}) {
  const { scene } = useGLTF(MODEL_PATH)

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        const name = (child.name || '').toLowerCase()
        const parentName = (child.parent?.name || '').toLowerCase()

        // Isolate ONLY the TV (Mesh 0 / Node 3,4) and TV Stand (Mesh 14 / Node 31,32)
        const isTV = name.includes('tv_') || name === 'tv' || parentName === 'tv'
        const isTVStand = name.includes('tv_stand') || parentName === 'tv_stand'

        if (isTV || isTVStand) {
          child.visible = true
          child.castShadow = true
          child.receiveShadow = true

          if (child.material) {
            child.material.side = THREE.DoubleSide
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
            if (child.material.emissiveMap) {
              child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace
              child.material.emissiveIntensity = 1.5
            }
            child.material.needsUpdate = true
          }
        } else {
          // Hide all other diorama parts (floor, drawing desk, markers, cookies, paper, milk, etc.)
          child.visible = false
        }
      }
    })

    // Force matrix update to compute bounding box of ONLY visible meshes
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    
    // Expand box strictly by visible meshes (TV and TV Stand)
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    // Center X & Z midpoints and align bottom flush to Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003

    return cloned
  }, [scene])

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation}>
      <group scale={scale}>
        <primitive object={clonedScene} />
      </group>
    </group>
  )
}
