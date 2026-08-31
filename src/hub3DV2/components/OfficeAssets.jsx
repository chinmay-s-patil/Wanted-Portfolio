import React, { useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/OfficeAssets/office_-_assets/optimized_office.glb'
useGLTF.preload(MODEL_PATH)

const SCREEN_W = 512
const SCREEN_H = 512

/** True if this mesh belongs to the monitor / tower / keyboard / mouse setup. */
const isStrictComputerMesh = (child) => {
  if (!child?.isMesh) return false
  // Multi-primitive monitor loads as Group(Object_16) → Mesh children, so walk ancestors.
  let node = child
  while (node) {
    const n = node.name || ''
    if (
      n === 'Object_10' ||
      n === 'Object_12' ||
      n === 'Object_14' ||
      n === 'Object_16' ||
      n.startsWith('Keyboard_3') ||
      n.startsWith('Computer_Mouse_4') ||
      n.startsWith('Computer_5') ||
      n.startsWith('Monitor_6')
    ) {
      return true
    }
    node = node.parent
  }
  return false
}

const isMonitorScreenMaterial = (mat) =>
  !!mat && (mat.name === 'M_Monitor_Screen' || (mat.name || '').includes('Screen'))

const isComputerBodyMaterial = (mat) =>
  !!mat && (mat.name === 'M_Computer_2048' || (mat.name || '').includes('Computer'))

/**
 * Front CRT glass lives on the monitor body (+X, toward the keyboard) as a barrel-
 * curved patch of M_Computer_2048 — not the hollow M_Monitor_Screen bezel on -X.
 * Extract those tris, remap UVs from YZ, and overlay slightly proud to avoid z-fight.
 */
const extractFrontCrtScreen = (bodyMesh, material) => {
  const src = bodyMesh.geometry
  const pos = src.attributes.position
  const nrm = src.attributes.normal
  const index = src.index
  if (!pos || !nrm || !index) return null

  const picked = []
  let yMin = Infinity
  let yMax = -Infinity
  let zMin = Infinity
  let zMax = -Infinity

  for (let t = 0; t < index.count; t += 3) {
    const a = index.getX(t)
    const b = index.getX(t + 1)
    const c = index.getX(t + 2)

    const ax = pos.getX(a)
    const ay = pos.getY(a)
    const az = pos.getZ(a)
    const bx = pos.getX(b)
    const by = pos.getY(b)
    const bz = pos.getZ(b)
    const cx = pos.getX(c)
    const cy = pos.getY(c)
    const cz = pos.getZ(c)

    const mx = (ax + bx + cx) / 3
    const my = (ay + by + cy) / 3
    const mz = (az + bz + cz) / 3
    const nx =
      (nrm.getX(a) + nrm.getX(b) + nrm.getX(c)) / 3
    const ny =
      (nrm.getY(a) + nrm.getY(b) + nrm.getY(c)) / 3
    const maxNx = Math.max(nrm.getX(a), nrm.getX(b), nrm.getX(c))
    const maxY = Math.max(ay, by, cy)
    const minY = Math.min(ay, by, cy)

    // Front glass: +X CRT face. Top/corner tris have softer normals, so allow
    // lower avg nx if any vert still faces strongly forward. Skip upward bezel lid.
    const facesForward = nx >= 0.35 || (maxNx >= 0.55 && nx >= 0.25)
    if (!facesForward || mx < 0.10) continue
    if (ny > 0.55) continue
    if (my < 0.145 || my > 0.418) continue
    if (maxY > 0.422 || minY < 0.128) continue
    if (Math.abs(mz) > 0.212) continue

    picked.push(a, b, c)
    yMin = Math.min(yMin, ay, by, cy)
    yMax = Math.max(yMax, ay, by, cy)
    zMin = Math.min(zMin, az, bz, cz)
    zMax = Math.max(zMax, az, bz, cz)
  }

  if (picked.length < 9) return null

  const yRange = yMax - yMin || 1
  const zRange = zMax - zMin || 1
  const outset = 0.0015

  const positions = new Float32Array(picked.length * 3)
  const normals = new Float32Array(picked.length * 3)
  const uvs = new Float32Array(picked.length * 2)

  for (let i = 0; i < picked.length; i++) {
    const vi = picked[i]
    const x = pos.getX(vi)
    const y = pos.getY(vi)
    const z = pos.getZ(vi)
    const nx = nrm.getX(vi)
    const ny = nrm.getY(vi)
    const nz = nrm.getZ(vi)

    // Nudge along +X so the emissive glass sits just outside the body shell
    positions[i * 3] = x + outset
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    normals[i * 3] = nx
    normals[i * 3 + 1] = ny
    normals[i * 3 + 2] = nz
    // Z → U, Y → V (flip V for canvas with flipY=false)
    uvs[i * 2] = (z - zMin) / zRange
    uvs[i * 2 + 1] = 1 - (y - yMin) / yRange
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

  const mesh = new THREE.Mesh(geo, material)
  mesh.name = 'CRT_Curved_Screen'
  mesh.userData.isComputer = true
  mesh.userData.isCrtScreen = true
  return mesh
}

const attachCurvedCrtScreen = (root, material) => {
  let bodyMesh = null
  root.traverse((child) => {
    if (bodyMesh || !child.isMesh) return
    let node = child
    let underMonitor = false
    while (node) {
      const n = node.name || ''
      if (n === 'Object_16' || n === 'Object_10' || n.startsWith('Monitor_6') || n.startsWith('Computer_5')) {
        underMonitor = true
        break
      }
      node = node.parent
    }
    if (!underMonitor) return

    const mats = Array.isArray(child.material) ? child.material : [child.material]
    if (mats.some(isComputerBodyMaterial) || mats.some(isMonitorScreenMaterial)) {
      bodyMesh = child
    }
  })

  if (!bodyMesh) return null
  const screen = extractFrontCrtScreen(bodyMesh, material)
  if (!screen) return null
  bodyMesh.parent.add(screen)
  return screen
}

/**
 * OfficeAssets Component
 *
 * Retro office workstation with an animated CFD CRT display.
 * The curved front glass is extracted from the monitor body (+X, keyboard side)
 * and overlaid with a canvas-driven emissive material.
 */
export default function OfficeAssets({
  position,
  scale,
  rotation,
  outlineColor = '#00ffff',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  onClick
}) {
  const [computerHovered, setComputerHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  const { canvas, canvasTexture, heatCanvas, heatCtx, heatImgData } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = SCREEN_W
    cvs.height = SCREEN_H
    const tex = new THREE.CanvasTexture(cvs)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.flipY = false
    tex.generateMipmaps = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter

    const hCvs = document.createElement('canvas')
    hCvs.width = 120
    hCvs.height = 68
    const hCtx = hCvs.getContext('2d')
    const hImg = hCtx.createImageData(120, 68)
    return { canvas: cvs, canvasTexture: tex, heatCanvas: hCvs, heatCtx: hCtx, heatImgData: hImg }
  }, [])

  const lastTimeRef = useRef(0)
  const particlesRef = useRef(
    Array.from({ length: 48 }, (_, i) => ({
      x: 40 + (i % 12) * 36,
      y: 70 + Math.floor(i / 12) * 55,
      speed: 0.6 + (i % 5) * 0.25,
      lane: i % 7
    }))
  )

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (elapsed - lastTimeRef.current < 0.033) return
    lastTimeRef.current = elapsed

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = SCREEN_W
    const H = SCREEN_H
    const plotTop = 48
    const plotBottom = 318
    const plotLeft = 16
    const plotRight = W - 16
    const cx = (plotLeft + plotRight) / 2
    const cy = (plotTop + plotBottom) / 2

    // CRT phosphor background
    ctx.fillStyle = '#031018'
    ctx.fillRect(0, 0, W, H)

    // Header
    ctx.fillStyle = '#0a2430'
    ctx.fillRect(0, 0, W, 42)
    ctx.font = 'bold 13px monospace'
    ctx.fillStyle = '#00e8ff'
    ctx.fillText('PRECINCT CFD WORKSTATION  //  airfoil_case_07', 12, 26)
    ctx.font = '11px monospace'
    ctx.fillStyle = '#5dffb0'
    ctx.fillText('LIVE', W - 48, 26)

    // Soft pressure / vorticity field behind the airfoil (Hyper-optimized via ImageData pixel buffer)
    const buf = heatImgData.data
    let ptr = 0
    for (let gy = 0; gy < 68; gy++) {
      const y = plotTop + gy * 4
      const ny = (y - cy) / 90
      for (let gx = 0; gx < 120; gx++) {
        const x = plotLeft + gx * 4
        const nx = (x - cx) / 140

        const r2 = nx * nx + ny * ny + 0.08
        const u = 1 - (nx * nx - ny * ny) / r2
        const v = (-2 * nx * ny) / r2
        const speed = Math.sqrt(u * u + v * v)
        const pressure = 1 - 0.5 * speed * speed
        const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.2 + x * 0.02 + y * 0.015)
        const t = Math.max(0, Math.min(1, (pressure + 0.4) * 0.55 + pulse * 0.08))

        buf[ptr] = (20 + t * 180) | 0
        buf[ptr + 1] = (40 + (1 - t) * 160) | 0
        buf[ptr + 2] = (80 + t * 120) | 0
        buf[ptr + 3] = ((0.35 + t * 0.35) * 255) | 0
        ptr += 4
      }
    }
    heatCtx.putImageData(heatImgData, 0, 0)
    ctx.drawImage(heatCanvas, plotLeft, plotTop, plotRight - plotLeft, plotBottom - plotTop)

    // Grid overlay
    ctx.strokeStyle = 'rgba(0, 230, 255, 0.12)'
    ctx.lineWidth = 1
    for (let x = plotLeft; x <= plotRight; x += 32) {
      ctx.beginPath()
      ctx.moveTo(x, plotTop)
      ctx.lineTo(x, plotBottom)
      ctx.stroke()
    }
    for (let y = plotTop; y <= plotBottom; y += 28) {
      ctx.beginPath()
      ctx.moveTo(plotLeft, y)
      ctx.lineTo(plotRight, y)
      ctx.stroke()
    }

    // Streamlines around NACA-ish airfoil
    const airfoilY = (localX, side) => {
      // localX in [-1, 1] along chord
      const t = (localX + 1) * 0.5
      const thick = 0.22 * (0.2969 * Math.sqrt(Math.max(t, 0)) - 0.126 * t - 0.3516 * t * t + 0.2843 * t * t * t - 0.1015 * t * t * t * t)
      return side * thick * 95
    }

    ctx.lineWidth = 1.6
    for (let s = 0; s < 9; s++) {
      const baseY = plotTop + 28 + s * 28
      const alpha = 0.35 + (s % 3) * 0.15
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`
      ctx.beginPath()
      let started = false
      for (let x = plotLeft; x <= plotRight; x += 6) {
        const chord = (x - (cx - 110)) / 220
        const localX = chord * 2 - 1
        let y = baseY + Math.sin(x * 0.035 + elapsed * 3.2 + s * 0.55) * 5

        // Divert flow around airfoil body
        if (localX > -1.05 && localX < 1.05) {
          const upper = cy + airfoilY(localX, -1)
          const lower = cy + airfoilY(localX, 1)
          if (y > upper - 8 && y < lower + 8) {
            y = y < cy ? upper - 10 - s * 1.2 : lower + 10 + s * 1.2
          } else {
            // mild acceleration near leading edge
            const bump = Math.exp(-((localX + 0.6) ** 2) * 8) * (s < 4.5 ? -12 : 12)
            y += bump * Math.sin(elapsed * 2 + s)
          }
        }

        if (!started) {
          ctx.moveTo(x, y)
          started = true
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    // Airfoil silhouette
    ctx.beginPath()
    for (let i = 0; i <= 40; i++) {
      const localX = -1 + (i / 40) * 2
      const x = cx - 110 + ((localX + 1) / 2) * 220
      const y = cy + airfoilY(localX, -1)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    for (let i = 40; i >= 0; i--) {
      const localX = -1 + (i / 40) * 2
      const x = cx - 110 + ((localX + 1) / 2) * 220
      const y = cy + airfoilY(localX, 1)
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(4, 20, 28, 0.92)'
    ctx.fill()
    ctx.strokeStyle = '#00ffff'
    ctx.lineWidth = 2.2
    ctx.shadowColor = '#00ffff'
    ctx.shadowBlur = 12
    ctx.stroke()
    ctx.shadowBlur = 0

    // Stagnation / Cp markers
    ctx.fillStyle = '#ff3d6e'
    ctx.beginPath()
    ctx.arc(cx - 108, cy, 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffe066'
    ctx.beginPath()
    ctx.arc(cx - 40, cy - 22, 3.5, 0, Math.PI * 2)
    ctx.fill()

    // Tracer particles
    const particles = particlesRef.current
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const nx = (p.x - cx) / 140
      const ny = (p.y - cy) / 90
      const r2 = nx * nx + ny * ny + 0.12
      const u = 1.8 - (nx * nx - ny * ny) / r2
      const v = (-2 * nx * ny) / r2
      p.x += u * p.speed * 1.8
      p.y += v * p.speed * 1.2 + Math.sin(elapsed * 4 + p.lane) * 0.15

      // Respawn upstream
      if (p.x > plotRight + 8 || p.y < plotTop - 8 || p.y > plotBottom + 8) {
        p.x = plotLeft - 4
        p.y = plotTop + 20 + (p.lane / 7) * (plotBottom - plotTop - 40)
      }

      // Hide particles inside airfoil
      const chord = (p.x - (cx - 110)) / 220
      const localX = chord * 2 - 1
      if (localX > -1 && localX < 1) {
        const upper = cy + airfoilY(localX, -1)
        const lower = cy + airfoilY(localX, 1)
        if (p.y > upper && p.y < lower) continue
      }

      const glow = 0.55 + 0.45 * Math.sin(elapsed * 6 + i)
      ctx.fillStyle = `rgba(120, 255, 230, ${glow})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Telemetry panel
    ctx.fillStyle = '#071820'
    ctx.fillRect(0, plotBottom + 4, W, H - plotBottom - 4)
    ctx.strokeStyle = '#00c8e0'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, plotBottom + 4)
    ctx.lineTo(W, plotBottom + 4)
    ctx.stroke()

    const iter = Math.floor(elapsed * 38) % 5000
    const residual = (1.8e-4 / (1 + (iter % 800) * 0.02)).toExponential(2)
    ctx.font = '12px monospace'
    ctx.fillStyle = '#00e8ff'
    ctx.fillText('SOLVER  simpleFoam  |  Re=1.2e5  |  AoA=4.0°', 14, plotBottom + 28)
    ctx.fillText(`ITER  ${String(iter).padStart(4, '0')}   RES(p)  ${residual}`, 14, plotBottom + 50)
    ctx.fillStyle = '#7dffa8'
    ctx.fillText('Cl=0.42  Cd=0.018  Cm=-0.031   [STABLE]', 14, plotBottom + 72)

    // Residual sparkline
    ctx.strokeStyle = '#66ff99'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let gx = 300; gx < 500; gx += 4) {
      const t = (gx - 300) / 200
      const gy =
        plotBottom + 52 +
        Math.sin(gx * 0.09 - elapsed * 5) * 10 * (1 - t) +
        Math.cos(gx * 0.04 - elapsed * 2) * 4 * (1 - t)
      if (gx === 300) ctx.moveTo(gx, gy)
      else ctx.lineTo(gx, gy)
    }
    ctx.stroke()

    // CTA strip
    ctx.fillStyle = '#00d4ef'
    ctx.fillRect(12, H - 52, W - 24, 38)
    ctx.fillStyle = '#021018'
    ctx.font = 'bold 12px monospace'
    ctx.fillText('> CLICK MONITOR  —  OPEN DATA VISUALIZER', 24, H - 28)

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.14)'
    for (let sy = 0; sy < H; sy += 3) {
      ctx.fillRect(0, sy, W, 1)
    }

    // Soft vignette
    const vig = ctx.createRadialGradient(cx, cy, 80, cx, cy, 280)
    vig.addColorStop(0, 'rgba(0,0,0,0)')
    vig.addColorStop(1, 'rgba(0,0,0,0.35)')
    ctx.fillStyle = vig
    ctx.fillRect(0, 0, W, H)

    canvasTexture.needsUpdate = true
  })

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/visualization')
    }
  })

  const { decorativeScene, computerScene, lampPos } = useMemo(() => {
    if (!scene) return { decorativeScene: null, computerScene: null, lampPos: null }
    const fullClone = scene.clone(true)
    const compClone = scene.clone(true)

    // Reset atlas transforms — curved glass uses clean 0–1 UVs
    canvasTexture.offset.set(0, 0)
    canvasTexture.repeat.set(1, 1)

    const screenMat = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      emissiveMap: canvasTexture,
      emissive: new THREE.Color('#00ffff'),
      emissiveIntensity: 2.6,
      roughness: 0.2,
      metalness: 0.05,
      toneMapped: false,
      side: THREE.FrontSide
    })

    // Dim bezel rim (stock "screen" material is only the plastic lip, not glass)
    const bezelMat = new THREE.MeshStandardMaterial({
      color: '#050a0c',
      emissive: new THREE.Color('#00181c'),
      emissiveIntensity: 0.35,
      roughness: 0.55,
      metalness: 0.1,
      side: THREE.DoubleSide
    })

    fullClone.traverse((child) => {
      const name = (child.name || '').toLowerCase()
      const isVent =
        name.includes('vent') ||
        name.includes('vend_airduct') ||
        name.includes('fansupport') ||
        name.includes('nut_37') ||
        name.includes('frame_43')
      const isPicture = name.includes('photo') || name.includes('poster')
      const isCactus = name.includes('cactus')
      const isTapeRecorder =
        name.includes('taperecorder') ||
        name.includes('microphone') ||
        name === 'object_70' ||
        name === 'object_71' ||
        name === 'object_73'

      if (isVent || isPicture || isCactus || isTapeRecorder) {
        child.visible = false
        return
      }

      if (!child.isMesh) return

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.side = THREE.DoubleSide
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
          })
        } else {
          child.material.side = THREE.DoubleSide
          if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace
        }
      }

      if (isStrictComputerMesh(child)) {
        child.userData.isComputer = true

        const mats = Array.isArray(child.material) ? child.material : [child.material]
        if (mats.some(isMonitorScreenMaterial)) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) =>
              isMonitorScreenMaterial(mat) ? screenMat : mat
            )
          } else {
            child.material = screenMat
          }
        }
      }
    })

    // Insert barrel-curved CRT glass into the hollow monitor opening
    attachCurvedCrtScreen(fullClone, screenMat)

    fullClone.updateMatrixWorld(true)
    const box = new THREE.Box3()
    fullClone.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    fullClone.position.x = -centerX
    fullClone.position.z = -centerZ
    fullClone.position.y = -box.min.y + 0.002

    compClone.traverse((child) => {
      if (child.isMesh) {
        child.visible = isStrictComputerMesh(child)
      }
    })
    attachCurvedCrtScreen(compClone, screenMat)

    compClone.position.x = -centerX
    compClone.position.z = -centerZ
    compClone.position.y = -box.min.y + 0.002

    let detectedLampPos = null
    fullClone.traverse((child) => {
      if (child.isMesh) {
        const n = (child.name || '').toLowerCase()
        const m = (child.material?.name || '').toLowerCase()
        if (n.includes('lamp') || m.includes('lamp') || n.includes('light') || m.includes('light') || n.includes('shade') || m.includes('shade')) {
          child.updateMatrixWorld(true)
          const lBox = new THREE.Box3().setFromObject(child)
          const lCenter = new THREE.Vector3()
          lBox.getCenter(lCenter)
          detectedLampPos = [
            lCenter.x - centerX,
            lBox.max.y - box.min.y - 0.05,
            lCenter.z - centerZ
          ]
        }
      }
    })

    if (!detectedLampPos) {
      detectedLampPos = [-0.65, 0.92, 0.45]
    }

    fullClone.traverse((child) => {
      if (child !== fullClone) child.matrixAutoUpdate = false
      child.frustumCulled = true
    })

    compClone.traverse((child) => {
      if (child !== compClone) child.matrixAutoUpdate = false
      child.frustumCulled = true
    })

    return { decorativeScene: fullClone, computerScene: compClone, lampPos: detectedLampPos }
  }, [scene, canvasTexture])

  if (!decorativeScene) return null

  const handlePointerOver = (e) => {
    if (e.object?.userData?.isComputer) {
      e.stopPropagation()
      setComputerHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = () => {
    setComputerHovered(false)
    document.body.style.cursor = 'auto'
  }

  const onDown = (e) => {
    if (e.object?.userData?.isComputer) {
      handlePointerDown(e)
    }
  }

  const onClk = (e) => {
    if (e.object?.userData?.isComputer) {
      handleClick(e)
    }
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive
        object={decorativeScene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={onDown}
        onClick={onClk}
      />
      {/* Warm Emerald-Gold Banker's Lamp Light positioned directly on the lamp shade */}
      {lampPos && (
        <>
          <pointLight
            position={lampPos}
            color="#a7f3d0"
            intensity={6.0}
            distance={8.0}
            decay={1.8}
          />
          <spotLight
            position={lampPos}
            color="#fff5c0"
            intensity={8.0}
            angle={Math.PI / 2.2}
            penumbra={0.6}
            distance={8.5}
            decay={1.8}
          />
        </>
      )}
      {(computerHovered || alwaysShowOutline) && (
        <TightSilhouetteOutline
          scene={computerScene}
          color={outlineColor}
          thickness={outlineThickness}
        />
      )}
    </group>
  )
}
