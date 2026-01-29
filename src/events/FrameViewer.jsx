// src/events/FrameViewer.jsx
import { useState, useEffect, useCallback } from 'react'

export default function FrameViewer({ reel, onClose }) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const currentFrame = reel.frames[currentFrameIndex]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && currentFrameIndex > 0) {
        setCurrentFrameIndex(prev => prev - 1)
      } else if (e.key === 'ArrowRight' && currentFrameIndex < reel.frames.length - 1) {
        setCurrentFrameIndex(prev => prev + 1)
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentFrameIndex, reel.frames.length, onClose])

  // Autoplay slideshow
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        if (prev >= reel.frames.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying, reel.frames.length])

  const nextFrame = useCallback(() => {
    if (currentFrameIndex < reel.frames.length - 1) {
      setCurrentFrameIndex(prev => prev + 1)
    }
  }, [currentFrameIndex, reel.frames.length])

  const prevFrame = useCallback(() => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(prev => prev - 1)
    }
  }, [currentFrameIndex])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1410 100%)'
    }}>
      <style jsx>{`
        @keyframes filmGrain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, 1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, -1%); }
          50% { transform: translate(-1%, -1%); }
          60% { transform: translate(1%, 1%); }
          70% { transform: translate(-1%, 1%); }
          80% { transform: translate(1%, -1%); }
          90% { transform: translate(-1%, 1%); }
        }
        
        @keyframes projectorBeam {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>

      {/* Projector Beam Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        height: '80px',
        background: 'linear-gradient(180deg, rgba(255,215,0,0.2), transparent)',
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
        pointerEvents: 'none',
        animation: 'projectorBeam 2s ease-in-out infinite',
        zIndex: 1
      }} />

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(61, 40, 23, 0.9)',
          border: '2px solid #8b7355',
          color: '#f6efe2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          zIndex: 100,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.background = 'rgba(61, 40, 23, 1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.background = 'rgba(61, 40, 23, 0.9)'
        }}
      >
        ✕
      </button>

      {/* Info Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '6rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: showDetails ? 'rgba(196, 165, 116, 0.9)' : 'rgba(61, 40, 23, 0.9)',
          border: '2px solid #8b7355',
          color: '#f6efe2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          zIndex: 100,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
        }}
      >
        ⓘ
      </button>

      {/* Main Projection Screen */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem 2rem',
        position: 'relative'
      }}>
        {/* Screen Frame */}
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          border: '16px solid #2a1a10',
          borderRadius: '8px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Film Grain Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 10,
            animation: 'filmGrain 0.2s steps(4) infinite'
          }} />

          {/* Scanlines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.1) 1px, transparent 2px)',
            pointerEvents: 'none',
            zIndex: 11
          }} />

          {/* Frame Content */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative'
          }}>
            {currentFrame.type === 'title' ? (
              /* Title Frame */
              <div style={{
                textAlign: 'center',
                color: '#f6efe2',
                maxWidth: '800px'
              }}>
                <div style={{
                  fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                  color: '#c4a574',
                  marginBottom: '2rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase'
                }}>
                  Memory Archive
                </div>
                <h1 style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  textShadow: '0 4px 12px rgba(0,0,0,0.8)',
                  fontFamily: "'Crimson Text', serif"
                }}>
                  {reel.title}
                </h1>
                <div style={{
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                  color: '#8b7355',
                  marginBottom: '2rem'
                }}>
                  {reel.location} • {reel.dates.start} — {reel.dates.end}
                </div>
                {reel.summary && (
                  <p style={{
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                    lineHeight: '1.8',
                    color: '#e8dcc8',
                    fontStyle: 'italic'
                  }}>
                    {reel.summary}
                  </p>
                )}
              </div>
            ) : currentFrame.type === 'image' ? (
              /* Image Frame */
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                <img
                  src={currentFrame.src}
                  alt={currentFrame.caption || `Frame ${currentFrameIndex + 1}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(100% - 60px)',
                    objectFit: 'contain',
                    filter: 'sepia(0.1) contrast(1.05)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                {currentFrame.caption && (
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#c4a574',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    maxWidth: '80%'
                  }}>
                    {currentFrame.caption}
                  </div>
                )}
              </div>
            ) : currentFrame.type === 'summary' ? (
              /* Summary Frame */
              <div style={{
                textAlign: 'center',
                color: '#f6efe2',
                maxWidth: '700px',
                padding: '2rem'
              }}>
                <div style={{
                  fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
                  color: '#c4a574',
                  marginBottom: '2rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase'
                }}>
                  Summary
                </div>
                <p style={{
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  lineHeight: '1.8',
                  color: '#e8dcc8'
                }}>
                  {currentFrame.text}
                </p>
                {reel.highlights && reel.highlights.length > 0 && (
                  <div style={{
                    marginTop: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    alignItems: 'center'
                  }}>
                    {reel.highlights.map((highlight, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: '0.95rem',
                          color: '#c4a574',
                          padding: '0.5rem 1.5rem',
                          border: '1px solid rgba(196, 165, 116, 0.3)',
                          borderRadius: '4px',
                          background: 'rgba(196, 165, 116, 0.05)'
                        }}
                      >
                        • {highlight}
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
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(61, 40, 23, 0.8)',
              border: '3px solid #8b7355',
              color: '#f6efe2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              zIndex: 20
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              e.currentTarget.style.background = 'rgba(61, 40, 23, 1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.8)'
            }}
          >
            ‹
          </button>
        )}

        {currentFrameIndex < reel.frames.length - 1 && (
          <button
            onClick={nextFrame}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(61, 40, 23, 0.8)',
              border: '3px solid #8b7355',
              color: '#f6efe2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              zIndex: 20
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              e.currentTarget.style.background = 'rgba(61, 40, 23, 1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.8)'
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div style={{
        height: '100px',
        background: 'rgba(26, 20, 16, 0.95)',
        borderTop: '2px solid #3d2817',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 3rem',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 50
      }}>
        {/* Frame Counter */}
        <div style={{
          fontSize: '1rem',
          color: '#c4a574',
          fontWeight: '600',
          fontFamily: "'Courier Prime', monospace"
        }}>
          Frame {currentFrameIndex + 1} / {reel.frames.length}
        </div>

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: isPlaying ? 'rgba(196, 165, 116, 0.3)' : 'rgba(61, 40, 23, 0.6)',
              border: '2px solid #8b7355',
              color: '#f6efe2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Frame Dots */}
          <div style={{
            display: 'flex',
            gap: '8px',
            padding: '0 1rem'
          }}>
            {reel.frames.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentFrameIndex(idx)}
                style={{
                  width: idx === currentFrameIndex ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: idx === currentFrameIndex 
                    ? '#c4a574'
                    : 'rgba(196, 165, 116, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Keyboard Hints */}
        <div style={{
          fontSize: '0.75rem',
          color: '#8b7355',
          textAlign: 'right',
          fontFamily: "'Courier Prime', monospace"
        }}>
          <div>← → Navigate • Space Play/Pause • Esc Close</div>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div style={{
          position: 'absolute',
          top: '6rem',
          right: '2rem',
          width: '320px',
          background: 'rgba(26, 20, 16, 0.98)',
          border: '2px solid #8b7355',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          zIndex: 90
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            color: '#f6efe2',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(196, 165, 116, 0.3)',
            paddingBottom: '0.5rem'
          }}>
            Event Details
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ color: '#8b7355' }}>Location:</span>
              <span style={{ color: '#e8dcc8', marginLeft: '0.5rem' }}>{reel.location}</span>
            </div>
            <div>
              <span style={{ color: '#8b7355' }}>Date:</span>
              <span style={{ color: '#e8dcc8', marginLeft: '0.5rem' }}>
                {reel.dates.start} — {reel.dates.end}
              </span>
            </div>
            <div>
              <span style={{ color: '#8b7355' }}>Frames:</span>
              <span style={{ color: '#e8dcc8', marginLeft: '0.5rem' }}>{reel.frames.length}</span>
            </div>
          </div>

          {reel.summary && (
            <p style={{
              fontSize: '0.85rem',
              color: '#c4a574',
              marginTop: '1rem',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              {reel.summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
