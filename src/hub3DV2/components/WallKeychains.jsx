import React, { useMemo } from 'react'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'

/**
 * WallKeychains Component
 *
 * Wall-mounted wooden precinct key rack with hanging keys and tag fobs.
 * Highlights together with PrecinctDoor when hovered.
 */
export default function WallKeychains({
  position = [-7.9, 0.8, -3.1],
  scale = [1, 1, 1],
  rotation = [0, Math.PI / 2, 0],
  outlineColor = '#ff3366',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  isHoveredGroup = false,
  onHoverChange,
  onClick
}) {
  const keychainsScene = useMemo(() => {
    const group = new THREE.Group()

    // 1. Dark Oak Wooden Key Board Base
    const boardMat = new THREE.MeshStandardMaterial({
      color: '#3b2619',
      roughness: 0.7,
      metalness: 0.1
    })
    const boardMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.45, 0.035), boardMat)
    boardMesh.position.set(0, 0, 0)
    group.add(boardMesh)

    // Gold Brass Border Trim Frame
    const brassMat = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      roughness: 0.35,
      metalness: 0.85
    })
    const borderTop = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.02, 0.04), brassMat)
    borderTop.position.set(0, 0.22, 0)
    group.add(borderTop)

    const borderBot = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.02, 0.04), brassMat)
    borderBot.position.set(0, -0.22, 0)
    group.add(borderBot)

    // 2. Gold Brass Title Plaque
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 0.045), brassMat)
    plaque.position.set(0, 0.14, 0.01)
    group.add(plaque)

    // 3. 4 Hanging Brass Hooks & Keyrings
    const hookXPositions = [-0.24, -0.08, 0.08, 0.24]
    const fobColors = ['#dc2626', '#d97706', '#2563eb', '#059669']

    const steelMat = new THREE.MeshStandardMaterial({
      color: '#e6e9ed',
      metalness: 0.9,
      roughness: 0.2
    })

    hookXPositions.forEach((xPos, idx) => {
      // Brass Hook Peg
      const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.06, 12), brassMat)
      hook.rotation.x = Math.PI / 3
      hook.position.set(xPos, 0.02, 0.03)
      group.add(hook)

      // Ring
      const ringGeo = new THREE.TorusGeometry(0.025, 0.004, 8, 16)
      const ring = new THREE.Mesh(ringGeo, steelMat)
      ring.position.set(xPos, -0.03, 0.045)
      group.add(ring)

      // Hanging Fob Tag
      const fobMat = new THREE.MeshStandardMaterial({
        color: fobColors[idx % fobColors.length],
        roughness: 0.3,
        metalness: 0.2
      })
      const fob = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.008), fobMat)
      fob.position.set(xPos, -0.11, 0.045)
      fob.rotation.z = (idx % 2 === 0 ? 0.08 : -0.08)
      group.add(fob)

      // Hanging Metallic Skeleton Key
      const keyStem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.09, 8), steelMat)
      keyStem.position.set(xPos + 0.012, -0.14, 0.05)
      group.add(keyStem)

      const keyBow = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 6, 12), steelMat)
      keyBow.position.set(xPos + 0.012, -0.095, 0.05)
      group.add(keyBow)
    })

    // Mark all child meshes for pointer events
    group.traverse((child) => {
      if (child.isMesh) {
        child.userData.isWallKeychains = true
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
      <primitive object={keychainsScene} />
      {(isHoveredGroup || alwaysShowOutline) && (
        <TightSilhouetteOutline
          scene={keychainsScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
