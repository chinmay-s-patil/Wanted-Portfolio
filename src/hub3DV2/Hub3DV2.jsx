'use client'

import React, { useState, Suspense, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Sofa, CenterTable, Newspaper, Binder, TvTable, Lockers, Terminal, FilingCabinet, OfficeAssets, RetroRoom, RetroFloorLamp, WASDFreecam, PrinterTable } from './components'

function LoadingSpinner() {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 2
    }
  })

  return (
    <group position={[0, 0.2, 0]}>
      <mesh ref={meshRef}>
        <torusGeometry args={[0.5, 0.08, 16, 32]} />
        <meshStandardMaterial color='#ff9e3b' wireframe />
      </mesh>
    </group>
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
    console.error("Hub3DV2 Render Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: '#ff6666', padding: '2rem', background: '#0d1117', fontFamily: 'monospace' }}>
          <h2>Hub3DV2 Loading Error</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default function Hub3DV2() {
  const controlsRef = useRef()
  const navigate = useNavigate()

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
            gap: 0.8rem;
          }

          .hub-v2-btn {
            background: rgba(22, 27, 34, 0.85);
            border: 1px solid #30363d;
            color: #f0f6fc;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          }

          .hub-v2-btn:hover {
            background: #21262d;
            border-color: #58a6ff;
            color: #58a6ff;
            transform: translateY(-2px);
          }

          /* Newspaper Silhouette Color Picker Control */
          .hub-v2-outline-picker {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(22, 27, 34, 0.9);
            border: 1px solid #30363d;
            padding: 0.6rem 1.2rem;
            border-radius: 30px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          }

          .hub-v2-picker-label {
            color: #8b949e;
            font-size: 0.85rem;
            font-weight: 600;
          }

          .hub-v2-color-dot {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: 2px solid transparent;
            cursor: pointer;
            transition: transform 0.2s ease, border-color 0.2s ease;
          }

          .hub-v2-color-dot:hover, .hub-v2-color-dot.active {
            transform: scale(1.25);
            border-color: #ffffff;
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

          <div className="hub-v2-subtitle-badge">🕵️ Gritty Retro Precinct Lounge • 🎮 WASD / Space / Shift Freecam</div>
          <div className="hub-v2-title-badge">3D Hub V2 — Custom Retro Scene</div>
        </div>

        {/* Three.js Canvas with Bright & Moody Retro Lighting */}
        <Canvas gl={{ antialias: true, shadowMapEnabled: true }}>
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
          <ambientLight intensity={0.38} color='#ffdfb3' />

          {/* Main Key Light */}
          <directionalLight
            position={[5, 7, 4]}
            intensity={1.6}
            color='#ff9d42'
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Moody Warm Rim Light */}
          <directionalLight
            position={[-5, 5, -4]}
            intensity={0.6}
            color='#ff7733'
          />

          {/* Front Spot Light highlighting Furniture */}
          <spotLight
            position={[0, 4.2, 1.2]}
            intensity={2.2}
            angle={0.7}
            penumbra={0.9}
            color='#ffe3b3'
            castShadow
          />

          {/* Mild Retro Atmospheric Fog */}
          <fog attach="fog" args={['#0d1117', 8, 25]} />

          {/* Modular Room Geometry & Lamp Fixture */}
          <RetroRoom />
          <RetroFloorLamp position={[2.6, -0.6, 0.5]} />

          {/* Floor Shadow */}
          <ContactShadows position={[0, -0.59, 0.7]} opacity={0.7} scale={9} blur={1.5} far={3} color='#000000' />

          {/* Render Modular 3D Components with React Suspense */}
          <Suspense fallback={<LoadingSpinner />}>
            <Sofa
              position={[0, -0.6, 0]}
              scale={[2, 2, 2]}
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
              outlineColor="#00ffff"
              outlineThickness={0.008}
              onClick={() => navigate('/newspaper')}
            />
            <Binder
              position={[-0.42, 0.08, 2.25]}
              scale={[2.5, 2.5, 2.5]}
              rotation={[0, 0.2, 0]}
              outlineColor="#ffea00"
              outlineThickness={0.008}
              onClick={() => navigate('/professionaldiary')}
            />
            <Lockers
              position={[6.5, -0.6, 5.75]}
              scale={[1.2, 1.2, 1.2]}
              rotation={[0, -Math.PI / 2, 0]}
              outlineColor="#00ff66"
              outlineThickness={0.008}
              onClick={() => navigate('/education')}
            />
            <Terminal
              position={[8.05, -0.93, 1.5]}
              scale={[0.55, 0.55, 0.55]}
              rotation={[0, -Math.PI / 2, 0]}
              outlineColor="#00ff66"
              outlineThickness={0.008}
              onClick={() => navigate('/solvers')}
            />
            <FilingCabinet
              position={[5.95, -0.6, 5.75]}
              scale={[3, 3, 3]}
              rotation={[0, 0, 0]}
              outlineColor="#00ffff"
              outlineThickness={0.008}
              onClick={() => navigate('/projects')}
            />
            <OfficeAssets
              position={[0, -0.6, -5.]}
              scale={[1.5, 1.5, 1.5]}
              rotation={[0, -Math.PI / 2, 0]}
              onClick={() => navigate('/visualization')}
            />
            <PrinterTable
              position={[-5.9, -0.6, 5.0]}
              scale={[2, 2, 2]}
              rotation={[0, -Math.PI, 0]}
              onClick={() => navigate('/cad')}
            />
          </Suspense>
        </Canvas>
      </div>
    </HubV2ErrorBoundary>
  )
}
