import React, { useRef, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MODEL_PATH = '/hubModels/Props/FirePlace/antique_fireplace.glb'

/**
 * Fireplace Component
 *
 * Lightweight, high-performance antique fireplace asset (~1.01MB) with:
 * - Dynamic flickering warm orange fire light (pointLight in hearth)
 * - Animated 3D procedural dancing flames & glowing embers bed
 * - Low-resource impact for smooth 60 FPS rendering
 */
export default function Fireplace({
  position = [8.2, -0.6, -2.2],
  rotation = [0, -Math.PI / 2, 0],
  scale = [1.2, 1.2, 1.2],
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const lightRef = useRef()
  const flamesGroupRef = useRef()

  // Auto-center, normalize scale, and align model base to floor plane
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.updateMatrixWorld(true)

    // Ensure all mesh materials are properly visible
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    const box = new THREE.Box3().setFromObject(cloned)
    if (!box.isEmpty()) {
      const center = new THREE.Vector3()
      const size = new THREE.Vector3()
      box.getCenter(center)
      box.getSize(size)

      // Normalize model height to ~1.6m if dimensions are in centimeters/millimeters or abnormal
      if (size.y > 10 || (size.y < 0.2 && size.y > 0)) {
        const fitScale = 1.6 / size.y
        cloned.scale.setScalar(fitScale)
        cloned.updateMatrixWorld(true)
        box.setFromObject(cloned)
        box.getCenter(center)
      }

      if (isFinite(center.x) && isFinite(center.z) && isFinite(box.min.y)) {
        cloned.position.x = -center.x
        cloned.position.z = -center.z
        cloned.position.y = -box.min.y
      }
    }

    return cloned
  }, [scene])

  // Create procedural flame ember seeds
  const flameParticles = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      baseX: (Math.random() - 0.5) * 0.45,
      baseZ: (Math.random() - 0.5) * 0.25,
      speed: 1.2 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      scale: 0.08 + Math.random() * 0.12,
    }))
  }, [])

  // Animate Fire Light Flicker & Flame Particle Dances in 60 FPS useFrame loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // 1. Organic Fire Point Light Flicker inside hearth
    if (lightRef.current) {
      const flicker =
        Math.sin(t * 14) * 0.35 +
        Math.cos(t * 27) * 0.25 +
        Math.sin(t * 43) * 0.15
      lightRef.current.intensity = Math.max(1.5, 3.4 + flicker)
    }

    // 2. Animate Flame Particles dancing & rising inside hearth
    if (flamesGroupRef.current) {
      flamesGroupRef.current.children.forEach((mesh, index) => {
        const p = flameParticles[index]
        if (!p || !mesh) return

        const progress = ((t * p.speed + p.phase) % 1)
        // Rise up inside hearth
        mesh.position.y = progress * 0.38 + 0.08
        // Horizontal jitter & dancing motion
        mesh.position.x = p.baseX + Math.sin(t * 8 + p.phase) * 0.04
        mesh.position.z = p.baseZ + Math.cos(t * 10 + p.phase) * 0.04

        // Scale down as flame rises and disappears at tip
        const s = p.scale * (1 - progress * 0.6)
        mesh.scale.set(s, s * (1.2 + progress * 0.8), s)

        // Fade material opacity
        if (mesh.material) {
          mesh.material.opacity = Math.sin(progress * Math.PI) * 0.95
        }
      })
    }
  })

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 3D Antique Fireplace Kiosk Model */}
      <primitive object={clonedScene} />

      {/* Fire Hearth & Embers Chamber */}
      <group position={[0, 0.1, 0.1]}>
        {/* Glow Logs / Coal Base Bed */}
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.55, 0.06, 0.32]} />
          <meshStandardMaterial
            color="#2a0800"
            emissive="#ff2200"
            emissiveIntensity={0.8}
            roughness={0.9}
          />
        </mesh>

        {/* Dynamic Flickering Firelight PointLight */}
        <pointLight
          ref={lightRef}
          position={[0, 0.25, 0.1]}
          color="#ff6600"
          intensity={3.4}
          distance={6.5}
          decay={2}
        />

        {/* Procedural Animated Flame Tongues */}
        <group ref={flamesGroupRef}>
          {flameParticles.map((p) => (
            <mesh key={p.id} position={[p.baseX, 0.08, p.baseZ]}>
              <coneGeometry args={[0.08, 0.28, 5]} />
              <meshBasicMaterial
                color={p.id % 2 === 0 ? '#ffaa00' : '#ff3300'}
                transparent
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
