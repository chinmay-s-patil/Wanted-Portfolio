import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { generateWoodTexture } from '../utils/textureUtils'

const MODEL_PATH = '/hubModels/CenterTable/CENTER TABLE.glb'

// Centralized in Hub3DV2 preloadInBatches
// useGLTF.preload(MODEL_PATH)

export default function CenterTableGLTF({
  position = [0, -0.6, 1.65],
  scale = [13.0, 7.5, 10.0],
  rotation = [0, 0, 0],
  onClick
}) {
  const { scene } = useGLTF(MODEL_PATH)

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    // Generate procedural rich wood texture for table top
    const woodTex = generateWoodTexture()
    woodTex.wrapS = THREE.RepeatWrapping
    woodTex.wrapT = THREE.RepeatWrapping
    woodTex.repeat.set(1.5, 1.5)

    // Brass metal material for legs & structural frame
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c5a059'),
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide
    })

    // Elegant translucent white frosted acrylic / glass material for tabletop surface
    const translucentWhiteMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.7,
      ior: 1.45,
      thickness: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide
    })

    // Dark matte accent material for feet pads & structural joints
    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a1a1a'),
      roughness: 0.8,
      metalness: 0.2,
      side: THREE.DoubleSide
    })

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.material) {
          const origColor = child.material.color
          if (origColor) {
            const r = origColor.r
            const g = origColor.g
            const b = origColor.b

            // Table top surface — dark in the GLB (near-black), replace with translucent white
            if (r < 0.25 && g < 0.25 && b < 0.25) {
              child.material = translucentWhiteMaterial
            }
            // Structural legs & frame — medium gray in the GLB
            else {
              child.material = brassMaterial
            }
          } else {
            child.material = translucentWhiteMaterial
          }
        }
      }
    })

    // Force matrix update to ensure 100% accurate bounding box computation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)

    // Center X & Z bounding box midpoints so the model origin is geometrically centered
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003

    return cloned
  }, [scene])

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <group scale={scale}>
        <primitive object={clonedScene} />
      </group>
    </group>
  )
}
