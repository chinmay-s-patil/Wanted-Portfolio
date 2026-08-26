import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder, Circle, Ring } from '@react-three/drei'
import * as THREE from 'three'
import { InteractiveObject } from '../HubObjects'
import { hubItems } from '../hubData'

function UpcomingRadarMesh() {
  const sweepRef = useRef()

  useFrame((_, delta) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.z -= delta * 1.8
    }
  })

  return (
    <group rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[0.68, 0.68, 0.12]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color='#18201a' roughness={0.5} metalness={0.6} />
      </RoundedBox>
      <Cylinder args={[0.29, 0.29, 0.03]} position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#2d3830' roughness={0.4} metalness={0.8} />
      </Cylinder>
      <Circle args={[0.26, 32]} position={[0, 0, 0.076]}>
        <meshStandardMaterial color='#041a0b' emissive='#02260f' emissiveIntensity={0.8} roughness={0.1} />
      </Circle>
      <Ring args={[0.07, 0.075, 32]} position={[0, 0, 0.077]}>
        <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.6} />
      </Ring>
      <Ring args={[0.15, 0.155, 32]} position={[0, 0, 0.077]}>
        <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.6} />
      </Ring>
      <Ring args={[0.23, 0.235, 32]} position={[0, 0, 0.077]}>
        <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.6} />
      </Ring>
      <Plane args={[0.5, 0.005]} position={[0, 0, 0.078]}>
        <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.5} />
      </Plane>
      <Plane args={[0.005, 0.5]} position={[0, 0, 0.078]}>
        <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.5} />
      </Plane>
      <group ref={sweepRef} position={[0, 0, 0.079]}>
        <Plane args={[0.24, 0.008]} position={[0.12, 0, 0]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={1} />
        </Plane>
      </group>
      <Circle args={[0.012, 16]} position={[0.1, 0.08, 0.08]}>
        <meshStandardMaterial color='#ffaa00' emissive='#ffaa00' emissiveIntensity={1} />
      </Circle>
      <Circle args={[0.01, 16]} position={[-0.12, -0.06, 0.08]}>
        <meshStandardMaterial color='#ff3300' emissive='#ff3300' emissiveIntensity={1} />
      </Circle>
      <pointLight position={[0, 0, 0.15]} intensity={0.5} color='#00ff66' distance={1.8} />
    </group>
  )
}

function CorkboardHeader() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#f4ebd0'
    ctx.fillRect(0, 0, 512, 128)
    ctx.fillStyle = '#8b0000'
    ctx.font = 'bold 44px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('2D INVESTIGATION HUB', 256, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <Plane args={[0.54, 0.14]} position={[0, 0.28, 0.032]} rotation={[0, 0, 0]}>
      <meshStandardMaterial map={texture} transparent opacity={0.95} />
    </Plane>
  )
}

function HubBoardMesh() {
  return (
    <group rotation={[0, Math.PI, 0]}>
      <RoundedBox args={[1.22, 0.92, 0.04]} radius={0.01} position={[0, 0, 0]}>
        <meshStandardMaterial color='#4a3018' roughness={0.7} />
      </RoundedBox>
      <Plane args={[1.14, 0.84]} position={[0, 0, 0.022]}>
        <meshStandardMaterial color='#b88e58' roughness={0.95} />
      </Plane>
      <CorkboardHeader />
      {[
        { x: -0.32, y: 0.05, r: 0.08, color: '#e8ded0' },
        { x: 0.32, y: 0.02, r: -0.06, color: '#e8ded0' },
        { x: -0.25, y: -0.22, r: -0.12, color: '#fff9c4' },
        { x: 0.22, y: -0.24, r: 0.1, color: '#fff9c4' },
      ].map((card, i) => (
        <group key={i} position={[card.x, card.y, 0.028]} rotation={[0, 0, card.r]}>
          <Plane args={[0.26, 0.22]}>
            <meshStandardMaterial color={card.color} roughness={0.9} />
          </Plane>
          <Plane args={[0.22, 0.14]} position={[0, 0.02, 0.001]}>
            <meshStandardMaterial color='#333333' roughness={0.8} />
          </Plane>
          <Cylinder args={[0.012, 0.004, 0.02]} position={[0, 0.09, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#cc0000' metalness={0.3} />
          </Cylinder>
        </group>
      ))}
      <Plane args={[0.62, 0.008]} position={[0, 0.03, 0.035]} rotation={[0, 0, -0.05]}>
        <meshStandardMaterial color='#cc0000' emissive='#990000' emissiveIntensity={0.5} />
      </Plane>
      <Plane args={[0.55, 0.008]} position={[0, -0.1, 0.035]} rotation={[0, 0, 0.7]}>
        <meshStandardMaterial color='#cc0000' emissive='#990000' emissiveIntensity={0.5} />
      </Plane>
    </group>
  )
}

export default function BackScene({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem, activeZone }) {
  const backItems = useMemo(() => hubItems.filter((item) => item.zone === 'back'), [])

  const getItem = (id) => backItems.find((it) => it.id === id)

  const upcomingItem = getItem('upcoming')
  const hubItem = getItem('hub')

  return (
    <group>
      {upcomingItem && (
        <InteractiveObject
          item={upcomingItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'upcoming'}
          activeZone={activeZone}
        >
          <UpcomingRadarMesh />
        </InteractiveObject>
      )}

      {hubItem && (
        <InteractiveObject
          item={hubItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'hub'}
          activeZone={activeZone}
        >
          <HubBoardMesh />
        </InteractiveObject>
      )}
    </group>
  )
}