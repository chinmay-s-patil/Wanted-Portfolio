import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AmbientDustParticles Component
 *
 * Lightweight floating dust particles drifting through the warm lounge spotlight beam.
 * Wrapped in React.memo with persistent buffer data to prevent jitter during parent state changes.
 */
const AmbientDustParticles = React.memo(function AmbientDustParticles({ count = 70, bounds = [10, 5, 10] }) {
  const pointsRef = useRef()

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * bounds[0]
      pos[i * 3 + 1] = Math.random() * bounds[1] - 0.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * bounds[2] + 1.0

      spd[i * 3] = (Math.random() - 0.5) * 0.002
      spd[i * 3 + 1] = Math.random() * 0.0015 + 0.0005
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }

    return { positions: pos, speeds: spd }
  }, []) // Instantiated once so position array is never re-created on parent re-renders

  useFrame(() => {
    if (!pointsRef.current) return
    const geo = pointsRef.current.geometry
    const posArr = geo.attributes.position.array

    for (let i = 0; i < count; i++) {
      posArr[i * 3] += speeds[i * 3]
      posArr[i * 3 + 1] += speeds[i * 3 + 1]
      posArr[i * 3 + 2] += speeds[i * 3 + 2]

      // Reset when particle floats above ceiling
      if (posArr[i * 3 + 1] > bounds[1]) {
        posArr[i * 3 + 1] = -0.5
        posArr[i * 3] = (Math.random() - 0.5) * bounds[0]
      }
    }

    geo.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffe8a3"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
})

export default AmbientDustParticles
