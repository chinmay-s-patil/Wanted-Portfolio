import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TightSilhouetteOutline from '../utils/TightSilhouetteOutline'
import useDragProtectedClick from '../utils/useDragProtectedClick'

const MODEL_PATH = '/hubModels/Terminal/display_terminal/optimized_terminal.gltf'

useGLTF.preload(MODEL_PATH)

const RETRO_CODE_LINES = [
  'INITIALIZING SYSTEM CORE...',
  'CONNECTING PRECINCT_DB @ 192.168.1.104',
  'AUTH USER: DETECTIVE_PATIL',
  '[OK] SECURITY LEVEL: 5 (ROOT)',
  'LOADING OPENFOAM KERNEL v24.06...',
  'SOLVER: interIsoFoam --phase-change',
  'COURANT NO: Co = 0.142 [STABLE]',
  'MESH: 12.4M HEXAHEDRAL CELLS RESOLVED',
  '0x7FFF5FB: 48 89 E5 48 83 EC 20 48',
  'EXEC: ./runParallel -np 16 --solver',
  '>> COMPUTING VORTICITY FIELD...',
  '>> PRESSURE POISSON EQUATION SOLVED',
  'MEM_ALLOC: 4096MB [NORMAL]',
  'STATUS: MONITORING REAL-TIME CFD',
  'SYS_STATUS: ACTIVE // ALL OPERATIONAL',
  '----------------------------------',
  'ACCESS GRANTED. ENTER PASSCODE:',
  'root@precinct:~# ./start_solver.sh',
  'DECRYPTING SPECIMEN DATASETS...',
  'FOUND 14 SOLVER CASE FILES [READY]',
]

/**
 * Terminal Component
 *
 * Interactive 3D Retro Display Terminal Workstation placed along the right wall.
 * Features an animated retro green CRT hacking screen with scrolling code lines moving up.
 * Clicking navigates directly to /solvers (Interactive Terminal Section).
 */
export default function Terminal({
  position = [8.2, -0.6, 1.5],
  scale = [0.55, 0.55, 0.55],
  rotation = [0, -Math.PI / 2, 0],
  outlineColor = '#00ff66',
  outlineThickness = 0.008,
  alwaysShowOutline = false,
  onClick
}) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const { scene } = useGLTF(MODEL_PATH)

  // 2D Offscreen Canvas & Texture for Animated CRT Screen
  const { canvas, canvasTexture } = useMemo(() => {
    const cvs = document.createElement('canvas')
    cvs.width = 512
    cvs.height = 512
    const tex = new THREE.CanvasTexture(cvs)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.flipY = false
    return { canvas: cvs, canvasTexture: tex }
  }, [])

  const lineOffsetRef = useRef(0)
  const lastTimeRef = useRef(0)

  // Animate the CRT screen texture inside useFrame
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    if (elapsed - lastTimeRef.current > 0.08) {
      lastTimeRef.current = elapsed
      lineOffsetRef.current = (lineOffsetRef.current + 0.5) % (RETRO_CODE_LINES.length * 24)

      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Deep Dark Green CRT Phosphor Background
        ctx.fillStyle = '#020d06'
        ctx.fillRect(0, 0, 512, 512)

        // CRT Scanline Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
        for (let y = 0; y < 512; y += 4) {
          ctx.fillRect(0, y, 512, 2)
        }

        // Header Title Bar
        ctx.fillStyle = '#004d1a'
        ctx.fillRect(10, 10, 492, 35)
        ctx.font = 'bold 16px monospace'
        ctx.fillStyle = '#00ff66'
        ctx.fillText('⚡ PRECINCT TERMINAL v4.09 // ROOT', 20, 33)

        // Scrolling Hacking Code Lines
        ctx.font = '15px monospace'
        ctx.shadowColor = '#00ff66'
        ctx.shadowBlur = 8

        const startY = 70
        const lineHeight = 22
        const totalLines = RETRO_CODE_LINES.length

        for (let i = 0; i < 18; i++) {
          const lineIdx = (Math.floor(lineOffsetRef.current / lineHeight) + i) % totalLines
          const lineText = RETRO_CODE_LINES[lineIdx]
          const drawY = startY + i * lineHeight

          if (lineText.startsWith('>>') || lineText.startsWith('[OK]')) {
            ctx.fillStyle = '#66ff99'
          } else if (lineText.startsWith('STATUS') || lineText.startsWith('ACCESS')) {
            ctx.fillStyle = '#ffff66'
          } else {
            ctx.fillStyle = '#00ff66'
          }

          ctx.fillText(lineText, 20, drawY)
        }

        // Blinking Cursor at bottom
        if (Math.floor(elapsed * 3) % 2 === 0) {
          ctx.fillStyle = '#00ff66'
          ctx.fillRect(20, 470, 12, 18)
        }

        canvasTexture.needsUpdate = true
      }
    }
  })

  const { handlePointerDown, handleClick } = useDragProtectedClick((e) => {
    if (onClick) {
      onClick(e)
    } else {
      navigate('/solvers')
    }
  })

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true

        if (child.material) {
          child.material.side = THREE.DoubleSide

          // If this mesh is the screen (Material.011), apply the animated CanvasTexture
          if (child.material.name === 'Material.011' || child.name === 'Object_35') {
            const screenMat = new THREE.MeshStandardMaterial({
              map: canvasTexture,
              emissiveMap: canvasTexture,
              emissive: new THREE.Color('#00ff66'),
              emissiveIntensity: 2.2,
              roughness: 0.2,
              metalness: 0.1
            })
            child.material = screenMat
          } else {
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace
            }
          }
          child.material.needsUpdate = true
        }
      }
    })

    // Compute bounding box strictly over child meshes
    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh) {
        box.expandByObject(child)
      }
    })

    // Center X & Z midpoints and align bottom flush to local Y = 0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.position.x = -centerX
    cloned.position.z = -centerZ
    cloned.position.y = -box.min.y

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
