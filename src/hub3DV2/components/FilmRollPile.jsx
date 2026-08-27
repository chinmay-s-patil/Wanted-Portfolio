import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const KODAK_400_PATH = '/hubModels/FilmRolls/packed_kodak_400.glb'
const KODAK_GOLD_PATH = '/hubModels/FilmRolls/packed_kodak_gold.glb'
const FILM_ROLL_35MM_PATH = '/hubModels/FilmRolls/packed_film_35mm.glb'

useGLTF.preload(KODAK_400_PATH)
useGLTF.preload(KODAK_GOLD_PATH)
useGLTF.preload(FILM_ROLL_35MM_PATH)

/**
 * FilmRollPile Component
 *
 * A scattered pile of vintage 35mm Kodak film canister rolls:
 * - Placed next to the camera on the workstation table.
 * - Interactive: Clicking navigates to /events (Events Section).
 * - Bi-directionally linked hover highlighting with OldCamera.
 */
export default function FilmRollPile({
  position = [-3.1, 0.16, 3.7],
  scale = [1.0, 1.0, 1.0],
  rotation = [0, -Math.PI / 6, 0],
  outlineColor = '#ffaa00',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  isHoveredFromCamera = false,
  onHoverChange,
  onClick
}) {
  const [localHovered, setLocalHovered] = useState(false)
  const navigate = useNavigate()

  const kodak400Gltf = useGLTF(KODAK_400_PATH)
  const kodakGoldGltf = useGLTF(KODAK_GOLD_PATH)
  const film35mmGltf = useGLTF(FILM_ROLL_35MM_PATH)

  const isHighlighted = localHovered || isHoveredFromCamera || alwaysShowOutline

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/events')
    }
  })

  const { pileGroup, outlineGroup } = useMemo(() => {
    if (!kodak400Gltf.scene || !kodakGoldGltf.scene || !film35mmGltf.scene) {
      return { pileGroup: null, outlineGroup: null }
    }

    const processClonedScene = (srcScene, targetHeight = 0.065) => {
      const clone = srcScene.clone(true)
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.side = THREE.DoubleSide
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
            child.material.needsUpdate = true
          }
        }
      })

      // Normalize canister to 6.5cm height
      clone.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(clone)
      const rawHeight = box.max.y - box.min.y
      const normScale = rawHeight > 0 ? targetHeight / rawHeight : 0.02

      const centerX = (box.min.x + box.max.x) / 2
      const centerZ = (box.min.z + box.max.z) / 2

      clone.scale.setScalar(normScale)
      clone.position.x = -centerX * normScale
      clone.position.z = -centerZ * normScale
      clone.position.y = -box.min.y * normScale

      return clone
    }

    const mainGroup = new THREE.Group()
    const silhouetteGroup = new THREE.Group()

    // 1. Canister 1: Upright Kodak 400
    const roll1Main = processClonedScene(kodak400Gltf.scene, 0.065)
    roll1Main.position.set(0, 0, 0)
    mainGroup.add(roll1Main)

    const roll1Outline = processClonedScene(kodak400Gltf.scene, 0.065)
    roll1Outline.position.set(0, 0, 0)
    silhouetteGroup.add(roll1Outline)

    // 2. Canister 2: Lying down Kodak Gold
    const roll2Main = processClonedScene(kodakGoldGltf.scene, 0.065)
    roll2Main.rotation.set(Math.PI / 2, 0.5, 0)
    roll2Main.position.set(0.07, 0.02, 0.03)
    mainGroup.add(roll2Main)

    const roll2Outline = processClonedScene(kodakGoldGltf.scene, 0.065)
    roll2Outline.rotation.set(Math.PI / 2, 0.5, 0)
    roll2Outline.position.set(0.07, 0.02, 0.03)
    silhouetteGroup.add(roll2Outline)

    // 3. Canister 3: Upright 35mm Film Roll
    const roll3Main = processClonedScene(film35mmGltf.scene, 0.065)
    roll3Main.rotation.set(0, 1.3, 0)
    roll3Main.position.set(-0.06, 0, 0.05)
    mainGroup.add(roll3Main)

    const roll3Outline = processClonedScene(film35mmGltf.scene, 0.065)
    roll3Outline.rotation.set(0, 1.3, 0)
    roll3Outline.position.set(-0.06, 0, 0.05)
    silhouetteGroup.add(roll3Outline)

    return { pileGroup: mainGroup, outlineGroup: silhouetteGroup }
  }, [kodak400Gltf, kodakGoldGltf, film35mmGltf])

  if (!pileGroup) return null

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setLocalHovered(true)
    if (onHoverChange) onHoverChange(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setLocalHovered(false)
    if (onHoverChange) onHoverChange(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={pileGroup}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
      {isHighlighted && outlineGroup && (
        <TightSilhouetteOutline
          scene={outlineGroup}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
