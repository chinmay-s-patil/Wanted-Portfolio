import React, { useMemo, useRef, useState } from 'react'
import { useGLTF, useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEasterEgg } from './EasterEggContext'
import { nightMountainAttribution } from './easterEggsData'

const TELESCOPE_MODEL_PATH = '/hubModels/EasterEggs/Telescope/telescope/scene.gltf'
const SKY_IMAGE_PATH = '/manuel-will-gd3t5Dtbwkw-unsplash.jpg'

useGLTF.preload(TELESCOPE_MODEL_PATH)

/**
 * Telescope Model Sub-component
 */
function TelescopeModel({ position, rotation, scale = [0.85, 0.85, 0.85] }) {
  const { scene } = useGLTF(TELESCOPE_MODEL_PATH)

  const clonedScene = useMemo(() => {
    if (!scene) return null
    const cloned = scene.clone(true)
    cloned.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material = child.material.clone()
          child.material.side = THREE.DoubleSide
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace
          }
          child.material.needsUpdate = true
        }
      }
    })

    cloned.updateMatrixWorld(true)
    const box = new THREE.Box3()
    cloned.traverse((child) => {
      if (child.isMesh && child.visible) {
        box.expandByObject(child)
      }
    })

    const rawHeight = box.max.y - box.min.y
    const targetHeight = 2.7 // Doubled scale (~2.7m tall standing telescope)
    const normScale = rawHeight > 0 ? targetHeight / rawHeight : 1.0
    const centerX = (box.min.x + box.max.x) / 2
    const centerZ = (box.min.z + box.max.z) / 2

    cloned.scale.setScalar(normScale)
    cloned.position.x = -centerX * normScale
    cloned.position.z = -centerZ * normScale
    cloned.position.y = -box.min.y * normScale

    const wrapper = new THREE.Group()
    wrapper.add(cloned)
    return wrapper
  }, [scene])

  if (!clonedScene) return null

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

/**
 * WindowAndTelescope Component
 *
 * Displays the high-res starry night sky background image (/manuel-will-gd3t5Dtbwkw-unsplash.jpg)
 * fitted precisely behind the window glass, paired with a floor-standing Telescope pointing out.
 *
 * Interactions:
 * - Single Click: Opens astronomical inspection lightbox crediting photographer Manuel Will on Unsplash.
 * - Double Click: Secret Easter egg trigger — starts video playback on the TV screen & Mini Player.
 */
export default function WindowAndTelescope({
  position = [-3.8, 2.3, -6.44],
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) {
  const { triggerEgg } = useEasterEgg()
  const [showLightbox, setShowLightbox] = useState(false)
  const clickTimerRef = useRef(null)

  const skyTexture = useTexture(SKY_IMAGE_PATH)
  useMemo(() => {
    if (skyTexture) {
      skyTexture.colorSpace = THREE.SRGBColorSpace
      skyTexture.needsUpdate = true
    }
  }, [skyTexture])

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.detail === 1) {
      clickTimerRef.current = setTimeout(() => {
        setShowLightbox(true)
      }, 250)
    }
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
    }
    triggerEgg('nightMountain')
  }

  const handlePointerDown = (e) => {
    if (e.detail === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
      triggerEgg('nightMountain')
    }
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {/* ========================================== */}
      {/* 1. STYLIZED WINDOW FRAME & MOULDING        */}
      {/* ========================================== */}
      {/* Outer Dark Mahogany Frame */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.82, 2.22]} />
        <meshStandardMaterial color="#1a120b" roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Polished Brass Inner Trim */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[1.68, 2.08]} />
        <meshStandardMaterial color="#c69214" roughness={0.25} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* ========================================== */}
      {/* 2. UNSPLASH STARRY NIGHT SKY BACKGROUND    */}
      {/* ========================================== */}
      <mesh position={[0, 0, 0.007]}>
        <planeGeometry args={[1.6, 2.0]} />
        <meshBasicMaterial map={skyTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* ========================================== */}
      {/* 3. WINDOW PANES & SILL LEDGE               */}
      {/* ========================================== */}
      {/* Wooden Window Cross Grid Panes */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[0.05, 2.0]} />
        <meshStandardMaterial color="#2d1f15" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[1.6, 0.05]} />
        <meshStandardMaterial color="#2d1f15" roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Window Sill Ledge */}
      <mesh position={[0, -1.05, 0.06]}>
        <boxGeometry args={[1.9, 0.08, 0.16]} />
        <meshStandardMaterial color="#3a281c" roughness={0.4} />
      </mesh>
      {/* Brass Lip on Sill */}
      <mesh position={[0, -1.02, 0.14]}>
        <boxGeometry args={[1.92, 0.02, 0.02]} />
        <meshStandardMaterial color="#c69214" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glass Pane Specular Reflection Overlay */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.6, 2.0]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.06}
          transmission={0.9}
          color="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ========================================== */}
      {/* 4. FLOOR-STANDING TELESCOPE                */}
      {/* ========================================== */}
      <TelescopeModel
        position={[-0.8, -3.4, 0.8]}
        rotation={[0.0, Math.PI / 4, 0.0]}
        scale={[0.85, 0.85, 0.85]}
      />      {/* Single-Click Inspection Lightbox Overlay (Compact & Local) */}
      {showLightbox && (
        <Html distanceFactor={6} position={[0, 0, 0.3]} center style={{ pointerEvents: 'auto', zIndex: 100000 }}>
          <div
            style={{
              background: 'rgba(10, 14, 20, 0.96)',
              border: '1.5px solid #e3b341',
              borderRadius: '12px',
              padding: '14px',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.85), 0 0 20px rgba(227, 179, 65, 0.25)',
              width: '320px',
              maxWidth: '85vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Header / Close */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#e3b341', textTransform: 'uppercase' }}>
                🔭 OBSERVATORY EXHIBIT
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowLightbox(false)
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                ✕
              </button>
            </div>

            {/* Compact Photo Image */}
            <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(227, 179, 65, 0.3)', background: '#000' }}>
              <img
                src={SKY_IMAGE_PATH}
                alt={nightMountainAttribution.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Attribution & Gratitude Card */}
            <div
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '10px 12px',
                background: 'rgba(227, 179, 65, 0.08)',
                borderLeft: '3px solid #e3b341',
                borderRadius: '4px',
                color: '#e6edf3',
                fontSize: '12px',
                lineHeight: '1.4'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                {nightMountainAttribution.title}
              </div>
              <div style={{ color: '#c9d1d9', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                <span>Photo by</span>
                <a
                  href={nightMountainAttribution.creator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffea9f', fontWeight: '600', textDecoration: 'underline' }}
                >
                  {nightMountainAttribution.creator.name}
                </a>
                <span>on Unsplash</span>
              </div>
              <div style={{ color: '#8b949e', fontSize: '10px', marginTop: '3px' }}>
                License: {nightMountainAttribution.license}
              </div>
            </div>

            {/* Footer Links & Hint */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '10px' }}>
              <span style={{ color: '#8b949e' }}>💡 Double-click to play video</span>
              <a
                href={nightMountainAttribution.source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#58a6ff', textDecoration: 'none' }}
              >
                Unsplash ↗
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
