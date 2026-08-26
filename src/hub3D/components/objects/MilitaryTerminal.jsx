import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder, Torus, Sphere } from '@react-three/drei'

export default function MilitaryTerminal() {
  const scanLineRef = useRef()
  const ledRef = useRef()
  const screenGlowRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (scanLineRef.current) {
      scanLineRef.current.position.y = Math.sin(t * 3) * 0.12
    }
    if (ledRef.current && ledRef.current.material) {
      ledRef.current.material.emissiveIntensity = Math.sin(t * 8) > 0 ? 1.4 : 0.2
    }
    if (screenGlowRef.current) {
      screenGlowRef.current.intensity = 1.2 + Math.sin(t * 10) * 0.08
    }
  })

  return (
    <group rotation={[0, -0.4, 0]}>
      {/* Heavy Industrial Floor Pedestal Base (Standing on Floor) */}
      <group position={[0, -0.75, 0]}>
        {/* Base Foundation Block */}
        <RoundedBox args={[0.92, 0.16, 0.72]} radius={0.02} position={[0, 0.08, 0]}>
          <meshStandardMaterial color='#181c19' roughness={0.7} metalness={0.5} />
        </RoundedBox>

        {/* Lower Mainframe Cabinet Body */}
        <RoundedBox args={[0.84, 0.65, 0.62]} radius={0.02} position={[0, 0.48, -0.02]}>
          <meshStandardMaterial color='#262e28' roughness={0.65} metalness={0.4} />
        </RoundedBox>

        {/* Side Armor Plates & Louvered Cooling Vents */}
        {[-0.43, 0.43].map((x, i) => (
          <group key={i} position={[x, 0.48, -0.02]}>
            <RoundedBox args={[0.02, 0.58, 0.54]} radius={0.005}>
              <meshStandardMaterial color='#1c221e' roughness={0.7} metalness={0.6} />
            </RoundedBox>
            {[-0.18, -0.06, 0.06, 0.18].map((y, j) => (
              <Plane key={j} args={[0.022, 0.42]} position={[i === 0 ? -0.005 : 0.005, y, 0]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color='#0d110e' />
              </Plane>
            ))}
          </group>
        ))}

        {/* Black & Yellow Hazard Stripes Trim along Front Base Rim */}
        {[-0.32, -0.16, 0, 0.16, 0.32].map((x, i) => (
          <Plane key={i} args={[0.1, 0.04]} position={[x, 0.78, 0.292]} rotation={[0, 0, 0.4]}>
            <meshStandardMaterial color={i % 2 === 0 ? '#d4a742' : '#141414'} roughness={0.4} />
          </Plane>
        ))}

        {/* Heavy Cables Running on Floor */}
        <group position={[0.3, 0.04, 0.2]}>
          <Cylinder args={[0.025, 0.025, 0.6]} position={[0, 0, 0]} rotation={[0.3, 0, Math.PI / 2]}>
            <meshStandardMaterial color='#111111' roughness={0.9} />
          </Cylinder>
          <Cylinder args={[0.018, 0.018, 0.6]} position={[0, 0, 0.08]} rotation={[0.2, 0, Math.PI / 2]}>
            <meshStandardMaterial color='#ccaa00' roughness={0.7} />
          </Cylinder>
        </group>
      </group>

      {/* Slanted Control Console Workstation Desk Deck */}
      <group position={[0, 0.08, 0.12]} rotation={[0.25, 0, 0]}>
        {/* Slanted Desk Deck Frame */}
        <RoundedBox args={[0.88, 0.08, 0.38]} radius={0.012} position={[0, 0, 0]}>
          <meshStandardMaterial color='#222a24' roughness={0.6} metalness={0.4} />
        </RoundedBox>

        {/* Primary Mechanical Keyboard Surface */}
        <group position={[-0.14, 0.045, 0.04]}>
          <RoundedBox args={[0.42, 0.02, 0.18]} radius={0.004}>
            <meshStandardMaterial color='#141715' roughness={0.8} />
          </RoundedBox>
          {/* Keycaps */}
          {[-0.17, -0.09, -0.01, 0.07, 0.15].map((x, i) =>
            [-0.05, 0, 0.05].map((z, j) => (
              <RoundedBox key={`${i}-${j}`} args={[0.025, 0.012, 0.025]} radius={0.002} position={[x, 0.012, z]}>
                <meshStandardMaterial color={i === 0 && j === 0 ? '#b83223' : '#2b332d'} roughness={0.5} />
              </RoundedBox>
            ))
          )}
        </group>

        {/* Joysticks, Levers & Red Emergency Stop Button */}
        <group position={[0.24, 0.045, 0.04]}>
          {/* Emergency Red Dome Button */}
          <Cylinder args={[0.035, 0.035, 0.025]} position={[-0.08, 0.015, -0.03]}>
            <meshStandardMaterial color='#cc1100' roughness={0.3} emissive='#550000' />
          </Cylinder>
          {/* Joystick Base & Lever Stick */}
          <Cylinder args={[0.03, 0.035, 0.02]} position={[0.06, 0.01, 0.02]}>
            <meshStandardMaterial color='#181818' metalness={0.8} />
          </Cylinder>

          <Cylinder args={[0.006, 0.006, 0.09]} position={[0.06, 0.05, 0.02]} rotation={[0.2, 0, 0.1]}>
            <meshStandardMaterial color='#dddddd' metalness={0.95} />
          </Cylinder>

          <Sphere args={[0.018, 12, 12]} position={[0.07, 0.09, 0.03]}>
            <meshStandardMaterial color='#d4a742' roughness={0.3} />
          </Sphere>
        </group>
      </group>

      {/* Main Central CRT Display Unit (SYSTEM LOAD 20% / SOLVERS TELEMETRY) */}
      <group position={[0, 0.42, -0.05]} rotation={[-0.1, 0, 0]}>
        {/* Main CRT Frame Shell */}
        <RoundedBox args={[0.62, 0.44, 0.28]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color='#222a24' roughness={0.65} metalness={0.4} />
        </RoundedBox>
        
        {/* Curved Bezel Rim */}
        <RoundedBox args={[0.54, 0.36, 0.03]} radius={0.015} position={[0, 0, 0.14]}>
          <meshStandardMaterial color='#141815' roughness={0.5} />
        </RoundedBox>
        
        {/* Glowing Green Phosphor Screen */}
        <Plane args={[0.49, 0.31]} position={[0, 0, 0.156]}>
          <meshStandardMaterial color='#021d07' emissive='#022e0a' emissiveIntensity={0.9} roughness={0.15} />
        </Plane>

        {/* Animated Green Telemetry Scanline */}
        <Plane ref={scanLineRef} args={[0.47, 0.012]} position={[0, 0, 0.158]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={1} />
        </Plane>

        {/* Telemetry Curves & Grid Overlay Lines */}
        <Plane args={[0.42, 0.005]} position={[0, 0.08, 0.157]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.9} />
        </Plane>

        <Plane args={[0.38, 0.005]} position={[-0.02, -0.04, 0.157]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={0.9} />
        </Plane>

        {/* CRT Light Beam Spill */}
        <pointLight ref={screenGlowRef} position={[0, 0, 0.35]} intensity={1.3} color='#00ff66' distance={2.8} />
      </group>

      {/* Left Side Auxiliary CRT Monitor on Articulated Metal Arm Bracket */}
      <group position={[-0.42, 0.52, 0.02]} rotation={[0, 0.35, 0.05]}>
        {/* Metal Support Arm Rod */}
        <Cylinder args={[0.012, 0.012, 0.22]} position={[0.06, 0, -0.1]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#888888' metalness={0.9} />
        </Cylinder>

        {/* Vertical CRT Shell */}
        <RoundedBox args={[0.22, 0.34, 0.16]} radius={0.015}>
          <meshStandardMaterial color='#1c221e' roughness={0.6} />
        </RoundedBox>

        <Plane args={[0.18, 0.29]} position={[0, 0, 0.082]}>
          <meshStandardMaterial color='#021c07' emissive='#022a09' emissiveIntensity={0.85} />
        </Plane>

        {/* Matrix Code Raster Text Lines */}
        {[-0.1, -0.05, 0, 0.05, 0.1].map((y, i) => (
          <Plane key={i} args={[0.14 - (i % 2) * 0.03, 0.008]} position={[0, y, 0.083]}>
            <meshStandardMaterial color='#00ff55' emissive='#00ff55' emissiveIntensity={1} />
          </Plane>
        ))}
      </group>

      {/* Right Side Control & Patch Panel Module with Status LEDs */}
      <group position={[0.42, 0.52, 0.02]} rotation={[0, -0.35, -0.05]}>
        {/* Module Casing */}
        <RoundedBox args={[0.24, 0.34, 0.16]} radius={0.015}>
          <meshStandardMaterial color='#1c221e' roughness={0.6} />
        </RoundedBox>

        {/* Switch Bank & Rotary Knobs */}
        {[-0.06, 0.06].map((x, i) =>
          [0.08, 0.02, -0.04, -0.1].map((y, j) => (
            <group key={`${i}-${j}`} position={[x, y, 0.082]}>
              <Cylinder args={[0.012, 0.012, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color='#888888' metalness={0.9} />
              </Cylinder>
              <Cylinder ref={i === 0 && j === 0 ? ledRef : null} args={[0.005, 0.005, 0.01]} position={[0, 0.015, 0.008]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color={j % 2 === 0 ? '#ff2200' : '#ffaa00'} emissive={j % 2 === 0 ? '#ff2200' : '#ffaa00'} emissiveIntensity={1} />
              </Cylinder>
            </group>
          ))
        )}
      </group>

      {/* Top Overhead Banner Monitor displaying Status Line */}
      <group position={[0, 0.72, -0.08]} rotation={[0.15, 0, 0]}>
        <RoundedBox args={[0.48, 0.12, 0.14]} radius={0.01}>
          <meshStandardMaterial color='#1a201c' roughness={0.6} />
        </RoundedBox>
        <Plane args={[0.42, 0.08]} position={[0, 0, 0.072]}>
          <meshStandardMaterial color='#021c07' emissive='#022e0a' emissiveIntensity={0.9} />
        </Plane>
        <Plane args={[0.36, 0.012]} position={[0, 0, 0.074]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={1} />
        </Plane>
      </group>
    </group>
  )
}
