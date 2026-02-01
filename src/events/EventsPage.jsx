// src/events/EventsPage.jsx
'use client'

import { useState, useEffect, useCallback, Suspense, lazy, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import eventsData from './eventsData'

const ProjectorModel = lazy(() => import('./ProjectorModel'))
const FrameViewer = lazy(() => import('./FrameViewer'))

export default function EventsPage() {
  const [selectedReel, setSelectedReel] = useState(null)
  const [projectorState, setProjectorState] = useState('idle') // idle | selected | projecting | open
  const [hoveredReel, setHoveredReel] = useState(null)
  const [filmStripActive, setFilmStripActive] = useState(false)
  const navigate = useNavigate()
  const screenRef = useRef(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleReelClick = useCallback((reel) => {
    setSelectedReel(reel)
    setFilmStripActive(true)
    
    // Step 1: Cassette lift animation (120ms)
    setTimeout(() => {
      setProjectorState('selected')
    }, 120)
    
    // Step 2: Projector warm-up + back-away (260-380ms)
    setTimeout(() => {
      setProjectorState('projecting')
    }, 300)
    
    // Step 3: Screen expands + show content (320ms)
    setTimeout(() => {
      setProjectorState('open')
      setFilmStripActive(false)
    }, 600)
  }, [])

  const handleCloseReel = useCallback(() => {
    // Reverse animation
    setProjectorState('projecting')
    
    setTimeout(() => {
      setProjectorState('selected')
    }, 200)
    
    setTimeout(() => {
      setProjectorState('idle')
      setSelectedReel(null)
    }, 500)
  }, [])

  const isProjecting = projectorState === 'projecting' || projectorState === 'open'

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a0f08 0%, #0d0906 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex'
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@700;800&display=swap');
        
        @keyframes reelSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes projectorBeam { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.25; } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } }
        @keyframes reelHover { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes filmTravel { 
          0% { transform: translateX(0) translateY(0) scale(1); opacity: 0; } 
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(var(--travel-x)) translateY(var(--travel-y)) scale(0.3); opacity: 0; } 
        }
        @keyframes screenGlow {
          0%, 100% { box-shadow: 0 0 60px rgba(246, 239, 226, 0.1); }
          50% { box-shadow: 0 0 80px rgba(246, 239, 226, 0.15); }
        }
        @keyframes slideInLeft { 
          from { opacity: 0; transform: translateX(-30px); } 
          to { opacity: 1; transform: translateX(0); } 
        }
        
        .cassette-reel:hover { animation: reelHover 0.6s ease-in-out; }
        .film-strip { animation: filmTravel 0.6s ease-in-out forwards; }
        .screen-glow { animation: screenGlow 4s ease-in-out infinite; }
        .reel-details-content { animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        
        /* Nav-ideas.md design tokens */
        :root {
          --rail-width: 320px;
          --rail-padding: 24px;
          --color-bg-rail: rgba(7, 16, 26, 0.95);
          --color-title: #EAF2FF;
          --color-kicker: #94a3b8;
          --color-desc: #bfcfe0;
          --accent: #00E0FF;
          --transition: cubic-bezier(.2,.9,.13,1);
        }
      `}</style>

      {/* SIDE RAIL - Shows Reel Details when selected, otherwise Archive Info */}
      <aside style={{
        width: '320px',
        height: '100vh',
        background: selectedReel ? 'rgba(7, 16, 26, 0.98)' : 'rgba(7, 16, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${selectedReel ? 'rgba(0, 224, 255, 0.3)' : 'rgba(148, 163, 184, 0.1)'}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        zIndex: 100, // Keep above FrameViewer
        boxShadow: selectedReel 
          ? '4px 0 24px rgba(0, 224, 255, 0.2)' 
          : '4px 0 24px rgba(0,0,0,0.4)',
        flexShrink: 0,
        transition: 'all 0.3s ease'
      }} role="complementary" aria-labelledby={selectedReel ? "reel-title" : "section-title"}>
        
        {selectedReel ? (
          // REEL DETAILS VIEW (shown when any reel is selected, including when FrameViewer is open)
          <div className="reel-details-content" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            height: '100%',
            overflowY: 'auto'
          }}>
            {/* Close/Back Button */}
            <button
              onClick={handleCloseReel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(0, 224, 255, 0.3)',
                background: 'rgba(0, 224, 255, 0.1)',
                color: '#00E0FF',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 140ms cubic-bezier(.2,.9,.13,1)',
                marginBottom: '12px',
                alignSelf: 'flex-start',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(0, 224, 255, 0.2)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(0, 224, 255, 0.1)';
              }}
              aria-label="Close reel and return to archive"
            >
              ← Back to archive
            </button>

            {/* Kicker */}
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '12px',
              lineHeight: 1
            }}>
              {selectedReel.category || 'Projection'}
            </div>

            {/* Title */}
            <h2 id="reel-title" style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#EAF2FF',
              margin: '0',
              fontFamily: "'Orbitron', sans-serif"
            }}>
              {selectedReel.title}
            </h2>

            {/* Summary */}
            {selectedReel.summary && (
              <p style={{
                fontSize: '0.95rem',
                color: '#bfcfe0',
                lineHeight: 1.6,
                margin: '0'
              }}>
                {selectedReel.summary}
              </p>
            )}

            {/* Metadata */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Location</div>
                <div style={{ fontSize: '0.95rem', color: '#bfcfe0' }}>{selectedReel.location}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Date</div>
                <div style={{ fontSize: '0.95rem', color: '#bfcfe0' }}>{selectedReel.dates?.start} - {selectedReel.dates?.end}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Frames</div>
                <div style={{ fontSize: '1.1rem', color: '#00E0FF', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
                  {selectedReel.frames?.length || 0}
                </div>
              </div>
            </div>

            {/* Highlights */}
            {selectedReel.highlights && selectedReel.highlights.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Highlights
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedReel.highlights.map((highlight, i) => (
                    <span key={i} style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      background: 'rgba(0, 224, 255, 0.1)',
                      border: '1px solid rgba(0, 224, 255, 0.3)',
                      borderRadius: '4px',
                      color: '#00E0FF'
                    }}>
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Status Indicator - Shows when projecting */}
            {projectorState !== 'idle' && (
              <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0, 224, 255, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.75rem',
                  color: '#00E0FF',
                  fontFamily: "'Roboto Mono', monospace"
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00E0FF',
                    animation: 'flicker 1s ease-in-out infinite'
                  }} />
                  {projectorState === 'projecting' ? 'Warming up projector...' : 
                   projectorState === 'open' ? 'Now projecting' : 'Loading...'}
                </div>
              </div>
            )}
          </div>
        ) : (
          // GENERAL ARCHIVE VIEW (shown when no reel selected)
          <>
            {/* Back Button */}
            <button
              onClick={() => navigate('/hub')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: '#cbd5e1',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 140ms cubic-bezier(.2,.9,.13,1)',
                marginBottom: '12px',
                alignSelf: 'flex-start',
                fontFamily: "'Inter', sans-serif"
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              aria-label="Back to office"
            >
              ← Back to office
            </button>

            {/* Kicker */}
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#94a3b8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif",
              marginTop: '12px',
              lineHeight: 1
            }}>
              Archive
            </div>

            {/* Title */}
            <h1 id="section-title" style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#EAF2FF',
              margin: '8px 0 0 0',
              fontFamily: "'Orbitron', sans-serif",
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              letterSpacing: '0.02em'
            }}>
              Memory Archives
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1rem',
              color: '#bfcfe0',
              lineHeight: 1.5,
              marginTop: '12px',
              fontFamily: "'Inter', sans-serif",
              maxWidth: '100%'
            }}>
              Select a film reel to load into the projector. Each cassette contains captured moments, experiments, and research documentation.
            </p>

            {/* Metadata tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#64748b',
                fontFamily: "'Roboto Mono', monospace",
                padding: '4px 8px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                {eventsData.length} Reels
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#64748b',
                fontFamily: "'Roboto Mono', monospace",
                padding: '4px 8px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                35mm Format
              </span>
            </div>
          </>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{
        flex: 1,
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Archive Room View */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          opacity: projectorState === 'open' ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: projectorState === 'open' ? 'none' : 'auto'
        }}>
          {/* Screen - Background Layer (z-index 1) */}
          <div 
            ref={screenRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -45%) scale(${isProjecting ? 1.18 : 0.9})`,
              width: '60%',
              maxWidth: '900px',
              height: '50%',
              background: isProjecting 
                ? 'rgba(246, 239, 226, 0.08)' 
                : 'rgba(246, 239, 226, 0.03)',
              border: `8px solid ${isProjecting ? 'rgba(61, 40, 23, 0.6)' : 'rgba(61, 40, 23, 0.2)'}`,
              borderRadius: '12px',
              transition: 'all 0.5s cubic-bezier(0.22, 0.9, 0.13, 1)',
              zIndex: 1,
              opacity: projectorState !== 'idle' ? 0.9 : 0.4,
              boxShadow: isProjecting 
                ? '0 30px 80px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.4)'
                : '0 8px 24px rgba(0,0,0,0.4)',
              pointerEvents: 'none'
            }} 
            className={isProjecting ? 'screen-glow' : ''}
          >
            {/* Scanlines effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.03) 1px, transparent 2px)',
              pointerEvents: 'none',
              opacity: 0.5
            }} />
          </div>

          {/* 3D Projector Canvas - Middle Layer (z-index 2) */}
          <div style={{
            width: '450px',
            height: '350px',
            marginBottom: '2rem',
            position: 'relative',
            zIndex: 2,
            transform: `translateZ(${isProjecting ? '-100px' : '0'}) scale(${isProjecting ? 0.92 : 1})`,
            opacity: isProjecting ? 0.6 : 1,
            transition: 'all 0.5s cubic-bezier(0.22, 0.9, 0.13, 1)',
            filter: isProjecting ? 'blur(1px)' : 'none'
          }}>
            <Suspense fallback={
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b7355',
                fontSize: '0.9rem',
                background: 'transparent'
              }}>
                <div style={{
                  background: 'rgba(26, 15, 8, 0.9)',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  border: '2px solid #8b7355'
                }}>
                  Loading projector...
                </div>
              </div>
            }>
              <ProjectorModel 
                isOn={projectorState !== 'idle'} 
                state={projectorState}
                modelPath="/movieprojector.gltf"
              />
            </Suspense>

            {/* Projector Beam Effect */}
            {projectorState !== 'idle' && (
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150px',
                height: '100px',
                background: 'linear-gradient(180deg, rgba(255,215,0,0.15), transparent)',
                clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
                animation: 'projectorBeam 3s ease-in-out infinite',
                zIndex: -1
              }} />
            )}
          </div>

          {/* Film Reels Shelf - Top Layer (z-index 3) */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '1200px',
            padding: '2rem',
            background: 'rgba(61, 40, 23, 0.25)',
            borderRadius: '16px',
            border: '2px solid rgba(139, 115, 85, 0.3)',
            position: 'relative',
            zIndex: 3,
            backdropFilter: 'blur(8px)',
            opacity: isProjecting ? 0.4 : 1,
            transform: isProjecting ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.4s ease',
            pointerEvents: isProjecting ? 'none' : 'auto'
          }}>
            {eventsData.map((reel, index) => (
              <div
                key={reel.id}
                className="cassette-reel"
                onClick={() => handleReelClick(reel)}
                onMouseEnter={() => setHoveredReel(reel.id)}
                onMouseLeave={() => setHoveredReel(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  transform: hoveredReel === reel.id ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Film Strip Animation */}
                {filmStripActive && selectedReel?.id === reel.id && (
                  <div 
                    className="film-strip"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '40px',
                      height: '30px',
                      background: `repeating-linear-gradient(90deg, ${reel.color} 0px, ${reel.color} 8px, transparent 8px, transparent 12px)`,
                      border: '2px solid rgba(0,0,0,0.5)',
                      zIndex: 100,
                      '--travel-x': '0px',
                      '--travel-y': '-200px'
                    }}
                  />
                )}

                {/* Reel Container */}
                <div style={{
                  width: '160px',
                  height: '160px',
                  position: 'relative',
                  filter: hoveredReel === reel.id ? 'brightness(1.2)' : 'brightness(1)'
                }}>
                  {/* Reel Body */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${reel.color || '#8b6914'} 0deg, #3d2817 60deg, #2a1a10 120deg, ${reel.color || '#8b6914'} 180deg, #3d2817 240deg, #2a1a10 300deg, ${reel.color || '#8b6914'} 360deg)`,
                    border: '4px solid rgba(0,0,0,0.6)',
                    boxShadow: hoveredReel === reel.id
                      ? `0 16px 40px rgba(0,0,0,0.7), 0 0 30px ${reel.color}50`
                      : '0 8px 24px rgba(0,0,0,0.6)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Spokes */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <div key={angle} style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '3px',
                        height: '40%',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4), transparent)',
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        transformOrigin: 'center'
                      }} />
                    ))}

                    {/* Center Hub */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #5a5a5a, #1a1a1a)',
                      border: '3px solid #0a0a0a',
                      boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.2), 0 4px 8px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#0a0a0a',
                        margin: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                      }} />
                    </div>

                    {/* Film texture rings */}
                    <div style={{
                      position: 'absolute',
                      inset: '15%',
                      border: '1px solid rgba(0,0,0,0.2)',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      position: 'absolute',
                      inset: '25%',
                      border: '1px solid rgba(0,0,0,0.15)',
                      borderRadius: '50%'
                    }} />
                  </div>

                  {/* Label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-35px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(to bottom, #f6efe2, #e8dcc8)',
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: '2px solid rgba(139, 115, 85, 0.6)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s',
                    minWidth: '120px'
                  }}>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#1a1410',
                      textAlign: 'center',
                      marginBottom: '2px',
                      fontFamily: "'Crimson Text', serif",
                      letterSpacing: '0.02em'
                    }}>
                      {reel.title}
                    </div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#5d4a2a',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {reel.year} • {reel.frames?.length || 0} FRAMES
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedReel?.id === reel.id && projectorState !== 'idle' && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#c4a574',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      animation: 'flicker 1s ease-in-out infinite'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projection View - Full Screen Overlay */}
        {projectorState === 'open' && selectedReel && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50, // Below sidebar (z-index 100) so sidebar stays on top
            animation: 'fadeIn 0.4s ease',
            left: '320px' // Account for side rail width
          }}>
            <style jsx>{`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <Suspense fallback={
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f6efe2',
                fontSize: '1.2rem',
                background: '#0a0a0a'
              }}>
                Loading projection...
              </div>
            }>
              <FrameViewer reel={selectedReel} onClose={handleCloseReel} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}