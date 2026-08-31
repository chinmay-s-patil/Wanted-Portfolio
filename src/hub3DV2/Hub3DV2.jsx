'use client'

import React, { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, AdaptiveDpr, AdaptiveEvents, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { getInitialDprBaseline } from '../common/gpuDetect'
import { Sofa, CenterTable, Newspaper, Binder, TvTable, Lockers, Terminal, FilingCabinet, OfficeAssets, RetroRoom, RetroFloorLamp, WASDFreecam, PrinterTable, Payphone, HubHelpGuideModal, OldCamera, FilmRollPile, RadarTablet, PrecinctDoor, WallKeychains, GrandfatherClock, AmbientDustParticles, PrecinctWallClock, DetectiveCoffeeMug, DetectiveCoffeeMugSet, RetroDeskFan, TableLamp, ScatteredPages, Globe, WaterDispenser, Fireplace, Trophy, AttributionModal, EvidenceBox, EvidenceBoxSet } from './components'
import { Piano, Violin, TvRemote, McNaughtFrame, WindowAndTelescope, useEasterEgg } from './easterEgg'

const ALL_HUB_MODELS = [
  '/hubModels/OfficeAssets/office_-_assets/optimized_office.glb',
  '/hubModels/Lockers2/school_locker_row/optimized_lockers.glb',
  '/hubModels/Filing Cabinet/filing_cabinet_-_6mb/optimized_cabinet.glb',
  '/hubModels/CenterTable/CENTER TABLE.glb',
  '/hubModels/SofaSet/couchsofa_set/optimized_sofa.glb',
  '/hubModels/TvTable/childhood_-_a_diorama/optimized_tv.glb',
  '/hubModels/Newspaper/newspaper/optimized_newspaper.glb',
  '/hubModels/Binder/binder_notebook/optimized_binder.glb',
  '/hubModels/RadarTablet/packed_radar.glb',
  '/hubModels/Table/office_table.glb',
  '/hubModels/3DPrinter/3d_printer.glb',
  '/hubModels/OldPayphone/packed_payphone.glb',
  '/hubModels/OldCamera/antique_wet_plate_camera_on_tripod_-_game_model/optimized_camera.glb',
  '/hubModels/TicketBooth/ticket_booth/optimized_booth.glb',
  '/hubModels/GrandfatherClock/fixed_grandfather_clock.glb',
  '/hubModels/TableLamp/packed_table_lamp.glb',
  '/hubModels/Props/FirePlace/antique_fireplace.glb',
  '/hubModels/Props/Globe2/antique_globe (1)/optimized_globe.glb',
  '/hubModels/Props/WaterDispenser/water_dispenser.glb',
  '/hubModels/Trophy/low_poly_trophy.glb',
  '/hubModels/FilmRolls/packed_film_35mm.glb',
  '/hubModels/FilmRolls/packed_kodak_400.glb',
  '/hubModels/FilmRolls/packed_kodak_gold.glb',
  '/hubModels/EasterEggs/Piano/old_piano/optimized_piano.glb',
  '/hubModels/EasterEggs/ViolinStanding/violin/optimized_violin.glb',
  '/hubModels/EasterEggs/Telescope/telescope/optimized_telescope.glb',
  '/hubModels/EasterEggs/TVRemote/tv_remote/optimized_tv_remote.glb'
]

async function preloadInBatches(paths, batchSize = 4, onProgress) {
  let done = 0
  onProgress?.(0)
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize)
    await Promise.all(batch.map((p) => useGLTF.preload(p)))
    done += batch.length
    onProgress?.(Math.min(1, done / paths.length))
  }
}

function AdaptivePerformanceMonitor() {
  const { performance } = useThree()
  const frameTimes = useRef([])

  useFrame((_, delta) => {
    frameTimes.current.push(delta)
    if (frameTimes.current.length > 30) {
      frameTimes.current.shift()
      const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
      const avgFps = 1 / avgDelta

      if (avgFps < 28) {
        performance.regress()
      }
    }
  })

  return null
}

