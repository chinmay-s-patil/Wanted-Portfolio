import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { generateWoodTexture } from '../utils/textureUtils'

const MODEL_PATH = '/hubModels/CenterTable/CENTER TABLE.glb'

useGLTF.preload(MODEL_PATH)

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

    // Rich dark polished mahogany wood material for tabletop surface
    const woodMaterial = new THREE.MeshStandardMaterial({
      map: woodTex,
      color: new THREE.Color('#4a2e1b'),
      roughness: 0.22,
      metalness: 0.08,
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

            // Table top surface (original CAD light grey / white)
            if (r > 0.8 && g > 0.8 && b > 0.8) {
              child.material = woodMaterial
            }
            // Dark joints / feet pads
            else if (r < 0.15 && g < 0.15 && b < 0.15) {
              child.material = darkAccentMaterial
            }
            // Structural frame & legs
            else {
              child.material = brassMaterial
            }
          } else {
            child.material = brassMaterial
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
