import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const _forward = new THREE.Vector3()
const _right = new THREE.Vector3()
const _movement = new THREE.Vector3()
const _offset = new THREE.Vector3()
const _spherical = new THREE.Spherical()

/**
 * WASDFreecam Component
 *
 * When `enabled` is true (Freecam Mode ON):
 * - W / S / Up / Down: Move forward & backward along camera view vector
 * - A / D / Left / Right: Strafe left & right perpendicular to camera view
 * - Space / E: Ascend straight UP
 * - Shift / Q: Descend straight DOWN
 *
 * When `enabled` is false (Freecam Mode OFF / Locked Mode):
 * - Mouse Drag: Rotates camera around target (OrbitControls)
 * - A / D / Left / Right: Yaw camera left / right (horizontal orbit)
 * - W / S / Up / Down: Pitch camera up / down angle (vertical orbit)
 */
export default function WASDFreecam({
  moveSpeed = 5.0,
  turnSpeed = 1.8,
  controlsRef,
  enabled = false,
}) {
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
    // When freecam is OFF (Locked mode), strictly clamp camera position within room boundary to prevent clipping through walls, floor, or ceiling
    if (!enabled) {
      const clampedX = THREE.MathUtils.clamp(camera.position.x, -7.5, 7.5)
      const clampedY = THREE.MathUtils.clamp(camera.position.y, -0.2, 3.8)
      const clampedZ = THREE.MathUtils.clamp(camera.position.z, -5.8, 5.8)

      if (clampedX !== camera.position.x || clampedY !== camera.position.y || clampedZ !== camera.position.z) {
        camera.position.set(clampedX, clampedY, clampedZ)
        if (controlsRef && controlsRef.current) {
          controlsRef.current.update()
        }
      }
    }

    if (activeKeys.current.size === 0) return
    const keys = activeKeys.current
    const dt = Math.min(delta, 0.1)

    if (enabled) {
      // FREECAM MODE ON: 3D WASD Translation Movement (Unconstrained free motion)
      const dist = moveSpeed * dt
      camera.getWorldDirection(_forward)
      _right.crossVectors(_forward, camera.up).normalize()

      _movement.set(0, 0, 0)
      if (keys.has('KeyW') || keys.has('ArrowUp')) {
        _movement.addScaledVector(_forward, dist)
      }
      if (keys.has('KeyS') || keys.has('ArrowDown')) {
        _movement.addScaledVector(_forward, -dist)
      }
      if (keys.has('KeyA') || keys.has('ArrowLeft')) {
        _movement.addScaledVector(_right, -dist)
      }
      if (keys.has('KeyD') || keys.has('ArrowRight')) {
        _movement.addScaledVector(_right, dist)
      }
      if (keys.has('Space') || keys.has('KeyE')) {
        _movement.y += dist
      }
      if (keys.has('ShiftLeft') || keys.has('ShiftRight') || keys.has('KeyQ')) {
        _movement.y -= dist
      }

      if (_movement.lengthSq() > 0) {
        camera.position.add(_movement)
        if (controlsRef && controlsRef.current) {
          controlsRef.current.target.add(_movement)
          controlsRef.current.update()
        }
      }
    } else {
      // FREECAM MODE OFF: Pitch (W/S) & Yaw (A/D) Rotation Only around Target
      if (!controlsRef || !controlsRef.current) return
      const controls = controlsRef.current
      const target = controls.target

      _offset.subVectors(camera.position, target)
      _spherical.setFromVector3(_offset)

      let updated = false
      const rotateAmount = turnSpeed * dt

      // A / D or Left / Right: Yaw (Horizontal Orbit)
      if (keys.has('KeyA') || keys.has('ArrowLeft')) {
        _spherical.theta += rotateAmount
        updated = true
      }
      if (keys.has('KeyD') || keys.has('ArrowRight')) {
        _spherical.theta -= rotateAmount
        updated = true
      }

      // W / S or Up / Down: Pitch (Vertical Orbit Angle)
      if (keys.has('KeyW') || keys.has('ArrowUp')) {
        _spherical.phi = Math.max(0.1, _spherical.phi - rotateAmount)
        updated = true
      }
      if (keys.has('KeyS') || keys.has('ArrowDown')) {
        _spherical.phi = Math.min(Math.PI / 2.02, _spherical.phi + rotateAmount)
        updated = true
      }

      if (updated) {
        _offset.setFromSpherical(_spherical)
        camera.position.addVectors(target, _offset)
        camera.lookAt(target)
        controls.update()
      }
    }
  })

  return null
}
