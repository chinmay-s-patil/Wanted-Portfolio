import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane, RoundedBox, Cylinder, Ring, Circle } from '@react-three/drei'
import DustParticles from './components/DustParticles'

// Ceiling fan component with rotating wood blades
function CeilingFan() {
  const bladesRef = useRef()

  useFrame((_, delta) => {
    if (bladesRef.current) {
      bladesRef.current.rotation.y += delta * 1.5
    }
  })

  return (
    <group position={[0, 7.6, 0]}>
      {/* Brass Ceiling Mount & Rod */}
      <Cylinder args={[0.12, 0.12, 0.1]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.5]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.16, 0.14, 0.12]} position={[0, -0.35, 0]}>
        <meshStandardMaterial color='#2c2219' roughness={0.6} />
      </Cylinder>

      {/* Rotating Blades */}
      <group ref={bladesRef} position={[0, -0.38, 0]}>
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <Cylinder args={[0.012, 0.012, 0.2]} position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color='#c4a574' metalness={0.8} />
            </Cylinder>
            <RoundedBox args={[0.75, 0.012, 0.14]} radius={0.005} position={[0.5, 0, 0]} rotation={[0.05, 0, 0]}>
              <meshStandardMaterial color='#3d2719' roughness={0.7} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* Hanging Warm Light Bulb */}
      <Cylinder args={[0.04, 0.04, 0.06]} position={[0, -0.45, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.8} />
      </Cylinder>
      <Cylinder args={[0.035, 0.035, 0.04]} position={[0, -0.49, 0]}>
        <meshStandardMaterial color='#fff5e6' emissive='#ffcc66' emissiveIntensity={1.2} />
      </Cylinder>
    </group>
  )
}

