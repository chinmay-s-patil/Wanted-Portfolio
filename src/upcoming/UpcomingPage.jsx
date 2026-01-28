// src/upcoming/UpcomingPage.jsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import upcomingProjects from './upcomingData'

export default function UpcomingPage() {
  const [isPowered, setIsPowered] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState(null)
  const navigate = useNavigate()

  // Power on animation
  useEffect(() => {
    const timer = setTimeout(() => setIsPowered(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && selectedCard) {
        setSelectedCard(null)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedCard])

  // Mouse parallax effect
  const handleMouseMove = useCallback((e) => {
    if (!selectedCard) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      setMousePos({ x, y })
    }
  }, [selectedCard])

  return (
    <div 
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #1a0f2e 0%, #0f0520 40%, #2d1b4e 70%, #FF8C3C 100%)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Orbitron', 'Inter', sans-serif"
      }}
      onMouseMove={handleMouseMove}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        @keyframes breathing {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes materialize {
          0% { 
            opacity: 0; 
            transform: scale(0) translateY(20px);
            filter: blur(10px);
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .holo-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        .holo-card:hover {
          transform: translateY(-12px) scale(1.05) !important;
          filter: drop-shadow(0 12px 24px rgba(0, 224, 255, 0.4));
        }
        
        .power-led {
          animation: breathing 2s ease-in-out infinite;
        }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 224, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Ambient particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(0, 224, 255, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 80% 70%, rgba(255, 60, 166, 0.1) 0%, transparent 50%),
                          radial-gradient(circle at 50% 50%, rgba(255, 140, 60, 0.05) 0%, transparent 50%)`,
        pointerEvents: 'none',
        opacity: 0.6
      }} />

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(0, 224, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(0, 224, 255, 0.3)',
          color: '#00E0FF',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: '700',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0, 224, 255, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 224, 255, 0.2)'
          e.currentTarget.style.borderColor = '#00E0FF'
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(0, 224, 255, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 224, 255, 0.1)'
          e.currentTarget.style.borderColor = 'rgba(0, 224, 255, 0.3)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 224, 255, 0.2)'
        }}
      >
        ← BACK TO HQ
      </button>

      {/* Main Content */}
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
          marginBottom: '3rem',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #00E0FF 0%, #FF3CA6 50%, #FF8C3C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
            textShadow: '0 0 40px rgba(0, 224, 255, 0.5)',
            animation: 'float 4s ease-in-out infinite'
          }}>
            FUTURE INITIATIVES
          </h1>
          <div style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
            color: '#00E0FF',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.8,
            fontWeight: '400'
          }}>
            Projects in Development
          </div>
        </div>

        {/* Projector Disk */}
        <div style={{
          position: 'relative',
          marginBottom: '4rem'
        }}>
          <div style={{
            width: '120px',
            height: '24px',
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #0a0e18 0%, #1a1e2e 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 2px 8px rgba(0, 224, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 224, 255, 0.2)',
            position: 'relative'
          }}>
            {/* Power LED */}
            <div 
              className="power-led"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isPowered 
                  ? 'radial-gradient(circle, #00FF88, #00CC66)' 
                  : 'radial-gradient(circle, #003322, #001a11)',
                boxShadow: isPowered 
                  ? '0 0 20px rgba(0, 255, 136, 0.8), inset 0 1px 3px rgba(255, 255, 255, 0.4)' 
                  : 'none',
                transition: 'all 0.3s ease'
              }}
            />
            
            {/* Projector Beam */}
            {isPowered && (
              <div style={{
                position: 'absolute',
                top: '-300px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '300px',
                background: 'linear-gradient(180deg, rgba(0, 224, 255, 0.15), transparent)',
                clipPath: 'polygon(40% 100%, 0% 0%, 100% 0%, 60% 100%)',
                pointerEvents: 'none',
                opacity: 0.6,
                filter: 'blur(2px)'
              }}>
                {/* Dust particles in beam */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: '2px',
                      height: '2px',
                      background: '#00E0FF',
                      borderRadius: '50%',
                      opacity: Math.random() * 0.6,
                      animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Holographic Plane */}
        {isPowered && (
          <div style={{
            position: 'relative',
            width: 'min(1100px, 90vw)',
            minHeight: '500px',
            background: 'linear-gradient(135deg, rgba(10, 14, 24, 0.4), rgba(15, 20, 35, 0.3))',
            backdropFilter: 'blur(10px) saturate(150%)',
            borderRadius: '20px',
            border: '2px solid rgba(0, 224, 255, 0.2)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(0, 224, 255, 0.05)',
            padding: '3rem',
            transform: `perspective(1200px) rotateX(-8deg) translateY(${mousePos.y * 0.5}px)`,
            transformOrigin: 'center bottom',
            transition: 'transform 0.3s ease-out',
            animation: 'materialize 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            transformStyle: 'preserve-3d'
          }}>
            
            {/* Scanline effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0, 224, 255, 0.03) 1px, transparent 2px)',
              pointerEvents: 'none',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, transparent 0%, rgba(0, 224, 255, 0.1) 50%, transparent 100%)',
                animation: 'scanline 4s linear infinite'
              }} />
            </div>

            {/* Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              position: 'relative',
              zIndex: 1
            }}>
              {upcomingProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="holo-card"
                  onClick={() => setSelectedCard(project)}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    position: 'relative',
                    padding: '1.5rem',
                    background: `linear-gradient(135deg, rgba(${
                      project.color === '#00E0FF' ? '0, 224, 255' :
                      project.color === '#FF3CA6' ? '255, 60, 166' :
                      project.color === '#FF8C3C' ? '255, 140, 60' :
                      project.color === '#06FFA5' ? '6, 255, 165' :
                      project.color === '#9D4EDD' ? '157, 78, 221' :
                      '72, 202, 228'
                    }, 0.08), rgba(10, 14, 24, 0.4))`,
                    border: `2px solid ${hoveredCard === project.id ? project.color : `${project.color}40`}`,
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: hoveredCard === project.id
                      ? `0 12px 40px ${project.color}40, inset 0 0 30px ${project.color}10`
                      : `0 8px 24px rgba(0, 0, 0, 0.4)`,
                    transform: hoveredCard === project.id 
                      ? `translateY(-12px) translateX(${mousePos.x * 0.3}px) scale(1.05)`
                      : 'translateY(0) scale(1)',
                    animation: `materialize 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                    animationDelay: `${index * 0.08}s`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Shimmer effect on hover */}
                  {hoveredCard === project.id && (
                    <div 
                      className="shimmer-effect"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '16px',
                        pointerEvents: 'none'
                      }}
                    />
                  )}

                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    padding: '0.25rem 0.75rem',
                    background: `${project.color}20`,
                    border: `1px solid ${project.color}`,
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: project.color,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}>
                    {project.status}
                  </div>

                  {/* Icon */}
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    filter: `drop-shadow(0 4px 12px ${project.color}60)`,
                    animation: 'float 3s ease-in-out infinite',
                    animationDelay: `${index * 0.2}s`
                  }}>
                    {project.icon}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    lineHeight: '1.3'
                  }}>
                    {project.title}
                  </h3>

                  {/* Category */}
                  <div style={{
                    fontSize: '0.85rem',
                    color: project.color,
                    marginBottom: '0.75rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}>
                    {project.category}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '1rem'
                  }}>
                    {project.description}
                  </p>

                  {/* Timeline */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginBottom: '1rem'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke={project.color} strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke={project.color} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {project.timeline}
                  </div>

                  {/* Tags */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.25rem 0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Expand hint */}
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    color: project.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: hoveredCard === project.id ? 1 : 0.6,
                    transition: 'opacity 0.3s ease'
                  }}>
                    Click for details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M12 5l7 7-7 7" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Card Modal */}
      {selectedCard && (
        <div
          onClick={() => setSelectedCard(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '700px',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(10, 14, 24, 0.95), rgba(15, 20, 35, 0.95))',
              backdropFilter: 'blur(20px)',
              border: `3px solid ${selectedCard.color}`,
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: `0 30px 100px ${selectedCard.color}40`,
              position: 'relative',
              animation: 'materialize 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `${selectedCard.color}20`,
                border: `2px solid ${selectedCard.color}`,
                color: selectedCard.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${selectedCard.color}40`
                e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${selectedCard.color}20`
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
              }}
            >
              ✕
            </button>

            {/* Icon */}
            <div style={{
              fontSize: '4rem',
              marginBottom: '1.5rem',
              filter: `drop-shadow(0 6px 20px ${selectedCard.color}80)`
            }}>
              {selectedCard.icon}
            </div>

            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              padding: '0.5rem 1rem',
              background: `${selectedCard.color}20`,
              border: `2px solid ${selectedCard.color}`,
              borderRadius: '24px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: selectedCard.color,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              {selectedCard.status}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: '#fff',
              marginBottom: '0.75rem',
              lineHeight: '1.2'
            }}>
              {selectedCard.title}
            </h2>

            {/* Category & Timeline */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              <div style={{
                color: selectedCard.color,
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                {selectedCard.category}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {selectedCard.timeline}
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1.5rem'
            }}>
              {selectedCard.details}
            </p>

            {/* Tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '2rem'
            }}>
              {selectedCard.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.5rem 1rem',
                    background: `${selectedCard.color}15`,
                    border: `1px solid ${selectedCard.color}40`,
                    borderRadius: '16px',
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: '600'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: `${selectedCard.color}10`,
              border: `1px solid ${selectedCard.color}30`,
              borderRadius: '12px',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.7)',
              fontStyle: 'italic'
            }}>
              💡 This project is in active development. Stay tuned for updates!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}