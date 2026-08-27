import React, { useMemo, useState } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/Evidence Board/psx_-_corkevidence_board/scene.gltf'

useGLTF.preload(MODEL_PATH)

/**
 * EvidenceBoard Component
 *
 * PSX Retro Cork Evidence Board mounted on the front wall.
 * - Displays a floating 3D hint banner ("Click if you need help!").
 * - Interactive: Hover shows neon amber outline + pointer cursor.
 * - Click: Triggers the Portfolio Help Directory modal overlay.
 */
export default function EvidenceBoard({
  position = [0, 1.4, 4.7],
  scale = [0.22, 0.22, 0.22],
  rotation = [0, 0, 0],
  outlineColor = '#ffb700',
  outlineThickness = 0.008,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const { scene } = useGLTF(MODEL_PATH)

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    }
  })

  const { boardScene, outlineScene } = useMemo(() => {
    if (!scene) return { boardScene: null, outlineScene: null }

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
            child.material.needsUpdate = true
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

    return { boardScene: mainWrapper, outlineScene: outlineWrapper }
  }, [scene])

  if (!boardScene) return null

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
        object={boardScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      />
      {hovered && outlineScene && (
        <TightSilhouetteOutline
          scene={outlineScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}

      {/* Floating 3D Help Hint Banner */}
      <Html
        position={[0, 1.15, 0.1]}
        center
        distanceFactor={12}
        zIndexRange={[10, 0]}
      >
        <div
          onClick={handleClick}
          style={{
            background: 'rgba(20, 16, 12, 0.94)',
            border: '2px solid #ffb700',
            borderRadius: '8px',
            padding: '8px 14px',
            color: '#fff',
            fontFamily: 'monospace, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 0 15px rgba(255, 183, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.8)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            userSelect: 'none',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ffe57f'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#ffb700'
            e.currentTarget.style.transform = 'scale(1.0)'
          }}
        >
          <span style={{ fontSize: '16px' }}>💡</span>
          <span>Need Help? Click Evidence Board for Guide Index</span>
        </div>
      </Html>
    </group>
  )
}
