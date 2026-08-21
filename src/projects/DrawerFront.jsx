import { useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import { useCabinetStore } from './useCabinetStore'
import { D } from './dimensions'
import { metalLight, metalMid, brass, labelPlateMat } from './materials'

export default function DrawerFront({ data }) {
  const setOpenDrawer = useCabinetStore((s) => s.setOpenDrawer)
  const isOpen = useCabinetStore((s) => s.openDrawerId === data.id)
  const [hovered, setHovered] = useState(false)

  return (
    <group
      onClick={(e) => {
        e.stopPropagation()
        setOpenDrawer(data.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Main panel with hover highlight border effect */}
      <RoundedBox
        args={[D.drawerWidth, D.drawerHeight, 0.04]}
        radius={0.012}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          {...(isOpen ? metalMid : metalLight)}
          color={hovered ? (isOpen ? '#5c544a' : '#7e7568') : (isOpen ? metalMid.color : metalLight.color)}
          roughness={hovered ? 0.25 : (isOpen ? metalMid.roughness : metalLight.roughness)}
        />
      </RoundedBox>

      {/* Hover outline glow when mouse over */}
      {hovered && !isOpen && (
        <mesh position={[0, 0, 0.021]}>
          <planeGeometry args={[D.drawerWidth - 0.02, D.drawerHeight - 0.02]} />
          <meshBasicMaterial color="#c4a574" opacity={0.12} transparent />
        </mesh>
      )}

      {/* Rivets */}
      {[
        [-D.drawerWidth / 2 + 0.06, D.drawerHeight / 2 - 0.06],
        [D.drawerWidth / 2 - 0.06, D.drawerHeight / 2 - 0.06],
        [-D.drawerWidth / 2 + 0.06, -D.drawerHeight / 2 + 0.06],
        [D.drawerWidth / 2 - 0.06, -D.drawerHeight / 2 + 0.06],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.025]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      ))}

      {/* Keyhole Lock Cylinder */}
      <group position={[-D.drawerWidth / 2 + 0.18, 0, 0.025]}>
        <RoundedBox args={[0.05, 0.07, 0.015]} radius={0.005}>
          <meshStandardMaterial {...brass} />
        </RoundedBox>
        <mesh position={[0, 0, 0.012]}>
          <boxGeometry args={[0.015, 0.025, 0.005]} />
          <meshStandardMaterial color="#1a1410" />
        </mesh>
      </group>

      {/* Label plate */}
      <group position={[0, 0.01, 0.025]}>
        {/* Brass frame surround */}
        <RoundedBox args={[0.72, 0.16, 0.008]} radius={0.006} position={[0, 0, -0.002]}>
          <meshStandardMaterial {...brass} />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.14, 0.012]} radius={0.008}>
          <meshStandardMaterial {...labelPlateMat} />
        </RoundedBox>
        {/* Label text */}
        <Text
          position={[0, 0, 0.008]}
          fontSize={0.052}
          color="#2a2018"
          anchorX="center"
          anchorY="middle"
          font="/fonts/special-elite.woff"
          letterSpacing={0.05}
        >
          {data.label}
        </Text>
      </group>

      {/* Heavy Duty Brass Handle */}
      <group position={[D.drawerWidth / 2 - 0.22, 0, 0.025]}>
        <RoundedBox args={[0.24, 0.07, 0.022]} radius={0.008}>
          <meshStandardMaterial {...brass} color={hovered ? '#d6b885' : brass.color} />
        </RoundedBox>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.15, 0.018, 0.008]} />
          <meshStandardMaterial color="#181410" />
        </mesh>
      </group>

      {/* File count badge */}
      <group position={[D.drawerWidth / 2 - 0.08, -D.drawerHeight / 2 + 0.06, 0.025]}>
        <RoundedBox args={[0.13, 0.06, 0.01]} radius={0.005}>
          <meshStandardMaterial color="#1a1816" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.006]}
          fontSize={0.034}
          color={data.color || '#c4a574'}
          anchorX="center"
          anchorY="middle"
          font="/fonts/courier-prime.woff"
        >
          {data.folders.length} FILES
        </Text>
      </group>
    </group>
  )
}