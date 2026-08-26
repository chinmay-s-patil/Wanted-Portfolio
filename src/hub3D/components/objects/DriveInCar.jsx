import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder, Torus } from '@react-three/drei'

export default function DriveInCar() {
  const headlightLightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (headlightLightRef.current) {
      // Subtle vintage tungsten light flicker
      headlightLightRef.current.intensity = 1.1 + Math.sin(t * 12) * 0.08 + (Math.random() - 0.5) * 0.04
    }
  })

  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Main Car Body Chassis */}
      <RoundedBox args={[0.98, 0.28, 1.38]} radius={0.04} position={[0, 0, 0]}>
        <meshStandardMaterial color='#8b1a1a' roughness={0.35} metalness={0.6} />
      </RoundedBox>

      {/* Front Engine Hood */}
      <RoundedBox args={[0.92, 0.12, 0.58]} radius={0.03} position={[0, 0.1, 0.4]}>
        <meshStandardMaterial color='#731515' roughness={0.35} metalness={0.6} />
      </RoundedBox>

      {/* Chrome Hood Center Strip */}
      <Plane args={[0.02, 0.56]} position={[0, 0.165, 0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#ffffff' metalness={0.95} roughness={0.1} />
      </Plane>

      {/* Interior Dashboard & Steering Wheel */}
      <group position={[0, 0.14, -0.1]}>
        <RoundedBox args={[0.86, 0.08, 0.2]} radius={0.01}>
          <meshStandardMaterial color='#1c1515' roughness={0.8} />
        </RoundedBox>

        {/* Steering Wheel */}
        <group position={[-0.24, 0.1, 0.02]} rotation={[0.4, 0, 0]}>
          <Torus args={[0.07, 0.01, 8, 16]}>
            <meshStandardMaterial color='#dddddd' metalness={0.9} />
          </Torus>
          <Cylinder args={[0.01, 0.01, 0.08]} position={[0, 0, -0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#333333' />
          </Cylinder>
        </group>
      </group>

      {/* Cabin Roof / Windshield Frame (Retro Convertible Style) */}
      <group position={[0, 0.18, -0.1]}>
        {/* Translucent Tinted Windshield Glass */}
        <Plane args={[0.84, 0.26]} position={[0, 0.08, 0.18]} rotation={[-0.45, 0, 0]}>
          <meshStandardMaterial color='#88ccff' transparent opacity={0.4} roughness={0.1} />
        </Plane>
        {/* Chrome Windshield Frame */}
        <RoundedBox args={[0.88, 0.02, 0.02]} radius={0.005} position={[0, 0.2, 0.13]}>
          <meshStandardMaterial color='#ffffff' metalness={0.95} roughness={0.1} />
        </RoundedBox>
      </group>

      {/* Side Mirrors */}
      {[-0.49, 0.49].map((x, i) => (
        <group key={i} position={[x, 0.2, 0.06]}>
          <Cylinder args={[0.008, 0.008, 0.06]} rotation={[0, 0, i === 0 ? -0.4 : 0.4]}>
            <meshStandardMaterial color='#dddddd' metalness={0.95} />
          </Cylinder>
          <Cylinder args={[0.035, 0.035, 0.01]} position={[i === 0 ? -0.03 : 0.03, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color='#dddddd' metalness={0.95} roughness={0.1} />
          </Cylinder>
        </group>
      ))}

      {/* Chrome Front Grille */}
      <RoundedBox args={[0.84, 0.16, 0.03]} radius={0.01} position={[0, 0.02, 0.69]}>
        <meshStandardMaterial color='#ffffff' metalness={0.95} roughness={0.1} />
      </RoundedBox>

      {/* Glowing Headlights */}
      {[-0.33, 0.33].map((x, i) => (
        <group key={i} position={[x, 0.04, 0.69]}>
          <Cylinder args={[0.078, 0.078, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#fffae6' emissive='#ffea9f' emissiveIntensity={1.1} roughness={0.1} />
          </Cylinder>
        </group>
      ))}

      {/* Headlight Beam PointLight */}
      <pointLight ref={headlightLightRef} position={[0, 0.04, 0.9]} intensity={1.2} color='#ffea9f' distance={3.8} />

      {/* Front Chrome Bumper Bar */}
      <RoundedBox args={[0.94, 0.06, 0.06]} radius={0.015} position={[0, -0.1, 0.71]}>
        <meshStandardMaterial color='#ffffff' metalness={0.95} roughness={0.1} />
      </RoundedBox>

      {/* Wheels */}
      {[-0.49, 0.49].map((x, i) =>
        [-0.42, 0.42].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, -0.1, z]}>
            {/* Rubber Tire */}
            <Cylinder args={[0.165, 0.165, 0.08]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color='#181818' roughness={0.9} />
            </Cylinder>
            {/* Chrome Hubcap */}
            <Cylinder args={[0.095, 0.095, 0.085]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color='#ffffff' metalness={0.95} roughness={0.1} />
            </Cylinder>
          </group>
        ))
      )}

      {/* Drive-in Theatre Speaker Post next to Car Window */}
      <group position={[0.58, 0.15, -0.1]}>
        <Cylinder args={[0.018, 0.018, 0.62]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color='#2b2b2b' metalness={0.7} />
        </Cylinder>

        {/* Speaker Unit hanging on window */}
        <RoundedBox args={[0.08, 0.15, 0.12]} radius={0.01} position={[-0.12, 0.15, 0]}>
          <meshStandardMaterial color='#666666' metalness={0.8} roughness={0.3} />
        </RoundedBox>

        {/* Coiled Audio Cable */}
        <Cylinder args={[0.005, 0.005, 0.25]} position={[-0.06, 0.05, 0]} rotation={[0.4, 0, 0]}>
          <meshStandardMaterial color='#111111' roughness={0.9} />
        </Cylinder>
      </group>
    </group>
  )
}
