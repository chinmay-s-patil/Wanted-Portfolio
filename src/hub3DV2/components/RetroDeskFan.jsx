import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
/**
 * RetroDeskFan Component
 *
 * Vintage oscillating metal electric desk fan with spinning fan blades.
 * Placed on the workstation desk to elevate the retro precinct office ambience.
 */
export default function RetroDeskFan({
  position = [-1.7, 0.51, -5.2],
  scale = [1, 1, 1],
  rotation = [0, 0.2, 0]
}) {
  const bladesRef = useRef()
  const headRef = useRef()
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    // High-speed spinning fan blades
    if (bladesRef.current) {
      bladesRef.current.rotation.z = elapsed * 18
    }
    // Slow oscillating fan head (yaw left to right)
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.45
    }
  })
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Heavy Base Stand */}
      <mesh   position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 24]} />
        <meshStandardMaterial color="#2d3142" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Vertical Support Arm */}
      <mesh  position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 16]} />
        <meshStandardMaterial color="#4f5d75" roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Oscillating Fan Head Assembly */}
      <group ref={headRef} position={[0, 0.24, 0]}>
        {/* Motor Housing */}
        <mesh  position={[0, 0, -0.04]}>
          <cylinderGeometry args={[0.05, 0.04, 0.1, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#2d3142" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Wire Cage Guard Rim */}
        <mesh position={[0, 0, 0.02]}>
          <torusGeometry args={[0.13, 0.005, 8, 32]} />
          <meshStandardMaterial color="#b8c0c8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Wire Cage Spokes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0.02]} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[0.003, 0.26, 0.003]} />
            <meshStandardMaterial color="#b8c0c8" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
        {/* Spinning Fan Blades */}
        <group ref={bladesRef} position={[0, 0, 0.015]}>
          {/* Center Hub */}
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#b8c0c8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* 3 Angled Fan Blades */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <mesh
              key={i}
              position={[
                Math.sin(angle) * 0.055,
                Math.cos(angle) * 0.055,
                0
              ]}
              rotation={[0.2, 0, -angle]}
            >
              <boxGeometry args={[0.04, 0.09, 0.003]} />
              <meshStandardMaterial color="#4f5d75" roughness={0.3} metalness={0.6} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}
