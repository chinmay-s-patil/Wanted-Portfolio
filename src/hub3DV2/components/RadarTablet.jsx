import React, { useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/RadarTablet/packed_radar.glb'
useGLTF.preload(MODEL_PATH)

// 4:3 Aspect ratio canvas matching the rectangular screen bezel cutout
const SCREEN_W = 640
const SCREEN_H = 480

const TARGET_BLIPS = [
  { r: 0.35, angle: 0.8, label: 'TARGET_01 [CFD]' },
  { r: 0.65, angle: 2.3, label: 'TARGET_02 [CAD]' },
  { r: 0.50, angle: 4.1, label: 'TARGET_03 [SOLVER]' },
  { r: 0.80, angle: 5.4, label: 'TARGET_04 [EVID]' },
]

/**
 * Fits the animated radar screen plane perfectly inside the tablet's screen bezel opening cutout.
 */
const createRadarScreenPlane = (bodyMesh, material, yOffset = 0) => {
  const posAttr = bodyMesh.geometry?.attributes?.position
  if (!posAttr) return null

  const box = new THREE.Box3().setFromBufferAttribute(posAttr)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)

  // Full-coverage dimensions extending to the bevels of the screen bezel frame
  const screenW = size.z * 0.580 // Extended width for edge-to-edge bezel fit
  const screenH = size.y * 0.6 // Extended height for full vertical coverage
  const screenX = box.max.x - size.x * 0.27
  const outset = Math.max(size.x * 0.0015, 0.5)
  const zOffset = 0.02

  const geo = new THREE.PlaneGeometry(screenW, screenH, 1, 1)
  geo.rotateY(Math.PI / 2) // face +X (width→Z, height→Y)
  geo.translate(screenX + outset, center.y + size.y * (0.025 + yOffset), center.z + zOffset + size.z * 0.012)

  const mesh = new THREE.Mesh(geo, material)
  mesh.name = 'Radar_CRT_Screen'
  mesh.userData.isRadarScreen = true
  mesh.renderOrder = 2
  return mesh
}

/**
 * RadarTablet Component
 *
 * Tactical radar tablet with a 60 FPS animated green CRT sweep fitted right-side up to the screen bezel cutout.
 */
