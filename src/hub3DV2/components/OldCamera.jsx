import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/OldCamera/antique_wet_plate_camera_on_tripod_-_game_model/optimized_camera.glb'
useGLTF.preload(MODEL_PATH)

/**
 * OldCamera Component
 */
export default function OldCamera({
  position = [-3.5, -0.6, 3.8],
  scale = [1.0, 1.0, 1.0],
  rotation = [0, Math.PI / 4, 0],
  outlineColor = '#ffaa00',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  isHoveredFromFilm = false,
  onHoverChange,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)
  const isHighlighted = hovered || isHoveredFromFilm || alwaysShowOutline
  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/events')
    }
  })
  const { cameraScene, outlineScene } = useMemo(() => {
    if (!scene) return { cameraScene: null, outlineScene: null }
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
    // Compute world matrix bounding box strictly over visible meshes
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
    const rawHeight = box.max.y - box.min.y
    const targetHeight = 1.5 // 1.5 meters standing height
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    // Apply normalization transform
    fullClone.scale.setScalar(normScale)
    fullClone.position.x = -centerX * normScale
    fullClone.position.z = -centerZ * normScale
    fullClone.position.y = -box.min.y * normScale + 0.002
    outlineClone.scale.setScalar(normScale)
    outlineClone.position.x = -centerX * normScale
    outlineClone.position.z = -centerZ * normScale
    fullClone.updateMatrix()
    fullClone.updateMatrixWorld(true)
    outlineClone.updateMatrix()
    outlineClone.updateMatrixWorld(true)

    const mainWrapper = new THREE.Group()
    mainWrapper.add(fullClone)
    const outlineWrapper = new THREE.Group()
    outlineWrapper.add(outlineClone)

    mainWrapper.traverse((c) => { if (c !== mainWrapper) c.matrixAutoUpdate = false; c.frustumCulled = true })
    outlineWrapper.traverse((c) => { if (c !== outlineWrapper) c.matrixAutoUpdate = false; c.frustumCulled = true })
    return { cameraScene: mainWrapper, outlineScene: outlineWrapper }
  }, [scene])
  if (!cameraScene) return null
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    if (onHoverChange) onHoverChange(true)
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = () => {
    setHovered(false)
    if (onHoverChange) onHoverChange(false)
    document.body.style.cursor = 'auto'
  }
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={cameraScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
      {isHighlighted && outlineScene && (
        <TightSilhouetteOutline
          scene={outlineScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
