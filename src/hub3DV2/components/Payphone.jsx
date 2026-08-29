import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/OldPayphone/packed_payphone.glb'
useGLTF.preload(MODEL_PATH)
/**
 * Payphone Component
 *
 * Vintage red wall-mounted payphone:
 * - Mounted on precinct wall at eye/chest level.
 * - Normalized 0.75m wall scale ([0.0015, 0.0015, 0.0015]).
 * - Interactive: Hover displays a high-contrast crimson outline + pointer cursor.
 * - Click: Navigates directly to /contact (Contact Section).
 */
export default function Payphone({
  position = [-6.85, 0.4, -0.5],
  scale = [0.0015, 0.0015, 0.0015],
  rotation = [0, Math.PI / 2, 0],
  outlineColor = '#ff3344',
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
      navigate('/contact')
    }
  })
  const { payphoneScene, outlineScene } = useMemo(() => {
    if (!scene) return { payphoneScene: null, outlineScene: null }
    const fullClone = scene.clone(true)
    const outlineClone = scene.clone(true)
    const processScene = (rootObj) => {
      rootObj.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
        }
      })
    }
    processScene(fullClone)
    processScene(outlineClone)
    // Compute bounding box strictly over visible meshes
    fullClone.updateMatrixWorld(true)
    const box = new THREE.Box3()
    fullClone.traverse((child) => {
      if (child.isMesh && child.visible && child.geometry) {
        child.geometry.computeBoundingBox()
        if (child.geometry.boundingBox) {
          const b = child.geometry.boundingBox.clone()
          b.applyMatrix4(child.matrixWorld)
          box.union(b)
        }
      }
    })
    const centerX = (box.min.x + box.max.x) / 2
    const centerY = (box.min.y + box.max.y) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    // Center X & Y & Z in wrapper container
    const mainWrapper = new THREE.Group()
    mainWrapper.add(fullClone)
    fullClone.position.x = -centerX
    fullClone.position.y = -centerY
    fullClone.position.z = -centerZ
    const outlineWrapper = new THREE.Group()
    outlineWrapper.add(outlineClone)
    outlineClone.position.x = -centerX
    outlineClone.position.y = -centerY
    outlineClone.position.z = -centerZ
    return { payphoneScene: mainWrapper, outlineScene: outlineWrapper }
  }, [scene])
  if (!payphoneScene) return null
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
        object={payphoneScene}
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
