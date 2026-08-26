import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DustParticles({ count = 70 }) {
  const pointsRef = useRef()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8
      pos[i * 3 + 1] = Math.random() * 3.5 + 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8

      spd[i * 3] = (Math.random() - 0.5) * 0.003
      spd[i * 3 + 1] = Math.random() * 0.002 + 0.001
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.userData.speeds = spd
    return geo
  }, [count])

  useFrame(() => {
    if (!pointsRef.current || !geometry) return
    const posAttr = geometry.attributes.position
    if (!posAttr) return
    const posArray = posAttr.array
    const speeds = geometry.userData.speeds

    for (let i = 0; i < count; i++) {
      posArray[i * 3] += speeds[i * 3]
      posArray[i * 3 + 1] += speeds[i * 3 + 1]
      posArray[i * 3 + 2] += speeds[i * 3 + 2]

      // Reset when particle drifts out of bounds
      if (posArray[i * 3 + 1] > 4) {
        posArray[i * 3 + 1] = 0.5
        posArray[i * 3] = (Math.random() - 0.5) * 8
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 8
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color='#ffe0b2'
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