// Vintage Wooden Coat Rack Stand with Fedora Hat & Trenchcoat
function CoatRackStand({ position = [-7.2, 0, -7.2] }) {
  return (
    <group position={position}>
      {/* Base Feet */}
      <Cylinder args={[0.32, 0.35, 0.06]} position={[0, 0.03, 0]}>
        <meshStandardMaterial color='#2e1c12' roughness={0.7} />
      </Cylinder>
      {/* Main Pole */}
      <Cylinder args={[0.035, 0.045, 1.9]} position={[0, 0.98, 0]}>
        <meshStandardMaterial color='#3a2418' roughness={0.6} />
      </Cylinder>
      {/* Top Crown Brass Hooks */}
      <Cylinder args={[0.08, 0.06, 0.1]} position={[0, 1.88, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.85} roughness={0.2} />
      </Cylinder>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]} position={[0, 1.88, 0]}>
          <Cylinder args={[0.008, 0.008, 0.18]} position={[0.1, 0.06, 0]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color='#c4a574' metalness={0.85} />
          </Cylinder>
          <Circle args={[0.02, 12]} position={[0.16, 0.12, 0]}>
            <meshStandardMaterial color='#c4a574' metalness={0.85} />
          </Circle>
        </group>
      ))}

      {/* Fedora Hat Resting on Hook */}
      <group position={[0.15, 1.94, 0]} rotation={[0.2, 0, -0.3]}>
        {/* Brim */}
        <Cylinder args={[0.22, 0.22, 0.015]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#201a16' roughness={0.9} />
        </Cylinder>
        {/* Crown */}
        <Cylinder args={[0.12, 0.13, 0.11]} position={[0, 0.06, 0]}>
          <meshStandardMaterial color='#201a16' roughness={0.9} />
        </Cylinder>
        {/* Hat Ribbon Band */}
        <Cylinder args={[0.131, 0.131, 0.025]} position={[0, 0.02, 0]}>
          <meshStandardMaterial color='#7a1e1e' roughness={0.6} />
        </Cylinder>
      </group>

      {/* Hanging Trench Coat */}
      <group position={[0, 1.25, 0.06]} rotation={[0, 0, 0.05]}>
        <RoundedBox args={[0.38, 1.0, 0.22]} radius={0.06}>
          <meshStandardMaterial color='#382e25' roughness={0.9} />
        </RoundedBox>
        {/* Lapels */}
        <Plane args={[0.14, 0.35]} position={[-0.08, 0.25, 0.115]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color='#2e241c' roughness={0.9} />
        </Plane>
        <Plane args={[0.14, 0.35]} position={[0.08, 0.25, 0.115]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color='#2e241c' roughness={0.9} />
        </Plane>
      </group>
    </group>
  )
}

// Vintage Oriental Crimson Rug under Center Desk
function OrientalRug() {
  return (
    <group position={[0, 0.005, 0]}>
      {/* Outer Fringe Trim */}
      <Plane args={[2.8, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#d6c9b3' roughness={0.9} />
      </Plane>
      {/* Main Rug Crimson Surface */}
      <Plane args={[2.7, 1.9]} position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#5c1518' roughness={0.8} />
      </Plane>
      {/* Inner Navy Border Pattern */}
      <Plane args={[2.3, 1.5]} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#182736' roughness={0.8} />
      </Plane>
      {/* Center Gold Medallion */}
      <Plane args={[1.9, 1.1]} position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#7a1e20' roughness={0.8} />
      </Plane>
      <Ring args={[0.2, 0.35, 32]} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#c4a574' roughness={0.7} />
      </Ring>
    </group>
  )
}

export default function OfficeEnvironment() {
  return (
    <group>
      {/* Volumetric Floating Dust Particles */}
      <DustParticles count={90} />

      {/* Weathered Dark Wood Plank Floor */}
      <Plane args={[16, 16]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#261b14' roughness={0.7} metalness={0.2} />
      </Plane>

      {/* Inlaid Brass Floor Border */}
      <Ring args={[7.8, 7.85, 4]} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <meshStandardMaterial color='#c4a574' metalness={0.85} roughness={0.2} />
      </Ring>

      {/* Vintage Crimson Area Rug under Desk */}
      <OrientalRug />

      {/* Dark Mahogany Dado Rails & Baseboards */}
      <RoundedBox args={[16, 0.14, 0.08]} radius={0.01} position={[0, 0.07, -7.95]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.14, 16]} radius={0.01} position={[-7.95, 0.07, 0]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.14, 16]} radius={0.01} position={[7.95, 0.07, 0]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>

      {/* Crown Molding top wall trim */}
      <RoundedBox args={[16, 0.18, 0.1]} radius={0.01} position={[0, 7.9, -7.94]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.18, 16]} radius={0.01} position={[-7.94, 7.9, 0]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.18, 16]} radius={0.01} position={[7.94, 7.9, 0]}>
        <meshStandardMaterial color='#3a2416' roughness={0.6} />
      </RoundedBox>

      {/* Rich Atmospheric Walls */}
      {/* Back Wall */}
      <Plane args={[16, 8]} position={[0, 4, -8]}>
        <meshStandardMaterial color='#1b221d' roughness={0.8} />
      </Plane>
      {/* Left Wall */}
      <Plane args={[16, 8]} position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color='#1b221d' roughness={0.8} />
      </Plane>
      {/* Right Wall */}
      <Plane args={[16, 8]} position={[8, 4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color='#1b221d' roughness={0.8} />
      </Plane>
      {/* Ceiling */}
      <Plane args={[16, 16]} position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#101411' roughness={0.9} />
      </Plane>

      {/* Wall Conduits & Industrial Steam Pipes with Dials */}
      <group position={[-7.9, 3.4, 0]}>
        <Cylinder args={[0.025, 0.025, 14]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#b08d57' metalness={0.8} roughness={0.3} />
        </Cylinder>
        {/* Pressure Gauge Dial */}
        <group position={[0.04, 0, -2.0]} rotation={[0, 0, Math.PI / 2]}>
          <Cylinder args={[0.08, 0.08, 0.02]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color='#c4a574' metalness={0.9} />
          </Cylinder>
          <Circle args={[0.07, 16]} position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#fcf8ee' roughness={0.5} />
          </Circle>
        </group>
      </group>

      <group position={[7.9, 3.4, 0]}>
        <Cylinder args={[0.025, 0.025, 14]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#b08d57' metalness={0.8} roughness={0.3} />
        </Cylinder>
      </group>

      {/* Ceiling Fan */}
      <CeilingFan />

      {/* Coat Rack Stand */}
      <CoatRackStand position={[-7.2, 0, -7.0]} />

      {/* Studio & Ambient Lighting Architecture */}
      <ambientLight intensity={0.85} color='#fffaee' />

      {/* Key Directional Warm Room Light */}
      <directionalLight position={[3, 6, 4]} intensity={1.6} color='#fff5e6' />
      <directionalLight position={[-4, 5, -2]} intensity={1.1} color='#6699cc' />
      <directionalLight position={[4, 5, 2]} intensity={1.1} color='#ffaa55' />

      {/* Dedicated Zone Spotlights */}
      <pointLight position={[0, 3.8, 0.5]} intensity={2.6} color='#ffe2b3' distance={6.5} />
      <pointLight position={[-1.95, 2.8, -1.6]} intensity={2.6} color='#00ff66' distance={5.0} />
      <pointLight position={[-3.6, 2.8, 0]} intensity={2.4} color='#ffcc88' distance={5.5} />
      <pointLight position={[3.6, 2.8, 0]} intensity={2.4} color='#ffd699' distance={5.5} />
      <pointLight position={[0, 3.2, 3.0]} intensity={2.2} color='#fffaee' distance={5.5} />
    </group>
  )
}