// src/CAD/CADSection.jsx
'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CADGLTFList from './CADGLTFList'
import TVModelViewer from './TVModelViewer'

export default function CADSection() {
  const [selectedCartridge, setSelectedCartridge] = useState(null)
  const navigate = useNavigate()
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isTransparent, setIsTransparent] = useState(false)
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
  }, [])

  // Control button handlers
  const resetView = useCallback(() => {
    if (!selectedCartridge) return
    const originalRotation = selectedCartridge.modelRotation || { x: 0, y: 0, z: 0 }
    setModelRotation(originalRotation)
    ctrlRef.current.viewState = { x: 0, y: 0, z: 0, perp: 0 }
    // Trigger reset in the viewer component
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

      {/* Main Container */}
      <div style={{
        display: 'flex',
        gap: '3rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '2400px',
        transform: 'scale(0.75)',
        transformOrigin: 'center'
      }}>
        {/* Left Side - Details Panel (only shown when cartridge selected) */}
        {selectedCartridge && (
          <div style={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
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

        {/* Center - CRT TV + Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          flex: selectedCartridge ? '0 0 auto' : 1
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
            width: '1100px',
            maxWidth: '90vw',
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
              left: '2rem',
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

        {/* Right Side - Control Buttons (only shown when cartridge selected) OR Cassette Rack */}
        {selectedCartridge ? (
          <div style={{
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
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
            projects={CADGLTFList}
            selectedProject={selectedCartridge}
            onProjectClick={handleCartridgeClick}
          />
        )}
      </div>
    </div>
  )
}


