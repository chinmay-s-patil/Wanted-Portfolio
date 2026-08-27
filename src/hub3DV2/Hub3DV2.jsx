'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Sofa, CenterTable, Newspaper, Binder, TvTable, Lockers, Terminal, FilingCabinet, OfficeAssets, RetroRoom, RetroFloorLamp, WASDFreecam, PrinterTable, Payphone, HubHelpGuideModal, OldCamera, FilmRollPile, RadarTablet, TicketBooth, AmbientDustParticles, PrecinctWallClock, DetectiveCoffeeMug, RetroDeskFan, TableLamp } from './components'

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
            border: 1px solid #30363d;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            backdrop-filter: blur(8px);
            transition: all 0.2s ease;
          }

          .hub-v2-btn:hover {
            background: #21262d;
            color: #58a6ff;
            border-color: #58a6ff;
            transform: translateY(-1px);
          }

          .hub-v2-action-btn {
            background: rgba(22, 27, 34, 0.9);
            color: #ffea9f;
            border: 1px solid #c59b27;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.88rem;
            cursor: pointer;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.4rem;
          }

          .hub-v2-action-btn:hover {
            background: #c59b27;
            color: #120e0b;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(197, 155, 39, 0.3);
          }

          .hub-v2-action-btn.active {
            background: #00ff66;
            color: #0d1117;
            border-color: #00ff66;
            box-shadow: 0 0 15px rgba(0, 255, 102, 0.5);
          }

          .hub-v2-hint-banner-wrap {
            position: absolute;
            top: 4.5rem;
            right: 10.5rem;
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            pointer-events: none;
            z-index: 25;
            animation: fadeIn 0.3s ease-out;
          }

          .hub-v2-hint-box {
            background: rgba(20, 16, 12, 0.95);
            border: 2px solid #ffea9f;
            border-radius: 8px;
            padding: 8px 14px;
            color: #ffea9f;
            font-family: monospace, sans-serif;
            font-size: 0.85rem;
            font-weight: bold;
            box-shadow: 0 0 18px rgba(255, 234, 159, 0.4);
            pointer-events: auto;
            cursor: pointer;
            user-select: none;
            transition: transform 0.2s ease;
          }

          .hub-v2-hint-box:hover {
            transform: scale(1.05);
          }

          .hub-v2-loopy-arrow-svg {
            width: 110px;
            height: 55px;
            margin-bottom: -4px;
          }

          .hub-v2-title-badge {
            position: absolute;
            bottom: 2rem;
            right: 2rem;
            color: #8b949e;
            font-size: 0.85rem;
            pointer-events: none;
          }

          .hub-v2-subtitle-badge {
            position: absolute;
            bottom: 2rem;
            left: 2rem;
            color: #ff9e3b;
            font-size: 0.88rem;
            font-weight: 600;
            background: rgba(22, 27, 34, 0.85);
            border: 1px solid #30363d;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            backdrop-filter: blur(8px);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* UI Overlay */}
        <div className="hub-v2-ui">
          <div className="hub-v2-nav-bar">
            <button className="hub-v2-btn" onClick={() => navigate('/')}>
              ← Back to Landing
            </button>
            <button className="hub-v2-btn" onClick={() => navigate('/hub3D')}>
              ← Procedural Hub3D (V1)
            </button>
          </div>

          {/* Top Right Action Button Bar */}
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

          {/* Auto-Disappearing 10-Second Hint Banner with Hand-Drawn Wavy Arrow */}
          {showHintBanner && (
            <div className="hub-v2-hint-banner-wrap">
              <div className="hub-v2-hint-box" onClick={() => setShowHelpModal(true)}>
                Need help? Click this!
              </div>
              <svg className="hub-v2-loopy-arrow-svg" viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 90 62 C 55 62, 25 50, 40 32 C 55 14, 80 25, 70 42 C 60 58, 22 45, 30 16"
                  stroke="#ffea9f"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 18 26 L 30 8 L 44 22 Z"
                  fill="#ffea9f"
                  stroke="#ffea9f"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          <div className="hub-v2-subtitle-badge">🕵️ Gritty Retro Precinct Lounge • 🎮 WASD / Space / Shift Freecam</div>
          <div className="hub-v2-title-badge">3D Hub V2 — Custom Retro Scene</div>
        </div>

        {/* Portfolio Investigation Directory Help Modal Overlay */}
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
          <ambientLight intensity={0.38} color="#ffdfb3" />

          {/* Main Key Light */}
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.6}
            color="#ff9d42"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={25}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-bias={-0.0001}
          />

          {/* Copper Rim Light */}
          <directionalLight
            position={[-5, 4, -4]}
            intensity={0.7}
            color="#ff7733"
          />

          {/* Focused Overhead Lounge Spotlight */}
          <spotLight
            position={[0, 4.5, 1.2]}
            angle={0.65}
            penumbra={0.8}
            intensity={2.8}
            color="#ffe3b3"
            castShadow
            shadow-bias={-0.0001}
          />

          {/* Retro Room Enclosure */}
          <RetroRoom />
          <RetroFloorLamp position={[2.6, -0.6, 0.5]} />

          {/* Floor Shadow */}
          <ContactShadows position={[0, -0.59, 0.7]} opacity={0.7} scale={9} blur={1.5} far={3} color="#000000" />

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
            />
            <Newspaper
              position={[0.42, 0.08, 2.25]}
              scale={[0.045, 0.045, 0.045]}
              rotation={[0, 2.95, 0]}
              outlineColor="#38ef7d"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/newspaper')}
            />
            <Binder
              position={[-0.42, 0.08, 2.25]}
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
              position={[0, -0.6, -5.]}
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
              onClick={() => navigate('/solvers')}
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
              onClick={() => navigate('/contact')}
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
            <TicketBooth
              position={[-7.4, -0.6, -4.2]}
              scale={[2, 2, 2]}
              rotation={[0, Math.PI / 2, 0]}
              outlineColor="#ff3366"
              outlineThickness={0.008}
              alwaysShowOutline={highlightAll}
              onClick={() => navigate('/openfoam')}
            />

            {/* Ambient Atmosphere & Environmental Props */}
            <AmbientDustParticles count={70} bounds={[10, 5, 10]} />
            <DetectiveCoffeeMug position={[0.1, 0.08, 2.55]} scale={[1.2, 1.2, 1.2]} rotation={[0, 0.4, 0]} />

            {/* Retro Office Precinct Desk Props on 3D Printer Table */}
            <RetroDeskFan
              position={[-4.5, 0.9, 5.8]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, Math.PI + Math.PI / 6, 0]}
            />

            <TableLamp 
              position={[-7.3, 0.9, 5.2]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, 3*Math.PI / 4, 0]} 
            />
          </Suspense>
        </Canvas>
      </div>
    </HubV2ErrorBoundary>
  )
}
