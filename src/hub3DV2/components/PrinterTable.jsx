import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const TABLE_MODEL_PATH = '/hubModels/Table/office_table.glb'
const PRINTER_MODEL_PATH = '/hubModels/3DPrinter/3d_printer.glb'

useGLTF.preload(TABLE_MODEL_PATH)
useGLTF.preload(PRINTER_MODEL_PATH)

/**
 * PrinterTable Component
 *
 * Renders an office table with an interactive 3D printer on top:
 * - Table size remains constant (0.75m desk height).
 * - 3D printer scaled up to 0.65m height.
 * - Excludes pistol/weapon parts from the 3D printer model.
 * - Interactive: Hover reveals neon yellow outline + pointer cursor; Click navigates to /cad (CAD Section).
 */
export default function PrinterTable({
  position = [5.5, -0.6, 5.0],
  scale = [1.0, 1.0, 1.0],
  rotation = [0, -Math.PI, 0],
  outlineColor = '#ffea00', // High-contrast neon yellow outline
  outlineThickness = 0.008,
  onClick
}) {
  const [printerHovered, setPrinterHovered] = useState(false)
  const navigate = useNavigate()
  const tableGLTF = useGLTF(TABLE_MODEL_PATH)
  const printerGLTF = useGLTF(PRINTER_MODEL_PATH)

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/cad')
    }
  })

  const { tableGroup, printerGroup, printerOutlineScene } = useMemo(() => {
    if (!tableGLTF.scene || !printerGLTF.scene) {
      return { tableGroup: null, printerGroup: null, printerOutlineScene: null }
    }

    // 1. Process Table (Unchanged 0.75m height)
    const tableClone = tableGLTF.scene.clone(true)
    tableClone.traverse((child) => {
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

    tableClone.updateMatrixWorld(true)
    const tableBox = new THREE.Box3()
    tableClone.traverse((child) => {
      if (child.isMesh && child.visible) {
        child.geometry.computeBoundingBox()
        const b = child.geometry.boundingBox.clone()
        b.applyMatrix4(child.matrixWorld)
        tableBox.union(b)
      }
    })

    const tableCenter = new THREE.Vector3()
    const tableSize = new THREE.Vector3()
    tableBox.getCenter(tableCenter)
    tableBox.getSize(tableSize)

    const tableWrapper = new THREE.Group()
    tableWrapper.add(tableClone)
    tableClone.position.x = -tableCenter.x
    tableClone.position.z = -tableCenter.z
    tableClone.position.y = -tableBox.min.y

    const targetTableHeight = 0.75
    const tableScaleFactor = tableSize.y > 0 ? targetTableHeight / tableSize.y : 1.0
    tableWrapper.scale.setScalar(tableScaleFactor)

    const tableTopY = targetTableHeight

    // 2. Process 3D Printer (Scaled up to 0.65m height, pistol parts removed)
    const printerClone = printerGLTF.scene.clone(true)
    const outlineClone = printerGLTF.scene.clone(true)

    const processPrinterNode = (sceneObj, markInteractive = false) => {
      sceneObj.traverse((child) => {
        const name = (child.name || '').toLowerCase()
        const isPistolPart =
          name.includes('pistol') ||
          name.includes('suppressor') ||
          name.includes('gun') ||
          name.includes('slide')

        if (isPistolPart) {
          child.visible = false
          return
        }

        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (markInteractive) {
            child.userData.isPrinter = true
          }
          if (child.material) {
            child.material.side = THREE.DoubleSide
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
            child.material.needsUpdate = true
          }
        }
      })
    }

    processPrinterNode(printerClone, true)
    processPrinterNode(outlineClone, false)

    printerClone.updateMatrixWorld(true)
    const printerBox = new THREE.Box3()
    printerClone.traverse((child) => {
      if (child.isMesh && child.visible) {
        child.geometry.computeBoundingBox()
        const b = child.geometry.boundingBox.clone()
        b.applyMatrix4(child.matrixWorld)
        printerBox.union(b)
      }
    })

    const printerCenter = new THREE.Vector3()
    const printerSize = new THREE.Vector3()
    printerBox.getCenter(printerCenter)
    printerBox.getSize(printerSize)

    // Wrap main printer clone
    const printerWrapper = new THREE.Group()
    printerWrapper.add(printerClone)
    printerClone.position.x = -printerCenter.x
    printerClone.position.z = -printerCenter.z
    printerClone.position.y = -printerBox.min.y

    // Target printer height: 0.65m (bigger than previous 0.50m)
    const targetPrinterHeight = 0.65
    const printerScaleFactor = printerSize.y > 0 ? targetPrinterHeight / printerSize.y : 1.0
    printerWrapper.scale.setScalar(printerScaleFactor)
    printerWrapper.position.y = tableTopY + 0.002

    // Wrap outline printer clone
    const outlineWrapper = new THREE.Group()
    outlineWrapper.add(outlineClone)
    outlineClone.position.x = -printerCenter.x
    outlineClone.position.z = -printerCenter.z
    outlineClone.position.y = -printerBox.min.y
    outlineWrapper.scale.setScalar(printerScaleFactor)
    outlineWrapper.position.y = tableTopY + 0.002

    return {
      tableGroup: tableWrapper,
      printerGroup: printerWrapper,
      printerOutlineScene: outlineWrapper
    }
  }, [tableGLTF.scene, printerGLTF.scene])

  if (!tableGroup || !printerGroup) return null

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setPrinterHovered(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setPrinterHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Office Table */}
      <primitive object={tableGroup} />

      {/* Interactive 3D Printer */}
      <primitive
        object={printerGroup}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />

      {/* Neon Yellow Silhouette Outline on Hover */}
      {printerHovered && printerOutlineScene && (
        <TightSilhouetteOutline
          scene={printerOutlineScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
