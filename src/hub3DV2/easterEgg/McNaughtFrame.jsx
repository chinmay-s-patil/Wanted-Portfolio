import React, { useState, useRef, useMemo } from 'react'
import { useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useEasterEgg } from './EasterEggContext'
import { mcnaughtAttribution } from './easterEggsData'

const IMAGE_PATH = '/mc_naught55.jpg'

/**
 * McNaughtFrame Component
 *
 * Flat front-facing photo frame mounted on the front wall.
 * Zero back-depth to eliminate wall mesh clipping, and zero outline highlight.
 *
 * Interactions:
 * - Single Click: Opens inspection lightbox with photo and full attribution details:
 *     Comet C/2006 P1 (McNaught)
 *     Paranal Observatory, January 2007
 *     S. Deiries / ESO
 * - Double Click: Secret Easter Egg trigger — starts video playback on the TV screen & Mini Player.
 */
export default function McNaughtFrame({
  position = [2.2, 2.1, -6.44],
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}) {
  const { triggerEgg } = useEasterEgg()
  const [showLightbox, setShowLightbox] = useState(false)
  const clickTimerRef = useRef(null)

  const texture = useTexture(IMAGE_PATH)
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.needsUpdate = true
    }
  }, [texture])

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
    triggerEgg('mcnaught')
  }

  const handlePointerDown = (e) => {
    if (e.detail === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
      triggerEgg('mcnaught')
    }
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* 1. Outer Dark Mahogany Wooden Frame (Flat plane, flush to wall surface, zero back clipping) */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshStandardMaterial color="#1a120c" roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. Inner Brass Trim Bezel */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[1.42, 1.02]} />
        <meshStandardMaterial color="#b38f38" roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* 3. Paper Matting Border */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[1.36, 0.96]} />
        <meshStandardMaterial color="#f2ebd9" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* 4. High-Res Comet McNaught Photo Mesh */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[1.28, 0.88]} />
        <meshStandardMaterial map={texture} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 5. Glass Reflection Overlay */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[1.28, 0.88]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.12}
          roughness={0.05}
          transmission={0.9}
          color="#ffffff"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Single-Click Inspection Lightbox Overlay */}
      {showLightbox && (
        <Html position={[0, 0, 0.5]} center style={{ pointerEvents: 'auto', zIndex: 100000 }}>
          <div
            style={{
              background: 'rgba(10, 14, 20, 0.96)',
              border: '1.5px solid #e3b341',
              borderRadius: '16px',
              padding: '24px',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(227, 179, 65, 0.3)',
              width: '520px',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Header / Close */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: '#e3b341', textTransform: 'uppercase' }}>
                📷 PRECINCT EVIDENCE ARCHIVE • EXHIBIT #55
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
                  borderRadius: '6px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                Close [×]
              </button>
            </div>

            {/* Photo Image */}
            <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(227, 179, 65, 0.4)', background: '#000' }}>
              <img
                src={IMAGE_PATH}
                alt="Comet C/2006 P1 (McNaught)"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            {/* Exact Requested Caption */}
            <div
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px 16px',
                background: 'rgba(227, 179, 65, 0.08)',
                borderLeft: '3px solid #e3b341',
                borderRadius: '4px',
                color: '#e6edf3',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>
                Comet C/2006 P1 (McNaught)
              </div>
              <div style={{ color: '#c9d1d9', marginTop: '2px' }}>
                Paranal Observatory, January 2007
              </div>
              <div style={{ color: '#8b949e', fontSize: '13px', marginTop: '2px' }}>
                S. Deiries / ESO
              </div>
            </div>

            {/* Hint / Attribution Link */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '12px' }}>
              <span style={{ color: '#8b949e' }}>💡 Double-click the frame to reveal hidden media</span>
              <a
                href={mcnaughtAttribution.source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#58a6ff', textDecoration: 'none' }}
              >
                ESO Image Record ↗
              </a>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
