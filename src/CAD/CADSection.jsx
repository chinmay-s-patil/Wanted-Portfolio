// src/CAD/CADSection.jsx
'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CADGLTFList from './CADGLTFList'

export default function CADSection() {
  const [selectedCartridge, setSelectedCartridge] = useState(null)
  const navigate = useNavigate()
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isTransparent, setIsTransparent] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const ITEMS_PER_PAGE = 6
  
  const ctrlRef = useRef({
    viewState: { x: 0, y: 0, z: 0, perp: 0 }
  })

  // Prevent body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleCartridgeClick = useCallback((project) => {
    setSelectedCartridge(project)
    setModelRotation(project.modelRotation || { x: 0, y: 0, z: 0 })
    setIsTransparent(project.transparency > 0)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedCartridge(null)
    setCurrentPage(0)
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(CADGLTFList.length / ITEMS_PER_PAGE)
  const currentProjects = CADGLTFList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  // Control button handlers
  const resetView = useCallback(() => {
    if (!selectedCartridge) return
    const originalRotation = selectedCartridge.modelRotation || { x: 0, y: 0, z: 0 }
    setModelRotation(originalRotation)
    ctrlRef.current.viewState = { x: 0, y: 0, z: 0, perp: 0 }
    window.dispatchEvent(new CustomEvent('resetView'))
  }, [selectedCartridge])

  const toggleTransparency = useCallback(() => {
    setIsTransparent(prev => !prev)
    window.dispatchEvent(new CustomEvent('toggleTransparency'))
  }, [])

  const setViewX = useCallback(() => {
    ctrlRef.current.viewState = { x: 1, y: 0, z: 0, perp: 0 }
    window.dispatchEvent(new CustomEvent('setViewX'))
  }, [])

  const setViewY = useCallback(() => {
    ctrlRef.current.viewState = { x: 0, y: 1, z: 0, perp: 0 }
    window.dispatchEvent(new CustomEvent('setViewY'))
  }, [])

  const setViewZ = useCallback(() => {
    ctrlRef.current.viewState = { x: 0, y: 0, z: 1, perp: 0 }
    window.dispatchEvent(new CustomEvent('setViewZ'))
  }, [])

  const setViewPerpendicular = useCallback(() => {
    window.dispatchEvent(new CustomEvent('setViewPerpendicular'))
  }, [])

  const rotateModelX = useCallback(() => {
    setModelRotation(prev => ({ ...prev, x: prev.x + Math.PI / 2 }))
    window.dispatchEvent(new CustomEvent('rotateModelX'))
  }, [])

  const rotateModelY = useCallback(() => {
    setModelRotation(prev => ({ ...prev, y: prev.y + Math.PI / 2 }))
    window.dispatchEvent(new CustomEvent('rotateModelY'))
  }, [])

  const rotateModelZ = useCallback(() => {
    setModelRotation(prev => ({ ...prev, z: prev.z + Math.PI / 2 }))
    window.dispatchEvent(new CustomEvent('rotateModelZ'))
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      fontFamily: "'Special Elite', monospace",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes powerOn {
          0% { opacity: 0; transform: scaleY(0.01) scaleX(0.8); }
          50% { opacity: 1; transform: scaleY(0.8) scaleX(0.9); }
          100% { opacity: 1; transform: scaleY(1) scaleX(1); }
        }
        
        .crt-bezel {
          animation: powerOn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cassette {
          transition: all 0.3s ease;
        }
        
        .cassette:hover {
          transform: translateX(-8px);
          box-shadow: -4px 4px 12px rgba(0,255,0,0.3);
        }

        .cassette-rack::-webkit-scrollbar {
          width: 8px;
        }

        .cassette-rack::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
        }

        .cassette-rack::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }

        .control-button {
          transition: all 0.2s ease;
        }

        .control-button:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .control-button:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(40, 40, 40, 0.9)',
          border: '2px solid #666',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Special Elite', monospace",
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ← BACK
      </button>

      {/* Main Container - FIXED POSITION */}
      <div style={{
        display: 'flex',
        gap: '3rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '2400px',
        transform: 'scale(0.75)',
        transformOrigin: 'center',
        position: 'relative'
      }}>
        
        {/* Left Side - Details Panel (only shown when cartridge selected) */}
        {selectedCartridge && (
          <div style={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            {/* Project Info Card */}
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(0,255,0,0.2)',
              padding: '1.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
            }}>
              <div style={{
                fontSize: '12px',
                color: selectedCartridge.color,
                fontWeight: '600',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {selectedCartridge.category}
              </div>
              
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '16px'
              }}>
                {selectedCartridge.title}
              </h3>
              
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '20px'
              }}>
                {selectedCartridge.description}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '8px'
                }}>
                  YEAR
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#fff',
                  fontWeight: '600'
                }}>
                  {selectedCartridge.year}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '8px'
                }}>
                  MODEL ROTATION (deg)
                </div>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  gap: '12px'
                }}>
                  <span>X: {Math.round(modelRotation.x * 180 / Math.PI)}°</span>
                  <span>Y: {Math.round(modelRotation.y * 180 / Math.PI)}°</span>
                  <span>Z: {Math.round(modelRotation.z * 180 / Math.PI)}°</span>
                </div>
              </div>
            </div>

            {/* Instructions Card */}
            <div style={{
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid rgba(0,255,0,0.1)',
              padding: '1.2rem',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: '#00ff00' }}>
                CONTROLS
              </div>
              <div style={{ lineHeight: '1.8' }}>
                <div><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem' }}>Drag</kbd> to rotate</div>
                <div><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem' }}>Scroll</kbd> to zoom</div>
                <div><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem' }}>Right-click</kbd> to pan</div>
              </div>
            </div>
          </div>
        )}

        {/* Center - CRT TV + Header - ALWAYS IN SAME POSITION */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          width: '1100px',
          maxWidth: '72vw'
        }}>
          {/* Header - only show when no cartridge selected */}
          {!selectedCartridge && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.9rem',
                color: '#00ff00',
                fontWeight: '600',
                letterSpacing: '0.2em',
                marginBottom: '0.5rem',
                textShadow: '0 0 10px #00ff00'
              }}>
                3D DESIGN ARCHIVE
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#fff',
                marginBottom: '0.5rem',
                textShadow: '0 0 20px rgba(255,255,255,0.5)'
              }}>
                CAD PROJECT VIEWER
              </h1>
              <p style={{
                fontSize: '18px',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.68)',
                maxWidth: '900px'
              }}>
                ACADEMIC CREDENTIALS & INSTITUTIONAL MILESTONES
              </p>
            </div>
          )}

          {/* CRT TV with embedded viewer */}
          <div className="crt-bezel" style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            borderRadius: '24px',
            padding: '3.5rem',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.5)',
            border: '8px solid #333'
          }}>
            {/* Power LED */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '2rem',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: selectedCartridge ? '#00ff00' : '#ff0000',
              boxShadow: selectedCartridge 
                ? '0 0 20px #00ff00, inset 0 0 10px #00ff00'
                : '0 0 20px #ff0000, inset 0 0 10px #ff0000',
              transition: 'all 0.3s ease'
            }} />

            {/* Brand Label */}
            <div style={{
              position: 'absolute',
              bottom: '1.2rem',
              left: '0.5rem',
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#666',
              letterSpacing: '0.3em'
            }}>
              CAD-TRON
            </div>

            {/* Screen */}
            <div style={{
              width: '100%',
              height: '100%',
              background: '#000',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
            }}>
              {/* Scanlines */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 2px, transparent 4px)',
                pointerEvents: 'none',
                zIndex: 10
              }} />

              {/* CRT Curvature Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none',
                zIndex: 9
              }} />

              {/* Content */}
              {!selectedCartridge ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '1rem',
                  color: '#00ff00',
                  fontFamily: "'Courier New', monospace"
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    textShadow: '0 0 10px #00ff00',
                    animation: 'pulse 2s infinite'
                  }}>
                    ▶
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    lineHeight: '1.8'
                  }}>
                    INSERT CASSETTE<br/>
                    TO BEGIN
                  </div>
                </div>
              ) : (
                <TVModelViewer project={selectedCartridge} />
              )}
            </div>
          </div>

          {/* Instructions - only when no cartridge */}
          {!selectedCartridge && (
            <div style={{
              fontSize: '0.8rem',
              color: '#666',
              textAlign: 'center',
              fontFamily: "'Courier New', monospace",
              letterSpacing: '0.1em'
            }}>
              ◄ SELECT CASSETTE ► LOAD MODEL ► EXPLORE 3D ►
            </div>
          )}
        </div>

        {/* Right Side - Control Buttons OR Cassette Rack */}
        {selectedCartridge ? (
          <div style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            {/* Control Panel Title */}
            <div style={{
              fontSize: '0.9rem',
              color: '#00ff00',
              fontWeight: '700',
              letterSpacing: '0.15em',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>
              CONTROL PANEL
            </div>

            {/* View Controls */}
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(0,255,0,0.2)',
              padding: '1rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '0.75rem',
                letterSpacing: '0.1em'
              }}>
                VIEW AXES
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                <button onClick={setViewX} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(255,100,100,0.2)',
                  border: '2px solid rgba(255,100,100,0.4)',
                  borderRadius: '8px',
                  color: '#ff6464',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  X
                </button>
                <button onClick={setViewY} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(100,255,100,0.2)',
                  border: '2px solid rgba(100,255,100,0.4)',
                  borderRadius: '8px',
                  color: '#64ff64',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  Y
                </button>
                <button onClick={setViewZ} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(100,100,255,0.2)',
                  border: '2px solid rgba(100,100,255,0.4)',
                  borderRadius: '8px',
                  color: '#6464ff',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  Z
                </button>
                <button onClick={setViewPerpendicular} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,100,0.2)',
                  border: '2px solid rgba(255,255,100,0.4)',
                  borderRadius: '8px',
                  color: '#ffff64',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  ⊥
                </button>
              </div>
            </div>

            {/* Rotation Controls */}
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(0,255,0,0.2)',
              padding: '1rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '0.75rem',
                letterSpacing: '0.1em'
              }}>
                ROTATE MODEL
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <button onClick={rotateModelX} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(255,100,100,0.15)',
                  border: '2px solid rgba(255,100,100,0.3)',
                  borderRadius: '8px',
                  color: '#ff6464',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <span>X-AXIS</span>
                  <span style={{ fontSize: '1rem' }}>↻</span>
                </button>
                <button onClick={rotateModelY} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(100,255,100,0.15)',
                  border: '2px solid rgba(100,255,100,0.3)',
                  borderRadius: '8px',
                  color: '#64ff64',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <span>Y-AXIS</span>
                  <span style={{ fontSize: '1rem' }}>↻</span>
                </button>
                <button onClick={rotateModelZ} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(100,100,255,0.15)',
                  border: '2px solid rgba(100,100,255,0.3)',
                  borderRadius: '8px',
                  color: '#6464ff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <span>Z-AXIS</span>
                  <span style={{ fontSize: '1rem' }}>↻</span>
                </button>
              </div>
            </div>

            {/* Utility Controls */}
            <div style={{
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '12px',
              border: '1px solid rgba(0,255,0,0.2)',
              padding: '1rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <button onClick={resetView} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12a9 9 0 109 9 9 9 0 00-9-9z" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  RESET VIEW
                </button>
                
                <button onClick={toggleTransparency} className="control-button" style={{
                  padding: '0.75rem',
                  background: isTransparent ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  border: `2px solid rgba(255,255,255,${isTransparent ? '0.3' : '0.2'})`,
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {isTransparent ? 'SOLID' : 'TRANSPARENT'}
                </button>

                <button onClick={handleClose} className="control-button" style={{
                  padding: '0.75rem',
                  background: 'rgba(255,100,100,0.2)',
                  border: '2px solid rgba(255,100,100,0.4)',
                  borderRadius: '8px',
                  color: '#ff6464',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  EJECT CASSETTE
                </button>
              </div>
            </div>
          </div>
        ) : (
          <CassetteRack 
            projects={currentProjects}
            selectedProject={selectedCartridge}
            onProjectClick={handleCartridgeClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        )}
      </div>
    </div>
  )
}

// Separate component for the 3D model viewer
function TVModelViewer({ project }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelGroupRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const ctrlRef = useRef({
    isRotating: false,
    lastX: 0,
    lastY: 0,
    spherical: null,
    target: null
  })

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => loadGLTFLoader()
        document.head.appendChild(script)
      } else {
        loadGLTFLoader()
      }
    }

    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.onload = () => setThreeReady(true)
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
      }
    }

    loadThreeJS()
  }, [])

  // Scene setup
  useEffect(() => {
    if (!threeReady || !containerRef.current) return

    const THREE = window.THREE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const d1 = new THREE.DirectionalLight(0xffffff, 1.5)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.8)
    d2.position.set(-5, -5, -5)
    scene.add(d2)

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)

    // Load model
    loadModel(project.gltfFile)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current?.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady])

  function loadModel(url) {
    const THREE = window.THREE
    setLoadingProgress(40)
    setIsLoading(true)

    if (!THREE.GLTFLoader) return

    const loader = new THREE.GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        setLoadingProgress(80)
        const model = gltf.scene
        
        if (project.modelRotation) {
          model.rotation.set(project.modelRotation.x, project.modelRotation.y, project.modelRotation.z)
        }

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 0.7 / maxDim
        model.scale.setScalar(scale)

        model.traverse((child) => {
          if (child.isMesh) {
            if (project.modelColor) {
              child.material.color = new THREE.Color(project.modelColor)
            }
            child.material.transparent = project.transparency > 0
            child.material.opacity = (project.transparency || 0) / 100
            child.material.needsUpdate = true
          }
        })

        sceneRef.current.add(model)
        modelGroupRef.current = model
        setIsLoading(false)
        setLoadingProgress(100)
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100
        setLoadingProgress(Math.min(progress, 95))
      },
      (error) => {
        console.error('Error loading model:', error)
        setIsLoading(false)
      }
    )
  }

  const updateCamera = () => {
    if (!cameraRef.current || !ctrlRef.current.spherical || !ctrlRef.current.target) return
    const { spherical, target } = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos)
    cameraRef.current.lookAt(target)
  }

  const handleMouseDown = (e) => {
    ctrlRef.current.isRotating = true
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseMove = (e) => {
    if (!ctrlRef.current.isRotating) return
    const dx = e.clientX - ctrlRef.current.lastX
    const dy = e.clientY - ctrlRef.current.lastY
    ctrlRef.current.spherical.theta -= dx * 0.01
    ctrlRef.current.spherical.phi += dy * 0.01
    ctrlRef.current.spherical.phi = window.THREE.MathUtils.clamp(
      ctrlRef.current.spherical.phi,
      0.1,
      Math.PI - 0.1
    )
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseUp = () => {
    ctrlRef.current.isRotating = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    ctrlRef.current.spherical.radius = Math.max(
      1,
      Math.min(20, ctrlRef.current.spherical.radius + e.deltaY * 0.01)
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)',
          color: '#00ff00',
          fontSize: '0.9rem',
          gap: '1rem',
          zIndex: 20
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0,255,0,0.2)',
            borderTop: '3px solid #00ff00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div>LOADING MODEL...</div>
          {loadingProgress > 0 && (
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(0,255,0,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: '#00ff00',
                transition: 'width 0.3s ease'
              }} />
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Cassette Rack Component with Pagination
function CassetteRack({ projects, selectedProject, onProjectClick, currentPage, totalPages, onNextPage, onPrevPage }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignItems: 'center',
      position: 'absolute',
      right: '-150px',
      top: '50%',
      transform: 'translateY(-50%)'
    }}>
      <div style={{
        fontSize: '0.9rem',
        color: '#00ff00',
        fontWeight: '700',
        letterSpacing: '0.15em',
        textShadow: '0 0 10px #00ff00'
      }}>
        CASSETTE LIBRARY
      </div>

      <div 
        className="cassette-rack"
        style={{
          width: '340px',
          height: 'calc(6 * 120px + 5 * 1.2rem + 3rem)',
          maxHeight: '80vh',
          overflowY: 'hidden',
          overflowX: 'hidden',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
          border: '3px solid #333',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="cassette"
            onClick={() => onProjectClick(project)}
            style={{
              width: '100%',
              height: '120px',
              background: `linear-gradient(90deg, ${project.color}dd 0%, ${project.color}88 100%)`,
              borderRadius: '6px',
              cursor: 'pointer',
              position: 'relative',
              border: selectedProject?.id === project.id 
                ? '3px solid #00ff00' 
                : '3px solid rgba(0,0,0,0.3)',
              boxShadow: selectedProject?.id === project.id
                ? `0 0 20px ${project.color}80, 0 0 40px #00ff0060`
                : '0 4px 12px rgba(0,0,0,0.4)',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '120px',
              height: '100%',
              overflow: 'hidden',
              borderRight: '3px solid rgba(0,0,0,0.3)',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img 
                src={project.coverPhoto} 
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9
                }}
              />
            </div>

            <div style={{
              flex: 1,
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {project.title}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '600'
              }}>
                {project.year} • {project.category}
              </div>
            </div>

            {selectedProject?.id === project.id && (
              <div style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '5px',
                height: '70%',
                background: '#00ff00',
                boxShadow: '0 0 12px #00ff00'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button
          onClick={onPrevPage}
          disabled={currentPage === 0}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: currentPage === 0 ? 'rgba(0,0,0,0.4)' : 'rgba(0,255,0,0.2)',
            border: '2px solid rgba(0,255,0,0.4)',
            color: currentPage === 0 ? '#555' : '#00ff00',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            opacity: currentPage === 0 ? 0.3 : 1
          }}
        >
          ‹
        </button>

        <div style={{
          fontSize: '0.8rem',
          color: '#00ff00',
          fontFamily: "'Courier New', monospace",
          fontWeight: '600',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {currentPage + 1} / {totalPages}
        </div>

        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages - 1}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: currentPage === totalPages - 1 ? 'rgba(0,0,0,0.4)' : 'rgba(0,255,0,0.2)',
            border: '2px solid rgba(0,255,0,0.4)',
            color: currentPage === totalPages - 1 ? '#555' : '#00ff00',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            opacity: currentPage === totalPages - 1 ? 0.3 : 1
          }}
        >
          ›
        </button>
      </div>

      <div style={{
        fontSize: '0.7rem',
        color: '#666',
        textAlign: 'center',
        fontFamily: "'Courier New', monospace",
        letterSpacing: '0.05em'
      }}>
        {projects.length} CASSETTES ON PAGE
      </div>
    </div>
  )
}