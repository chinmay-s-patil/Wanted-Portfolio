'use client'

import React, { useState, useCallback, Suspense, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import OfficeEnvironment from './OfficeEnvironment'
import CaseNotes from './CaseNotes'

const CenterScene = React.lazy(() => import('./components/CenterScene'))
const LeftScene = React.lazy(() => import('./components/LeftScene'))
const RightScene = React.lazy(() => import('./components/RightScene'))
const BackScene = React.lazy(() => import('./components/BackScene'))

const CAMERA_CONFIG = {
  0:   { position: new THREE.Vector3(0, 2.0, 2.5), target: new THREE.Vector3(0, 0.6, 0) },
  90:  { position: new THREE.Vector3(-2.5, 2.0, 0), target: new THREE.Vector3(0, 0.6, 0) },
  180: { position: new THREE.Vector3(0, 2.0, -2.5), target: new THREE.Vector3(0, 0.6, 0) },
  270: { position: new THREE.Vector3(2.5, 2.0, 0), target: new THREE.Vector3(0, 0.6, 0) },
}

function CameraController({ cameraAngle }) {
  const { camera } = useThree()
  const currentPos = useRef(new THREE.Vector3().copy(CAMERA_CONFIG[0].position))
  const currentTarget = useRef(new THREE.Vector3().copy(CAMERA_CONFIG[0].target))
  const targetPos = useRef(new THREE.Vector3().copy(CAMERA_CONFIG[0].position))
  const targetLook = useRef(new THREE.Vector3().copy(CAMERA_CONFIG[0].target))

  useEffect(() => {
    const config = CAMERA_CONFIG[cameraAngle] || CAMERA_CONFIG[0]
    targetPos.current.copy(config.position)
    targetLook.current.copy(config.target)
  }, [cameraAngle])

  useFrame((_, delta) => {
    const lerpFactor = Math.min(delta * 3, 1)
    currentPos.current.lerp(targetPos.current, lerpFactor)
    currentTarget.current.lerp(targetLook.current, lerpFactor)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)
    camera.updateProjectionMatrix()
  })

  return null
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='#8b7355' wireframe />
    </mesh>
  )
}

export default function Hub3D() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [caseNotesOpen, setCaseNotesOpen] = useState(false)
  const [cameraAngle, setCameraAngle] = useState(0)
  const navigate = useNavigate()

  const handleNavigate = useCallback((path) => {
    navigate(path)
  }, [navigate])

  const handleHoverItem = useCallback((id) => {
    setHoveredItem(id)
  }, [])

  const handleUnhoverItem = useCallback((id) => {
    setHoveredItem((prev) => (prev === id ? null : prev))
  }, [])

  const rotateLeft = () => {
    setCameraAngle((prev) => (prev + 90) % 360)
  }

  const rotateRight = () => {
    setCameraAngle((prev) => (prev - 90 + 360) % 360)
  }

  const viewLabels = {
    0: 'Front',
    90: 'Left',
    180: 'Back',
    270: 'Right',
  }

  const sceneProps = {
    onNavigate: handleNavigate,
    hoveredItem,
    onHoverItem: handleHoverItem,
    onUnhoverItem: handleUnhoverItem,
  }

  return (
    <div
      className='hub-3d-container'
      onMouseLeave={() => {
        setHoveredItem(null)
        document.body.style.cursor = 'auto'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .hub-3d-container {
          width: 100vw;
          height: 100vh;
          background: #0f0d0a;
          position: relative;
          overflow: hidden;
        }

        .hub-3d-ui {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
        }

        .hub-3d-ui > * {
          pointer-events: auto;
        }

        .hub-back-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: rgba(196, 165, 116, 0.2);
          border: 2px solid #8b7355;
          color: #f6efe2;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'Special Elite', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .hub-back-btn:hover {
          background: rgba(196, 165, 116, 0.3);
          border-color: #c4a574;
          transform: translateX(-4px);
        }

        .hub-case-notes-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(196, 165, 116, 0.2);
          border: 2px solid #8b7355;
          color: #f6efe2;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'Special Elite', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .hub-case-notes-btn:hover {
          background: rgba(196, 165, 116, 0.3);
          border-color: #c4a574;
          transform: translateY(-2px);
        }

        .hub-tooltip {
          position: absolute;
          bottom: 6rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(26, 20, 16, 0.9);
          border: 2px solid #8b7355;
          color: #f6efe2;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'Special Elite', monospace;
          font-size: 1rem;
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          white-space: nowrap;
        }

        .hub-tooltip.visible {
          opacity: 1;
        }

        .hub-title-overlay {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          color: rgba(246, 239, 226, 0.3);
          font-family: 'Special Elite', monospace;
          font-size: 0.9rem;
          pointer-events: none;
        }

        .hub-view-label {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(196, 165, 116, 0.5);
          font-family: 'Special Elite', monospace;
          font-size: 0.85rem;
          pointer-events: none;
          letter-spacing: 1px;
        }

        .hub-rotate-controls {
          position: absolute;
          bottom: 3.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .hub-rotate-btn {
          background: rgba(196, 165, 116, 0.15);
          border: 2px solid #8b7355;
          color: #f6efe2;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-family: 'Special Elite', monospace;
          font-size: 1.4rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .hub-rotate-btn:hover {
          background: rgba(196, 165, 116, 0.3);
          border-color: #c4a574;
          transform: scale(1.1);
        }

        .hub-rotate-btn:active {
          transform: scale(0.95);
        }

        .hub-rotate-hint {
          color: rgba(196, 165, 116, 0.4);
          font-family: 'Special Elite', monospace;
          font-size: 0.75rem;
          text-align: center;
          margin-top: 0.5rem;
          pointer-events: none;
        }
      `}</style>

      <div className='hub-3d-ui'>
        <button className='hub-back-btn' onClick={() => navigate('/')}>
          ← Back to Landing
        </button>
        <button className='hub-case-notes-btn' onClick={() => setCaseNotesOpen(true)}>
          📋 Case Notes
        </button>
        <div className={`hub-tooltip ${hoveredItem ? 'visible' : ''}`}>
          {hoveredItem ? `Investigate: ${hoveredItem}` : ''}
        </div>
        <div className='hub-title-overlay'>Detective Office — Click objects to explore</div>
        <div className='hub-view-label'>{viewLabels[cameraAngle]}</div>
        <div className='hub-rotate-controls'>
          <button
            className='hub-rotate-btn'
            onClick={rotateLeft}
            title='Rotate Left'
          >
            ◀
          </button>
          <button
            className='hub-rotate-btn'
            onClick={rotateRight}
            title='Rotate Right'
          >
            ▶
          </button>
        </div>
        <div className='hub-rotate-hint'>Turn your head</div>
      </div>

      <CaseNotes
        isOpen={caseNotesOpen}
        onClose={() => setCaseNotesOpen(false)}
        onNavigate={handleNavigate}
      />

      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0f0d0a')
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 2.0, 2.5]} fov={50} />
        <CameraController cameraAngle={cameraAngle} />
        <Suspense fallback={<LoadingFallback />}>
          <OfficeEnvironment />
          {cameraAngle === 0 && <CenterScene {...sceneProps} />}
          {cameraAngle === 90 && <LeftScene />}
          {cameraAngle === 180 && <BackScene />}
          {cameraAngle === 270 && <RightScene />}
        </Suspense>
      </Canvas>
    </div>
  )
}