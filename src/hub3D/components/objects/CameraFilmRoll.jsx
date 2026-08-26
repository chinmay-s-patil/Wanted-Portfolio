import React from 'react'
import { RoundedBox, Plane, Cylinder, Torus } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraFilmRoll() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* 35mm Metal Film Canister Container */}
      <group position={[-0.18, 0.08, 0]} rotation={[0, 0.3, 0]}>
        {/* Metallic Cylindrical Canister Body */}
        <Cylinder args={[0.09, 0.09, 0.28]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#181818' metalness={0.85} roughness={0.25} />
        </Cylinder>
        {/* Top & Bottom Brass Spool Rim Caps */}
        <Cylinder args={[0.1, 0.1, 0.02]} position={[0, 0.14, 0]}>
          <meshStandardMaterial color='#d4a742' metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.1, 0.1, 0.02]} position={[0, -0.14, 0]}>
          <meshStandardMaterial color='#d4a742' metalness={0.9} roughness={0.2} />
        </Cylinder>

        {/* Vintage Film Canister Brand Label Wrapper */}
        <Cylinder args={[0.092, 0.092, 0.18]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#8b0000' roughness={0.6} />
        </Cylinder>
        <Plane args={[0.12, 0.06]} position={[0, 0, 0.093]}>
          <meshStandardMaterial color='#f2e6ce' roughness={0.8} />
        </Plane>
      </group>

      {/* Unspooled Gracefully Curling 35mm Photo Film Strip Ribbon */}
      <group position={[0.05, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0.15]}>
        {/* Translucent Dark Film Ribbon Strip */}
        <Plane args={[0.66, 0.18]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#16110a' transparent opacity={0.88} roughness={0.2} side={THREE.DoubleSide} />
        </Plane>

        {/* Photo Negative Film Frames */}
        {[-0.24, -0.08, 0.08, 0.24].map((x, i) => (
          <group key={i} position={[x, 0, 0.002]}>
            <Plane args={[0.12, 0.14]}>
              <meshStandardMaterial color='#4a3b2c' transparent opacity={0.75} roughness={0.3} side={THREE.DoubleSide} />
            </Plane>
            {/* Sample Photo Vignette Outline */}
            <Plane args={[0.1, 0.11]} position={[0, 0, 0.001]}>
              <meshStandardMaterial color='#8090a0' transparent opacity={0.4} roughness={0.1} side={THREE.DoubleSide} />
            </Plane>
          </group>
        ))}

        {/* Top Sprocket Perforations */}
        {[-0.28, -0.21, -0.14, -0.07, 0, 0.07, 0.14, 0.21, 0.28].map((x, i) => (
          <Plane key={`top-${i}`} args={[0.02, 0.015]} position={[x, 0.075, 0.003]}>
            <meshStandardMaterial color='#0b0907' side={THREE.DoubleSide} />
          </Plane>
        ))}
        {/* Bottom Sprocket Perforations */}
        {[-0.28, -0.21, -0.14, -0.07, 0, 0.07, 0.14, 0.21, 0.28].map((x, i) => (
          <Plane key={`bot-${i}`} args={[0.02, 0.015]} position={[x, -0.075, 0.003]}>
            <meshStandardMaterial color='#0b0907' side={THREE.DoubleSide} />
          </Plane>
        ))}
      </group>

      {/* Darkroom Magnifying Glass / Loupe */}
      <group position={[0.24, 0.02, 0.1]} rotation={[0, -0.3, 0]}>
        <Torus args={[0.045, 0.006, 8, 24]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Torus>
        <Cylinder args={[0.02, 0.02, 0.002]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#ffffff' transparent opacity={0.35} roughness={0.1} />
        </Cylinder>
        <Cylinder args={[0.006, 0.006, 0.12]} position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#3d2714' roughness={0.8} />
        </Cylinder>
      </group>

      {/* Loose Film Spool Reels on desk */}
      <group position={[0.22, -0.04, -0.18]} rotation={[0.4, 0, 0]}>
        <Cylinder args={[0.07, 0.07, 0.02]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#d4a742' metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.03, 0.03, 0.025]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#1a1a1a' />
        </Cylinder>
      </group>
    </group>
  )
}
