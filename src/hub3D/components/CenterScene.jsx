import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder, Circle, Torus, Ring, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { InteractiveObject } from '../HubObjects'
import { hubItems } from '../hubData'
import SolversTerminalMesh from './objects/MilitaryTerminal'
import CoffeeMug from './objects/CoffeeMug'

// Canvas texture generator for Newspaper Masthead
function NewspaperMasthead() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#e6d7c3'
    ctx.fillRect(0, 0, 512, 128)

    // Weathered paper background texture noise
    ctx.fillStyle = '#d4c4ad'
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 128, 2, 2)
    }

    ctx.fillStyle = '#221a10'
    ctx.font = 'bold 50px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('DAILY INVESTIGATOR', 256, 45)

    ctx.fillStyle = '#5c452e'
    ctx.font = '16px serif'
    ctx.fillText('SPECIAL EDITION — CHINMAY PATIL PORTFOLIO archive', 256, 95)
    ctx.fillRect(30, 75, 452, 2)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <Plane args={[0.48, 0.12]} position={[0, 0.014, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial map={texture} transparent opacity={0.95} />
    </Plane>
  )
}

// 1. Landing Newspaper with Coffee Stain & Headlines
function NewspaperMesh() {
  return (
    <group rotation={[0.08, 0.18, 0.02]}>
      <RoundedBox args={[0.66, 0.025, 0.46]} radius={0.004}>
        <meshStandardMaterial color='#e6d7c3' roughness={0.95} />
      </RoundedBox>
      <Plane args={[0.015, 0.43]} position={[0.08, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#cca87e' side={THREE.DoubleSide} />
      </Plane>
      <NewspaperMasthead />

      {/* Coffee Ring Stain on Newspaper */}
      <Ring args={[0.048, 0.056, 24]} position={[-0.18, 0.0145, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#54371f' transparent opacity={0.45} side={THREE.DoubleSide} />
      </Ring>

      {/* Article lines */}
      {[0.0, -0.04, -0.08, -0.12, -0.16].map((z, i) => (
        <Plane key={i} args={[0.44 - i * 0.02, 0.007]} position={[0, 0.014, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#786248' side={THREE.DoubleSide} />
        </Plane>
      ))}
    </group>
  )
}

// 2. Professional Diary with Leather Binding & Brass Corners
function ProfessionalDiaryMesh() {
  return (
    <group rotation={[-0.04, -0.22, 0]}>
      <RoundedBox args={[0.42, 0.04, 0.32]} radius={0.008} position={[0, 0, 0]}>
        <meshStandardMaterial color='#381a10' roughness={0.65} />
      </RoundedBox>
      {[-0.2, 0.2].map((x, i) =>
        [-0.15, 0.15].map((z, j) => (
          <RoundedBox key={`${i}-${j}`} args={[0.032, 0.042, 0.032]} radius={0.002} position={[x, 0, z]}>
            <meshStandardMaterial color='#c4a574' metalness={0.85} roughness={0.25} />
          </RoundedBox>
        ))
      )}
      <RoundedBox args={[0.38, 0.02, 0.28]} radius={0.002} position={[0, 0.025, 0]}>
        <meshStandardMaterial color='#f0e4c8' roughness={0.9} />
      </RoundedBox>

      {/* Red Ribbon Bookmark */}
      <Plane args={[0.028, 0.36]} position={[0.02, 0.036, 0.02]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <meshStandardMaterial color='#8b0000' side={THREE.DoubleSide} />
      </Plane>

      {/* Fountain Pen Clip */}
      <group position={[0.23, 0.02, -0.05]} rotation={[0, 0.3, 0]}>
        <Cylinder args={[0.007, 0.007, 0.22]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#1a1a1a' metalness={0.6} roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.004, 0.002, 0.04]} position={[-0.1, -0.005, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} />
        </Cylinder>
      </group>
    </group>
  )
}

// 3. Vintage Bakelite Rotary Phone with Coiled Cord
function RotaryPhoneMesh() {
  return (
    <group rotation={[0, -0.4, 0]}>
      {/* Phone Base Box */}
      <RoundedBox args={[0.26, 0.14, 0.24]} radius={0.03} position={[0, 0.07, 0]}>
        <meshStandardMaterial color='#181614' roughness={0.35} metalness={0.2} />
      </RoundedBox>

      {/* Rotary Dial Face */}
      <Cylinder args={[0.072, 0.072, 0.012]} position={[0, 0.142, 0.06]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color='#d4d4d4' metalness={0.9} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.065, 0.065, 0.014]} position={[0, 0.144, 0.06]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color='#181614' roughness={0.5} />
      </Cylinder>

      {/* Dial Finger Holes */}
      {[0, 0.6, 1.2, 1.8, 2.4, 3.0, 3.6, 4.2, 4.8].map((angle, i) => (
        <Circle
          key={i}
          args={[0.009, 12]}
          position={[
            Math.cos(angle) * 0.042,
            0.152 + Math.sin(angle) * 0.012,
            0.06 + Math.sin(angle) * 0.042,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color='#ffffff' roughness={0.2} />
        </Circle>
      ))}

      {/* Center Brass Emblem */}
      <Cylinder args={[0.02, 0.02, 0.018]} position={[0, 0.148, 0.06]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
      </Cylinder>

      {/* Handset Receiver Cradle & Handset */}
      <group position={[0, 0.20, -0.04]} rotation={[0, 0, 0.1]}>
        <Cylinder args={[0.014, 0.014, 0.32]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#181614' roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.042, 0.032, 0.045]} position={[-0.15, -0.01, 0]} rotation={[0.2, 0, 0]}>
          <meshStandardMaterial color='#181614' roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.042, 0.032, 0.045]} position={[0.15, -0.01, 0]} rotation={[-0.2, 0, 0]}>
          <meshStandardMaterial color='#181614' roughness={0.3} />
        </Cylinder>
      </group>

      {/* Coiled Telephone Cord */}
      <group position={[-0.12, 0.06, -0.08]} rotation={[0.2, 0, 0.5]}>
        <Torus args={[0.018, 0.005, 8, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#111111' roughness={0.8} />
        </Torus>
        <Torus args={[0.018, 0.005, 8, 16]} position={[-0.01, -0.02, 0]}>
          <meshStandardMaterial color='#111111' roughness={0.8} />
        </Torus>
      </group>
    </group>
  )
}

// Oscillating Vintage Desk Fan
function DeskFan() {
  const fanRef = useRef()

  useFrame((_, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.z += delta * 8.0
    }
  })

  return (
    <group position={[-0.68, 0.79, -0.22]} rotation={[0, 0.6, 0]}>
      {/* Heavy Brass Stand Base */}
      <Cylinder args={[0.065, 0.075, 0.018]} position={[0, 0.009, 0]}>
        <meshStandardMaterial color='#b89253' metalness={0.85} roughness={0.2} />
      </Cylinder>
      {/* Brass Neck Stem */}
      <Cylinder args={[0.01, 0.012, 0.22]} position={[0, 0.12, 0]} rotation={[0, 0, 0.15]}>
        <meshStandardMaterial color='#b89253' metalness={0.85} roughness={0.2} />
      </Cylinder>
      {/* Fan Motor Housing */}
      <Cylinder args={[0.045, 0.04, 0.08]} position={[0.02, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#221a14' roughness={0.5} />
      </Cylinder>

      {/* Wire Cage Frame */}
      <Torus args={[0.12, 0.004, 8, 24]} position={[0.02, 0.22, 0.04]}>
        <meshStandardMaterial color='#b89253' metalness={0.9} />
      </Torus>
      <Torus args={[0.07, 0.004, 8, 24]} position={[0.02, 0.22, 0.04]}>
        <meshStandardMaterial color='#b89253' metalness={0.9} />
      </Torus>

      {/* Spinning Fan Blades */}
      <group ref={fanRef} position={[0.02, 0.22, 0.04]}>
        {[0, Math.PI * 0.66, Math.PI * 1.33].map((angle, i) => (
          <group key={i} rotation={[0, 0, angle]}>
            <Plane args={[0.09, 0.035]} position={[0.045, 0, 0]} rotation={[0.2, 0, 0]}>
              <meshStandardMaterial color='#b89253' metalness={0.85} side={THREE.DoubleSide} />
            </Plane>
          </group>
        ))}
      </group>
    </group>
  )
}

// Brass Rim Magnifying Glass on Documents
function MagnifyingGlass() {
  return (
    <group position={[-0.22, 0.8, -0.05]} rotation={[-0.1, -0.5, 0.2]}>
      {/* Turned Wooden Handle */}
      <Cylinder args={[0.009, 0.012, 0.16]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#422c16' roughness={0.7} />
      </Cylinder>
      {/* Brass Ferrules */}
      <Cylinder args={[0.014, 0.014, 0.02]} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#c4a574' metalness={0.9} />
      </Cylinder>
      {/* Brass Lens Ring Frame */}
      <Torus args={[0.055, 0.008, 12, 24]} position={[0, 0, 0.14]}>
        <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
      </Torus>
      {/* Glass Lens */}
      <Circle args={[0.052, 24]} position={[0, 0, 0.14]}>
        <meshStandardMaterial color='#e6f7ff' transparent opacity={0.4} roughness={0.05} metalness={0.1} />
      </Circle>
    </group>
  )
}

// Glass Ashtray with Smoking Cigar
function Ashtray() {
  return (
    <group position={[-0.58, 0.79, 0.18]} rotation={[0, 0.2, 0]}>
      {/* Heavy Cut Glass Ashtray */}
      <Cylinder args={[0.06, 0.05, 0.022]} position={[0, 0.011, 0]}>
        <meshStandardMaterial color='#d4e6eb' transparent opacity={0.65} roughness={0.1} />
      </Cylinder>
      {/* Cigar */}
      <Cylinder args={[0.008, 0.008, 0.09]} position={[0.02, 0.022, 0]} rotation={[0.2, 0, 0.8]}>
        <meshStandardMaterial color='#4a2e19' roughness={0.8} />
      </Cylinder>
      {/* Glowing Ember Tip */}
      <Sphere args={[0.008, 8, 8]} position={[0.05, 0.032, 0]}>
        <meshStandardMaterial color='#ff4400' emissive='#ff3300' emissiveIntensity={1.8} />
      </Sphere>
    </group>
  )
}

// Vintage Executive Leather Swivel Chair behind Desk
function DetectiveChair() {
  return (
    <group position={[0, 0, -0.72]} rotation={[0, 0, 0]}>
      {/* Base Star Legs */}
      <Cylinder args={[0.03, 0.03, 0.45]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color='#221a14' metalness={0.7} />
      </Cylinder>
      {[0, 1.25, 2.5, 3.75, 5.0].map((angle, i) => (
        <Cylinder
          key={i}
          args={[0.018, 0.018, 0.28]}
          position={[Math.cos(angle) * 0.14, 0.08, Math.sin(angle) * 0.14]}
          rotation={[0.3, angle, 0]}
        >
          <meshStandardMaterial color='#221a14' metalness={0.7} />
        </Cylinder>
      ))}

      {/* Padded Dark Leather Seat */}
      <RoundedBox args={[0.52, 0.08, 0.48]} radius={0.02} position={[0, 0.45, 0]}>
        <meshStandardMaterial color='#2a170d' roughness={0.6} />
      </RoundedBox>

      {/* Button Tufted Leather Backrest */}
      <RoundedBox args={[0.5, 0.58, 0.08]} radius={0.02} position={[0, 0.78, -0.2]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color='#2a170d' roughness={0.6} />
      </RoundedBox>
    </group>
  )
}

// Detective Desk Base Structure with Green Banker Lamp
export function MainDetectiveDesk() {
  return (
    <group position={[0, 0, -0.1]}>
      {/* Desk Top Wood Slab */}
      <RoundedBox args={[1.65, 0.06, 0.85]} radius={0.018} position={[0, 0.76, 0]}>
        <meshStandardMaterial color='#3d2716' roughness={0.65} />
      </RoundedBox>

      {/* Inlaid Leather Blotter Pad with Gold Stenciled Edge */}
      <Plane args={[1.12, 0.57]} position={[0, 0.792, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#162419' roughness={0.9} />
      </Plane>

      {/* Desk Pedestal Side Drawers */}
      <RoundedBox args={[0.42, 0.7, 0.75]} radius={0.01} position={[-0.56, 0.35, 0]}>
        <meshStandardMaterial color='#301e10' roughness={0.8} />
      </RoundedBox>

      <RoundedBox args={[0.42, 0.7, 0.75]} radius={0.01} position={[0.56, 0.35, 0]}>
        <meshStandardMaterial color='#301e10' roughness={0.8} />
      </RoundedBox>

      {/* Brass Handles on Pedestal Drawers */}
      {[-0.56, 0.56].map((x, i) =>
        [0.55, 0.35, 0.15].map((y, j) => (
          <RoundedBox key={`${i}-${j}`} args={[0.12, 0.03, 0.015]} radius={0.003} position={[x, y, 0.38]}>
            <meshStandardMaterial color='#c4a574' metalness={0.85} roughness={0.25} />
          </RoundedBox>
        ))
      )}

      {/* Vintage Green Banker Desk Lamp */}
      <group position={[0.65, 0.79, 0.28]} rotation={[0, -0.6, 0]}>
        {/* Brass Base */}
        <Cylinder args={[0.06, 0.07, 0.02]} position={[0, 0.01, 0]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Cylinder>
        {/* Curved Brass Arm */}
        <Cylinder args={[0.008, 0.008, 0.26]} position={[-0.02, 0.14, 0]} rotation={[0, 0, -0.2]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Cylinder>
        {/* Emerald Green Glass Shade */}
        <Cylinder args={[0.06, 0.07, 0.16]} position={[-0.05, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#0a5220' roughness={0.2} transparent opacity={0.92} />
        </Cylinder>
        {/* Warm Lamp Glow */}
        <pointLight position={[-0.05, 0.22, 0]} intensity={1.3} color='#ffaa44' distance={2.8} />
      </group>

      {/* Steaming Coffee Mug & Saucer on Desk */}
      <CoffeeMug position={[-0.38, 0.792, -0.22]} rotation={[0, 0.3, 0]} />

      {/* Oscillating Desk Fan */}
      <DeskFan />

      {/* Magnifying Glass on Desk */}
      <MagnifyingGlass />

      {/* Ashtray with Cigar */}
      <Ashtray />

      {/* Detective Chair Behind Desk */}
      <DetectiveChair />
    </group>
  )
}

export default function CenterScene({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem, activeZone }) {
  const centerItems = useMemo(() => hubItems.filter((item) => item.zone === 'center'), [])

  const getItem = (id) => centerItems.find((it) => it.id === id)

  const landingItem = getItem('landing')
  const diaryItem = getItem('professionaldiary')
  const phoneItem = getItem('contactme')
  const solversItem = getItem('solvers')

  return (
    <group>
      <MainDetectiveDesk />

      {landingItem && (
        <InteractiveObject
          item={landingItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'landing'}
          activeZone={activeZone}
        >
          <NewspaperMesh />
        </InteractiveObject>
      )}

      {diaryItem && (
        <InteractiveObject
          item={diaryItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'professionaldiary'}
          activeZone={activeZone}
        >
          <ProfessionalDiaryMesh />
        </InteractiveObject>
      )}

      {phoneItem && (
        <InteractiveObject
          item={phoneItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'contactme'}
          activeZone={activeZone}
        >
          <RotaryPhoneMesh />
        </InteractiveObject>
      )}

      {solversItem && (
        <InteractiveObject
          item={solversItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'solvers'}
          activeZone={activeZone}
        >
          <SolversTerminalMesh />
        </InteractiveObject>
      )}
    </group>
  )
}