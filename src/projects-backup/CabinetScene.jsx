import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import CabinetGroup from './CabinetGroup'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'
import { D } from './dimensions'

function CameraController() {
  const openDrawerId = useCabinetStore((s) => s.openDrawerId)

  // Default camera position and target
  const defaultPos = useRef(new THREE.Vector3(3.2, 2.4, 4.6))
  const defaultTarget = useRef(new THREE.Vector3(0, 0.6, 0))

  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const currentLook = useRef(new THREE.Vector3(0, 0.6, 0))

  useFrame(({ camera }) => {
    if (openDrawerId) {
      const drawerIndex = projectsData.drawers.findIndex((d) => d.id === openDrawerId)
      if (drawerIndex !== -1) {
        const totalDrawers = projectsData.drawers.length
        const drawerTotalHeight = totalDrawers * (D.drawerHeight + D.drawerGap)
        const shellHeight = drawerTotalHeight + 0.22 + 0.10 + 0.1
        const drawerStartY = shellHeight - 0.22 - 0.10 - D.drawerHeight / 2 - 0.05
        const drawerY = 0.2 + (drawerStartY - drawerIndex * (D.drawerHeight + D.drawerGap))

        // Comfortably framed zoom: close enough to see all folders clearly, but far enough back so nothing gets cut off
        targetPos.current.set(2.4, drawerY + 0.75, 3.65)
        targetLook.current.set(0.0, drawerY + 0.1, 0.35)
      } else {
        targetPos.current.copy(defaultPos.current)
        targetLook.current.copy(defaultTarget.current)
      }
    } else {
      targetPos.current.copy(defaultPos.current)
      targetLook.current.copy(defaultTarget.current)
    }

    // Smooth camera transition (lerp)
    camera.position.lerp(targetPos.current, 0.06)
    currentLook.current.lerp(targetLook.current, 0.06)
    camera.lookAt(currentLook.current)
  })

  return null
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.65} color="#3a3228" />
      <spotLight
        position={[1.5, 4, 3]}
        angle={0.35}
        penumbra={0.6}
        intensity={3.5}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 1, -2]} intensity={0.55} color="#4a6580" />
      <pointLight position={[0, 1, -4]} intensity={0.8} color="#a08060" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#f6efe2" />
      <fog attach="fog" args={['#0c0b09', 6, 13]} />
    </>
  )
}

function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group>
        <Lightformer
          form="rect"
          intensity={4.0}
          color="#fff5e0"
          position={[2, 3, 2]}
          scale={[3, 3, 1]}
          target={[0, 0.6, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.0}
          color="#d4e4f8"
          position={[-3, 1.5, -1]}
          scale={[2, 4, 1]}
          target={[0, 0.6, 0]}
        />
        <Lightformer
          form="ring"
          intensity={1.2}
          color="#a08060"
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
      dpr={[1, 2]}
      gl={{ alpha: true }}
      camera={{
        position: [3.2, 2.4, 4.6],
        fov: 32,
        near: 0.1,
        far: 20,
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <CameraController />
      <SceneLighting />
      <StudioEnvironment />
      <group rotation={[0, Math.PI / 7, 0]}>
        <CabinetGroup onSelectProject={onSelectProject} />
      </group>
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.55}
        blur={2.4}
        far={2}
        color="#000000"
      />
    </Canvas>
  )
}