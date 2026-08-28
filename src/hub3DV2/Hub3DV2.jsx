'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Sofa, CenterTable, Newspaper, Binder, TvTable, Lockers, Terminal, FilingCabinet, OfficeAssets, RetroRoom, RetroFloorLamp, WASDFreecam, PrinterTable, Payphone, HubHelpGuideModal, OldCamera, FilmRollPile, RadarTablet, PrecinctDoor, WallKeychains, GrandfatherClock, AmbientDustParticles, PrecinctWallClock, DetectiveCoffeeMug, RetroDeskFan, TableLamp, ScatteredPages, Globe, WaterDispenser } from './components'
import { Piano, Violin, TvRemote, McNaughtFrame, useEasterEgg } from './easterEgg'



function LoadingSpinner() {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 2
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#00ffff" wireframe emissive="#00ffff" emissiveIntensity={0.8} />
    </mesh>
  )
}

class HubV2ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Hub3DV2 render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#ff5555', padding: '2rem', background: '#0d1117', height: '100vh', fontFamily: 'monospace' }}>
          <h2>Hub3DV2 Loading Error</h2>
          <pre>{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#21262d', color: '#fff', border: '1px solid #30363d', cursor: 'pointer' }}>
            Reload Scene
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Hub3DV2() {
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [highlightAll, setHighlightAll] = useState(false)
  const [showHintBanner, setShowHintBanner] = useState(true)
  const [cameraHovered, setCameraHovered] = useState(false)
  const [doorKeychainsHovered, setDoorKeychainsHovered] = useState(false)
  const { activeEgg, setActiveEgg, isTvPaused, setIsTvPaused, triggerEgg } = useEasterEgg()
  const controlsRef = useRef()


  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHintBanner(false)
    }, 10000)
    return () => clearTimeout(timer)
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
        `}</style>

        {/* Floating HTML UI Overlay */}
        <div className="hub-v2-ui">
          <div className="hub-v2-nav-bar">
            <button className="hub-v2-btn" onClick={() => navigate('/')}>
              ← Back to Landing
            </button>
            <button className="hub-v2-btn" onClick={() => navigate('/hub')}>
              ← Procedural Hub3D (V1)
            </button>
          </div>

          <div className="hub-v2-top-right-bar">
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

          <div className="hub-v2-subtitle-badge">🕵️ Gritty Retro Precinct Lounge • 🎮 WASD / Space / Shift Freecam</div>
          <div className="hub-v2-title-badge">3D Hub V2 — Custom Retro Scene</div>
        </div>

        {/* Portfolio Directory Help Modal Overlay */}
        <HubHelpGuideModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />



        {/* Three.js Canvas with High Performance & Moody Retro Lighting */}
        <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <PerspectiveCamera makeDefault position={[0, 0.7, -3.2]} fov={50} />
          <OrbitControls
            ref={controlsRef}
            target={[0, -0.2, 1.2]}
            maxPolarAngle={Math.PI / 2.02}
            minDistance={0.5}
            maxDistance={25}
            enableDamping
            dampingFactor={0.08}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN
            }}
          />
          <WASDFreecam controlsRef={controlsRef} moveSpeed={5.0} />

          {/* Gritty Retro Precinct Ambient & Directional Scene Lighting */}
          <ambientLight intensity={0.45} color="#ffdfb3" />

          {/* Main Key Light */}
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.8}
            color="#ff9d42"
          />

          {/* Copper Rim Light */}
          <directionalLight
            position={[-5, 4, -4]}
            intensity={0.8}
            color="#ff7733"
          />

          {/* Focused Overhead Lounge Spotlight */}
          <spotLight
            position={[0, 4.5, 1.2]}
            angle={0.65}
            penumbra={0.8}
            intensity={3.0}
            color="#ffe3b3"
          />

          {/* Retro Room Enclosure */}
          <RetroRoom />
          <RetroFloorLamp position={[2.6, -0.6, 0.5]} />

          {/* Render Modular 3D Components with React Suspense */}
          <Suspense fallback={<LoadingSpinner />}>
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
              position={[0, -0.6, 4.2]}
              scale={[0.3, 0.3, 0.3]}
              rotation={[0, Math.PI, 0]}
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
              position={[3.2, -0.6, 5.95]}
              scale={[3, 3, 2]}
              rotation={[0, 0, 0]}
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
            <GrandfatherClock
              position={[-2, -0.6, 6.0]}
              scale={[1.8, 1.8, 1.8]}
              rotation={[0, - Math.PI / 1, 0]}
            />

            {/* Ambient Atmosphere & Environmental Props */}
            <AmbientDustParticles count={70} bounds={[10, 5, 10]} />
            <DetectiveCoffeeMug position={[0.1, 0.08, 2.55]} scale={[1.2, 1.2, 1.2]} rotation={[0, 0.4, 0]} />

            {/* Props */}
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
              isActive={Boolean(activeEgg)}
              isPaused={isTvPaused}
              onClick={() => {
                if (activeEgg) {
                  setIsTvPaused((prev) => !prev)
                }
              }}
            />

            <McNaughtFrame
              position={[0, 2.1, 6.44]}
              scale={[1, 1, 1]}
              rotation={[0, Math.PI, 0]}
            />

            {/* Static Super Low-Poly Scattered Document Pages */}
            <ScatteredPages />
          </Suspense>


        </Canvas>
      </div>
    </HubV2ErrorBoundary>
  )
}
