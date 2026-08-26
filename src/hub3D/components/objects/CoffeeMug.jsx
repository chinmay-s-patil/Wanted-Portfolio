import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Torus, Circle, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function SteamParticles({ count = 18 }) {
  const pointsRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const off = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.06
      pos[i * 3 + 1] = Math.random() * 0.18 + 0.05
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.06

      off[i * 3] = Math.random() * Math.PI * 2
      off[i * 3 + 1] = Math.random() * 0.0015 + 0.001
      off[i * 3 + 2] = Math.random() * Math.PI * 2
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.userData.offsets = off
    return geo
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current || !geometry) return
    const posAttr = geometry.attributes.position
    if (!posAttr) return
    const t = clock.getElapsedTime()
    const posArray = posAttr.array
    const offsets = geometry.userData.offsets

    for (let i = 0; i < count; i++) {
      // Float upwards with slight sinusoidal sway
      posArray[i * 3 + 1] += offsets[i * 3 + 1]
      posArray[i * 3] += Math.sin(t * 2 + offsets[i * 3]) * 0.0006
      posArray[i * 3 + 2] += Math.cos(t * 2 + offsets[i * 3 + 2]) * 0.0006

      // Reset loop when steam rises above threshold
      if (posArray[i * 3 + 1] > 0.28) {
        posArray[i * 3 + 1] = 0.05
        posArray[i * 3] = (Math.random() - 0.5) * 0.06
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.06
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.018}
        color='#fff3e0'
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default function CoffeeMug({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Ceramic Saucer Plate */}
      <Cylinder args={[0.075, 0.06, 0.008, 24]} position={[0, 0.004, 0]}>
        <meshStandardMaterial color='#eae5d9' roughness={0.4} metalness={0.1} />
      </Cylinder>
      <Cylinder args={[0.055, 0.055, 0.004, 24]} position={[0, 0.008, 0]}>
        <meshStandardMaterial color='#d8d3c5' roughness={0.4} />
      </Cylinder>

      {/* Ceramic Mug Body */}
      <group position={[0, 0.055, 0]}>
        <Cylinder args={[0.046, 0.042, 0.1, 24]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#eae5d9' roughness={0.35} metalness={0.05} />
        </Cylinder>
        {/* Dark Coffee Liquid Surface */}
        <Circle args={[0.042, 24]} position={[0, 0.044, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#201209' roughness={0.1} metalness={0.2} />
        </Circle>
        {/* Coffee Foam Crema ring */}
        <Torus args={[0.038, 0.003, 8, 24]} position={[0, 0.044, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#6e472a' roughness={0.5} />
        </Torus>

        {/* Mug Handle */}
        <group position={[0.048, 0.005, 0]} rotation={[0, 0, 0]}>
          <Torus args={[0.026, 0.007, 12, 24, Math.PI * 1.2]} rotation={[0, 0, -Math.PI * 0.6]}>
            <meshStandardMaterial color='#eae5d9' roughness={0.35} />
          </Torus>
        </group>

        {/* Steam rising from coffee */}
        <SteamParticles count={20} />
      </group>

      {/* Stainless Steel Teaspoon on Saucer */}
      <group position={[-0.035, 0.009, 0.04]} rotation={[0, 0.8, -0.08]}>
        <Cylinder args={[0.002, 0.002, 0.11, 8]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#dddddd' metalness={0.9} roughness={0.2} />
        </Cylinder>
        <RoundedBox args={[0.02, 0.002, 0.012]} radius={0.001} position={[-0.055, 0, 0]}>
          <meshStandardMaterial color='#dddddd' metalness={0.9} roughness={0.2} />
        </RoundedBox>
      </group>
    </group>
  )
}
