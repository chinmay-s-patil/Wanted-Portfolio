import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
/**
 * PrecinctWallClock Component
 *
 * Procedural low-poly retro police precinct wall clock with real-time ticking hands.
 * Placed on the wall for authentic retro precinct ambience.
 */
export default function PrecinctWallClock({
  position = [2.2, 2.8, 5.92],
  scale = [1, 1, 1],
  rotation = [0, Math.PI, 0]
}) {
  const secondHandRef = useRef()
  const minuteHandRef = useRef()
  const hourHandRef = useRef()
  useFrame(() => {
    const now = new Date()
    const sec = now.getSeconds() + now.getMilliseconds() / 1000
    const min = now.getMinutes() + sec / 60
    const hr = (now.getHours() % 12) + min / 60
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -sec * ((Math.PI * 2) / 60)
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -min * ((Math.PI * 2) / 60)
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -hr * ((Math.PI * 2) / 12)
    }
  })
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Outer Chrome / Brass Rim */}
      <mesh  >
        <cylinderGeometry args={[0.55, 0.55, 0.08, 32]} />
        <meshStandardMaterial color="#2b2d42" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Clock Face Plate */}
      <mesh position={[0, 0, 0.045]} >
        <cylinderGeometry args={[0.48, 0.48, 0.01, 32]} />
        <meshStandardMaterial color="#f4f1de" roughness={0.6} />
      </mesh>
      {/* Glass Cover */}
      <mesh position={[0, 0, 0.055]}>
        <cylinderGeometry args={[0.52, 0.52, 0.01, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.1}
          transmission={0.9}
        />
      </mesh>
      {/* Hour Markers (12 ticks around face) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6
        const isMajor = i % 3 === 0
        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * 0.38,
              Math.cos(angle) * 0.38,
              0.052
            ]}
            rotation={[0, 0, -angle]}
          >
            <boxGeometry args={[isMajor ? 0.03 : 0.015, isMajor ? 0.08 : 0.04, 0.005]} />
            <meshStandardMaterial color="#1d3557" />
          </mesh>
        )
      })}
      {/* Center Pivot Cap */}
      <mesh position={[0, 0, 0.07]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#e63946" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Hour Hand */}
      <group ref={hourHandRef} position={[0, 0, 0.058]}>
        <mesh position={[0, 0.12, 0]} >
          <boxGeometry args={[0.03, 0.24, 0.005]} />
          <meshStandardMaterial color="#1d3557" />
        </mesh>
      </group>
      {/* Minute Hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.062]}>
        <mesh position={[0, 0.17, 0]} >
          <boxGeometry args={[0.02, 0.34, 0.005]} />
          <meshStandardMaterial color="#1d3557" />
        </mesh>
      </group>
      {/* Ticking Red Second Hand */}
      <group ref={secondHandRef} position={[0, 0, 0.066]}>
        <mesh position={[0, 0.19, 0]}>
          <boxGeometry args={[0.008, 0.38, 0.004]} />
          <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.2} />
        </mesh>
      </group>
    </group>
  )
}
