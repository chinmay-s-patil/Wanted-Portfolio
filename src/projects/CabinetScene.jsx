import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import CabinetGroup from './CabinetGroup'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'
import { D } from './dimensions'

function CameraController() {
  const openDrawerId = useCabinetStore((s) => s.openDrawerId)

  // Default camera position and target (Pitched slightly for grand cabinet scale)
  const defaultPos = useRef(new THREE.Vector3(3.3, 2.3, 5.0))
  const defaultTarget = useRef(new THREE.Vector3(0, 0.55, 0))

  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3(0, 0.55, 0))

  useFrame(({ camera }, delta) => {
    if (openDrawerId) {
      const drawerIndex = projectsData.drawers.findIndex((d) => d.id === openDrawerId)
      if (drawerIndex !== -1) {
        const totalDrawers = projectsData.drawers.length
        const drawerTotalHeight = totalDrawers * (D.drawerHeight + D.drawerGap)
        const shellHeight = drawerTotalHeight + 0.22 + 0.10 + 0.1
        const drawerStartY = shellHeight - 0.22 - 0.10 - D.drawerHeight / 2 - 0.05
        const drawerY = 0.2 + (drawerStartY - drawerIndex * (D.drawerHeight + D.drawerGap))

        // Perfectly framed zoom — no top or bottom clipping
        targetPos.current.set(2.3, drawerY + 0.45, 4.25)
        targetLook.current.set(0.0, drawerY + 0.15, 0.2)
      } else {
        targetPos.current.copy(defaultPos.current)
        targetLook.current.copy(defaultTarget.current)
      }
    } else {
      targetPos.current.copy(defaultPos.current)
      targetLook.current.copy(defaultTarget.current)
    }

    // Delta-damped smooth camera transition
    const step = Math.min(delta * 4.5, 0.1)
    camera.position.lerp(targetPos.current, step)
    currentLook.current.lerp(targetLook.current, step)
    camera.lookAt(currentLook.current)
  })

  return null
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.7} color="#2b313d" />
      <spotLight
        position={[2.0, 5.0, 4.0]}
        angle={0.4}
        penumbra={0.5}
        intensity={4.5}
        color="#fff4e0"
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3.5, 2.0, -1.5]} intensity={0.7} color="#6080a0" />
      <pointLight position={[3.5, 1.5, 2.5]} intensity={0.8} color="#d4af37" />
    </>
  )
}

function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group>
        <Lightformer
          form="rect"
          intensity={4.5}
          color="#ffffff"
          position={[2, 3, 2]}
          scale={[4, 4, 1]}
          target={[0, 0.6, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#8ab4f8"
          position={[-3, 1.5, -1]}
          scale={[2, 4, 1]}
          target={[0, 0.6, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.5}
          color="#d4af37"
          position={[0, 2.5, -3]}
          scale={2}
          target={[0, 0.6, 0]}
        />
      </group>
    </Environment>
  )
}

export default function CabinetScene({ onSelectProject }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{
        position: [3.2, 2.4, 4.6],
        fov: 32,
        near: 0.1,
        far: 20,
      }}
      style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
    >
      <CameraController />
      <SceneLighting />
      <StudioEnvironment />
      <group rotation={[0, Math.PI / 7, 0]}>
        <CabinetGroup onSelectProject={onSelectProject} />
      </group>
      <ContactShadows
        position={[0, -1.04, 0]}
        opacity={0.85}
        blur={2.8}
        far={3}
        color="#000000"
      />
    </Canvas>
  )
}