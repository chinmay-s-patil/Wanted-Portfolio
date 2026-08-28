import { useSpring, animated } from '@react-spring/three'
import { Text } from '@react-three/drei'
import { useCabinetStore } from './useCabinetStore'
import { D } from './dimensions'
import { manilaBody, manilaBodyLight } from './materials'

export default function Folder({ data, index, drawerColor, restTransform, onSelectProject }) {
  const activeFolderIndex = useCabinetStore((s) => s.activeFolderIndex)
  const setActiveFolderIndex = useCabinetStore((s) => s.setActiveFolderIndex)
  const isActive = activeFolderIndex === index

  // Smooth vertical lift when active
  const { y, rotX } = useSpring({
    y: isActive ? restTransform.y + 0.11 : restTransform.y,
    rotX: isActive ? -0.10 : 0,
    config: { tension: 260, friction: 22 },
  })

  // Stagger tab positions (Left, Center, Right) across columns
  const tabPositions = [-D.folderWidth / 3.2, 0, D.folderWidth / 3.2]
  const tabX = tabPositions[index % 3]

  const tabColor = drawerColor || '#d4af37'

  return (
    <animated.group
      position-x={restTransform.x}
      position-y={y}
      position-z={restTransform.z}
      rotation-x={rotX}
      rotation-y={restTransform.yawRad}
      rotation-z={restTransform.tiltRad}
      onClick={(e) => {
        e.stopPropagation()
        if (isActive && onSelectProject) {
          onSelectProject(data)
        } else {
          setActiveFolderIndex(index)
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Folder Hooks (Left & Right) */}
      <Hook position={[-D.folderWidth / 2 + 0.015, D.folderHeight / 2 + 0.02, 0]} />
      <Hook position={[D.folderWidth / 2 - 0.015, D.folderHeight / 2 + 0.02, 0]} />

      {/* Hanging Folder Steel Bar */}
      <mesh position={[0, D.folderHeight / 2 + 0.01, 0]}>
        <boxGeometry args={[D.folderWidth + 0.04, 0.008, 0.006]} />
        <meshStandardMaterial color="#8a8884" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* High-Visibility Folder Tab */}
      <group position={[tabX, D.folderHeight / 2 + D.folderTabHeight / 2, 0.002]}>
        {/* Metal frame surround */}
        <mesh position={[0, 0, 0.002]}>
          <boxGeometry args={[D.folderTabWidth + 0.012, D.folderTabHeight + 0.006, 0.005]} />
          <meshStandardMaterial color="#2a241e" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Colored Tab fill */}
        <mesh position={[0, 0, 0.005]}>
          <boxGeometry args={[D.folderTabWidth + 0.004, D.folderTabHeight, 0.003]} />
          <meshStandardMaterial color={tabColor} metalness={0.2} roughness={0.6} />
        </mesh>
        {/* High contrast tab text */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.03}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          {(data.category || 'CASE').substring(0, 9).toUpperCase()}
        </Text>
      </group>

      {/* Inner Document Paper Sheet */}
      <mesh position={[0, 0.012, -0.002]} castShadow>
        <boxGeometry args={[D.folderWidth - 0.02, D.folderHeight - 0.02, 0.003]} />
        <meshStandardMaterial color="#f4efe4" roughness={0.9} />
      </mesh>

      {/* Manila Folder Front Jacket */}
      <mesh position={[0, 0, 0.004]} castShadow receiveShadow>
        <boxGeometry args={[D.folderWidth, D.folderHeight, D.folderThickness]} />
        <meshStandardMaterial {...(isActive ? manilaBodyLight : manilaBody)} />
      </mesh>

      {/* Metal Corner Clip */}
      <mesh position={[-D.folderWidth / 2 + 0.02, D.folderHeight / 2 - 0.02, 0.015]}>
        <boxGeometry args={[0.02, 0.03, 0.004]} />
        <meshStandardMaterial color="#8a8884" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Crisp Confidential Stamp */}
      <Text
        position={[-D.folderWidth / 2 + 0.04, D.folderHeight / 2 - 0.05, 0.015]}
        fontSize={0.028}
        color="rgba(180,30,30,0.85)"
        anchorX="left"
        anchorY="top"
        letterSpacing={0.12}
        rotation-z={-0.08}
      >
        [CLASSIFIED]
      </Text>

      {/* Case File Number Stamp */}
      <Text
        position={[D.folderWidth / 2 - 0.03, D.folderHeight / 2 - 0.05, 0.015]}
        fontSize={0.022}
        color="rgba(90,70,40,0.8)"
        anchorX="right"
        anchorY="top"
      >
        FILE #{data.id.substring(0, 6).toUpperCase()}
      </Text>

      {/* Main Title centered cleanly on Folder Cover */}
      <Text
        position={[0, -0.02, 0.015]}
        fontSize={isActive ? 0.03 : 0.026}
        color={isActive ? 'rgba(30,18,8,0.98)' : 'rgba(70,45,20,0.8)'}
        anchorX="center"
        anchorY="middle"
        maxWidth={D.folderWidth - 0.06}
        textAlign="center"
      >
        {data.title.length > 36 ? data.title.substring(0, 36) + '...' : data.title}
      </Text>
    </animated.group>
  )
}

function Hook({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.015, 0]}>
        <boxGeometry args={[0.018, 0.035, 0.008]} />
        <meshStandardMaterial color="#8a8884" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <boxGeometry args={[0.008, 0.02, 0.008]} />
        <meshStandardMaterial color="#787672" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}