import React from 'react'
import { RoundedBox, Plane } from '@react-three/drei'

export default function OfficeEnvironment() {
  return (
    <group>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <meshStandardMaterial color='#3a2a1a' roughness={0.9} />
      </Plane>

      {/* Back Wall */}
      <Plane args={[20, 10]} position={[0, 5, -3.5]} receiveShadow>
        <meshStandardMaterial color='#352818' roughness={0.95} />
      </Plane>

      {/* Left Wall */}
      <Plane args={[20, 10]} rotation={[0, Math.PI / 2, 0]} position={[-5, 5, 0]} receiveShadow>
        <meshStandardMaterial color='#352818' roughness={0.95} />
      </Plane>

      {/* Right Wall */}
      <Plane args={[20, 10]} rotation={[0, -Math.PI / 2, 0]} position={[5, 5, 0]} receiveShadow>
        <meshStandardMaterial color='#352818' roughness={0.95} />
      </Plane>

      {/* Baseboard — back */}
      <RoundedBox args={[10, 0.15, 0.04]} radius={0.005} position={[0, 0.075, -3.47]}>
        <meshStandardMaterial color='#4a3a2a' roughness={0.85} />
      </RoundedBox>

      {/* Baseboard — left */}
      <RoundedBox args={[0.04, 0.15, 10]} radius={0.005} position={[-4.97, 0.075, 0]}>
        <meshStandardMaterial color='#4a3a2a' roughness={0.85} />
      </RoundedBox>

      {/* Ceiling */}
      <Plane args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <meshStandardMaterial color='#1a1410' roughness={1} />
      </Plane>

      {/* Lighting */}
      <ambientLight intensity={0.6} color='#f6efe2' />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color='#f6efe2' castShadow />
      <pointLight position={[0, 3, 2]} intensity={0.6} color='#c4a574' distance={8} />
      <pointLight position={[-2, 2, -1]} intensity={0.3} color='#8b7355' distance={6} />
      <pointLight position={[2, 2, -1]} intensity={0.3} color='#8b7355' distance={6} />
      <hemisphereLight args={['#f6efe2', '#2a2018', 0.4]} />
    </group>
  )
}