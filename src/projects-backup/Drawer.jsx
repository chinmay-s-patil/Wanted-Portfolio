import { useSpring, animated } from '@react-spring/three'
import { useCabinetStore } from './useCabinetStore'
import { D } from './dimensions'
import DrawerFront from './DrawerFront'
import FolderRow from './FolderRow'

// The shell has no front panel (drawer fronts ARE the front face), so the
// drawer's rest position needs an explicit forward offset. Without this the
// front panel sits at the cabinet's local z=0 — the middle of a shell that
// spans -shellDepth/2..+shellDepth/2 — which is exactly the "pushed in /
// recessed" look. This puts it flush with the open face instead.
const REST_Z = D.shellDepth / 2 - 0.02

export default function Drawer({ data, index, baseY, onSelectProject }) {
  const isOpen = useCabinetStore((s) => s.openDrawerId === data.id)

  const { z, dip } = useSpring({
    z: isOpen ? REST_Z + D.drawerTravel : REST_Z,
    dip: isOpen ? -0.015 : 0,
    config: isOpen
      ? { tension: 170, friction: 16 }
      : { tension: 210, friction: 22 },
  })

  return (
    <group position={[0, baseY, 0]}>
      <animated.group position-z={z} position-y={dip}>
        {/* Drawer body (visible when open) */}
        {isOpen && (
          <DrawerBody>
            <FolderRow data={data} onSelectProject={onSelectProject} />
          </DrawerBody>
        )}

        {/* Drawer front panel */}
        <DrawerFront data={data} />
      </animated.group>
    </group>
  )
}

function DrawerBody({ children }) {
  const wallThick = 0.02
  const w = D.drawerWidth
  const h = D.drawerHeight
  const d = D.drawerDepth

  return (
    <group position={[0, 0, -d / 2]}>
      {/* Bottom */}
      <mesh position={[0, -h / 2 + wallThick / 2, 0]} receiveShadow>
        <boxGeometry args={[w, wallThick, d]} />
        <meshStandardMaterial color="#2e2c28" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-w / 2 + wallThick / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallThick, h, d]} />
        <meshStandardMaterial color="#2e2c28" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Right wall */}
      <mesh position={[w / 2 - wallThick / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallThick, h, d]} />
        <meshStandardMaterial color="#2e2c28" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 0, -d / 2 + wallThick / 2]}>
        <boxGeometry args={[w, h, wallThick]} />
        <meshStandardMaterial color="#1e1c1a" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Hanging rail */}
      <mesh position={[0, h / 2 - 0.02, 0]}>
        <boxGeometry args={[w - 0.04, 0.015, 0.015]} />
        <meshStandardMaterial color="#8a8884" metalness={0.8} roughness={0.3} />
      </mesh>

      {children}
    </group>
  )
}