export default function RadarTablet({
  position = [-0.75, 0.745, 0.05],
  scale = [0.35, 0.35, 0.35],
  rotation = [-0.15, 0.25, 0],
  outlineColor = '#00ff66',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  screenYOffset = -0.1,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  const { canvas, canvasTexture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = SCREEN_W
    cvs.height = SCREEN_H
    const tex = new THREE.CanvasTexture(cvs)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.flipY = true // Right-side up text orientation
    tex.generateMipmaps = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return { canvas: cvs, canvasTexture: tex }
  }, [])

  const lastTimeRef = useRef(0)

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (elapsed - lastTimeRef.current < 0.033) return
    lastTimeRef.current = elapsed

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = SCREEN_W
    const H = SCREEN_H
    const cx = W * 0.5
    const cy = H * 0.5
    const maxR = 195
    const sweepAngle = (elapsed * 2.2) % (Math.PI * 2)

    // Deep CRT Green Phosphor Background
    ctx.fillStyle = '#020e06'
    ctx.fillRect(0, 0, W, H)

    // Radial Vignette Glow
    const vig = ctx.createRadialGradient(cx, cy, 30, cx, cy, maxR + 30)
    vig.addColorStop(0, 'rgba(0, 45, 20, 0.40)')
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.65)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    // Range Concentric Rings
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.35)'
    ctx.lineWidth = 1.6
    for (let r = 40; r <= maxR; r += 40) {
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Crosshairs
    ctx.beginPath()
    ctx.moveTo(cx - maxR, cy)
    ctx.lineTo(cx + maxR, cy)
    ctx.moveTo(cx, cy - maxR)
    ctx.lineTo(cx, cy + maxR)
    ctx.stroke()

    // Rotating Radar Sweep Afterglow Trail
    const trailSteps = 36
    for (let i = 0; i < trailSteps; i++) {
      const a = sweepAngle - i * 0.028
      const alpha = (1 - i / trailSteps) * 0.42
      ctx.fillStyle = `rgba(0, 255, 102, ${alpha})`
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, maxR, a - 0.028, a)
      ctx.closePath()
      ctx.fill()
    }

    // Rotating Sweep Line
    ctx.strokeStyle = '#00ff66'
    ctx.lineWidth = 3.0
    ctx.shadowColor = '#00ff66'
    ctx.shadowBlur = 14
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Target Blips
    for (let i = 0; i < TARGET_BLIPS.length; i++) {
      const target = TARGET_BLIPS[i]
      const bx = cx + Math.cos(target.angle) * (target.r * maxR)
      const by = cy + Math.sin(target.angle) * (target.r * maxR)

      let diff = (sweepAngle - target.angle) % (Math.PI * 2)
      if (diff < 0) diff += Math.PI * 2
      const isHit = diff < 0.35
      const alpha = isHit ? 1 : Math.max(0.2, 1 - diff / 2.2)

      ctx.fillStyle = isHit ? '#ffffff' : `rgba(0, 255, 102, ${alpha})`
      ctx.beginPath()
      ctx.arc(bx, by, isHit ? 6 : 4, 0, Math.PI * 2)
      ctx.fill()

      if (isHit) {
        ctx.strokeStyle = '#00ff66'
        ctx.lineWidth = 1.5
        ctx.strokeRect(bx - 10, by - 10, 20, 20)
        ctx.font = 'bold 11px monospace'
        ctx.fillStyle = '#66ff99'
        ctx.fillText(target.label, bx + 14, by + 4)
      }
    }

    // Header & HUD Telemetry Text
    ctx.font = 'bold 14px monospace'
    ctx.fillStyle = '#00ff66'
    ctx.fillText('TACTICAL RADAR v2.4', 25, 36)
    ctx.font = '12px monospace'
    ctx.fillStyle = '#66ff99'
    ctx.fillText('RANGE 50km // AUTO-TRACK', 25, 56)
    ctx.fillText(`SWEEP ${(sweepAngle * (180 / Math.PI)).toFixed(0)}°`, W - 145, 36)
    ctx.fillText('TARGETS 04', W - 145, 56)

    // Footer Status Banner
    ctx.font = 'bold 12px monospace'
    ctx.fillStyle = '#00ff66'
    ctx.fillText('▶ CLICK TABLET TO OPEN NUMERICAL SOLVERS (/solvers)', 25, H - 24)

    // CRT Scanline Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
    for (let sy = 0; sy < H; sy += 3) {
      ctx.fillRect(0, sy, W, 1)
    }

    canvasTexture.needsUpdate = true
  })

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) onClick(e)
    else navigate('/solvers')
  })

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    const screenMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      emissiveMap: canvasTexture,
      emissive: new THREE.Color('#00ff66'),
      emissiveIntensity: 3.2,
      roughness: 0.3,
      metalness: 0.05,
      toneMapped: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2
    })

    let bodyMesh = null
    cloned.traverse((child) => {
      if (!child.isMesh || !child.material) return

      const cloneMat = (mat) => {
        const clonedMat = mat.clone()
        if (clonedMat.map) clonedMat.map.colorSpace = THREE.SRGBColorSpace
        if (clonedMat.emissiveMap) clonedMat.emissiveMap.colorSpace = THREE.SRGBColorSpace
        if (clonedMat.emissiveIntensity > 2) clonedMat.emissiveIntensity = 0.85
        return clonedMat
      }

      child.material = Array.isArray(child.material)
        ? child.material.map(cloneMat)
        : cloneMat(child.material)

      bodyMesh = child
    })

    if (bodyMesh) {
      const screen = createRadarScreenPlane(bodyMesh, screenMat, screenYOffset)
      if (screen) bodyMesh.add(screen)
    }

    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh) box.expandByObject(child)
    })

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2
    if (isFinite(centerX) && isFinite(centerZ)) {
      cloned.position.x = -centerX
      cloned.position.z = -centerZ
      cloned.position.y = -box.min.y + 0.001
      cloned.updateMatrix()
      cloned.updateMatrixWorld(true)
    }

    cloned.traverse((c) => {
      if (c !== cloned) c.matrixAutoUpdate = false
      c.frustumCulled = true
    })
    return cloned
  }, [scene, canvasTexture])

  if (!clonedScene) return null

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <primitive object={clonedScene} />
      {(hovered || alwaysShowOutline) && (
        <TightSilhouetteOutline
          scene={clonedScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
