'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// Lazy image component with intersection observer
const LazyImage = ({ src, alt, className, style }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = React.useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      {!loaded && !error && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8b7355'
        }}>
          Loading...
        </div>
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={className}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: error ? 'none' : 'block'
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  )
}

export default function EducationPage() {
  const [openLocker, setOpenLocker] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState({})
  const navigate = useNavigate()

  // Memoize lockers data
  const lockers = useMemo(() => [
    {
      id: 'masters',
      locked: false,
      label: 'M.Sc.',
      number: '042',
      color: '#2a5d84',
      degree: 'Aerospace Engineering',
      title: 'Master of Science',
      institution: 'Technical University of Munich',
      shortName: 'TUM',
      period: 'Oct 2025 — Present',
      location: 'Munich, Germany',
      description: 'Pursuing advanced studies in aerospace engineering with specialization in computational fluid dynamics and aerodynamics. Engaging with cutting-edge research in turbulence modeling, high-performance computing, and numerical methods for complex flow simulations.',
      skills: ['Advanced CFD', 'Turbulence Modeling', 'HPC', 'Numerical Methods', 'Aerodynamics', 'Research'],
      imageCount: 7,
      imageBase: '/Education/TUM/TUM',
      imageExt: '.jpg',
      gpa: '—',
      focus: 'CFD & Aeroacoustics'
    },
    {
      id: 'bachelors',
      locked: false,
      label: 'B.Tech',
      number: '021',
      color: '#5d4a2a',
      degree: 'Mechanical Engineering',
      title: 'Bachelor of Technology',
      institution: 'VIT Chennai',
      shortName: 'VITC',
      period: 'Jun 2021 — May 2025',
      location: 'Chennai, India',
      description: 'Completed comprehensive undergraduate program in mechanical engineering, developing strong fundamentals in thermodynamics, fluid mechanics, and computational methods. Gained hands-on experience through laboratory work, projects, and industry internships.',
      skills: ['Fluid Mechanics', 'CFD', 'Heat Transfer', 'Thermodynamics', 'Engineering Analysis', 'Mechanical Design'],
      imageCount: 8,
      imageBase: '/Education/VITC/VITC',
      imageExts: ['.jpeg', '.JPG', '.jpg', '.jpg', '.jpg', '.jpg', '.jpg', '.jpg'],
      gpa: 'Honors',
      focus: 'Thermal & Fluid Systems'
    },
    {
      id: 'phd',
      locked: true,
      label: 'Ph.D.',
      number: '???',
      color: '#4a2a5d',
      message: "We ain't there yet, buddy.",
      subtitle: "A little ambition goes a long way — plans TBD."
    }
  ], [])

  // Auto-advance slideshow with cleanup
  useEffect(() => {
    if (!openLocker) return
    
    const locker = lockers.find(l => l.id === openLocker)
    if (!locker || !locker.imageCount) return

    const timer = setInterval(() => {
      setCurrentImageIndex(prev => ({
        ...prev,
        [openLocker]: ((prev[openLocker] || 0) + 1) % locker.imageCount
      }))
    }, 4000)

    return () => clearInterval(timer)
  }, [openLocker, lockers])

  const handleLockerClick = useCallback((lockerId) => {
    const locker = lockers.find(l => l.id === lockerId)
    if (locker.locked) return
    
    setOpenLocker(prev => prev === lockerId ? null : lockerId)
    if (!currentImageIndex[lockerId]) {
      setCurrentImageIndex(prev => ({ ...prev, [lockerId]: 0 }))
    }
  }, [lockers, currentImageIndex])

  const getImagePath = useCallback((locker, index) => {
    if (locker.id === 'masters') {
      return `${locker.imageBase} (${index + 1})${locker.imageExt}`
    } else if (locker.id === 'bachelors') {
      return `${locker.imageBase} (${index + 1})${locker.imageExts[index]}`
    }
    return ''
  }, [])

  const currentLocker = useMemo(() => 
    lockers.find(l => l.id === openLocker),
    [lockers, openLocker]
  )

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(0,255,0,0.4); }
          50% { box-shadow: 0 0 25px rgba(0,255,0,0.6); }
        }

        .content-panel {
          animation: fadeIn 0.6s ease-out both;
        }
        
        .skill-tag {
          transition: all 0.2s ease;
        }
        
        .skill-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(196, 165, 116, 0.4);
        }
        
        .locker-door {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left center;
        }
        
        .locker-wrapper:hover .locker-door {
          transform: rotateY(-5deg);
        }
        
        .locker-wrapper.open .locker-door {
          transform: rotateY(-110deg);
        }
        
        .ventilation-slit {
          background: linear-gradient(90deg, #000 0%, #333 50%, #000 100%);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
        }
      `}</style>

      {/* Back to Hub Button - Bottom Left */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          bottom: '2rem',
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
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ← Back to Hub
      </button>

      {!openLocker ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative'
        }}>
          {/* Enhanced Background Elements */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, #3a3a3a 0%, transparent 100%)',
            opacity: 0.3
          }} />
          
          {/* Title moved to top-left with CADSection fonts */}
          <div style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            textAlign: 'left',
            zIndex: 10
          }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#f6efe2',
              marginBottom: '0.5rem',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)',
              fontFamily: "'Special Elite', monospace",
              letterSpacing: '2px',
              fontWeight: '400'
            }}>
              EDUCATION ARCHIVE
            </h1>
            {/* Green kicker/subtitle with CADSection styling */}
            <p style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              color: '#00ff00',
              fontStyle: 'normal',
              margin: 0,
              fontFamily: "'Special Elite', monospace",
              textShadow: '0 0 8px rgba(0,255,0,0.4)',
              letterSpacing: '0.15em'
            }}>
              ACADEMIC CREDENTIALS & INSTITUTIONAL MILESTONES
            </p>
          </div>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#aaa',
            marginBottom: '4rem',
            textAlign: 'center',
            fontStyle: 'normal',
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '0.1em',
            position: 'relative',
            zIndex: 10
          }}>
            SELECT A LOCKER TO VIEW CREDENTIALS
          </p>

          {/* Floor effect */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
            zIndex: 1
          }} />

          <div style={{
            display: 'flex',
            gap: '4rem',
            alignItems: 'flex-end',
            perspective: '1200px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            {lockers.map((locker) => (
              <div
                key={locker.id}
                className={`locker-wrapper ${!locker.locked && openLocker === locker.id ? 'open' : ''}`}
                onClick={() => handleLockerClick(locker.id)}
                style={{
                  position: 'relative',
                  cursor: locker.locked ? 'not-allowed' : 'pointer',
                  filter: locker.locked ? 'grayscale(0.3)' : 'none',
                  opacity: locker.locked ? 0.7 : 1
                }}
              >
                {/* Locker Base/Pedestal */}
                <div style={{
                  width: '260px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                  borderRadius: '0 0 6px 6px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.7)'
                }} />
                
                {/* Main Locker Body */}
                <div style={{
                  width: '260px',
                  height: locker.locked ? '340px' : '420px',
                  position: 'relative',
                  transform: 'translateY(-4px)'
                }}>
                  {/* Locker Door */}
                  <div className="locker-door" style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${locker.color} 0%, ${locker.color}dd 30%, ${locker.color}88 70%, ${locker.color}55 100%)`,
                    borderRadius: '8px 8px 4px 4px',
                    border: '3px solid rgba(0,0,0,0.4)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
                    overflow: 'hidden'
                  }}>
                    {/* Door frame border */}
                    <div style={{
                      position: 'absolute',
                      inset: '12px',
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      pointerEvents: 'none'
                    }} />
                    
                    {/* Hinges */}
                    <div style={{
                      position: 'absolute',
                      left: '-6px',
                      top: '60px',
                      width: '12px',
                      height: '40px',
                      background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
                      borderRadius: '2px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      left: '-6px',
                      bottom: '60px',
                      width: '12px',
                      height: '40px',
                      background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
                      borderRadius: '2px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
                    }} />
                    
                    {/* Lock mechanism */}
                    <div style={{
                      position: 'absolute',
                      top: '120px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40px',
                      height: '40px',
                      background: 'radial-gradient(circle, #888 0%, #444 100%)',
                      borderRadius: '50%',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: '124px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '20px',
                      background: '#222',
                      borderRadius: '3px'
                    }} />
                    
                    {/* Number plate */}
                    <div style={{
                      position: 'absolute',
                      top: '50px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.7)',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: locker.locked ? '#666' : '#f6efe2',
                      fontFamily: "'Special Elite', monospace",
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {locker.number}
                    </div>
                    
                    {/* Ventilation slits */}
                    <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} className="ventilation-slit" style={{ height: '2px', borderRadius: '1px' }} />
                      ))}
                    </div>
                    
                    {/* Label at bottom */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#f6efe2',
                      padding: '6px 16px',
                      borderRadius: '3px',
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: locker.color,
                      fontFamily: "'Special Elite', monospace"
                    }}>
                      {locker.label}
                    </div>
                    
                    {/* Metallic shine effect */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: '60%',
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
                      pointerEvents: 'none'
                    }} />
                  </div>
                  
                  {/* Locker Interior (visible when open) */}
                  {!locker.locked && (
                    <div style={{
                      position: 'absolute',
                      inset: '3px',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.6)',
                      opacity: openLocker === locker.id ? 1 : 0,
                      transition: 'opacity 0.4s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '0.8rem'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📂</div>
                        <div>CREDENTIALS</div>
                        <div>INSIDE</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Locked message */}
                {locker.locked && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: '200px',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#c4a574', fontStyle: 'normal', fontFamily: "'Special Elite', monospace" }}>
                      {locker.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          position: 'relative',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
        }}>
          {/* Close Button - Fixed position to ensure visibility */}
          <button
            onClick={() => setOpenLocker(null)}
            style={{
              position: 'fixed',
              top: '2rem',
              right: '2rem',
              background: 'rgba(40, 40, 40, 0.9)',
              border: '2px solid #666',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1001,
              fontFamily: "'Special Elite', monospace",
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            ✕ CLOSE LOCKER
          </button>

          {/* Open Locker Interior View */}
          <div className="content-panel" style={{
            maxWidth: '1600px',
            width: '100%',
            height: '85%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            marginTop: '6rem',
            padding: '0 3rem',
            position: 'relative'
          }}>
            {/* Locker Frame around content */}
            <div style={{
              position: 'absolute',
              inset: '-2rem',
              border: '16px solid',
              borderImage: `linear-gradient(135deg, ${currentLocker?.color} 0%, #1a1a1a 50%) 1`,
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)',
              pointerEvents: 'none',
              zIndex: -1
            }} />
            
            {/* Interior shelf effect */}
            <div style={{
              position: 'absolute',
              top: '-1rem',
              left: '1rem',
              right: '1rem',
              height: '8px',
              background: 'linear-gradient(90deg, #333 0%, #555 50%, #333 100%)',
              borderRadius: '2px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.8)'
            }} />

            {/* Left Side - Document Panel (like paper on locker door) */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              {/* Push pin effect */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                background: 'radial-gradient(circle, #c00 0%, #800 100%)',
                borderRadius: '50%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }} />
              
              <div style={{
                background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
                padding: '3rem',
                borderRadius: '2px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)',
                border: 'none',
                position: 'relative',
                clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 5% 100%, 0 95%)'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '50%'
                }} />
                
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1a1a1a',
                  fontFamily: "'Special Elite', monospace",
                  letterSpacing: '1px'
                }}>
                  {currentLocker?.title}
                </h2>

                <div style={{ 
                  fontSize: '1.3rem', 
                  color: currentLocker?.color, 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  {currentLocker?.degree}
                </div>
                
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#555', 
                  marginBottom: '1.5rem',
                  fontFamily: "'Special Elite', monospace",
                  letterSpacing: '0.5px'
                }}>
                  {currentLocker?.institution} | {currentLocker?.period}
                </div>

                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.8', 
                  color: '#2a2a2a', 
                  marginBottom: '2rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  {currentLocker?.description}
                </p>

                <div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    marginBottom: '0.75rem', 
                    fontWeight: '600',
                    fontFamily: "'Special Elite', monospace",
                    letterSpacing: '0.1em'
                  }}>
                    KEY COMPETENCIES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {currentLocker?.skills.map((skill, i) => (
                      <span key={i} className="skill-tag" style={{
                        padding: '0.4rem 0.8rem',
                        background: currentLocker?.color,
                        color: '#f6efe2',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontFamily: "'Special Elite', monospace",
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Photo Wall (like inside locker door) */}
            {currentLocker?.imageCount && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                {/* Magnetic photo corners effect */}
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-8px',
                  width: '24px',
                  height: '24px',
                  background: '#2a5d84',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '24px',
                  height: '24px',
                  background: '#2a5d84',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
                }} />
                
                <div style={{
                  minHeight: '450px',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
                  border: '8px solid #3d2817',
                  background: '#000'
                }}>
                  {[...Array(currentLocker.imageCount)].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: idx === (currentImageIndex[openLocker] || 0) ? 'relative' : 'absolute',
                        inset: 0,
                        opacity: idx === (currentImageIndex[openLocker] || 0) ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                        pointerEvents: idx === (currentImageIndex[openLocker] || 0) ? 'auto' : 'none'
                      }}
                    >
                      {idx === (currentImageIndex[openLocker] || 0) && (
                        <LazyImage
                          src={getImagePath(currentLocker, idx)}
                          alt={`${currentLocker.institution} ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            minHeight: '450px'
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    color: '#f6efe2',
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {(currentImageIndex[openLocker] || 0) + 1} / {currentLocker.imageCount}
                  </div>
                </div>
                
                {/* Additional info card */}
                <div style={{
                  background: 'rgba(0,0,0,0.4)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#888' }}>Location:</span>
                    <span style={{ color: '#fff' }}>{currentLocker.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#888' }}>GPA:</span>
                    <span style={{ color: '#fff' }}>{currentLocker.gpa}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Focus:</span>
                    <span style={{ color: '#fff' }}>{currentLocker.focus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}