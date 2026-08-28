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
