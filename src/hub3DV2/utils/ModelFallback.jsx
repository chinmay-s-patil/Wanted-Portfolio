import React from 'react'

export default function ModelFallback({ label = '3D Model', position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color='#8b7355' wireframe />
      </mesh>
    </group>
  )
}
