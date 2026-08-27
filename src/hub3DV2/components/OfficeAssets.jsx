import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/OfficeAssets/office_-_assets/optimized_office.gltf'

useGLTF.preload(MODEL_PATH)

// Helper function to test strictly if a child mesh belongs to the computer setup
const isStrictComputerMesh = (child) => {
  if (!child || !child.isMesh) return false
  const name = child.name || ''
  const parentName = child.parent?.name || ''

  // Target strictly computer monitor (Object_16 / Monitor_6), computer tower (Object_14 / Computer_5),
  // keyboard (Object_10 / Keyboard_3), and mouse (Object_12 / Computer_Mouse_4)
  const isComputerName =
    name === 'Object_10' ||
    name === 'Object_12' ||
    name === 'Object_14' ||
    name === 'Object_16' ||
    name.startsWith('Keyboard_3') ||
    name.startsWith('Computer_Mouse_4') ||
    name.startsWith('Computer_5') ||
    name.startsWith('Monitor_6')

  const isComputerParent =
    parentName.startsWith('Keyboard_3') ||
    parentName.startsWith('Computer_Mouse_4') ||
    parentName.startsWith('Computer_5') ||
    parentName.startsWith('Monitor_6')

  return isComputerName || isComputerParent
}

/**
 * OfficeAssets Component
 *
 * Retro office workstation asset pack.
 * Filters out:
 * 1. Vent items ("cent" / air duct / fans / covers)
 * 2. All picture frames, family/child photos, and posters
 * 3. Cactus pot, cactus plant, and soil
 *
 * Computer monitor setup is STRICTLY isolated for hover/click:
 * - Hover: Cursor pointer + neon cyan silhouette outline ONLY on computer setup
 * - Click: Drag-protected navigation to /visualization
 */
export default function OfficeAssets({
  position,
  scale,
  rotation,
  outlineColor = '#00ffff', // High-contrast neon cyan outline for computer
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  onClick
}) {
  const [computerHovered, setComputerHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/visualization')
    }
  })

  const { decorativeScene, computerScene } = useMemo(() => {
    if (!scene) return { decorativeScene: null, computerScene: null }

    const fullClone = scene.clone(true)
    const compClone = scene.clone(true)

    // 1. Process decorativeScene (all visible desk items except excluded vents/photos/cactus)
    fullClone.traverse((child) => {
      const name = (child.name || '').toLowerCase()

      // Exclude Vent ("cent"), Pictures/Photos/Posters, and Cactus
      const isVent =
        name.includes('vent') ||
        name.includes('vend_airduct') ||
        name.includes('fansupport') ||
        name.includes('nut_37') ||
        name.includes('frame_43')

      const isPicture = name.includes('photo') || name.includes('poster')
      const isCactus = name.includes('cactus')
      const isTapeRecorder =
        name.includes('taperecorder') ||
        name.includes('microphone') ||
        name === 'object_70' ||
        name === 'object_71' ||
        name === 'object_73'

      if (isVent || isPicture || isCactus || isTapeRecorder) {
        child.visible = false
        return
      }

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

        // Mark strictly computer meshes
        if (isStrictComputerMesh(child)) {
          child.userData.isComputer = true
        }
      }
    })

    // Compute bounding box & center fullClone
    fullClone.updateMatrixWorld(true)
    const box = new THREE.Box3()
    fullClone.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    fullClone.position.x = -centerX
    fullClone.position.z = -centerZ
    fullClone.position.y = -box.min.y + 0.002

    // 2. Process computerScene (STRICTLY computer setup meshes for silhouette outline)
    compClone.traverse((child) => {
      if (child.isMesh) {
        if (isStrictComputerMesh(child)) {
          child.visible = true
        } else {
          child.visible = false
        }
      }
    })

    compClone.position.x = -centerX
    compClone.position.z = -centerZ
    compClone.position.y = -box.min.y + 0.002

    return { decorativeScene: fullClone, computerScene: compClone }
  }, [scene])

  if (!decorativeScene) return null

  const handlePointerOver = (e) => {
    if (e.object?.userData?.isComputer) {
      e.stopPropagation()
      setComputerHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = () => {
    setComputerHovered(false)
    document.body.style.cursor = 'auto'
  }

  const onDown = (e) => {
    if (e.object?.userData?.isComputer) {
      handlePointerDown(e)
    }
  }

  const onClk = (e) => {
    if (e.object?.userData?.isComputer) {
      handleClick(e)
    }
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={decorativeScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={onDown}
        onClick={onClk}
      />
      {(computerHovered || alwaysShowOutline) && (
        <TightSilhouetteOutline
          scene={computerScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
