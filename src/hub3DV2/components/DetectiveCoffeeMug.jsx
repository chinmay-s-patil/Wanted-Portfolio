import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
/**
 * DetectiveCoffeeMug Component
 *
 * Low-poly ceramic detective coffee mug with animated warm steam effect.
 * Placed on the center coffee table to elevate lounge human presence & ambience.
 */
export default function DetectiveCoffeeMug({
  position = [0.1, 0.08, 2.55],
  scale = [1, 1, 1],
  rotation = [0, 0.4, 0]
}) {
  const steamRef = useRef()
  useFrame(({ clock }) => {
    if (!steamRef.current) return
    const t = clock.getElapsedTime()
    const posArr = steamRef.current.geometry.attributes.position.array
    for (let i = 0; i < 15; i++) {
      // Rise and weave steam particles
      posArr[i * 3 + 1] += 0.0015
      posArr[i * 3] += Math.sin(t * 2 + i) * 0.0008
      if (posArr[i * 3 + 1] > 0.35) {
        posArr[i * 3 + 1] = 0.08
        posArr[i * 3] = (Math.random() - 0.5) * 0.04
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 0.04
      }
    }
    steamRef.current.geometry.attributes.position.needsUpdate = true
  })
  // Initial steam particle positions
  const steamPos = React.useMemo(() => {
    const pos = new Float32Array(15 * 3)
    for (let i = 0; i < 15; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.04
      pos[i * 3 + 1] = 0.08 + Math.random() * 0.2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.04
    }
    return pos
  }, [])
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Ceramic Mug Body */}
      <mesh   position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.045, 0.038, 0.11, 24]} />
        <meshStandardMaterial color="#2b2d42" roughness={0.3} />
      </mesh>
      {/* Inner Hot Black Coffee Liquid */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.005, 24]} />
        <meshStandardMaterial color="#1a0c02" roughness={0.1} />
      </mesh>
      {/* Mug Handle */}
      <mesh  position={[-0.05, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.03, 0.008, 12, 24, Math.PI]} />
        <meshStandardMaterial color="#2b2d42" roughness={0.3} />
      </mesh>
      {/* Steaming Heat Particles */}
      <points ref={steamRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