const EVIDENCE_BOX_DATA = [
  { position: [2.8, 3.02, -5.95], rotation: [0, 0.15, 0], labelType: 'CASE FILES', caseNumber: 'CASE #7821-A' },
  { position: [2.78, 3.32, -5.93], rotation: [0, -0.22, 0], labelType: 'EVIDENCE', caseNumber: 'CASE #8492-B' },
  { position: [3.6, 3.02, -5.95], rotation: [0, -0.3, 0], labelType: 'RESEARCH', caseNumber: 'CASE #5519-X' },
  { position: [2.3, -0.6, -5.3], rotation: [0, 0.85, 0], labelType: 'CASE FILES', caseNumber: 'CASE #1048-E' },
  { position: [4.8, -0.6, -5.8], rotation: [0, -0.4, 0], labelType: 'EVIDENCE', caseNumber: 'CASE #2091-P' },
  { position: [1.1, -0.6, 1.9], rotation: [0, -0.35, 0], labelType: 'EVIDENCE', caseNumber: 'CASE #5820-F' },
  { position: [1.08, -0.30, 1.88], rotation: [0, 0.25, 0], labelType: 'RESEARCH', caseNumber: 'CASE #9014-G' },
  { position: [-0.6, -0.6, 2.9], rotation: [0, 0.65, 0], labelType: 'CONFIDENTIAL', caseNumber: 'CASE #6731-H' }
]

const COFFEE_MUG_DATA = [
  { position: [0.15, 0.08, 2.55], scale: [1.2, 1.2, 1.2], rotation: [0, 0.4, 0] },
  { position: [-5.4, 0.9, 4.6], scale: [1.2, 1.2, 1.2], rotation: [0, -0.4, 0] },
  { position: [7.8, -0.2, 1.2], scale: [1.2, 1.2, 1.2], rotation: [0, 1.5, 0] }
]

function WebGLContextManager() {
  const { gl } = useThree()
  useEffect(() => {
    const canvas = gl.domElement
    const handleContextLost = (e) => {
      e.preventDefault()
      console.warn('WebGL context lost. Attempting context restoration...')
    }
    const handleContextRestored = () => {
      console.log('WebGL context successfully restored.')
    }
    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [gl])
  return null
}

function PerformanceStatsCollector({ visible, onUpdate }) {
  const { gl } = useThree()
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  useFrame(() => {
    if (!visible) return
    frameCountRef.current++
    const now = performance.now()
    const delta = now - lastTimeRef.current

    if (delta >= 400) {
      const currentFps = Math.round((frameCountRef.current * 1000) / delta)
      const currentMs = (delta / frameCountRef.current).toFixed(1)
      const calls = gl.info.render.calls
      const tris = gl.info.render.triangles
      const mem = window.performance && window.performance.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : 0

      onUpdate({ fps: currentFps, frameTime: currentMs, drawCalls: calls, triangles: tris, memory: mem })
      frameCountRef.current = 0
      lastTimeRef.current = now
    }
  })

  return null
}

function LoadingSpinner({ progress = 0 }) {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 2.5
      meshRef.current.rotation.x = clock.getElapsedTime() * 1.2
    }
  })

  const percent = Math.round(progress * 100)

  return (
    <group position={[0, 0.4, 0]}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#00ffff" wireframe emissive="#00ffff" emissiveIntensity={0.8} />
      </mesh>
      <Html center position={[0, -0.6, 0]}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          <div style={{
            color: '#38bdf8',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap'
          }}>
            Loading 3D Precinct... {percent}%
          </div>
          <div style={{
            width: '180px',
            height: '5px',
            background: 'rgba(22, 27, 34, 0.85)',
            borderRadius: '4px',
            overflow: 'hidden',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              height: '100%',
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #38bdf8, #38ef7d)',
              borderRadius: '4px',
              transition: 'width 0.2s ease-out'
            }} />
          </div>
        </div>
      </Html>
    </group>
  )
}

