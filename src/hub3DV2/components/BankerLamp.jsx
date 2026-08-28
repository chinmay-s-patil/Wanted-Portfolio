import React from 'react'
import * as THREE from 'three'
/**
 * BankerLamp Component
 *
 * Classic vintage emerald-green glass and heavy brass Banker's Lamp.
 * Placed on the workstation desk to add authentic retro office warmth.
 */
export default function BankerLamp({
  position = [1.5, 0.51, -5.2],
  scale = [1, 1, 1],
  rotation = [0, -0.3, 0]
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Heavy Brass Stepped Base */}
      <mesh   position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.07, 0.085, 0.03, 24]} />
        <meshStandardMaterial color="#c59b27" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Brass Gooseneck / Curved Arm */}
      <mesh  position={[0, 0.16, -0.02]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.014, 0.28, 16]} />
        <meshStandardMaterial color="#c59b27" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Swivel Brass Joints */}
      <mesh position={[0, 0.28, -0.05]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshStandardMaterial color="#c59b27" roughness={0.3} metalness={0.85} />
      </mesh>
      {/* Emerald Green Glass Shade */}
      <group position={[0, 0.29, 0.01]} rotation={[-0.2, 0, 0]}>
        <mesh  >
          <boxGeometry args={[0.22, 0.08, 0.12]} />
          <meshPhysicalMaterial
            color="#006400"
            emissive="#003800"
            emissiveIntensity={0.6}
            roughness={0.15}
            transmission={0.4}
            thickness={0.02}
          />
        </mesh>
        {/* Inner Light Bulb & Warm Point Light */}
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#fff3b0" emissive="#ffea88" emissiveIntensity={3} />
        </mesh>
        <pointLight
          position={[0, -0.05, 0]}
          color="#ffea88"
          intensity={1.4}
          distance={3.5}
          decay={2}
        />
      </group>
      {/* Pull Chain Switch */}
      <mesh position={[0.07, 0.18, 0.01]}>
        <cylinderGeometry args={[0.002, 0.002, 0.12, 8]} />
        <meshStandardMaterial color="#e5c158" metalness={0.9} />
      </mesh>
      <mesh position={[0.07, 0.11, 0.01]}>
        <sphereGeometry args={[0.007, 8, 8]} />
        <meshStandardMaterial color="#e5c158" metalness={0.9} />
      </mesh>
    </group>
  )
}
