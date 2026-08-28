import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import { D } from './dimensions'
import { metalDark, metalMid, metalLight, brass, labelPlateMat } from './materials'
import projectsData from './projectsData'
import Drawer from './Drawer'

function CabinetHeader() {
  return (
    <group position={[0, 0.12, D.shellDepth / 2 + 0.01]}>
      <RoundedBox
        args={[D.shellWidth - 0.08, 0.18, 0.04]}
        radius={0.01}
        smoothness={4}
      >
        <meshStandardMaterial {...metalMid} />
      </RoundedBox>
      {/* Label plate */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[1.4, 0.1]} />
        <meshStandardMaterial {...labelPlateMat} />
      </mesh>
      {/* Rivets */}
      {[[-1, 0], [1, 0]].map(([x, y], i) => (
        <mesh key={i} position={[x * 0.65, y * 0.04, 0.03]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
          <meshStandardMaterial {...brass} />
        </mesh>
      ))}
    </group>
  )
}

function CabinetFeet() {
  const footPositions = [
    [-D.shellWidth / 2 + 0.15, -0.08, D.shellDepth / 2 - 0.15],
    [D.shellWidth / 2 - 0.15, -0.08, D.shellDepth / 2 - 0.15],
    [-D.shellWidth / 2 + 0.15, -0.08, -D.shellDepth / 2 + 0.15],
    [D.shellWidth / 2 - 0.15, -0.08, -D.shellDepth / 2 + 0.15],
  ]
  return (
    <group>
      {footPositions.map((pos, i) => (
        <RoundedBox
          key={i}
          args={[0.12, 0.08, 0.12]}
          radius={0.01}
          position={pos}
        >
          <meshStandardMaterial {...metalDark} />
        </RoundedBox>
      ))}
    </group>
  )
}

export default function CabinetGroup({ onSelectProject }) {
  const shellThickness = 0.06
  const headerHeight = 0.22
  const baseHeight = 0.10
  const drawerTotalHeight = projectsData.drawers.length * (D.drawerHeight + D.drawerGap)
  const shellHeight = drawerTotalHeight + headerHeight + baseHeight + 0.1

  const shellPanels = useMemo(() => {
    const panels = []
    const w = D.shellWidth
    const h = shellHeight
    const d = D.shellDepth
    const t = shellThickness

    // Back panel
    panels.push({
      pos: [0, h / 2 - baseHeight, -d / 2 + t / 2],
      size: [w, h, t],
    })
    // Left panel
    panels.push({
      pos: [-w / 2 + t / 2, h / 2 - baseHeight, 0],
      size: [t, h, d],
    })
    // Right panel
    panels.push({
      pos: [w / 2 - t / 2, h / 2 - baseHeight, 0],
      size: [t, h, d],
    })
    // Top panel
    panels.push({
      pos: [0, h - baseHeight - t / 2, 0],
      size: [w, t, d],
    })
    // Bottom panel
    panels.push({
      pos: [0, -baseHeight + t / 2, 0],
      size: [w, t, d],
    })

    return panels
  }, [shellHeight])

  const drawerStartY = shellHeight - headerHeight - baseHeight - D.drawerHeight / 2 - 0.05

  return (
    <group position={[0, 0.2, 0]}>
      {/* Shell */}
      {shellPanels.map((panel, i) => (
        <RoundedBox
          key={i}
          args={panel.size}
          radius={0.005}
          position={panel.pos}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial {...metalDark} />
        </RoundedBox>
      ))}

      {/* Header */}
      <group position={[0, shellHeight - baseHeight - 0.11, 0]}>
        <RoundedBox
          args={[D.shellWidth - 0.04, 0.22, D.shellDepth]}
          radius={0.01}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial {...metalMid} />
        </RoundedBox>
        <CabinetHeader />
      </group>

      {/* Base */}
      <RoundedBox
        args={[D.shellWidth - 0.04, 0.10, D.shellDepth]}
        radius={0.01}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial {...metalMid} />
      </RoundedBox>

      {/* Drawers */}
      {projectsData.drawers.map((drawer, index) => (
        <Drawer
          key={drawer.id}
          data={drawer}
          index={index}
          baseY={drawerStartY - index * (D.drawerHeight + D.drawerGap)}
          onSelectProject={onSelectProject}
        />
      ))}

      <CabinetFeet />
    </group>
  )
}