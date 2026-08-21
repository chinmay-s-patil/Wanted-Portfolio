import React, { useMemo } from 'react'
import { RoundedBox, Plane } from '@react-three/drei'
import * as THREE from 'three'

function NewspaperMasthead() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#e8dcc8'
    ctx.fillRect(0, 0, 512, 128)
    ctx.fillStyle = '#2a2010'
    ctx.font = 'bold 52px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('DAILY NEWS', 256, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  return (
    <Plane args={[0.42, 0.1]} position={[0, 0.012, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial map={texture} transparent opacity={0.95} />
    </Plane>
  )
}

export function LandingTable() {
  return (
    <group position={[0, 0, 0]}>
      {/* Table top */}
      <RoundedBox args={[1.3, 0.05, 0.75]} radius={0.015} position={[0, 0.76, 0]}>
        <meshStandardMaterial color='#5a3a1a' roughness={0.7} />
      </RoundedBox>
      {/* Front edge trim */}
      <RoundedBox args={[1.32, 0.015, 0.02]} radius={0.003} position={[0, 0.735, 0.37]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.8} />
      </RoundedBox>
      {/* Back edge trim */}
      <RoundedBox args={[1.32, 0.015, 0.02]} radius={0.003} position={[0, 0.735, -0.37]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.8} />
      </RoundedBox>
      {/* Left edge trim */}
      <RoundedBox args={[0.02, 0.015, 0.77]} radius={0.003} position={[-0.65, 0.735, 0]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.8} />
      </RoundedBox>
      {/* Right edge trim */}
      <RoundedBox args={[0.02, 0.015, 0.77]} radius={0.003} position={[0.65, 0.735, 0]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.8} />
      </RoundedBox>
      {/* Front left leg */}
      <RoundedBox args={[0.07, 0.74, 0.07]} radius={0.012} position={[-0.55, 0.37, 0.3]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.85} metalness={0.15} />
      </RoundedBox>
      {/* Front right leg */}
      <RoundedBox args={[0.07, 0.74, 0.07]} radius={0.012} position={[0.55, 0.37, 0.3]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.85} metalness={0.15} />
      </RoundedBox>
      {/* Back left leg */}
      <RoundedBox args={[0.07, 0.74, 0.07]} radius={0.012} position={[-0.55, 0.37, -0.3]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.85} metalness={0.15} />
      </RoundedBox>
      {/* Back right leg */}
      <RoundedBox args={[0.07, 0.74, 0.07]} radius={0.012} position={[0.55, 0.37, -0.3]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.85} metalness={0.15} />
      </RoundedBox>
      {/* Back panel (modesty panel) */}
      <RoundedBox args={[1.16, 0.55, 0.02]} radius={0.005} position={[0, 0.42, -0.34]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.9} />
      </RoundedBox>
      {/* Side panel left */}
      <RoundedBox args={[0.02, 0.55, 0.6]} radius={0.005} position={[-0.56, 0.42, 0.04]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.9} />
      </RoundedBox>
      {/* Side panel right */}
      <RoundedBox args={[0.02, 0.55, 0.6]} radius={0.005} position={[0.56, 0.42, 0.04]}>
        <meshStandardMaterial color='#4a2e12' roughness={0.9} />
      </RoundedBox>
      {/* Drawer front */}
      <RoundedBox args={[0.5, 0.14, 0.025]} radius={0.008} position={[0, 0.68, 0.365]}>
        <meshStandardMaterial color='#5a3a1a' roughness={0.75} />
      </RoundedBox>
      {/* Drawer handle */}
      <RoundedBox args={[0.12, 0.02, 0.015]} radius={0.004} position={[0, 0.68, 0.385]}>
        <meshStandardMaterial color='#c4a574' metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {/* Lower shelf */}
      <RoundedBox args={[1.1, 0.025, 0.55]} radius={0.008} position={[0, 0.2, 0.04]}>
        <meshStandardMaterial color='#5a3a1a' roughness={0.8} />
      </RoundedBox>
    </group>
  )
}

export function LandingNewspaperMesh() {
  return (
    <group rotation={[0.12, 0.2, 0.03]}>
      {/* Main paper body */}
      <RoundedBox args={[0.65, 0.025, 0.45]} radius={0.004}>
        <meshStandardMaterial color='#e8dcc8' roughness={0.95} />
      </RoundedBox>
      {/* Fold line */}
      <Plane args={[0.015, 0.42]} position={[0.08, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#d4c4a8' side={THREE.DoubleSide} />
      </Plane>
      {/* Masthead */}
      <NewspaperMasthead />
      {/* Article lines */}
      <Plane args={[0.48, 0.007]} position={[0, 0.014, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#b0a080' side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[0.42, 0.007]} position={[0, 0.014, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#b0a080' side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[0.42, 0.007]} position={[0, 0.014, -0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#b0a080' side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[0.38, 0.007]} position={[0, 0.014, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#b0a080' side={THREE.DoubleSide} />
      </Plane>
      <Plane args={[0.38, 0.007]} position={[0, 0.014, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#b0a080' side={THREE.DoubleSide} />
      </Plane>
    </group>
  )
}