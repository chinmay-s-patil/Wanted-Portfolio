import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
const MODEL_PATH = '/hubModels/TableLamp/packed_table_lamp.glb'
useGLTF.preload(MODEL_PATH)
/**
 * TableLamp Component
 *
 * Vintage Table Lamp model placed on the 3D printer workstation table.
 * Includes warm ambient point light placed directly at the bulb position before main JSX scale/rotation.
 */
export default function TableLamp({
  position = [-5.3, 0.9, 5.2],
  scale = [1, 1, 1],
  rotation = [0, -Math.PI / 4, 0]
}) {
  const { scene } = useGLTF(MODEL_PATH)
  const lampData = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child.material.map) {
          child.material.map.colorSpace = THREE.SRGBColorSpace
        }
        if (child.name.includes('bulb') || child.material.name?.includes('bulb')) {
          child.material.emissive = new THREE.Color('#ffea88')
          child.material.emissiveIntensity = 4.0
        }
      }
    })
    // Compute bounding box over model
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh) {
        box.expandByObject(child)
      }
    })
    const rawHeight = box.max.y - box.min.y
    const targetHeight = 0.55 // 55cm standing table lamp height
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    cloned.scale.setScalar(normScale)
    cloned.position.x = -centerX * normScale
    cloned.position.z = -centerZ * normScale
    cloned.position.y = -box.min.y * normScale
    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    // Raw Bulb position is [0.0, 44.442, 3.307] in model space
    const bulbLocalY = (44.442 - box.min.y) * normScale
    const bulbLocalZ = (3.307 - centerZ) * normScale
    const bulbLocalX = (0.0 - centerX) * normScale
    return { wrapper, bulbPos: [bulbLocalX, bulbLocalY, bulbLocalZ] }
  }, [scene])
  if (!lampData) return null
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={lampData.wrapper} />
      {/* Warm Ambient Point Light inside Bulb */}
      <pointLight
        position={[0, 0.45, 0]}
        color="#ffe28a"
        intensity={6.5}
        distance={9.0}
        decay={1.8}
      />
      {/* Focused Downward Desk Spotlight */}
      <spotLight
        position={[0, 0.45, 0]}
        color="#fff1b5"
        intensity={8.0}
        angle={Math.PI / 2.2}
        penumbra={0.6}
        distance={9.0}
        decay={1.8}
      />
    </group>
  )
}
