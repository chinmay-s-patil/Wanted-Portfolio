import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Plane, Cylinder, Torus, Sphere } from '@react-three/drei'

export default function Industrial3DPrinter() {
  const printHeadRef = useRef()
  const spoolRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (printHeadRef.current) {
      printHeadRef.current.position.x = Math.sin(t * 2.2) * 0.16
      printHeadRef.current.position.z = Math.cos(t * 1.5) * 0.12
    }
    if (spoolRef.current) {
      spoolRef.current.rotation.x = t * 0.6
    }
  })

  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* Heavy Enclosed Outer Chassis Box */}
      <RoundedBox args={[0.74, 0.78, 0.66]} radius={0.02} position={[0, 0, 0]}>
        <meshStandardMaterial color='#16191c' roughness={0.6} metalness={0.6} />
      </RoundedBox>

      {/* Interior Hollow Build Chamber Cutout */}
      <RoundedBox args={[0.66, 0.68, 0.58]} radius={0.01} position={[0, 0.02, 0.02]}>
        <meshStandardMaterial color='#0c0e10' roughness={0.9} />
      </RoundedBox>

      {/* Translucent Tinted Acrylic Front Glass Door */}
      <Plane args={[0.62, 0.64]} position={[0, 0.02, 0.332]}>
        <meshStandardMaterial color='#182838' transparent opacity={0.35} roughness={0.1} />
      </Plane>
      {/* Door Frame & Handle */}
      <RoundedBox args={[0.02, 0.16, 0.02]} radius={0.004} position={[0.26, 0.02, 0.34]}>
        <meshStandardMaterial color='#d4a742' metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Corner Anodized Frame Pillars & Brackets */}
      {[-0.35, 0.35].map((x, i) =>
        [-0.31, 0.31].map((z, j) => (
          <group key={`${i}-${j}`} position={[x, 0, z]}>
            <RoundedBox args={[0.045, 0.79, 0.045]} radius={0.006}>
              <meshStandardMaterial color='#22262a' roughness={0.4} metalness={0.8} />
            </RoundedBox>
          </group>
        ))
      )}

      {/* Top Chamber Internal LED Light Strip */}
      <Plane args={[0.6, 0.06]} position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color='#ffffff' emissive='#ffffff' emissiveIntensity={1.2} />
      </Plane>
      <pointLight position={[0, 0.3, 0]} intensity={1.5} color='#e6f2ff' distance={2.2} />

      {/* Precision Dual Z-Axis Threaded Lead Screws */}
      {[-0.28, 0.28].map((x, i) => (
        <group key={i} position={[x, 0, -0.22]}>
          <Cylinder args={[0.01, 0.01, 0.66]} position={[0, 0, 0]}>
            <meshStandardMaterial color='#dddddd' metalness={0.95} roughness={0.15} />
          </Cylinder>
          <Cylinder args={[0.018, 0.018, 0.66]} position={[-0.03, 0, 0]}>
            <meshStandardMaterial color='#222222' metalness={0.8} />
          </Cylinder>
        </group>
      ))}

      {/* Heated PEI Glass Build Bed Plate */}
      <group position={[0, -0.22, 0]}>
        {/* Under-bed Support Spider Bracket */}
        <RoundedBox args={[0.54, 0.03, 0.5]} radius={0.005} position={[0, -0.02, 0]}>
          <meshStandardMaterial color='#262a2e' metalness={0.8} />
        </RoundedBox>
        {/* Glass Plate */}
        <RoundedBox args={[0.52, 0.015, 0.48]} radius={0.004} position={[0, 0, 0]}>
          <meshStandardMaterial color='#1c1c1c' roughness={0.8} />
        </RoundedBox>
        <Plane args={[0.48, 0.44]} position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#111111' roughness={0.95} />
        </Plane>
        {/* Grid Print Lines on Bed */}
        {[-0.18, -0.09, 0, 0.09, 0.18].map((x, i) => (
          <Plane key={i} args={[0.004, 0.42]} position={[x, 0.009, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#00bfff' emissive='#00bfff' emissiveIntensity={0.6} />
          </Plane>
        ))}
      </group>

      {/* High-Detail 3D Printed Mechanical Turbine Rotor Model */}
      <group position={[0, -0.11, 0]}>
        <Cylinder args={[0.12, 0.14, 0.18, 16]} position={[0, 0.04, 0]}>
          <meshStandardMaterial color='#ff5500' emissive='#ff4400' emissiveIntensity={0.9} wireframe />
        </Cylinder>
        {/* Impeller Blades */}
        {[0, 0.78, 1.57, 2.35, 3.14, 3.92, 4.71, 5.49].map((rot, i) => (
          <group key={i} rotation={[0, rot, 0]}>
            <RoundedBox args={[0.14, 0.12, 0.012]} radius={0.002} position={[0.08, 0.04, 0]} rotation={[0.3, 0, 0]}>
              <meshStandardMaterial color='#00e5ff' emissive='#00ccff' emissiveIntensity={0.95} wireframe />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* X & Y Gantry System + Dual Direct Extruder Print Head */}
      <group position={[0, 0.08, 0]}>
        {/* X-Axis Carbon Fiber Guide Rods */}
        <Cylinder args={[0.008, 0.008, 0.58]} position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#dddddd' metalness={0.9} />
        </Cylinder>
        <Cylinder args={[0.008, 0.008, 0.58]} position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#dddddd' metalness={0.9} />
        </Cylinder>

        {/* Animated Moving Extruder Assembly */}
        <group ref={printHeadRef} position={[0, 0, 0]}>
          {/* Extruder Main Body Shell */}
          <RoundedBox args={[0.11, 0.12, 0.11]} radius={0.012} position={[0, 0, 0]}>
            <meshStandardMaterial color='#22282e' roughness={0.4} metalness={0.6} />
          </RoundedBox>
          {/* Fan Duct Cooling Grill */}
          <Cylinder args={[0.035, 0.035, 0.012]} position={[0, 0, 0.058]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color='#d4a742' metalness={0.9} />
          </Cylinder>
          {/* Brass Nozzle Tip */}
          <Cylinder args={[0.008, 0.002, 0.025]} position={[0, -0.07, 0]}>
            <meshStandardMaterial color='#ffaa00' metalness={0.95} />
          </Cylinder>
          {/* Focused Hot Nozzle Point Light Glow */}
          <pointLight position={[0, -0.08, 0]} intensity={1.6} color='#ff5500' distance={1.2} />
        </group>
      </group>

      {/* Top Enclosure Spool Mount & Rotating Filament Roll */}
      <group position={[0, 0.46, -0.1]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder ref={spoolRef} args={[0.13, 0.13, 0.09]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#181818' roughness={0.5} />
        </Cylinder>
        {/* Bright Orange Filament Roll */}
        <Cylinder args={[0.122, 0.122, 0.086]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#ff4400' roughness={0.35} />
        </Cylinder>
      </group>

      {/* Front Lower Bezel 4.3" Touchscreen LCD Controller */}
      <group position={[0, -0.34, 0.334]}>
        <RoundedBox args={[0.26, 0.07, 0.01]} radius={0.003}>
          <meshStandardMaterial color='#0c1014' roughness={0.8} />
        </RoundedBox>
        <Plane args={[0.22, 0.055]} position={[0, 0, 0.006]}>
          <meshStandardMaterial color='#021c2b' emissive='#00bfff' emissiveIntensity={0.85} />
        </Plane>
        {/* Progress Bar & Status Text Line */}
        <Plane args={[0.14, 0.008]} position={[-0.02, -0.01, 0.007]}>
          <meshStandardMaterial color='#00ff66' emissive='#00ff66' emissiveIntensity={1} />
        </Plane>
      </group>
    </group>
  )
}