class HubV2ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Hub3DV2 render error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#ff5555', padding: '2rem', background: '#0d1117', height: '100vh', fontFamily: 'monospace', overflowY: 'auto' }}>
          <h2 style={{ color: '#ff6b6b' }}>Hub3DV2 Loading Error</h2>
          <pre style={{ fontSize: '0.95rem', background: '#161b22', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          {this.state.errorInfo && (
            <pre style={{ color: '#8b949e', fontSize: '0.85rem', background: '#090d13', padding: '1rem', borderRadius: '6px', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#21262d', color: '#fff', border: '1px solid #30363d', cursor: 'pointer', borderRadius: '4px' }}>
            Reload Scene
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Hub3DV2() {
  const initialDpr = useMemo(() => getInitialDprBaseline(), [])
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showAttributionModal, setShowAttributionModal] = useState(false)
  const [highlightAll, setHighlightAll] = useState(false)
  const [showHintBanner, setShowHintBanner] = useState(true)
  const [isFreecamEnabled, setIsFreecamEnabled] = useState(false)
  const [showFpsCounter, setShowFpsCounter] = useState(false)
  const [fpsStats, setFpsStats] = useState({ fps: 60, frameTime: '16.6', drawCalls: 0, triangles: 0, memory: 0 })
  const [cameraHovered, setCameraHovered] = useState(false)
  const [doorKeychainsHovered, setDoorKeychainsHovered] = useState(false)
  const { activeEgg, setActiveEgg, isTvPaused, setIsTvPaused, triggerEgg } = useEasterEgg()
  const controlsRef = useRef()

  const [loadProgress, setLoadProgress] = useState(0)
  const [isPreloading, setIsPreloading] = useState(true)

  useEffect(() => {
    let isMounted = true
    preloadInBatches(ALL_HUB_MODELS, 4, (ratio) => {
      if (isMounted) setLoadProgress(ratio)
    }).then(() => {
      if (isMounted) {
        setLoadProgress(1)
        setTimeout(() => {
          if (isMounted) setIsPreloading(false)
        }, 200)
      }
    })
    return () => { isMounted = false }
  }, [])

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 2.0, -4.8)
      controlsRef.current.target.set(0, 0.4, 0.5)
      controlsRef.current.update()
    }
  }

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHintBanner(false)
    }, 10000)
    return () => clearTimeout(timer)
  }, [])

  // Hotkeys: 'F' for Freecam, 'P' for Performance FPS & WebGL Counter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) return
      if (e.code === 'KeyF' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        setIsFreecamEnabled((prev) => !prev)
      }
      if (e.code === 'KeyP' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setShowFpsCounter((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <HubV2ErrorBoundary>
      <div className="hub-3d-v2-container" onContextMenu={(e) => e.preventDefault()}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

          .hub-3d-v2-container {
            width: 100vw;
            height: 100vh;
            background: #0d1117;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }

          .hub-v2-loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0d1117;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            transition: opacity 0.3s ease;
          }

          .hub-v2-loading-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .hub-v2-loading-title {
            color: #38bdf8;
            font-family: 'Inter', sans-serif;
            font-size: 1.05rem;
            font-weight: 600;
            letter-spacing: 0.04em;
          }

          .hub-v2-loading-bar-bg {
            width: 240px;
            height: 6px;
            background: rgba(48, 54, 61, 0.8);
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid rgba(56, 189, 248, 0.3);
          }

          .hub-v2-loading-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #38bdf8, #38ef7d);
            border-radius: 4px;
            transition: width 0.2s ease-out;
          }

          .hub-v2-loading-percent {
            color: #8b949e;
            font-family: monospace;
            font-size: 0.85rem;
          }

          .hub-v2-ui {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
          }

          .hub-v2-ui > * {
            pointer-events: auto;
          }

          .hub-v2-nav-bar {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            display: flex;
            gap: 0.75rem;
          }

          .hub-v2-top-right-bar {
            position: absolute;
            top: 1.5rem;
            right: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 20;
          }

          .hub-v2-btn {
            background: rgba(22, 27, 34, 0.85);
            color: #c9d1d9;
            border: 1px solid rgba(48, 54, 61, 0.8);
            padding: 0.6rem 1.1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(12px);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .hub-v2-btn:hover {
            background: rgba(33, 38, 45, 0.95);
            border-color: #58a6ff;
            color: #ffffff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          .hub-v2-action-btn {
            background: rgba(22, 27, 34, 0.85);
            color: #c9d1d9;
            border: 1px solid rgba(48, 54, 61, 0.8);
            padding: 0.6rem 1.1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(12px);
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .hub-v2-action-btn:hover {
            background: rgba(33, 38, 45, 0.95);
            border-color: #e3b341;
            color: #ffffff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(227, 179, 65, 0.2);
          }

          .hub-v2-action-btn.active {
            background: rgba(227, 179, 65, 0.15);
            border-color: #e3b341;
            color: #ffea9f;
          }

          .hub-v2-subtitle-badge {
            position: absolute;
            bottom: 1.5rem;
            left: 1.5rem;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid rgba(48, 54, 61, 0.8);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #8b949e;
            backdrop-filter: blur(12px);
          }

          .hub-v2-title-badge {
            position: absolute;
            bottom: 1.5rem;
            right: 1.5rem;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid rgba(48, 54, 61, 0.8);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #8b949e;
            backdrop-filter: blur(12px);
          }

          .hub-v2-hint-banner-wrap {
            position: absolute;
            top: 3.6rem;
            right: 12.0rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none;
            z-index: 30;
            animation: fadeInHint 0.4s ease-out;
          }

          @keyframes fadeInHint {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hub-v2-hint-box {
            pointer-events: none;
            background: rgba(22, 27, 34, 0.95);
            color: #ffea9f;
            border: 1px solid #e3b341;
            font-weight: 600;
            font-size: 0.82rem;
            padding: 0.45rem 0.85rem;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            white-space: nowrap;
            user-select: none;
          }

          .hub-v2-swirly-arrow-svg {
            width: 120px;
            height: 65px;
            margin-bottom: -4px;
            order: -1;
            filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
          }

          .hub-v2-fps-badge {
            position: absolute;
            top: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(13, 17, 23, 0.92);
            border: 1px solid #38bdf8;
            border-radius: 20px;
            padding: 0.45rem 1rem;
            font-family: monospace;
            font-size: 0.82rem;
            color: #38bdf8;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(12px);
            z-index: 100;
            pointer-events: none;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
        `}</style>

        {/* Floating HTML UI Overlay */}
        <div className="hub-v2-ui">
          {showFpsCounter && (
            <div className="hub-v2-fps-badge">
              <span>⚡ <strong style={{ color: fpsStats.fps < 30 ? '#ff5555' : fpsStats.fps < 50 ? '#ffea9f' : '#38ef7d' }}>{fpsStats.fps} FPS</strong> ({fpsStats.frameTime}ms)</span>
              <span>🎨 Calls: <strong style={{ color: '#ffffff' }}>{fpsStats.drawCalls}</strong></span>
              <span>📐 Tris: <strong style={{ color: '#ffffff' }}>{fpsStats.triangles.toLocaleString()}</strong></span>
              {fpsStats.memory > 0 && <span>💾 Heap: <strong style={{ color: '#ffffff' }}>{fpsStats.memory}MB</strong></span>}
            </div>
          )}

          <div className="hub-v2-nav-bar">
            <button
              className="hub-v2-btn"
              onClick={handleResetCamera}
              title="Reset camera position to default higher view"
            >
              🎥 Reset View
            </button>
          </div>

          <div className="hub-v2-top-right-bar">
            <button
              className={`hub-v2-action-btn ${isFreecamEnabled ? 'active' : ''}`}
              onClick={() => setIsFreecamEnabled(!isFreecamEnabled)}
              title={isFreecamEnabled ? 'Freecam active: Move in 3D with WASD / Space / Shift (Press F to toggle)' : 'Freecam locked: Drag to rotate, W/S Pitch, A/D Yaw (Press F to toggle)'}
            >
              {isFreecamEnabled ? '🚀 Freecam: ON [F]' : '🔒 Freecam: OFF [F]'}
            </button>
            <button
              className="hub-v2-action-btn"
              onClick={() => setShowHelpModal(true)}
            >
              💡 Help Guide
            </button>
            <button
              className={`hub-v2-action-btn ${highlightAll ? 'active' : ''}`}
              onClick={() => setHighlightAll(!highlightAll)}
            >
              {highlightAll ? '✨ Hide Outlines' : '✨ Highlight All'}
            </button>
          </div>

          {/* Auto-Disappearing 10-Second Non-Clickable Hint Banner with Swirly SVG Arrow Starting at Hint & Pointing directly into Help Guide */}
          {showHintBanner && (
            <div className="hub-v2-hint-banner-wrap">
              <svg className="hub-v2-swirly-arrow-svg" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Curve starts at top of hint box (60, 65), moves UP & AWAY, swirls in a loop, and shoots UP into Help Guide button */}
                <path
                  d="M 60 65 C 40 55, 20 45, 30 30 C 40 15, 80 20, 65 45 C 50 65, 25 35, 25 10"
                  stroke="#ffea9f"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Arrowhead pointing UP directly into Help Guide button */}
                <path
                  d="M 15 18 L 25 2 L 35 18 Z"
                  fill="#ffea9f"
                  stroke="#ffea9f"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="hub-v2-hint-box">
                Need help?
              </div>
            </div>
          )}

          <div className="hub-v2-subtitle-badge">
            {isFreecamEnabled
              ? '🕵️ Gritty Retro Precinct Lounge • 🎮 Freecam ON: WASD / Space / Shift'
              : '🕵️ Gritty Retro Precinct Lounge • 🖱️ Drag to rotate | W/S Pitch | A/D Yaw'}
          </div>
          <div className="hub-v2-title-badge">3D Hub V2 — Custom Retro Scene</div>
        </div>

        {/* Portfolio Directory Help Modal Overlay */}
        <HubHelpGuideModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />

        {/* Project Attributions & Credits Modal Overlay */}
        <AttributionModal isOpen={showAttributionModal} onClose={() => setShowAttributionModal(false)} />

        {/* Three.js Canvas with High Performance & Moody Retro Lighting */}
        <Canvas dpr={initialDpr} performance={{ min: 0.5 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <AdaptivePerformanceMonitor />
          <WebGLContextManager />
          <PerformanceStatsCollector visible={showFpsCounter} onUpdate={setFpsStats} />
          <PerspectiveCamera makeDefault position={[0, 2.0, -4.8]} fov={50} near={0.1} far={100} />
          <OrbitControls
            ref={controlsRef}
            target={[0, 0.4, 0.5]}
            minPolarAngle={isFreecamEnabled ? 0.001 : 0.3}
            maxPolarAngle={isFreecamEnabled ? Math.PI - 0.001 : Math.PI / 2.08}
            minDistance={isFreecamEnabled ? 0.1 : 1.2}
            maxDistance={isFreecamEnabled ? 100 : 5.8}
            enableDamping
            dampingFactor={0.08}
            enablePan={isFreecamEnabled}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: isFreecamEnabled ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
            }}
          />
          <WASDFreecam controlsRef={controlsRef} enabled={isFreecamEnabled} moveSpeed={5.0} turnSpeed={1.8} />

          {/* Balanced Retro Precinct Ambient & Directional Scene Lighting */}
          <ambientLight intensity={0.55} color="#ffe3c2" />

          {/* Actual Left Window Moonlight Beam (Positioned at Window X=-8.5, Z=-4.4) */}
          <directionalLight
            position={[-8.5, 3.5, -4.4]}
            intensity={1.8}
            color="#38bdf8"
          />

          {/* Retro Room Enclosure */}
          <RetroRoom />
          <RetroFloorLamp position={[2.6, -0.6, 0.5]} />

          {/* Render Modular 3D Components with React Suspense & Unified Batched Preloading */}
          <Suspense fallback={<LoadingSpinner progress={loadProgress} />}>
            {!isPreloading && (
              <>
                <Sofa
                  position={[-1, -0.6, 0.8]}
                  scale={[1.8, 1.8, 1.8]}
                  rotation={[0, 0, 0]}
                />
            <CenterTable
              position={[0.3, -0.9, 2.65]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 0, 0]}
            />
            <TvTable
              position={[2, -0.6, 4.2]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, Math.PI + Math.PI/4, 0]}
              activeEgg={activeEgg}
              isPaused={isTvPaused}
              onClose={() => {
                setActiveEgg(null)
                setIsTvPaused(false)
              }}
            />
            <Newspaper
              position={[0.42, -0.01, 2.25]}
              scale={[0.045, 0.045, 0.045]}
              rotation={[0, 2.95, 0]}
              outlineColor="#38ef7d"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/')}
            />
            <Binder
              position={[-0.42, -0.02, 2.25]}
              scale={[2.5, 2.5, 2.5]}
              rotation={[0, 0.2, 0]}
              outlineColor="#ff0055"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/professionaldiary')}
            />
            <Lockers
              position={[6.5, -0.6, 5.75]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, -Math.PI / 2, 0]}
              outlineColor="#00d2ff"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/education')}
            />
            <Terminal
              position={[8.05, -0.93, 1.5]}
              scale={[0.55, 0.55, 0.55]}
              rotation={[0, -Math.PI / 2, 0]}
              outlineColor="#00ff66"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/solvers')}
            />
            <FilingCabinet
              position={[3.2, -0.6, -5.95]}
              scale={[3, 3, 2]}
              rotation={[0, Math.PI, 0]}
              outlineColor="#1e40af"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/projects')}
            />
            <OfficeAssets
              position={[0, -0.6, -5.2]}
              scale={[1.5, 1.5, 1.5]}
              rotation={[0, -Math.PI / 2, 0]}
              outlineColor="#00f5d4"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/visualization')}
            />
            <RadarTablet
              position={[-1.05, 0.51, -5.65]}
              scale={[2, 2, 2]}
              rotation={[0.05, -Math.PI / 2 + 0.3, 0]}
              outlineColor="#00ff66"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/upcoming')}
            />
            <PrinterTable
              position={[-5.9, -0.6, 5.0]}
              scale={[2, 2, 2]}
              rotation={[0, -Math.PI, 0]}
              outlineColor="#a855f7"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/cad')}
            />
            <Payphone
              position={[-8.2, 2.4, -1.5]}
              scale={[0.0035, 0.0035, 0.0035]}
              rotation={[0, 0*Math.PI / 2, 0]}
              outlineColor="#ff007f"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/contactme')}
            />
            <OldCamera
              position={[-3.5, -0.6, 5.4]}
              scale={[2, 2, 2]}
              rotation={[0, Math.PI / 1, 0]}
              outlineColor="#ffb703"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              isHoveredFromFilm={cameraHovered}
              onHoverChange={setCameraHovered}
              onClick={() => navigate('/events')}
            />
            <FilmRollPile
              position={[-4.7, 0.9, 4.8]}
              scale={[2, 2, 2]}
              rotation={[0, -Math.PI / 6, 0]}
              outlineColor="#ffb703"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              isHoveredFromCamera={cameraHovered}
              onHoverChange={setCameraHovered}
              onClick={() => navigate('/events')}
            />

            {/* Precinct Security Door & Wall Keychains (Linked Hover Pair) */}
            <PrecinctDoor
              position={[-7.1, 0.6, -6.4]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 0 * Math.PI / 1, 0]}
              outlineColor="#ff3366"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              isHoveredGroup={doorKeychainsHovered}
              onHoverChange={setDoorKeychainsHovered}
              onClick={() => navigate('/openfoam')}
            />
            <WallKeychains
              position={[-5.6, 1.7, -6.4]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 0 * Math.PI / 1, 0]}
              outlineColor="#ff3366"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              isHoveredGroup={doorKeychainsHovered}
              onHoverChange={setDoorKeychainsHovered}
              onClick={() => navigate('/openfoam')}
            />

            <Trophy
              position={[-0.8, 1.3, 6.2]}
              scale={[0.1, 0.1, 0.1]}
              rotation={[0, 0, 0]}
              alwaysShowOutline={highlightAll}
              onClick={() => setShowAttributionModal(true)}
            />

            {/* Ambient Atmosphere & Environmental Props */}
            <AmbientDustParticles 
              count={130}
              bounds={[12, 6, 12]}
            />
            {/* Detective Coffee Mugs (Instanced Mesh rendering - 1 draw call) */}
            <DetectiveCoffeeMugSet mugs={COFFEE_MUG_DATA} />

            {/* Scattered Case Files & Evidence Pages */}
            <ScatteredPages
              position={[0.65, -0.89, 2.75]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, -0.7, 0]}
            />
            <ScatteredPages
              position={[2.0, -0.59, -5.1]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 0.5, 0]}
            />
            <ScatteredPages
              position={[-4.0, 0.9, 5.2]}
              scale={[1.1, 1.1, 1.1]}
              rotation={[0, 0.25, 0]}
            />

            {/* Props */}
            <GrandfatherClock
              position={[-2, -0.6, 6.0]}
              scale={[1.8, 1.8, 1.8]}
              rotation={[0, -Math.PI / 1, 0]}
            />

            <RetroDeskFan
              position={[-4.5, 0.9, 5.8]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, Math.PI + Math.PI / 6, 0]}
            />

            <TableLamp 
              position={[-7.5, 0.9, 5.6]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 3*Math.PI / 4, 0]} 
            />

            <Globe
              position={[-6.9, 0.9, 5.4]}
              scale={[2, 2, 2]}
              rotation={[0, Math.PI, 0]}
            />

            <WaterDispenser
              position={[-8.1, -0.6, 2.5]}
              scale={[2, 2, 2]}
              rotation={[0, 0*Math.PI / 2, 0]}
              outlineColor="#00f5d4"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
            />

            <Fireplace
              position={[0, -0.6, 6.2]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, Math.PI / 1, 0]}
            />

            {/* Evidence Boxes Stacked & Spread */}
            {EVIDENCE_BOX_DATA.map((box, i) => (
              <EvidenceBox
                key={i}
                position={box.position}
                rotation={box.rotation}
                labelType={box.labelType}
                caseNumber={box.caseNumber}
              />
            ))}

            {/* Easter Eggs */}
            <Piano
              position={[7.9, -0.6, -5.0]}
              scale={[1.6, 1.6, 1.6]}
              rotation={[0, -Math.PI/2, 0]}
              outlineColor="#e3b341"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onDoubleClick={() => triggerEgg('piano')}
            />

            <Violin
              position={[-2.05, -0.6, -5.8]}
              scale={[2, 2, 2]}
              rotation={[-1*Math.PI/6, -Math.PI / 4, -Math.PI/6]}
              onDoubleClick={() => triggerEgg('violin')}
            />

            <TvRemote
              position={[-0.75, -0.01, 2.60]}
              scale={[1, 1, 1]}
              rotation={[0, Math.PI/6, 0]}
              isTvOn={Boolean(activeEgg)}
              isActive={Boolean(activeEgg)}
              isPaused={isTvPaused}
              onClick={() => {
                if (activeEgg) {
                  setIsTvPaused((prev) => !prev)
                }
              }}
            />

            <McNaughtFrame
              position={[0, 2.7, 6.44]}
              scale={[1, 1, 1]}
              rotation={[0, Math.PI, 0]}
            />

            <WindowAndTelescope
              position={[-8.4, 2.3, -4.44]}
              scale={[1, 1, 1]}
              rotation={[0, Math.PI/2, 0]}
            />
          </>
        )}
      </Suspense>


        </Canvas>
      </div>
    </HubV2ErrorBoundary>
  )
}
