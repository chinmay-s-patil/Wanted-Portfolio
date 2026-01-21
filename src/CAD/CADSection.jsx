// src/CAD/CADSection.jsx
'use client'

import React, { useState, useCallback, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import CADGLTFList from './CADGLTFList'

// Lazy load the 3D viewer
const GLTFViewerModal = lazy(() => import('./GLTFViewerModal'))

export default function CADSection() {
  const [selectedCartridge, setSelectedCartridge] = useState(null)
  const navigate = useNavigate()

  const handleCartridgeClick = useCallback((project) => {
    setSelectedCartridge(project)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedCartridge(null)
  }, [])

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
      justifyContent: 'center'
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
        
        .cartridge {
          transition: all 0.3s ease;
        }
        
        .cartridge:hover {
          transform: translateY(-8px);
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
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3rem',
        width: '100%',
        maxWidth: '1400px',
        padding: '2rem'
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
          width: '900px',
          maxWidth: '90vw',
          aspectRatio: '4/3',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          borderRadius: '24px',
          padding: '3rem',
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
                  INSERT CARTRIDGE<br/>
                  TO BEGIN
                </div>
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '2rem',
                padding: '2rem',
                color: '#fff'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#00ff00',
                  textShadow: '0 0 10px #00ff00',
                  textAlign: 'center'
                }}>
                  {selectedCartridge.title}
                </div>
                
                <div style={{
                  fontSize: '0.9rem',
                  color: '#aaa',
                  textAlign: 'center',
                  maxWidth: '80%',
                  lineHeight: '1.6'
                }}>
                  {selectedCartridge.description}
                </div>

                <button
                  onClick={() => setSelectedCartridge({ ...selectedCartridge, view3D: true })}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontFamily: "'Special Elite', monospace",
                    boxShadow: '0 4px 20px rgba(0,255,0,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ▶ LOAD 3D MODEL
                </button>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
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
          </div>
        </div>

        {/* Cartridge Row */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '1rem',
          width: '100%',
          maxWidth: '900px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#00ff00 #1a1a1a'
        }}>
          {CADGLTFList.map((project) => (
            <div
              key={project.id}
              className="cartridge"
              onClick={() => handleCartridgeClick(project)}
              style={{
                minWidth: '120px',
                height: '180px',
                background: `linear-gradient(135deg, ${project.color}dd 0%, ${project.color}88 100%)`,
                borderRadius: '8px',
                cursor: 'pointer',
                position: 'relative',
                border: selectedCartridge?.id === project.id 
                  ? '3px solid #00ff00' 
                  : '3px solid rgba(0,0,0,0.3)',
                boxShadow: selectedCartridge?.id === project.id
                  ? `0 8px 30px ${project.color}60, 0 0 20px #00ff00`
                  : `0 8px 20px rgba(0,0,0,0.4)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#fff',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: '0.5rem',
                wordWrap: 'break-word',
                width: '100%'
              }}>
                {project.title}
              </div>
              
              <div style={{
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '600'
              }}>
                {project.year}
              </div>

              {/* Cartridge notch */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '8px',
                background: '#000',
                borderRadius: '4px 4px 0 0'
              }} />
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div style={{
          fontSize: '0.8rem',
          color: '#666',
          textAlign: 'center',
          fontFamily: "'Courier New', monospace",
          letterSpacing: '0.1em'
        }}>
          ▲ SELECT CARTRIDGE ▲ LOAD MODEL ▲ EXPLORE 3D ▲
        </div>
      </div>

      {/* 3D Viewer Modal */}
      {selectedCartridge?.view3D && (
        <Suspense fallback={<div>Loading 3D Viewer...</div>}>
          <GLTFViewerModal 
            project={selectedCartridge}
            onClose={() => setSelectedCartridge({ ...selectedCartridge, view3D: false })}
          />
        </Suspense>
      )}
    </div>
  )
}