import React from 'react'
import * as THREE from 'three'

/**
 * Mid-Century Retro Brass Floor Lamp mesh fixture with warm bulb glow.
 */
export default function RetroFloorLamp({ position = [2.6, -0.6, 0.5] }) {
  return (
    <group position={position}>
      {/* Lamp Base */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.04, 32]} />
        <meshStandardMaterial color='#4a3525' roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Brass Pole */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2.1, 16]} />
        <meshStandardMaterial color='#d4af37' roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Lamp Shade */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.38, 0.45, 32, 1, true]} />
        <meshStandardMaterial color='#2b1a10' roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Warm Glowing Bulb Inside */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color='#fff0c2' />
      </mesh>
      {/* Strong Lamp Light */}
      <pointLight position={[0, 1.9, 0]} intensity={4.5} color='#ffa033' distance={8} decay={1.5} />
    </group>
  )
}
