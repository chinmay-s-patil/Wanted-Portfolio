import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function DesktopFileOrganizer({
  position = [1.9, 0.51, -5.2],
  scale = [1, 1, 1],
  rotation = [0, -0.2, 0]
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Wooden / Metal Tiered Tray Frame */}
      <mesh   position={[0, 0.08, 0]}>
        <boxGeometry args={[0.26, 0.16, 0.34]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.6} />
      </mesh>
      {/* Top Tray Cavity - Manila Case Folder 1 (Red Confidential Tag) */}
      <group position={[0, 0.14, 0.02]} rotation={[0.05, 0.08, 0]}>
        <mesh  >
          <boxGeometry args={[0.22, 0.015, 0.3]} />
          <meshStandardMaterial color="#e0a96d" roughness={0.7} />
        </mesh>
        {/* Red Confidential Tag */}
        <mesh position={[-0.08, 0.009, -0.12]}>
          <boxGeometry args={[0.05, 0.002, 0.03]} />
          <meshStandardMaterial color="#d90429" />
        </mesh>
      </group>
      {/* Middle Tray Cavity - Manila Case Folder 2 (Blue Case File) */}
      <group position={[0, 0.08, -0.01]} rotation={[-0.02, -0.05, 0]}>
        <mesh  >
          <boxGeometry args={[0.23, 0.018, 0.31]} />
          <meshStandardMaterial color="#2b4c7e" roughness={0.7} />
        </mesh>
      </group>
      {/* Bottom Tray Cavity - White Document Paper Sheets */}
      <group position={[0.01, 0.02, 0.01]} rotation={[0, 0.02, 0]}>
        <mesh  >
          <boxGeometry args={[0.21, 0.02, 0.29]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}
