import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/RadarTablet/packed_radar.glb'

useGLTF.preload(MODEL_PATH)

/**
 * RadarTablet Component
 *
 * Rugged Sci-Fi Tactical Military Radar Tablet placed on the workstation desk.
 * Replaces the tape recorder machine on the left side of the desk.
 * - Interactive: Hover displays a neon green CRT outline + pointer cursor.
 * - Click: Navigates directly to /solvers (Tactical Solvers & Radar Section).
 */
export default function RadarTablet({
  position = [-0.75, 0.745, 0.05],
  scale = [0.35, 0.35, 0.35],
  rotation = [-0.15, 0.25, 0],
  outlineColor = '#00ff66',
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
      navigate('/solvers')
    }
  })

  const { tabletScene, outlineScene } = useMemo(() => {
    if (!scene) return { tabletScene: null, outlineScene: null }

    const fullClone = scene.clone(true)
    const outlineClone = scene.clone(true)

    const processScene = (rootObj) => {
      rootObj.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.side = THREE.DoubleSide
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
            // Add emissive green glow to tactical radar screen
            if (child.material.name.toLowerCase().includes('screen') || child.name.toLowerCase().includes('screen')) {
              child.material.emissive = new THREE.Color('#00ff66')
              child.material.emissiveIntensity = 1.5
            }
            child.material.needsUpdate = true
          }
        }
      })
    }

    processScene(fullClone)
    processScene(outlineClone)

    // Compute world matrix bounding box
    fullClone.updateMatrixWorld(true)
    const box = new THREE.Box3()
    fullClone.traverse((child) => {
      if (child.isMesh && child.visible) {
        child.geometry.computeBoundingBox()
        const b = child.geometry.boundingBox.clone()
        b.applyMatrix4(child.matrixWorld)
        box.union(b)
      }
    })

    const centerX = (box.min.x + box.max.x) / 2
    const centerY = (box.min.y + box.max.y) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    // Center X & Z, align bottom Y to 0
    fullClone.position.x = -centerX
    fullClone.position.z = -centerZ
    fullClone.position.y = -box.min.y + 0.001

    outlineClone.position.x = -centerX
    outlineClone.position.z = -centerZ
    outlineClone.position.y = -box.min.y + 0.001

    const mainWrapper = new THREE.Group()
    mainWrapper.add(fullClone)

    const outlineWrapper = new THREE.Group()
    outlineWrapper.add(outlineClone)

    return { tabletScene: mainWrapper, outlineScene: outlineWrapper }
  }, [scene])

  if (!tabletScene) return null

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={tabletScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
      {(hovered || alwaysShowOutline) && outlineScene && (
        <TightSilhouetteOutline
          scene={outlineScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
