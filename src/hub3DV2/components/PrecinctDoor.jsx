import React, { useMemo } from 'react'
import { RoundedBox, Plane, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'

/**
 * PrecinctDoor Component
 *
 * Heavy 1980s Police Precinct Security Door with metallic frame, brass hardware, and security window.
 * Highlights together with WallKeychains when hovered.
 */
export default function PrecinctDoor({
  position = [-7.9, 0.6, -4.2],
  scale = [1, 1, 1],
  rotation = [0, Math.PI / 2, 0],
  outlineColor = '#ff3366',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  isHoveredGroup = false,
  onHoverChange,
  onClick
}) {
  const doorScene = useMemo(() => {
    const group = new THREE.Group()

    // 1. Heavy Outer Door Frame (Steel/Iron)
    const frameMat = new THREE.MeshStandardMaterial({
      color: '#1a1d24',
      roughness: 0.5,
      metalness: 0.7
    })
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(1.24, 2.54, 0.12), frameMat)
    frameMesh.position.set(0, 0, 0)
    group.add(frameMesh)

    // Inner Door Frame Recess Cutout
    const frameInnerMat = new THREE.MeshStandardMaterial({
      color: '#0d0e12',
      roughness: 0.6
    })
    const frameInner = new THREE.Mesh(new THREE.BoxGeometry(1.12, 2.42, 0.13), frameInnerMat)
    frameInner.position.set(0, 0, 0)
    group.add(frameInner)

    // 2. Door Panel Body (Dark Metallic Steel / Heavy Wood)
    const doorMat = new THREE.MeshStandardMaterial({
      color: '#282c37',
      roughness: 0.55,
      metalness: 0.6
    })
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(1.08, 2.38, 0.08), doorMat)
    doorPanel.position.set(0, 0, 0.01)
    group.add(doorPanel)

    // 3. Lower Kickplate (Polished Brass)
    const brassMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.35,
      metalness: 0.85
    })
    const kickplate = new THREE.Mesh(new THREE.BoxGeometry(1.04, 0.35, 0.09), brassMat)
    kickplate.position.set(0, -0.98, 0.01)
    group.add(kickplate)

    // 4. Upper Security Wire Glass Window Frame
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: '#181a20',
      roughness: 0.4,
      metalness: 0.8
    })
    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.55, 0.095), windowFrameMat)
    windowFrame.position.set(0, 0.55, 0.01)
    group.add(windowFrame)

    // Security Wire Glass Pane (Frosted Cyan Tint)
    const glassMat = new THREE.MeshStandardMaterial({
      color: '#002b36',
      emissive: '#003847',
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    })
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.45, 0.098), glassMat)
    glassPane.position.set(0, 0.55, 0.01)
    group.add(glassPane)

    // 5. Polished Brass Lever Handle & Keyhole Lock Plate
    const handlePlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.105), brassMat)
    handlePlate.position.set(0.42, -0.1, 0.01)
    group.add(handlePlate)

    const leverHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.14, 12), brassMat)
    leverHandle.rotation.z = Math.PI / 2
    leverHandle.position.set(0.48, -0.05, 0.07)
    group.add(leverHandle)

    // Keyhole Cylinder
    const keyholeMat = new THREE.MeshStandardMaterial({ color: '#0a0a0a' })
    const keyhole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.11, 12), keyholeMat)
    keyhole.rotation.x = Math.PI / 2
    keyhole.position.set(0.42, -0.18, 0.01)
    group.add(keyhole)

    // 6. Overhead Emergency / Security Dome Light Fixture
    const lightHousingMat = new THREE.MeshStandardMaterial({ color: '#111318', metalness: 0.9, roughness: 0.3 })
    const lightHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 16), lightHousingMat)
    lightHousing.position.set(0, 1.35, 0.08)
    group.add(lightHousing)

    // Glowing Red LED Dome Lens
    const redLensMat = new THREE.MeshStandardMaterial({
      color: '#ff1a40',
      emissive: '#ff0033',
      emissiveIntensity: 2.2,
      roughness: 0.2
    })
    const redLens = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), redLensMat)
    redLens.position.set(0, 1.32, 0.08)
    group.add(redLens)

    // Mark all child meshes for pointer events
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.isPrecinctDoor = true
      }
    })

    return group
  }, [])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (onHoverChange) onHoverChange(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    if (onHoverChange) onHoverChange(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      <primitive object={doorScene} />
      {(isHoveredGroup || alwaysShowOutline) && (
        <TightSilhouetteOutline
          scene={doorScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
