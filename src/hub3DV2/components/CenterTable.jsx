import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { generateWoodTexture } from '../utils/textureUtils'
const MODEL_PATH = '/hubModels/CenterTable/CENTER TABLE.glb'
useGLTF.preload(MODEL_PATH)
/**
 * CenterTable Component
 *
 * Decorative 3D center coffee table model with custom mahogany & brass materials.
 * Internal geometry is normalized to realistic coffee table proportions so that
 * any outer `scale` prop applies 100% UNIFORM scaling without distortion.
 */
export default function CenterTable({
  position = [0, -0.6, 2.65],
  scale = [1.35, 1.35, 1.35],
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
      roughness: 0.25
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
      clearcoatRoughness: 0.1
    })
    // Dark matte accent material for feet pads & structural joints
    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1a1a1a'),
      roughness: 0.8,
      metalness: 0.2
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
    // Force matrix update for accurate bounding box computation
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(cloned)
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003
    // Normalize raw CAD aspect ratio to ideal coffee table proportions [1.6m wide, 0.45m high, 1.0m deep]
    const rawSize = new THREE.Vector3()
    box.getSize(rawSize)
    if (rawSize.x > 0 && rawSize.y > 0 && rawSize.z > 0) {
      cloned.scale.set(
        1.6 / rawSize.x,
        0.45 / rawSize.y,
        1.0 / rawSize.z
      )
    }
    cloned.updateMatrix()
    wrapper.updateMatrix()
    wrapper.updateMatrixWorld(true)
    wrapper.traverse((c) => { if (c !== wrapper) c.matrixAutoUpdate = false; c.frustumCulled = true })
    return wrapper
  }, [scene])
  if (!clonedScene) return null
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick(e)
        }
      }}
    >
      <primitive object={clonedScene} />
    </group>
  )
}
