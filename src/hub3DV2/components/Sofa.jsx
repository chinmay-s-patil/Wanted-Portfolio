import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const MODEL_PATH = '/hubModels/SofaSet/couchsofa_set/optimized_sofa.glb'
useGLTF.preload(MODEL_PATH)

/**
 * Sofa Component (couchsofa_set)
 */
const Sofa = React.memo(function Sofa({
  position = [0, -0.6, 0.8],
  scale = [1.8, 1.8, 1.8],
  rotation = [0, 0, 0],
  onClick
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      const name = (child.name || '').toLowerCase()
      // 1. Remove / hide the 2-section seat (Couch_9)
      if (name.includes('couch_9')) {
        child.visible = false
        return
      }
      // 2. Remove / hide ALL pillows entirely
      if (name.includes('pillow')) {
        child.visible = false
        return
      }
      if (child.isMesh && child.material) {
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace
        }
      }
    })
    // Compute bounding box strictly over visible sub-meshes
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible && child.geometry) {
        box.expandByObject(child)
      }
    })
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    const wrapper = new THREE.Group()
    wrapper.matrixAutoUpdate = false
    wrapper.add(cloned)
    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y + 0.003
    return wrapper
  }, [scene])
  if (!clonedScene) return null
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation()
          onClick(e)
        }
      }}
    >
      <primitive object={clonedScene} />
    </group>
  )
})

export default Sofa
