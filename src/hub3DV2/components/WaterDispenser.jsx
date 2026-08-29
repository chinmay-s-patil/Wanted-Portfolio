import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/Props/WaterDispenser/water_dispenser.glb'
useGLTF.preload(MODEL_PATH)

/**
 * WaterCup Sub-component
 *
 * Procedural paper/plastic water cup model.
 */
function WaterCup({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], filled = true }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer Paper / Translucent Plastic Cup Body */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.032, 0.022, 0.08, 16, 1, true]} />
        <meshStandardMaterial
          color="#d0e8ff"
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bottom Base Disk */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.022, 16]} />
        <meshStandardMaterial color="#c0e0ff" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Water Liquid Inside */}
      {filled && (
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.028, 0.022, 0.05, 16]} />
          <meshStandardMaterial color="#00a8ff" roughness={0.1} transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  )
}

/**
 * WaterDispenser Component (Non-clickable Room Prop)
 *
 * Classic office water cooler dispenser model placed in the retro precinct lounge.
 * Includes a cup sitting in the tray alcove and scattered cups on the floor.
 */
export default function WaterDispenser({
  position = [-7.5, -0.6, 2.5],
  scale = [1, 1, 1],
  rotation = [0, Math.PI / 2, 0]
}) {
  const { scene } = useGLTF(MODEL_PATH)

  const dispenserGroup = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => {
            if (m && m.map) m.map.colorSpace = THREE.SRGBColorSpace
          })
        } else if (child.material.map) {
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
    const targetHeight = 1.45 // ~1.45m standing office water dispenser height
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

  if (!dispenserGroup) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Water Dispenser 3D Model */}
      <primitive object={dispenserGroup} />

      {/* 1. Cup sitting inside the dispenser tray alcove */}
      <WaterCup position={[0, 0.68, 0.12]} rotation={[0, 0.2, 0]} filled={true} />

      {/* 2. Cups scattered on the ground around the base */}
      <WaterCup position={[0.22, 0.02, 0.24]} rotation={[Math.PI / 2, 0, 0.8]} filled={false} />
      <WaterCup position={[0.28, 0.02, -0.18]} rotation={[Math.PI / 2, 0, 0*Math.PI]} filled={false} />
      <WaterCup position={[0.15, 0.57, 0.065]} rotation={[0.05, 0.3, -0.05]} filled={true} />
    </group>
  )
}
