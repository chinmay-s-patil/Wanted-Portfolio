// src/CAD/CADSection.jsx
'use client'

import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CADGLTFList from './CADGLTFList'
import TVViewer from './TVViewer'

export default function CADSection() {
  const [selectedCartridge, setSelectedCartridge] = useState(null)
  const navigate = useNavigate()

  const handleCartridgeClick = useCallback((project) => {
    setSelectedCartridge(project)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedCartridge(null)
  }, [])

  const viewerControls = selectedCartridge ? TVViewer({ project: selectedCartridge, onClose: handleClose }) : null

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      overflow: 'hidden',
      position: 'relative',
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
        maxWidth: '1600px'
      }}>
        {/* Left Side - CRT + Header + Controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          flex: 1
        }}>
          {/* Header */}
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
          </div>

          {/* CRT TV */}
          <div className="crt-bezel" style={{
            position: 'relative',
            width: '1100px',  // Increased from 900px
            maxWidth: '90vw',
            aspectRatio: '4/3',
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            borderRadius: '24px',
            padding: '3.5rem',  // Increased padding
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
                <div
                  ref={viewerControls?.containerRef}
                  onMouseDown={viewerControls?.handleMouseDown}
                  onMouseMove={viewerControls?.handleMouseMove}
                  onMouseUp={viewerControls?.handleMouseUp}
                  onMouseLeave={viewerControls?.handleMouseUp}
                  onWheel={viewerControls?.handleWheel}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'grab',
                    position: 'relative'
                  }}
                >
                  {viewerControls?.isLoading && (
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
                      {viewerControls.loadingProgress > 0 && (
                        <div style={{
                          width: '200px',
                          height: '4px',
                          background: 'rgba(0,255,0,0.2)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${viewerControls.loadingProgress}%`,
                            height: '100%',
                            background: '#00ff00',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Control Panel - Below TV */}
          {selectedCartridge && viewerControls && (
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: '900px',
              padding: '1rem',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '12px',
              border: '2px solid #333'
            }}>
              {/* View Controls */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(40,40,40,0.8)',
                borderRadius: '8px',
                border: '1px solid #555'
              }}>
                <button onClick={viewerControls.setViewX} style={buttonStyle('#ff6464')}>
                  X
                </button>
                <button onClick={viewerControls.setViewY} style={buttonStyle('#64ff64')}>
                  Y
                </button>
                <button onClick={viewerControls.setViewZ} style={buttonStyle('#6464ff')}>
                  Z
                </button>
              </div>

              {/* Rotation Controls */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(40,40,40,0.8)',
                borderRadius: '8px',
                border: '1px solid #555'
              }}>
                <button onClick={viewerControls.rotateModelX} style={buttonStyle('#ff6464', true)}>
                  X↻
                </button>
                <button onClick={viewerControls.rotateModelY} style={buttonStyle('#64ff64', true)}>
                  Y↻
                </button>
                <button onClick={viewerControls.rotateModelZ} style={buttonStyle('#6464ff', true)}>
                  Z↻
                </button>
              </div>

              {/* Utility Controls */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.5rem',
                background: 'rgba(40,40,40,0.8)',
                borderRadius: '8px',
                border: '1px solid #555'
              }}>
                <button onClick={viewerControls.resetView} style={buttonStyle('#fff')}>
                  ⟲ Reset
                </button>
                <button onClick={viewerControls.toggleTransparency} style={buttonStyle('#fff')}>
                  {viewerControls.isTransparent ? '◉' : '○'} Trans
                </button>
                <button onClick={handleClose} style={buttonStyle('#ff4444')}>
                  ✕ Close
                </button>
              </div>
            </div>
          )}

          {/* Info Display */}
          {selectedCartridge && (
            <div style={{
              maxWidth: '900px',
              padding: '1.5rem',
              background: 'rgba(0,0,0,0.7)',
              borderRadius: '12px',
              border: '2px solid #333',
              color: '#fff'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#00ff00',
                marginBottom: '1rem',
                textShadow: '0 0 10px #00ff00'
              }}>
                {selectedCartridge.title}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: '#aaa',
                marginBottom: '1rem',
                lineHeight: '1.6'
              }}>
                {selectedCartridge.description}
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {selectedCartridge.tags?.map((tag, i) => (
                  <span key={i} style={{
                    padding: '0.3rem 0.8rem',
                    background: 'rgba(0,255,0,0.2)',
                    border: '1px solid #00ff00',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#00ff00'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            fontSize: '0.8rem',
            color: '#666',
            textAlign: 'center',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.1em'
          }}>
            ◄ SELECT CASSETTE ► LOAD MODEL ► EXPLORE 3D ►
          </div>
        </div>

        {/* Right Side - Cassette Rack */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignItems: 'center'
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

          {/* Cassette Rack Container */}
          <div 
            className="cassette-rack"
            style={{
              width: '280px',
              maxHeight: '70vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
              border: '3px solid #333',
              borderRadius: '12px',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {CADGLTFList.map((project) => (
              <div
                key={project.id}
                className="cassette"
                onClick={() => handleCartridgeClick(project)}
                style={{
                  width: '100%',
                  height: '80px',
                  background: `linear-gradient(90deg, ${project.color}dd 0%, ${project.color}88 100%)`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  position: 'relative',
                  border: selectedCartridge?.id === project.id 
                    ? '2px solid #00ff00' 
                    : '2px solid rgba(0,0,0,0.3)',
                  boxShadow: selectedCartridge?.id === project.id
                    ? `0 0 20px ${project.color}80, 0 0 40px #00ff0060`
                    : '0 4px 12px rgba(0,0,0,0.4)',
                  display: 'flex',
                  overflow: 'hidden'
                }}
              >
                {/* Cassette Image Preview */}
                <div style={{
                  width: '80px',
                  height: '100%',
                  overflow: 'hidden',
                  borderRight: '2px solid rgba(0,0,0,0.3)',
                  background: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img 
                    src={project.coverPhoto} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.8
                    }}
                  />
                </div>

                {/* Cassette Info */}
                <div style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#fff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    lineHeight: '1.1',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {project.title}
                  </div>
                  
                  <div style={{
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.7)',
                    fontWeight: '600'
                  }}>
                    {project.year} • {project.category}
                  </div>
                </div>

                {/* Cassette Reels */}
                <div style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '8px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  {[1, 2].map((i) => (
                    <div key={i} style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }} />
                  ))}
                </div>

                {/* Selected Indicator */}
                {selectedCartridge?.id === project.id && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    background: '#00ff00',
                    boxShadow: '0 0 10px #00ff00'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Rack Footer */}
          <div style={{
            fontSize: '0.7rem',
            color: '#666',
            textAlign: 'center',
            fontFamily: "'Courier New', monospace",
            letterSpacing: '0.05em'
          }}>
            {CADGLTFList.length} CASSETTES AVAILABLE
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Helper function for consistent button styling
function buttonStyle(color, small = false) {
  return {
    padding: small ? '0.4rem 0.7rem' : '0.5rem 1rem',
    background: `rgba(${color === '#ff6464' ? '255,100,100' : color === '#64ff64' ? '100,255,100' : color === '#6464ff' ? '100,100,255' : color === '#ff4444' ? '255,68,68' : '255,255,255'}, 0.15)`,
    border: `1px solid ${color}`,
    borderRadius: '6px',
    color: color,
    fontSize: small ? '0.75rem' : '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Special Elite', monospace",
    transition: 'all 0.2s ease',
    boxShadow: `0 0 10px ${color}33`
  }
}