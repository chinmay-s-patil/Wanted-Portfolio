import React, { useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/GrandfatherClock/fixed_grandfather_clock.glb'
useGLTF.preload(MODEL_PATH)

/**
 * GrandfatherClock Component
 *
 * Vintage Police Precinct Grandfather Clock asset with fast-ticking 5-min/sec 3D clock hands and swinging pendulum.
 * Non-clickable ambient 3D scene prop.
 */
export default function GrandfatherClock({
  position = [-2, -0.6, 6.0],
  scale = [1.8, 1.8, 1.8],
  rotation = [0, -Math.PI, 0]
}) {
  const { scene } = useGLTF(MODEL_PATH)

  const minuteHandRef = useRef()
  const hourHandRef = useRef()
  const pendulumRef = useRef()

  // Process scene, ensure matrixAutoUpdate is enabled on all nodes, & capture references
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.visible = true
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
          })
        } else {
          if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace
        }
      }
    })

    // Capture model nodes with flexible fallback matching
    minuteHandRef.current = cloned.getObjectByName('MinuteHand_GR')
    hourHandRef.current = cloned.getObjectByName('HourHand_GR')
    pendulumRef.current = cloned.getObjectByName('Pendulum_GR')

    if (!minuteHandRef.current || !hourHandRef.current || !pendulumRef.current) {
      cloned.traverse((child) => {
        const name = child.name || ''
        const lower = name.toLowerCase()

        if (!minuteHandRef.current && (name === 'MinuteHand_GR' || lower.includes('minutehand') || lower.includes('082'))) {
          minuteHandRef.current = (child.name === 'defaultMaterial' && child.parent && child.parent !== cloned) ? child.parent : child
        }
        if (!hourHandRef.current && (name === 'HourHand_GR' || lower.includes('hourhand') || lower.includes('083'))) {
          hourHandRef.current = (child.name === 'defaultMaterial' && child.parent && child.parent !== cloned) ? child.parent : child
        }
        if (!pendulumRef.current && (name === 'Pendulum_GR' || lower.includes('pendulum'))) {
          pendulumRef.current = (child.name === 'defaultMaterial' && child.parent && child.parent !== cloned) ? child.parent : child
        }
      })
    }

    // Enable matrixAutoUpdate ONLY on animated nodes
    if (minuteHandRef.current) minuteHandRef.current.matrixAutoUpdate = true
    if (hourHandRef.current) hourHandRef.current.matrixAutoUpdate = true
    if (pendulumRef.current) pendulumRef.current.matrixAutoUpdate = true

    // Compute bounding box & center base
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) box.expandByObject(child)
    })

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    if (isFinite(centerX) && isFinite(centerZ)) {
      cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.001
    }

    return cloned
  }, [scene])

  // Swinging pendulum in 60 FPS useFrame loop
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()

    // Swing Pendulum smoothly side-to-side around top anchor
    if (pendulumRef.current) {
      const swing = Math.sin(elapsed * 3.5) * 0.18
      pendulumRef.current.rotation.z = swing
    }
  })

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}
