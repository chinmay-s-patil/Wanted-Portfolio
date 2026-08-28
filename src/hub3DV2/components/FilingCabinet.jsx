import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/Filing Cabinet/filing_cabinet_-_6mb/optimized_cabinet.gltf'
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
  outlineColor = '#1e40af', // Cool deep steel cobalt blue outline
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
    // Create a clean root group for box_7 containing STRICTLY visible box_7 meshes (no ghost nodes)
    scene.updateMatrixWorld(true)
    const box7Group = new THREE.Group()
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name || ''
        const isBox7 =
          name === 'box_7__0' ||
          name === '01__0' ||
          name === '02__0' ||
          name === '03__0' ||
          name === '04__0'
        if (isBox7) {
          const meshClone = child.clone(true)
          meshClone.visible = true
          if (meshClone.material) {
            meshClone.material = meshClone.material.clone()
            meshClone.material.side = THREE.DoubleSide
            if (meshClone.material.map) {
              meshClone.material.map.colorSpace = THREE.SRGBColorSpace
            }
            meshClone.material.needsUpdate = true
          }
          // Apply world matrix transform to lock local position cleanly
          meshClone.applyMatrix4(child.matrixWorld)
          box7Group.add(meshClone)
        }
      }
    })
    // Compute exact bounding box over strictly box_7 meshes
    box7Group.updateMatrixWorld(true)
    const singleBox = new THREE.Box3().setFromObject(box7Group)
    const width = singleBox.max.x - singleBox.min.x
    const centerX = (singleBox.min.x + singleBox.max.x) / 2
    const centerZ = (singleBox.min.z + singleBox.max.z) / 2
    // Center single cabinet to local origin
    const singleCabinet = new THREE.Group()
    singleCabinet.add(box7Group)
    box7Group.position.x = -centerX
    box7Group.position.z = -centerZ
    box7Group.position.y = -singleBox.min.y + 0.002
    // Join TWO identical singleCabinet towers side-by-side
    const doubleGroup = new THREE.Group()
    const leftCabinet = singleCabinet
    leftCabinet.position.x = -width / 2
    doubleGroup.add(leftCabinet)
    const rightCabinet = singleCabinet.clone(true)
    rightCabinet.position.x = width / 2
    doubleGroup.add(rightCabinet)
    doubleGroup.updateMatrixWorld(true)
    return doubleGroup
  }, [scene])
  if (!joinedScene) return null
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
    <group position={position} rotation={rotation}>
      <group
        scale={scale}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
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
