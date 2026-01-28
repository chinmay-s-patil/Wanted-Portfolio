// src/upcoming/UpcomingPage.jsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import upcomingProjects from './upcomingData'

export default function UpcomingPage() {
  const [isPowered, setIsPowered] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()

  const ITEMS_PER_PAGE = 3
  const totalPages = Math.ceil(upcomingProjects.length / ITEMS_PER_PAGE)

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
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        scrollToPage(currentPage - 1)
      } else if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        scrollToPage(currentPage + 1)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedCard, currentPage, totalPages])

  // Mouse parallax effect
  const handleMouseMove = useCallback((e) => {
    if (!selectedCard) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      setMousePos({ x, y })
    }
  }, [selectedCard])

  // Scroll handler
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const page = Math.round(scrollLeft / containerWidth)
      setCurrentPage(Math.min(page, totalPages - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [totalPages])

  const scrollToPage = (pageIndex) => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const containerWidth = container.clientWidth
    container.scrollTo({ left: containerWidth * pageIndex, behavior: 'smooth' })
    setCurrentPage(pageIndex)
  }

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
            transform: scale(0) translateY(1rem);
            filter: blur(0.5rem);
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
          50% { transform: translateY(-0.5rem); }
        }
        
        .holo-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        
        .holo-card:hover {
          transform: translateY(-0.5rem) scale(1.03) !important;
          filter: drop-shadow(0 0.5rem 1rem rgba(0, 224, 255, 0.4));
          z-index: 10;
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
        
        .cards-scroll-container {
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
        }
        
        .cards-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .card-page {
          scroll-snap-align: start;
          scroll-snap-stop: always;
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
          top: '1.6rem',
          left: '1.6rem',
          background: 'rgba(0, 224, 255, 0.1)',
          backdropFilter: 'blur(0.5rem)',
          border: '2px solid rgba(0, 224, 255, 0.3)',
          color: '#00E0FF',
          padding: '0.6rem 1.2rem',
          borderRadius: '0.6rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: '700',
          transition: 'all 0.3s ease',
          boxShadow: '0 0.2rem 1rem rgba(0, 224, 255, 0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 224, 255, 0.2)'
          e.currentTarget.style.borderColor = '#00E0FF'
          e.currentTarget.style.boxShadow = '0 0.3rem 1.5rem rgba(0, 224, 255, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 224, 255, 0.1)'
          e.currentTarget.style.borderColor = 'rgba(0, 224, 255, 0.3)'
          e.currentTarget.style.boxShadow = '0 0.2rem 1rem rgba(0, 224, 255, 0.2)'
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
        padding: '1.6rem'
      }}>
        
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.4rem',
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #00E0FF 0%, #FF3CA6 50%, #FF8C3C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.4rem',
            letterSpacing: '0.05em',
            textShadow: '0 0 2rem rgba(0, 224, 255, 0.5)',
            animation: 'float 4s ease-in-out infinite'
          }}>
            FUTURE INITIATIVES
          </h1>
          <div style={{
            fontSize: '0.88rem',
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
          marginBottom: '3.2rem'
        }}>
          <div style={{
            width: '6rem',
            height: '1.2rem',
            borderRadius: '999px',
            background: 'linear-gradient(180deg, #0a0e18 0%, #1a1e2e 100%)',
            boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.8), inset 0 0.1rem 0.4rem rgba(0, 224, 255, 0.1)',
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
                width: '0.6rem',
                height: '0.6rem',
                borderRadius: '50%',
                background: isPowered 
                  ? 'radial-gradient(circle, #00FF88, #00CC66)' 
                  : 'radial-gradient(circle, #003322, #001a11)',
                boxShadow: isPowered 
                  ? '0 0 1rem rgba(0, 255, 136, 0.8), inset 0 0.05rem 0.15rem rgba(255, 255, 255, 0.4)' 
                  : 'none',
                transition: 'all 0.3s ease'
              }}
            />
            
            {/* Projector Beam */}
            {isPowered && (
              <div style={{
                position: 'absolute',
                top: '-15rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '4rem',
                height: '15rem',
                background: 'linear-gradient(180deg, rgba(0, 224, 255, 0.15), transparent)',
                clipPath: 'polygon(40% 100%, 0% 0%, 100% 0%, 60% 100%)',
                pointerEvents: 'none',
                opacity: 0.6,
                filter: 'blur(0.1rem)'
              }}>
                {/* Dust particles in beam */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: '0.1rem',
                      height: '0.1rem',
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

        {/* Page Navigation Buttons */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.6rem',
            zIndex: 10
          }}>
            <button
              onClick={() => scrollToPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: '50%',
                background: currentPage === 0 ? 'rgba(0, 224, 255, 0.05)' : 'rgba(0, 224, 255, 0.15)',
                border: '2px solid rgba(0, 224, 255, 0.3)',
                color: currentPage === 0 ? 'rgba(0, 224, 255, 0.3)' : '#00E0FF',
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                opacity: currentPage === 0 ? 0.3 : 1,
                transition: 'all 0.3s ease',
                boxShadow: currentPage === 0 ? 'none' : '0 0.2rem 0.8rem rgba(0, 224, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (currentPage > 0) {
                  e.currentTarget.style.background = 'rgba(0, 224, 255, 0.25)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = currentPage === 0 ? 'rgba(0, 224, 255, 0.05)' : 'rgba(0, 224, 255, 0.15)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ‹
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToPage(idx)}
                  style={{
                    width: idx === currentPage ? '2.6rem' : '1.8rem',
                    height: '0.35rem',
                    borderRadius: '0.2rem',
                    background: idx === currentPage ? '#00E0FF' : 'rgba(0, 224, 255, 0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: idx === currentPage ? '0 0 0.6rem rgba(0, 224, 255, 0.6)' : 'none'
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: '50%',
                background: currentPage === totalPages - 1 ? 'rgba(0, 224, 255, 0.05)' : 'rgba(0, 224, 255, 0.15)',
                border: '2px solid rgba(0, 224, 255, 0.3)',
                color: currentPage === totalPages - 1 ? 'rgba(0, 224, 255, 0.3)' : '#00E0FF',
                cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                transition: 'all 0.3s ease',
                boxShadow: currentPage === totalPages - 1 ? 'none' : '0 0.2rem 0.8rem rgba(0, 224, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (currentPage < totalPages - 1) {
                  e.currentTarget.style.background = 'rgba(0, 224, 255, 0.25)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = currentPage === totalPages - 1 ? 'rgba(0, 224, 255, 0.05)' : 'rgba(0, 224, 255, 0.15)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ›
            </button>
          </div>
        )}

        {/* Holographic Plane with Scrolling Cards */}
        {isPowered && (
          <div style={{
            position: 'relative',
            width: 'min(55rem, 90vw)',
            minHeight: '25rem',
            background: 'linear-gradient(135deg, rgba(10, 14, 24, 0.4), rgba(15, 20, 35, 0.3))',
            backdropFilter: 'blur(0.5rem) saturate(150%)',
            borderRadius: '1rem',
            border: '2px solid rgba(0, 224, 255, 0.2)',
            boxShadow: '0 1.5rem 4rem rgba(0, 0, 0, 0.6), inset 0 0 2rem rgba(0, 224, 255, 0.05)',
            padding: '2.4rem',
            transform: `perspective(60rem) rotateX(-8deg) translateY(${mousePos.y * 0.5}px)`,
            transformOrigin: 'center bottom',
            transition: 'transform 0.3s ease-out',
            animation: 'materialize 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            transformStyle: 'preserve-3d',
            overflow: 'visible'
          }}>
            
            {/* Scanline effect */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, transparent 0px, rgba(0, 224, 255, 0.03) 1px, transparent 2px)',
              pointerEvents: 'none',
              borderRadius: '1rem',
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

            {/* Horizontal Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="cards-scroll-container"
              style={{
                display: 'flex',
                overflowX: 'auto',
                overflowY: 'visible',
                gap: '1.6rem',
                position: 'relative',
                zIndex: 1,
                WebkitOverflowScrolling: 'touch',
                margin: '-1.2rem -0.4rem',
                padding: '1.2rem 0.4rem'
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="card-page"
                  style={{
                    minWidth: '100%',
                    width: '100%',
                    flexShrink: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.6rem',
                    padding: '0.8rem 0'
                  }}
                >
                  {upcomingProjects
                    .slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE)
                    .map((project, index) => (
                      <div
                        key={project.id}
                        className="holo-card"
                        onClick={() => setSelectedCard(project)}
                        onMouseEnter={() => setHoveredCard(project.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          position: 'relative',
                          padding: '1.2rem',
                          background: `linear-gradient(135deg, rgba(${
                            project.color === '#00E0FF' ? '0, 224, 255' :
                            project.color === '#FF3CA6' ? '255, 60, 166' :
                            project.color === '#FF8C3C' ? '255, 140, 60' :
                            project.color === '#06FFA5' ? '6, 255, 165' :
                            project.color === '#9D4EDD' ? '157, 78, 221' :
                            '72, 202, 228'
                          }, 0.08), rgba(10, 14, 24, 0.4))`,
                          border: `2px solid ${hoveredCard === project.id ? project.color : `${project.color}40`}`,
                          borderRadius: '0.8rem',
                          cursor: 'pointer',
                          boxShadow: hoveredCard === project.id
                            ? `0 0.6rem 2rem ${project.color}40, inset 0 0 1.5rem ${project.color}10`
                            : `0 0.4rem 1.2rem rgba(0, 0, 0, 0.4)`,
                          transform: hoveredCard === project.id 
                            ? `translateY(-0.6rem) translateX(${mousePos.x * 0.3}px) scale(1.05)`
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
                              borderRadius: '0.8rem',
                              pointerEvents: 'none'
                            }}
                          />
                        )}

                        {/* Status Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '0.8rem',
                          right: '0.8rem',
                          padding: '0.2rem 0.6rem',
                          background: `${project.color}20`,
                          border: `1px solid ${project.color}`,
                          borderRadius: '1rem',
                          fontSize: '0.56rem',
                          fontWeight: '700',
                          color: project.color,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}>
                          {project.status}
                        </div>

                        {/* Icon */}
                        <div style={{
                          fontSize: '2.4rem',
                          marginBottom: '0.8rem',
                          filter: `drop-shadow(0 0.2rem 0.6rem ${project.color}60)`,
                          animation: 'float 3s ease-in-out infinite',
                          animationDelay: `${index * 0.2}s`
                        }}>
                          {project.icon}
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontSize: '1.04rem',
                          fontWeight: '700',
                          color: '#fff',
                          marginBottom: '0.4rem',
                          lineHeight: '1.3'
                        }}>
                          {project.title}
                        </h3>

                        {/* Category */}
                        <div style={{
                          fontSize: '0.68rem',
                          color: project.color,
                          marginBottom: '0.6rem',
                          fontWeight: '600',
                          letterSpacing: '0.05em'
                        }}>
                          {project.category}
                        </div>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.72rem',
                          lineHeight: '1.6',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '0.8rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {project.description}
                        </p>

                        {/* Timeline */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.68rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '0.8rem'
                        }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke={project.color} strokeWidth="2"/>
                            <path d="M12 6v6l4 2" stroke={project.color} strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          {project.timeline}
                        </div>

                        {/* Tags */}
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem'
                        }}>
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              style={{
                                padding: '0.2rem 0.6rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.6rem',
                                fontSize: '0.6rem',
                                color: 'rgba(255, 255, 255, 0.7)'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Expand hint */}
                        <div style={{
                          marginTop: '0.8rem',
                          fontSize: '0.64rem',
                          color: project.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          opacity: hoveredCard === project.id ? 1 : 0.6,
                          transition: 'opacity 0.3s ease'
                        }}>
                          Click for details
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M12 5l7 7-7 7" stroke={project.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    ))}
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
            backdropFilter: 'blur(0.6rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.6rem',
            zIndex: 2000,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '35rem',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, rgba(10, 14, 24, 0.95), rgba(15, 20, 35, 0.95))',
              backdropFilter: 'blur(1rem)',
              border: `3px solid ${selectedCard.color}`,
              borderRadius: '1.2rem',
              padding: '2rem',
              boxShadow: `0 1.5rem 5rem ${selectedCard.color}40`,
              position: 'relative',
              animation: 'materialize 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: `${selectedCard.color}20`,
                border: `2px solid ${selectedCard.color}`,
                color: selectedCard.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
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
              fontSize: '3.2rem',
              marginBottom: '1.2rem',
              filter: `drop-shadow(0 0.3rem 1rem ${selectedCard.color}80)`
            }}>
              {selectedCard.icon}
            </div>

            {/* Status Badge */}
            <div style={{
              display: 'inline-flex',
              padding: '0.4rem 0.8rem',
              background: `${selectedCard.color}20`,
              border: `2px solid ${selectedCard.color}`,
              borderRadius: '1.2rem',
              fontSize: '0.64rem',
              fontWeight: '700',
              color: selectedCard.color,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '0.8rem'
            }}>
              {selectedCard.status}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: '900',
              color: '#fff',
              marginBottom: '0.6rem',
              lineHeight: '1.2'
            }}>
              {selectedCard.title}
            </h2>

            {/* Category & Timeline */}
            <div style={{
              display: 'flex',
              gap: '1.6rem',
              marginBottom: '1.6rem',
              fontSize: '0.76rem',
              flexWrap: 'wrap'
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
                gap: '0.4rem'
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {selectedCard.timeline}
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.88rem',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1.2rem'
            }}>
              {selectedCard.details}
            </p>

            {/* Tags */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              marginTop: '1.6rem'
            }}>
              {selectedCard.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: `${selectedCard.color}15`,
                    border: `1px solid ${selectedCard.color}40`,
                    borderRadius: '0.8rem',
                    fontSize: '0.68rem',
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
              marginTop: '1.6rem',
              padding: '0.8rem',
              background: `${selectedCard.color}10`,
              border: `1px solid ${selectedCard.color}30`,
              borderRadius: '0.6rem',
              fontSize: '0.72rem',
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