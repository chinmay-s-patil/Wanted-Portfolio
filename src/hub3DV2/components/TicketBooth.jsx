import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'
const MODEL_PATH = '/hubModels/TicketBooth/ticket_booth/optimized_booth.glb'
useGLTF.preload(MODEL_PATH)

/**
 * TicketBooth Component
 */
export default function TicketBooth({
  position = [-6.2, -0.6, -3.8],
  scale = [1.0, 1.0, 1.0],
  rotation = [0, Math.PI / 4, 0],
  outlineColor = '#ffaa00',
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
      navigate('/openfoam')
    }
  })
  const { boothScene, outlineScene } = useMemo(() => {
    if (!scene) return { boothScene: null, outlineScene: null }
    const fullClone = scene.clone(true)
    const outlineClone = scene.clone(true)
    const processScene = (rootObj) => {
      rootObj.traverse((child) => {
        const name = (child.name || '').toLowerCase()
        const matName = (child.material?.name || '').toLowerCase()
        // Exclude Ground Base, "Wood Stuff", bottom tickets/signs, pCylinder11 components, pCylinder30/31/32, and dropped coins
        const isGroundBase = name.includes('ground_base') || matName.includes('ground_base')
        const isWoodStuff = name.includes('wood_stuff') || matName.includes('wood_stuff')
        const isTicketOrSign = name.includes('main_sign_and_ticket') || matName.includes('main_sign_and_ticket') || name.includes('ticket')
        const isCylinder11 = name.includes('pcylinder11') || matName.includes('pcylinder11')
        const isCylinder30_31_32 = name.includes('pcylinder30') || name.includes('pcylinder31') || name.includes('pcylinder32')
        const isCoin = name.includes('psphere') ||
                       name.includes('pcylinder19') || name.includes('pcylinder20') ||
                       name.includes('pcylinder21') || name.includes('pcylinder22') ||
                       name.includes('pcylinder23') || name.includes('pcylinder24') ||
                       name.includes('pcylinder25') || name.includes('pcylinder26') ||
                       name.includes('pcylinder27') || name.includes('pcylinder28')
        if (isGroundBase || isWoodStuff || isTicketOrSign || isCylinder11 || isCylinder30_31_32 || isCoin) {
          child.visible = false
          return
        }
        if (child.isMesh && child.material) {
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
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
    const targetHeight = 2.4 // 2.4 meters standing booth kiosk height
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    // Apply height normalization and align floor Y to 0
    fullClone.scale.setScalar(normScale)
    fullClone.position.x = -centerX * normScale
    fullClone.position.z = -centerZ * normScale
    fullClone.position.y = -box.min.y * normScale + 0.002
    outlineClone.scale.setScalar(normScale)
    outlineClone.position.x = -centerX * normScale
    outlineClone.position.z = -centerZ * normScale
    outlineClone.position.y = -box.min.y * normScale + 0.002
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

    return { boothScene: mainWrapper, outlineScene: outlineWrapper }
  }, [scene])
  if (!boothScene) return null
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
        object={boothScene}
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
