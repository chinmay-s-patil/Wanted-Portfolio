'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

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
      description: 'Pursuing advanced studies in aerospace engineering with specialization in computational fluid dynamics and aerodynamics.',
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
      description: 'Completed comprehensive undergraduate program in mechanical engineering.',
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
      background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .content-panel {
          animation: fadeIn 0.6s ease-out 0.3s both;
        }

        .skill-tag {
          transition: all 0.2s ease;
        }

        .skill-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(196, 165, 116, 0.4);
        }
      `}</style>

      <button
        onClick={() => router.push('/hub')}
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
          fontFamily: "'Special Elite', monospace",
          transition: 'all 0.3s ease'
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
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: '#f6efe2',
            marginBottom: '1rem',
            textAlign: 'center',
            textShadow: '0 4px 12px rgba(0,0,0,0.8)'
          }}>
            Education Archive
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#c4a574',
            marginBottom: '4rem',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Select a locker to view credentials
          </p>

          <div style={{
            display: 'flex',
            gap: '3rem',
            alignItems: 'flex-end',
            perspective: '1000px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {lockers.map((locker) => (
              <div
                key={locker.id}
                onClick={() => handleLockerClick(locker.id)}
                style={{
                  width: '240px',
                  height: locker.locked ? '320px' : '400px',
                  background: `linear-gradient(135deg, ${locker.color} 0%, ${locker.color}dd 100%)`,
                  borderRadius: '8px 8px 4px 4px',
                  position: 'relative',
                  cursor: locker.locked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  border: '3px solid rgba(0,0,0,0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  transform: locker.locked ? 'scale(0.9)' : 'scale(1)',
                  opacity: locker.locked ? 0.6 : 1
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '100px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: locker.locked ? '#666' : '#f6efe2',
                  fontFamily: "'Crimson Text', serif"
                }}>
                  {locker.number}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '180px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#f6efe2',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: locker.color
                }}>
                  {locker.label}
                </div>

                {locker.locked && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    width: '200px'
                  }}>
                    <div style={{ fontSize: '0.9rem', color: '#c4a574', fontStyle: 'italic' }}>
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
          padding: '2rem',
          position: 'relative',
          overflowY: 'auto'
        }}>
          <button
            onClick={() => setOpenLocker(null)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'rgba(196, 165, 116, 0.2)',
              border: '2px solid #8b7355',
              color: '#f6efe2',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 1000
            }}
          >
            ✕ Close
          </button>

          <div className="content-panel" style={{
            maxWidth: '1400px',
            width: '100%',
            height: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'start',
            marginTop: '4rem'
          }}>
            {/* Poster */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
                padding: '3rem',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                border: '8px solid #3d2817'
              }}>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  color: '#1a1a1a',
                  fontFamily: "'Crimson Text', serif"
                }}>
                  {currentLocker?.title}
                </h2>

                <div style={{ fontSize: '1.5rem', color: currentLocker?.color, fontWeight: '600', marginBottom: '1.5rem' }}>
                  {currentLocker?.degree}
                </div>

                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#2a2a2a', marginBottom: '2rem' }}>
                  {currentLocker?.description}
                </p>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem', fontWeight: '600' }}>
                    KEY COMPETENCIES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {currentLocker?.skills.map((skill, i) => (
                      <span key={i} className="skill-tag" style={{
                        padding: '0.5rem 1rem',
                        background: currentLocker?.color,
                        color: '#f6efe2',
                        borderRadius: '6px',
                        fontSize: '0.85rem'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Wall */}
            {currentLocker?.imageCount && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{
                  minHeight: '400px',
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  border: '8px solid #3d2817'
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
                            minHeight: '400px'
                          }}
                        />
                      )}
                    </div>
                  ))}

                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    color: '#f6efe2'
                  }}>
                    {(currentImageIndex[openLocker] || 0) + 1} / {currentLocker.imageCount}
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