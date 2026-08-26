import React, { useMemo } from 'react'
import { RoundedBox, Plane, Cylinder, Torus, Circle } from '@react-three/drei'
import * as THREE from 'three'
import { InteractiveObject } from '../HubObjects'
import { hubItems } from '../hubData'
import OpenFoamCarMesh from './objects/DriveInCar'

// Diploma scroll & graduation cap inside half-open evidence locker
function LockerEvidenceContents() {
  return (
    <group position={[0.27, 0.05, 0.12]} rotation={[0, -0.15, 0]}>
      {/* Diploma Scroll */}
      <group position={[0.08, 0.22, -0.04]} rotation={[0.2, 0.5, -0.1]}>
        <Cylinder args={[0.022, 0.022, 0.28]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#fcf8ee' roughness={0.7} />
        </Cylinder>
        {/* Red Ribbon Tie */}
        <Cylinder args={[0.024, 0.024, 0.03]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color='#8b0000' roughness={0.6} />
        </Cylinder>
      </group>

      {/* Graduation Cap (Mortarboard) */}
      <group position={[-0.05, -0.15, -0.05]} rotation={[0.1, -0.2, 0]}>
        <Plane args={[0.24, 0.24]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color='#181c19' roughness={0.7} side={THREE.DoubleSide} />
        </Plane>
        <Cylinder args={[0.07, 0.08, 0.08]} position={[0, -0.04, 0]}>
          <meshStandardMaterial color='#181c19' roughness={0.7} />
        </Cylinder>
        <Cylinder args={[0.005, 0.005, 0.12]} position={[0.06, 0.01, 0.06]} rotation={[0.4, 0, 0]}>
          <meshStandardMaterial color='#c4a574' metalness={0.8} />
        </Cylinder>
      </group>

      {/* Golden Academic Trophy Cup */}
      <group position={[-0.12, 0.28, -0.05]}>
        <Cylinder args={[0.03, 0.04, 0.02]} position={[0, 0, 0]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.008, 0.008, 0.08]} position={[0, 0.04, 0]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.045, 0.025, 0.09]} position={[0, 0.11, 0]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>
    </group>
  )
}

function EducationLockersMesh() {
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Outer Heavy Steel Frame */}
      <RoundedBox args={[1.1, 1.6, 0.5]} radius={0.015} position={[0, 0, 0]}>
        <meshStandardMaterial color='#222823' roughness={0.7} metalness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.015, 1.58, 0.01]} position={[0, 0, 0.252]}>
        <meshStandardMaterial color='#151a16' roughness={0.8} />
      </RoundedBox>

      {/* Left Door (Closed with Brass Evidence Tag) */}
      <group position={[-0.27, 0, 0.252]}>
        <RoundedBox args={[0.52, 1.54, 0.015]} radius={0.005}>
          <meshStandardMaterial color='#2c352d' roughness={0.65} metalness={0.3} />
        </RoundedBox>
        {/* Louver Vent Slats */}
        {[-0.08, 0, 0.08].map((x, i) =>
          [0.6, 0.56, 0.52].map((y, j) => (
            <Plane key={`${i}-${j}`} args={[0.08, 0.012]} position={[x - 0.08, y, 0.009]}>
              <meshStandardMaterial color='#151a16' />
            </Plane>
          ))
        )}
        {/* Brass Evidence Label Holder */}
        <RoundedBox args={[0.18, 0.06, 0.008]} radius={0.002} position={[0, 0.35, 0.01]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </RoundedBox>
        <Plane args={[0.15, 0.045]} position={[0, 0.35, 0.015]}>
          <meshStandardMaterial color='#f2e8d5' roughness={0.9} />
        </Plane>
        {/* Heavy Handle */}
        <RoundedBox args={[0.04, 0.12, 0.02]} radius={0.004} position={[0.2, 0, 0.012]}>
          <meshStandardMaterial color='#111111' metalness={0.85} />
        </RoundedBox>
      </group>

      {/* Right Door (Ajar / Slightly Open displaying contents) */}
      <group position={[0.27, 0, 0.252]} rotation={[0, -0.35, 0]}>
        <RoundedBox args={[0.52, 1.54, 0.015]} radius={0.005}>
          <meshStandardMaterial color='#2c352d' roughness={0.65} metalness={0.3} />
        </RoundedBox>
        {[-0.08, 0, 0.08].map((x, i) =>
          [0.6, 0.56, 0.52].map((y, j) => (
            <Plane key={`${i}-${j}`} args={[0.08, 0.012]} position={[x - 0.08, y, 0.009]}>
              <meshStandardMaterial color='#151a16' />
            </Plane>
          ))
        )}
        <RoundedBox args={[0.18, 0.06, 0.008]} radius={0.002} position={[0, 0.35, 0.01]}>
          <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
        </RoundedBox>
        {/* Heavy Brass Padlock hanging */}
        <group position={[-0.2, 0, 0.015]}>
          <RoundedBox args={[0.05, 0.06, 0.02]} radius={0.004} position={[0, -0.02, 0]}>
            <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <Cylinder args={[0.015, 0.015, 0.04]} position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color='#888888' metalness={0.9} />
          </Cylinder>
        </group>
      </group>

      {/* Interior Contents of Open Locker */}
      <LockerEvidenceContents />
    </group>
  )
}

