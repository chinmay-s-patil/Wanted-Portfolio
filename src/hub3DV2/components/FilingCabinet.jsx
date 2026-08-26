import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/Filing Cabinet/filing_cabinet_-_6mb/scene.gltf'

useGLTF.preload(MODEL_PATH)

/**
 * FilingCabinet Component
 *
 * Joined double 4-drawer filing cabinet model (isolated "box_7" completely closed model from GLTF pack).
 * Both towers are joined side-by-side into a single unit with one continuous silhouette outline.
 * Clicking anywhere on the joined unit navigates directly to /projects (Projects Archive Section) with drag-protected click handling.
 */
export default function FilingCabinet({
  position = [-8.2, -0.6, 0.95],
  scale = [1.4, 1.4, 1.4],
  rotation = [0, 0, 0],
  outlineColor = '#00ffff', // High-contrast neon cyan outline
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/projects')
    }
  })

  const joinedScene = useMemo(() => {
    if (!scene) return null

    // Clone source scene and isolate strictly box_7 (the completely closed 4-drawer filing cabinet)
    const sourceScene = scene.clone(true)

    sourceScene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name || ''
        // Meshes 0..4 belong strictly to box_7 (box_7__0, 01__0, 02__0, 03__0, 04__0)
        const isBox7 =
          name === 'box_7__0' ||
          name === '01__0' ||
          name === '02__0' ||
          name === '03__0' ||
          name === '04__0'

        if (isBox7) {
          child.visible = true
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.side = THREE.DoubleSide
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
            child.material.needsUpdate = true
          }
        } else {
          child.visible = false
        }
      }
    })

    // Force matrix update & compute bounds for a single box_7 cabinet
    sourceScene.updateMatrixWorld(true)
    const singleBox = new THREE.Box3()
    sourceScene.traverse((child) => {
      if (child.isMesh && child.visible) {
        singleBox.expandByObject(child)
      }
    })

    const width = singleBox.max.x - singleBox.min.x // 40.0 units
    const centerX = (singleBox.min.x + singleBox.max.x) / 2
    const centerZ = (singleBox.min.z + singleBox.max.z) / 2

    // Center the single cabinet to local origin
    sourceScene.position.x = -centerX
    sourceScene.position.z = -centerZ
    sourceScene.position.y = -singleBox.min.y + 0.002

    // Create a parent group joining TWO identical box_7 cabinets side-by-side
    const doubleGroup = new THREE.Group()

    const leftCabinet = sourceScene
    leftCabinet.position.x = -width / 2
    doubleGroup.add(leftCabinet)

    const rightCabinet = sourceScene.clone(true)
    rightCabinet.position.x = width / 2
    doubleGroup.add(rightCabinet)

    // Force world matrix update over the joined double group
    doubleGroup.updateMatrixWorld(true)

    const wrapper = new THREE.Group()
    wrapper.add(doubleGroup)
    return wrapper
  }, [scene])

  if (!joinedScene) return null

  return (
    <group
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <group scale={scale}>
        <primitive object={joinedScene} />
        {(hovered || alwaysShowOutline) && (
          <TightSilhouetteOutline
            scene={joinedScene}
            color={outlineColor}
            thickness={outlineThickness}
          />
        )}
      </group>
    </group>
  )
}
