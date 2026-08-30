import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { generateWoodTexture, generateWallTexture } from '../utils/textureUtils'

export default function RetroRoom() {
  const floorWoodTexture = useMemo(() => {
    const tex = generateWoodTexture()
    tex.repeat.set(4, 4)
    return tex
  }, [])
  const wallTexture = useMemo(() => {
    const tex = generateWallTexture()
    tex.repeat.set(4, 2)
    return tex
  }, [])
  const wainscotWoodTexture = useMemo(() => {
    const tex = generateWoodTexture()
    tex.repeat.set(4, 1)
    return tex
  }, [])

  return (
    <group>
      {/* 1. Real Hardwood Floor (Dark Aged Mahogany) */}
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]} >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={floorWoodTexture}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>
      {/* 2. Rectangular Vintage Area Rug (Under Sofa & Center Table) */}
      <group position={[0, -0.592, 1.4]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} >
          <planeGeometry args={[5.2, 3.8]} />
          <meshStandardMaterial color="#361711" roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[5.4, 4.0]} />
          <meshStandardMaterial color="#210d0a" roughness={0.85} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[4.8, 3.4]} />
          <meshStandardMaterial color="#6b4421" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
          <planeGeometry args={[4.6, 3.2]} />
          <meshStandardMaterial color="#361711" roughness={0.9} />
        </mesh>
      </group>
      {/* 3. Ceiling Plane */}
      <mesh position={[0, 4.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0f131a" roughness={0.85} />
      </mesh>
      {/* 4. Enclosed Room Walls with Wallpaper & Wainscoting */}
      {/* BACK WALL (Z = -6.5) */}
      <group position={[0, 1.9, -6.5]}>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[20, 3.6]} />
          <meshStandardMaterial map={wallTexture} roughness={0.7} />
        </mesh>
        <mesh position={[0, -1.5, 0.02]}>
          <planeGeometry args={[20, 1.8]} />
          <meshStandardMaterial map={wainscotWoodTexture} roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]}>
          <boxGeometry args={[20, 0.1, 0.05]} />
          <meshStandardMaterial color="#2d1b11" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>
      {/* LEFT WALL (X = -8.5) */}
      <group position={[-8.5, 1.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[20, 3.6]} />
          <meshStandardMaterial map={wallTexture} roughness={0.7} />
        </mesh>
        <mesh position={[0, -1.5, 0.02]}>
          <planeGeometry args={[20, 1.8]} />
          <meshStandardMaterial map={wainscotWoodTexture} roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]}>
          <boxGeometry args={[20, 0.1, 0.05]} />
          <meshStandardMaterial color="#2d1b11" roughness={0.4} />
        </mesh>
      </group>
      {/* RIGHT WALL (X = 8.5) */}
      <group position={[8.5, 1.9, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[20, 3.6]} />
          <meshStandardMaterial map={wallTexture} roughness={0.7} />
        </mesh>
        <mesh position={[0, -1.5, 0.02]}>
          <planeGeometry args={[20, 1.8]} />
          <meshStandardMaterial map={wainscotWoodTexture} roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]}>
          <boxGeometry args={[20, 0.1, 0.05]} />
          <meshStandardMaterial color="#2d1b11" roughness={0.4} />
        </mesh>
      </group>
      {/* FRONT WALL (Z = 6.5) */}
      <group position={[0, 1.9, 6.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.8, 0]}>
          <planeGeometry args={[20, 3.6]} />
          <meshStandardMaterial map={wallTexture} roughness={0.7} />
        </mesh>
        <mesh position={[0, -1.5, 0.02]}>
          <planeGeometry args={[20, 1.8]} />
          <meshStandardMaterial map={wainscotWoodTexture} roughness={0.4} metalness={0.15} />
        </mesh>
        <mesh position={[0, -0.6, 0.04]}>
          <boxGeometry args={[20, 0.1, 0.05]} />
          <meshStandardMaterial color="#2d1b11" roughness={0.4} />
        </mesh>
      </group>
      {/* 5. Baseboard Moldings (Perimeter) */}
      <mesh position={[0, -0.48, -6.46]}>
        <boxGeometry args={[20, 0.24, 0.08]} />
        <meshStandardMaterial color="#2d1b11" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.48, 6.46]}>
        <boxGeometry args={[20, 0.24, 0.08]} />
        <meshStandardMaterial color="#2d1b11" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-8.46, -0.48, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.24, 0.08]} />
        <meshStandardMaterial color="#2d1b11" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[8.46, -0.48, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[20, 0.24, 0.08]} />
        <meshStandardMaterial color="#2d1b11" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* 6. Crown Moldings (Ceiling Perimeter) */}
      <mesh position={[0, 4.28, -6.44]}>
        <boxGeometry args={[20, 0.2, 0.12]} />
        <meshStandardMaterial color="#1f120b" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 4.28, 6.44]}>
        <boxGeometry args={[20, 0.2, 0.12]} />
        <meshStandardMaterial color="#1f120b" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* 7. Warm Brass Precinct Wall Sconces */}
      <group position={[-5.2, 2.2, -6.4]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        <pointLight intensity={3.2} color="#ff9433" distance={8} decay={1.5} />
      </group>
      <group position={[5.2, 2.2, -6.4]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        <pointLight intensity={3.2} color="#ff9433" distance={8} decay={1.5} />
      </group>
      <group position={[-8.4, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        <pointLight intensity={3.2} color="#ff9433" distance={8} decay={1.5} />
      </group>
      <group position={[8.4, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[0.2, 0.4, 0.12]} />
          <meshStandardMaterial color="#c59b27" metalness={0.85} roughness={0.25} />
        </mesh>
        <pointLight intensity={3.2} color="#ff9433" distance={8} decay={1.5} />
      </group>
    </group>
  )
}