function ProjectsCabinetMesh() {
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      {/* Main Steel Filing Cabinet Body */}
      <RoundedBox args={[0.65, 1.45, 0.65]} radius={0.015} position={[0, 0, 0]}>
        <meshStandardMaterial color='#1c2022' roughness={0.7} metalness={0.5} />
      </RoundedBox>

      {/* Cardboard Storage Box stacked on top of filing cabinet */}
      <group position={[0, 0.88, 0]} rotation={[0, 0.1, 0]}>
        <RoundedBox args={[0.55, 0.28, 0.48]} radius={0.01}>
          <meshStandardMaterial color='#b58d55' roughness={0.9} />
        </RoundedBox>
        <Plane args={[0.22, 0.08]} position={[0, 0.02, 0.241]}>
          <meshStandardMaterial color='#ffffff' roughness={0.9} />
        </Plane>
      </group>

      {/* Drawers */}
      {[0.52, 0.18, -0.16, -0.5].map((y, idx) => {
        const isTopDrawerPulled = idx === 0
        const zOffset = isTopDrawerPulled ? 0.22 : 0
        return (
          <group key={idx} position={[0, y, 0.328 + zOffset]}>
            <RoundedBox args={[0.58, 0.31, 0.025]} radius={0.008}>
              <meshStandardMaterial color='#242a2e' roughness={0.65} metalness={0.4} />
            </RoundedBox>
            <RoundedBox args={[0.18, 0.08, 0.01]} radius={0.002} position={[0, 0.04, 0.015]}>
              <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
            </RoundedBox>
            <Plane args={[0.15, 0.05]} position={[0, 0.04, 0.021]}>
              <meshStandardMaterial color='#f2e6ce' roughness={0.9} />
            </Plane>
            <RoundedBox args={[0.14, 0.035, 0.02]} radius={0.006} position={[0, -0.05, 0.02]}>
              <meshStandardMaterial color='#c4a574' metalness={0.9} roughness={0.2} />
            </RoundedBox>

            {/* Pulled-out Top Drawer with Hanging Case Folders */}
            {isTopDrawerPulled && (
              <group position={[0, 0.05, -0.15]}>
                {[-0.18, -0.1, -0.02, 0.06, 0.14].map((z, j) => (
                  <RoundedBox
                    key={j}
                    args={[0.52, 0.22, 0.01]}
                    radius={0.003}
                    position={[0, 0.04, z]}
                    rotation={[-0.1, 0, 0]}
                  >
                    <meshStandardMaterial color={['#c99f49', '#3b7a57', '#993d3d', '#3d6399', '#8a49a8'][j]} roughness={0.9} />
                  </RoundedBox>
                ))}
              </group>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function LeftScene({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem, activeZone }) {
  const leftItems = useMemo(() => hubItems.filter((item) => item.zone === 'left'), [])

  const getItem = (id) => leftItems.find((it) => it.id === id)

  const educationItem = getItem('education')
  const projectsItem = getItem('projects')
  const openfoamItem = getItem('openfoam')

  return (
    <group>
      {educationItem && (
        <InteractiveObject
          item={educationItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'education'}
          activeZone={activeZone}
        >
          <EducationLockersMesh />
        </InteractiveObject>
      )}

      {projectsItem && (
        <InteractiveObject
          item={projectsItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'projects'}
          activeZone={activeZone}
        >
          <ProjectsCabinetMesh />
        </InteractiveObject>
      )}

      {openfoamItem && (
        <InteractiveObject
          item={openfoamItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'openfoam'}
          activeZone={activeZone}
        >
          <OpenFoamCarMesh />
        </InteractiveObject>
      )}
    </group>
  )
}