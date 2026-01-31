// src/events/FrameViewer.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FrameViewer({ reel, onClose }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [direction, setDirection] = useState(0)
  const navigate = useNavigate()

  const currentFrame = reel.frames[currentFrameIndex]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && currentFrameIndex > 0) {
        setDirection(-1)
        setCurrentFrameIndex(prev => prev - 1)
      }
      else if (e.key === 'ArrowRight' && currentFrameIndex < reel.frames.length - 1) {
        setDirection(1)
        setCurrentFrameIndex(prev => prev + 1)
      }
      else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentFrameIndex, reel.frames.length, onClose])

  // Autoplay
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        if (prev >= reel.frames.length - 1) {
          setIsPlaying(false)
          return prev
        }
        setDirection(1)
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, reel.frames.length])

  const nextFrame = useCallback(() => {
    if (currentFrameIndex < reel.frames.length - 1) {
      setDirection(1)
      setCurrentFrameIndex(prev => prev + 1)
    }
  }, [currentFrameIndex, reel.frames.length])

  const prevFrame = useCallback(() => {
    if (currentFrameIndex > 0) {
      setDirection(-1)
      setCurrentFrameIndex(prev => prev - 1)
    }
  }, [currentFrameIndex])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1410 50%, #0d0906 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(2%, 2%); }
          30% { transform: translate(-2%, 2%); }
          40% { transform: translate(2%, -2%); }
          50% { transform: translate(-2%, -2%); }
          60% { transform: translate(2%, 2%); }
          70% { transform: translate(-2%, 2%); }
          80% { transform: translate(2%, -2%); }
          90% { transform: translate(-2%, 2%); }
        }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .frame-content { animation: ${direction === 1 ? 'slideInRight' : direction === -1 ? 'slideInLeft' : 'none'} 0.3s ease; }
      `}</style>

      {/* SIDE RAIL - Consistent with EventsPage */}
      <aside style={{
        width: '320px',
        height: '100%',
        background: 'rgba(7, 16, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)'
      }}>
        {/* Back Button - Nav-ideas.md style */}
        <button
          onClick={onClose}
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
          aria-label="Back to archive"
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
          marginTop: '12px'
        }}>
          {reel.category || 'Projection'}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          lineHeight: 1.1,
          color: '#EAF2FF',
          margin: '8px 0 0 0',
          fontFamily: "'Orbitron', sans-serif",
          maxWidth: '100%',
          wordWrap: 'break-word'
        }}>
          {reel.title}
        </h1>

        {/* Description/Metadata */}
        <div style={{
          marginTop: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Location</div>
            <div style={{ fontSize: '0.95rem', color: '#bfcfe0' }}>{reel.location}</div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Date</div>
            <div style={{ fontSize: '0.95rem', color: '#bfcfe0' }}>{reel.dates?.start} — {reel.dates?.end}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Frame</div>
            <div style={{ fontSize: '1.1rem', color: '#00E0FF', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
              {currentFrameIndex + 1} <span style={{ color: '#64748b' }}>/</span> {reel.frames.length}
            </div>
          </div>
        </div>

        {/* Progress Bar in Rail */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentFrameIndex + 1) / reel.frames.length) * 100}%`,
              height: '100%',
              background: '#00E0FF',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Control hints */}
        <div style={{
          marginTop: 'auto',
          fontSize: '0.75rem',
          color: '#64748b',
          fontFamily: "'Roboto Mono', monospace",
          lineHeight: '1.6',
          paddingTop: '16px',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div>← → Navigate</div>
          <div>Space Play/Pause</div>
          <div>Esc Close</div>
        </div>
      </aside>

      {/* Main Projection Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: '#000'
      }}>
        {/* Ambient Projector Beam */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '150px',
          background: 'linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 70%)',
          clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Top Right Controls */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          display: 'flex',
          gap: '1rem',
          zIndex: 100
        }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: showDetails ? 'rgba(196, 165, 116, 0.9)' : 'rgba(61, 40, 23, 0.8)',
              border: '2px solid #8b7355',
              color: '#f6efe2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
            aria-label="Toggle details"
          >
            ⓘ
          </button>
        </div>

        {/* Screen Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          position: 'relative'
        }}>
          {/* Projection Screen */}
          <div style={{
            maxWidth: '1400px',
            width: '100%',
            aspectRatio: '16/9',
            background: '#000',
            border: '20px solid #2a1a10',
            borderRadius: '12px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(196, 165, 116, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Film Grain Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.12'/%3E%3C/svg%3E")`,
              pointerEvents: 'none',
              zIndex: 10,
              animation: 'grain 0.3s steps(6) infinite'
            }} />

            {/* Scanlines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.15) 1px, transparent 2px)',
              pointerEvents: 'none',
              zIndex: 11
            }} />

            {/* Vignette */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
              pointerEvents: 'none',
              zIndex: 12
            }} />

            {/* Frame Content */}
            <div className="frame-content" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
              position: 'relative'
            }}>
              {currentFrame.type === 'title' ? (
                <div style={{ textAlign: 'center', color: '#f6efe2', maxWidth: '800px' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#c4a574',
                    marginBottom: '2rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Memory Archive • {reel.id}
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    textShadow: '0 4px 20px rgba(0,0,0,0.9)',
                    fontFamily: "'Crimson Text', serif",
                    letterSpacing: '0.02em',
                    lineHeight: 1.2
                  }}>
                    {reel.title}
                  </h1>
                  <div style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    color: '#8b7355',
                    marginBottom: '2rem',
                    fontStyle: 'italic'
                  }}>
                    {reel.location} • {reel.dates?.start} — {reel.dates?.end}
                  </div>
                  {reel.summary && (
                    <p style={{
                      fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
                      lineHeight: '1.8',
                      color: '#d4c8b0',
                      fontStyle: 'italic',
                      maxWidth: '600px',
                      margin: '0 auto'
                    }}>
                      {reel.summary}
                    </p>
                  )}
                </div>
              ) : currentFrame.type === 'image' ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.5rem'
                }}>
                  <img
                    src={currentFrame.src}
                    alt={currentFrame.caption || `Frame ${currentFrameIndex + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(100% - 80px)',
                      objectFit: 'contain',
                      filter: 'sepia(0.15) contrast(1.05) saturate(0.9)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
                      borderRadius: '4px'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  {currentFrame.caption && (
                    <div style={{
                      fontSize: '1rem',
                      color: '#c4a574',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      maxWidth: '70%',
                      lineHeight: '1.6',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                    }}>
                      {currentFrame.caption}
                    </div>
                  )}
                </div>
              ) : currentFrame.type === 'summary' ? (
                <div style={{ textAlign: 'center', color: '#f6efe2', maxWidth: '800px', padding: '2rem' }}>
                  <div style={{
                    fontSize: '1rem',
                    color: '#c4a574',
                    marginBottom: '2rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    Archive Summary
                  </div>
                  <p style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                    lineHeight: '1.9',
                    color: '#e8dcc8',
                    marginBottom: '3rem'
                  }}>
                    {currentFrame.text}
                  </p>
                  {reel.highlights && reel.highlights.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      justifyContent: 'center',
                      marginTop: '2rem'
                    }}>
                      {reel.highlights.map((highlight, i) => (
                        <div key={i} style={{
                          fontSize: '0.9rem',
                          color: '#c4a574',
                          padding: '0.6rem 1.5rem',
                          border: '1px solid rgba(196, 165, 116, 0.4)',
                          borderRadius: '20px',
                          background: 'rgba(196, 165, 116, 0.05)',
                          backdropFilter: 'blur(4px)'
                        }}>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentFrameIndex > 0 && (
            <button
              onClick={prevFrame}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(61, 40, 23, 0.6)',
                border: '2px solid #8b7355',
                color: '#f6efe2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                zIndex: 20,
                backdropFilter: 'blur(4px)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.background = 'rgba(61, 40, 23, 0.9)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(61, 40, 23, 0.6)' }}
              aria-label="Previous frame"
            >
              ‹
            </button>
          )}

          {currentFrameIndex < reel.frames.length - 1 && (
            <button
              onClick={nextFrame}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(61, 40, 23, 0.6)',
                border: '2px solid #8b7355',
                color: '#f6efe2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                zIndex: 20,
                backdropFilter: 'blur(4px)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.background = 'rgba(61, 40, 23, 0.9)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.background = 'rgba(61, 40, 23, 0.6)' }}
              aria-label="Next frame"
            >
              ›
            </button>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div style={{
          height: '90px',
          background: 'linear-gradient(to top, rgba(26, 20, 16, 0.98), rgba(26, 20, 16, 0.9))',
          borderTop: '1px solid rgba(139, 115, 85, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
          gap: '2rem',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.6)',
          zIndex: 50,
          backdropFilter: 'blur(10px)'
        }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isPlaying ? 'rgba(196, 165, 116, 0.3)' : 'rgba(61, 40, 23, 0.6)',
              border: '2px solid #c4a574',
              color: '#f6efe2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxShadow: isPlaying ? '0 0 20px rgba(196, 165, 116, 0.3)' : 'none'
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {reel.frames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFrameIndex(idx)}
                style={{
                  width: idx === currentFrameIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentFrameIndex 
                    ? '#00E0FF' 
                    : idx < currentFrameIndex ? 'rgba(0, 224, 255, 0.5)' : 'rgba(0, 224, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to frame ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel (Floating) */}
      {showDetails && (
        <div style={{
          position: 'absolute',
          top: '6rem',
          right: '2rem',
          width: '300px',
          background: 'rgba(26, 20, 16, 0.98)',
          border: '1px solid rgba(139, 115, 85, 0.3)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 12px 40px rgba(0,0,0,0.9)',
          zIndex: 90,
          backdropFilter: 'blur(10px)',
          animation: 'slideInRight 0.3s ease'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            color: '#f6efe2',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(196, 165, 116, 0.3)',
            paddingBottom: '0.5rem',
            fontFamily: "'Orbitron', sans-serif"
          }}>
            Frame Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Type</span>
              <span style={{ color: '#e8dcc8' }}>{currentFrame.type}</span>
            </div>
            {currentFrame.caption && (
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Caption</span>
                <span style={{ color: '#e8dcc8', fontStyle: 'italic' }}>{currentFrame.caption}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}