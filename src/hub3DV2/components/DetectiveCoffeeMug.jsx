import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const mugGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.11, 16)
const liquidGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.005, 16)
const handleGeo = new THREE.TorusGeometry(0.03, 0.008, 8, 16, Math.PI)

const mugMat = new THREE.MeshStandardMaterial({ color: '#2b2d42', roughness: 0.3 })
const liquidMat = new THREE.MeshStandardMaterial({ color: '#1a0c02', roughness: 0.1 })
const steamMat = new THREE.PointsMaterial({
  size: 0.02,
  color: '#ffffff',
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

/**
 * DetectiveCoffeeMug Component
 *
 * Low-poly ceramic detective coffee mug with animated warm steam effect.
 * Placed on the center coffee table to elevate lounge human presence & ambience.
 */
const DetectiveCoffeeMug = React.memo(function DetectiveCoffeeMug({
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
        posArr[i * 3] = ((i % 5) - 2) * 0.008
        posArr[i * 3 + 2] = (((i * 3) % 5) - 2) * 0.008
      }
    }
    steamRef.current.geometry.attributes.position.needsUpdate = true
  })
  // Initial steam particle positions
  const steamPos = React.useMemo(() => {
    const pos = new Float32Array(15 * 3)
    for (let i = 0; i < 15; i++) {
      pos[i * 3] = ((i % 5) - 2) * 0.008
      pos[i * 3 + 1] = 0.08 + (i / 15) * 0.2
      pos[i * 3 + 2] = (((i * 3) % 5) - 2) * 0.008
    }
    return pos
  }, [])
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Ceramic Mug Body */}
      <mesh position={[0, 0.06, 0]} geometry={mugGeo} material={mugMat} />
      {/* Inner Hot Black Coffee Liquid */}
      <mesh position={[0, 0.1, 0]} geometry={liquidGeo} material={liquidMat} />
      {/* Mug Handle */}
      <mesh position={[-0.05, 0.06, 0]} rotation={[0, 0, Math.PI / 2]} geometry={handleGeo} material={mugMat} />
      {/* Steaming Heat Particles */}
      <points ref={steamRef} material={steamMat}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[steamPos, 3]}
          />
        </bufferGeometry>
      </points>
    </group>
  )
})

export const DetectiveCoffeeMugSet = React.memo(function DetectiveCoffeeMugSet({ mugs = [] }) {
  const mugRef = React.useRef()
  const liquidRef = React.useRef()
  const handleRef = React.useRef()

  React.useEffect(() => {
    if (!mugs.length) return
    const dummy = new THREE.Object3D()

    mugs.forEach((m, i) => {
      const pos = m.position || [0, 0, 0]
      const rot = m.rotation || [0, 0, 0]
      const sca = m.scale || [1, 1, 1]

      // Mug body
      dummy.position.set(pos[0], pos[1] + 0.06 * sca[1], pos[2])
      dummy.rotation.set(rot[0], rot[1], rot[2])
      dummy.scale.set(sca[0], sca[1], sca[2])
      dummy.updateMatrix()
      if (mugRef.current) mugRef.current.setMatrixAt(i, dummy.matrix)

      // Liquid
      dummy.position.set(pos[0], pos[1] + 0.1 * sca[1], pos[2])
      dummy.updateMatrix()
      if (liquidRef.current) liquidRef.current.setMatrixAt(i, dummy.matrix)

      // Handle
      dummy.position.set(pos[0] - 0.05 * sca[0], pos[1] + 0.06 * sca[1], pos[2])
      dummy.rotation.set(rot[0], rot[1], rot[2] + Math.PI / 2)
      dummy.updateMatrix()
      if (handleRef.current) handleRef.current.setMatrixAt(i, dummy.matrix)
    })

    if (mugRef.current) mugRef.current.instanceMatrix.needsUpdate = true
    if (liquidRef.current) liquidRef.current.instanceMatrix.needsUpdate = true
    if (handleRef.current) handleRef.current.instanceMatrix.needsUpdate = true
  }, [mugs])

  return (
    <group>
      <instancedMesh ref={mugRef} args={[mugGeo, mugMat, mugs.length]} castShadow receiveShadow />
      <instancedMesh ref={liquidRef} args={[liquidGeo, liquidMat, mugs.length]} />
      <instancedMesh ref={handleRef} args={[handleGeo, mugMat, mugs.length]} castShadow />
    </group>
  )
})

export default DetectiveCoffeeMug
