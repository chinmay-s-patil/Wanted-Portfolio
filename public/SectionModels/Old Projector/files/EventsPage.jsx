// src/events/EventsPage.jsx
'use client'

import { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import eventsData from './eventsData'

// Lazy load the projector and frame viewer
const ProjectorModel = lazy(() => import('./ProjectorModel'))
const FrameViewer = lazy(() => import('./FrameViewer'))

export default function EventsPage() {
  const [selectedReel, setSelectedReel] = useState(null)
  const [projectorOn, setProjectorOn] = useState(false)
  const navigate = useNavigate()

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleReelClick = useCallback((reel) => {
    setSelectedReel(reel)
    setProjectorOn(true)
  }, [])

  const handleCloseReel = useCallback(() => {
    setSelectedReel(null)
    setProjectorOn(false)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes reelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes projectorBeam {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(196, 165, 116, 0.2)',
          border: '2px solid #8b7355',
          color: '#f6efe2',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ← Back to Hub
      </button>

      {!selectedReel ? (
        /* Archive Room View - Film Reels on Table */
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#f6efe2',
              marginBottom: '0.5rem',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)',
              letterSpacing: '0.05em'
            }}>
              MEMORY ARCHIVES
            </h1>
            <div style={{
              width: '200px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #c4a574, transparent)',
              margin: '0 auto 1rem'
            }} />
            <p style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              color: '#8b7355',
              fontStyle: 'italic',
              letterSpacing: '0.08em'
            }}>
              Select a reel to load into the projector
            </p>
          </div>

          {/* 3D Projector Model */}
          <div style={{
            width: '400px',
            height: '300px',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            <Suspense fallback={
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b7355'
              }}>
                Loading projector...
              </div>
            }>
              <ProjectorModel isOn={projectorOn} />
            </Suspense>
          </div>

          {/* Film Reels on Table */}
          <div style={{
            display: 'flex',
            gap: '3rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '1200px',
            padding: '2rem',
            background: 'rgba(61, 40, 23, 0.2)',
            borderRadius: '12px',
            border: '2px solid rgba(139, 115, 85, 0.3)'
          }}>
            {eventsData.map((reel) => (
              <div
                key={reel.id}
                onClick={() => handleReelClick(reel)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                }}
              >
                {/* Film Reel */}
                <div style={{
                  width: '180px',
                  height: '180px',
                  position: 'relative'
                }}>
                  {/* Reel Body */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${reel.color || '#3d2817'} 0%, #2a1a10 100%)`,
                    border: '4px solid rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Reel Holes Pattern */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '20px',
                          height: '20px',
                          background: 'rgba(0,0,0,0.6)',
                          borderRadius: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-50px)`,
                          border: '1px solid rgba(0,0,0,0.8)'
                        }}
                      />
                    ))}

                    {/* Center Hub */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a)',
                      border: '3px solid #0a0a0a',
                      boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#0a0a0a',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                      }} />
                    </div>

                    {/* Film Texture Lines */}
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '2px',
                          height: '80%',
                          background: 'rgba(0,0,0,0.2)',
                          transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                  </div>

                  {/* Label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(246, 239, 226, 0.95)',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    border: '2px solid rgba(139, 115, 85, 0.5)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: '#1a1410',
                      textAlign: 'center',
                      marginBottom: '2px'
                    }}>
                      {reel.title}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#5d4a2a',
                      textAlign: 'center'
                    }}>
                      {reel.year} • {reel.frames.length} frames
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Projection View - Frame by Frame */
        <Suspense fallback={
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f6efe2',
            fontSize: '1.2rem'
          }}>
            Loading projection...
          </div>
        }>
          <FrameViewer reel={selectedReel} onClose={handleCloseReel} />
        </Suspense>
      )}
    </div>
  )
}
