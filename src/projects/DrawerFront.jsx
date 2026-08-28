import React, { useRef } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { useCabinetStore } from './useCabinetStore'
import { D } from './dimensions'
import { metalDrawerFront, polishedChrome, policeBrass, labelPlateMat } from './materials'

/**
 * DrawerFront Component
 *
 * Clean, high-end 3D Police Precinct Filing Cabinet Drawer Front.
 * Uses direct mesh material color lerps to guarantee 0 React re-render jitter on mouse hover.
 */
export default function DrawerFront({ data }) {
  const setOpenDrawer = useCabinetStore((s) => s.setOpenDrawer)
  const isOpen = useCabinetStore((s) => s.openDrawerId === data.id)

  const frontMeshRef = useRef()
  const handleMeshRef = useRef()

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        setOpenDrawer(data.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        if (frontMeshRef.current) {
          frontMeshRef.current.material.color.set('#3a4354')
        }
        if (handleMeshRef.current) {
          handleMeshRef.current.material.color.set('#ffffff')
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        if (frontMeshRef.current) {
          frontMeshRef.current.material.color.set(isOpen ? '#2a313d' : metalDrawerFront.color)
        }
        if (handleMeshRef.current) {
          handleMeshRef.current.material.color.set(polishedChrome.color)
        }
      }}
    >
      {/* Main Drawer Front Face */}
      <RoundedBox
        ref={frontMeshRef}
        args={[D.drawerWidth, D.drawerHeight, 0.04]}
        radius={0.012}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          {...metalDrawerFront}
          color={isOpen ? '#2a313d' : metalDrawerFront.color}
        />
      </RoundedBox>

      {/* Chrome Corner Rivets */}
      {[
        [-D.drawerWidth / 2 + 0.06, D.drawerHeight / 2 - 0.06],
        [D.drawerWidth / 2 - 0.06, D.drawerHeight / 2 - 0.06],
        [-D.drawerWidth / 2 + 0.06, -D.drawerHeight / 2 + 0.06],
        [D.drawerWidth / 2 - 0.06, -D.drawerHeight / 2 + 0.06],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.025]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
          <meshStandardMaterial {...polishedChrome} />
        </mesh>
      ))}

      {/* Keyhole Lock Cylinder */}
      <group position={[-D.drawerWidth / 2 + 0.18, 0, 0.025]}>
        <RoundedBox args={[0.05, 0.07, 0.015]} radius={0.005}>
          <meshStandardMaterial {...policeBrass} />
        </RoundedBox>
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.015, 0.025, 0.005]} />
          <meshStandardMaterial color="#0f1115" />
        </mesh>
      </group>

      {/* Label Plate Frame */}
      <group position={[0, 0.01, 0.025]}>
        <RoundedBox args={[0.72, 0.16, 0.008]} radius={0.006} position={[0, 0, -0.002]}>
          <meshStandardMaterial {...policeBrass} />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.14, 0.012]} radius={0.008}>
          <meshStandardMaterial {...labelPlateMat} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.052}
          color="#12151c"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {data.label}
        </Text>
      </group>

      {/* Polished Chrome Handle */}
      <group position={[D.drawerWidth / 2 - 0.22, 0, 0.025]}>
        <RoundedBox ref={handleMeshRef} args={[0.24, 0.07, 0.022]} radius={0.008}>
          <meshStandardMaterial {...polishedChrome} />
        </RoundedBox>
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.012, 12, 24, Math.PI]} />
          <meshStandardMaterial {...polishedChrome} />
        </mesh>
      </group>
    </group>
  )
}