import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/Filing Cabinet/filing_cabinet_-_6mb/optimized_cabinet.glb'
useGLTF.preload(MODEL_PATH)

/**
 * FilingCabinet Component
 */
export default function FilingCabinet({
  position = [-8.2, -0.6, 0.95],
  scale = [1.4, 1.4, 1.4],
  rotation = [0, 0, 0],
  outlineColor = '#1e40af',
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
          name === '04__0' ||
          name.includes('box_7')
        if (isBox7) {
          const meshClone = child.clone(true)
          meshClone.visible = true
          if (meshClone.material) {
            if (Array.isArray(meshClone.material)) {
              meshClone.material.forEach((m) => {
                if (m && m.map) m.map.colorSpace = THREE.SRGBColorSpace
              })
            } else if (meshClone.material.map) {
              meshClone.material.map.colorSpace = THREE.SRGBColorSpace
            }
          }
          meshClone.applyMatrix4(child.matrixWorld)
          box7Group.add(meshClone)
        }
      }
    })

    const sourceGroup = box7Group.children.length > 0 ? box7Group : scene.clone(true)
    sourceGroup.updateMatrixWorld(true)
    const singleBox = new THREE.Box3().setFromObject(sourceGroup)

    if (singleBox.isEmpty() || !isFinite(singleBox.min.x) || !isFinite(singleBox.max.x)) {
      return scene.clone(true)
    }

    const width = Math.max(0.4, singleBox.max.x - singleBox.min.x)
    const centerX = (singleBox.min.x + singleBox.max.x) / 2
    const centerZ = (singleBox.min.z + singleBox.max.z) / 2

    if (!isFinite(width) || !isFinite(centerX) || !isFinite(centerZ)) {
      return scene.clone(true)
    }

    const singleCabinet = new THREE.Group()
    singleCabinet.add(sourceGroup)
    sourceGroup.position.x = -centerX
    sourceGroup.position.z = -centerZ
    sourceGroup.position.y = -singleBox.min.y + 0.002

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
