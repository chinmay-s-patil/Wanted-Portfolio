import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder } from '@react-three/drei'

export default function VintageComputer() {
  const crtGlowRef = useRef()
  const floppyLedRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (crtGlowRef.current) {
      crtGlowRef.current.intensity = 0.85 + Math.sin(t * 15) * 0.05 + (Math.random() - 0.5) * 0.03
    }
    if (floppyLedRef.current && floppyLedRef.current.material) {
      floppyLedRef.current.material.emissiveIntensity = Math.sin(t * 6) > 0.3 ? 1.2 : 0.1
    }
  })

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* Heavy Desktop Computer Base Mainframe Box */}
      <RoundedBox args={[0.64, 0.22, 0.5]} radius={0.015} position={[0, -0.22, 0]}>
        <meshStandardMaterial color='#d4cbba' roughness={0.65} />
      </RoundedBox>

      {/* Ventilation Grille Slots on side */}
      {[-0.1, -0.05, 0, 0.05, 0.1].map((x, i) => (
        <Plane key={i} args={[0.02, 0.14]} position={[x, -0.22, -0.252]} rotation={[0, Math.PI, 0]}>
          <meshStandardMaterial color='#2b2722' />
        </Plane>
      ))}

      {/* 5.25 Inch Floppy Disk Drives Bays */}
      <group position={[0.17, -0.22, 0.252]}>
        {/* Drive Bay 1 */}
        <RoundedBox args={[0.22, 0.08, 0.01]} radius={0.002} position={[0, 0.04, 0]}>
          <meshStandardMaterial color='#22201d' roughness={0.8} />
        </RoundedBox>
        <Plane args={[0.16, 0.008]} position={[0, 0.04, 0.006]}>
          <meshStandardMaterial color='#0a0a0a' />
        </Plane>
        {/* Drive LED Indicator (Flickering) */}
        <Cylinder ref={floppyLedRef} args={[0.004, 0.004, 0.006]} position={[-0.08, 0.04, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#ff3300' emissive='#ff3300' emissiveIntensity={1} />
        </Cylinder>

        {/* Drive Bay 2 */}
        <RoundedBox args={[0.22, 0.08, 0.01]} radius={0.002} position={[0, -0.04, 0]}>
          <meshStandardMaterial color='#22201d' roughness={0.8} />
        </RoundedBox>
        <Plane args={[0.16, 0.008]} position={[0, -0.04, 0.006]}>
          <meshStandardMaterial color='#0a0a0a' />
        </Plane>
      </group>

      {/* CRT Monitor Unit Mounted on Base */}
      <group position={[0, 0.12, -0.02]}>
        {/* Beige CRT Shell */}
        <RoundedBox args={[0.56, 0.44, 0.44]} radius={0.025} position={[0, 0, 0]}>
          <meshStandardMaterial color='#d4cbba' roughness={0.65} />
        </RoundedBox>
        
        {/* Curved CRT Bezel */}
        <RoundedBox args={[0.48, 0.36, 0.03]} radius={0.015} position={[0, 0, 0.22]}>
          <meshStandardMaterial color='#36322b' roughness={0.55} />
        </RoundedBox>
        
        {/* Glowing Green CRT Phosphor Screen */}
        <Plane args={[0.43, 0.31]} position={[0, 0, 0.236]}>
          <meshStandardMaterial color='#021c07' emissive='#022c09' emissiveIntensity={0.85} roughness={0.15} />
        </Plane>
        
        {/* Green Code Raster Text Lines */}
        {[0.1, 0.07, 0.04, 0.01, -0.02, -0.05, -0.08, -0.11].map((y, i) => (
          <Plane key={i} args={[0.36 - (i % 3) * 0.04, 0.008]} position={[-0.02 + (i % 2) * 0.01, y, 0.237]}>
            <meshStandardMaterial color='#00ff55' emissive='#00ff55' emissiveIntensity={1} />
          </Plane>
        ))}

        {/* Screen Ambient CRT Light Glow */}
        <pointLight ref={crtGlowRef} position={[0, 0, 0.4]} intensity={0.9} color='#00ff55' distance={2.4} />
      </group>

      {/* Angled Mechanical Keyboard sitting on desk in front */}
      <group position={[0, -0.34, 0.24]} rotation={[0.18, 0, 0]}>
        <RoundedBox args={[0.5, 0.03, 0.19]} radius={0.006}>
          <meshStandardMaterial color='#c2baa8' roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.46, 0.015, 0.15]} radius={0.002} position={[0, 0.018, 0]}>
          <meshStandardMaterial color='#2c2822' roughness={0.8} />
        </RoundedBox>
      </group>
    </group>
  )
}
