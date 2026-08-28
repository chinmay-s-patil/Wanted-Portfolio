import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
/**
 * WASDFreecam Component
 *
 * Provides Minecraft-style freecam WASD / Arrow Keys camera movement:
 * - W / S / Up / Down: Move forward & backward along camera view vector
 * - A / D / Left / Right: Strafe left & right perpendicular to camera view
 * - Space / E: Ascend straight UP
 * - Shift / Q: Descend straight DOWN
 *
 * Synchronizes OrbitControls target with camera translation for seamless mouse orbiting.
 */
export default function WASDFreecam({ moveSpeed = 5.0, controlsRef }) {
  const { camera } = useThree()
  const activeKeys = useRef(new Set())
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return
      activeKeys.current.add(e.code)
    }
    const handleKeyUp = (e) => {
      activeKeys.current.delete(e.code)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  useFrame((_, delta) => {
    if (activeKeys.current.size === 0) return
    const dist = moveSpeed * Math.min(delta, 0.1)
    const keys = activeKeys.current
    // Camera forward direction
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    // Camera right direction
    const right = new THREE.Vector3()
    right.crossVectors(forward, camera.up).normalize()
    const movement = new THREE.Vector3()
    if (keys.has('KeyW') || keys.has('ArrowUp')) {
      movement.addScaledVector(forward, dist)
    }
    if (keys.has('KeyS') || keys.has('ArrowDown')) {
      movement.addScaledVector(forward, -dist)
    }
    if (keys.has('KeyA') || keys.has('ArrowLeft')) {
      movement.addScaledVector(right, -dist)
    }
    if (keys.has('KeyD') || keys.has('ArrowRight')) {
      movement.addScaledVector(right, dist)
    }
    if (keys.has('Space') || keys.has('KeyE')) {
      movement.y += dist
    }
    if (keys.has('ShiftLeft') || keys.has('ShiftRight') || keys.has('KeyQ')) {
      movement.y -= dist
    }
    if (movement.lengthSq() > 0) {
      camera.position.add(movement)
      if (controlsRef && controlsRef.current) {
        controlsRef.current.target.add(movement)
        controlsRef.current.update()
      }
    }
  })
  return null
}
