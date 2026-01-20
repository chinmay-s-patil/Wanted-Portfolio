// app/projects/ProjectFolder.jsx
'use client'

import { useEffect, useState, useRef } from 'react'

export default function ProjectFolder({ project, onClose }) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Video playback management
  useEffect(() => {
    if (!project.media || project.media.length === 0) return
    
    const currentMedia = project.media[currentMediaIndex]
    
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    })
    
    const currentVideo = videoRefs.current[currentMediaIndex]
    if (currentVideo && currentMedia?.type === 'video') {
      currentVideo.play().catch(err => console.log('Autoplay prevented:', err))
    }
  }, [currentMediaIndex, project.media])

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause()
          video.currentTime = 0
        }
      })
    }
  }, [])

  if (!project) return null

  const hasMultipleMedia = project.media && project.media.length > 1

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % project.media.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + project.media.length) % project.media.length)
  }

  const getYouTubeEmbedUrl = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
      /(?:youtube\.com\/embed\/)([^?\s]+)/,
      /(?:youtu\.be\/)([^?\s]+)/,
      /(?:youtube\.com\/v\/)([^?\s]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const videoId = match[1]
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=0&playlist=${videoId}`
      }
    }
    
    return url
  }

  const currentMedia = project.media?.[currentMediaIndex]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={onClose}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .folder-content-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .folder-content-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .folder-content-scroll::-webkit-scrollbar-thumb {
          background: #c4a574;
          border-radius: 4px;
        }

        .folder-content-scroll::-webkit-scrollbar-thumb:hover {
          background: #8b7355;
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)'
        }}
      />

      {/* Folder */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
          borderRadius: '0 12px 12px 12px',
          border: '8px solid #3d2817',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Folder Tab */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '0',
          width: '200px',
          height: '48px',
          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
          borderRadius: '12px 12px 0 0',
          border: '8px solid #3d2817',
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          fontWeight: '700',
          color: '#3d2817',
          fontFamily: "'Special Elite', monospace"
        }}>
          CASE FILE
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#3d2817',
            border: '2px solid #8b7355',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          aria-label="Close folder"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#f6efe2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div 
          className="folder-content-scroll"
          style={{ 
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '2.5rem',
            paddingTop: '4rem',
            flex: 1
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.85rem',
              color: '#8b7355',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              {project.category || 'Project'}
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              color: '#1a1a1a',
              fontFamily: "'Crimson Text', serif"
            }}>
              {project.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                color: '#666'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {project.period}
              </div>
            </div>
          </div>

          {/* Media Section */}
          {project.media && project.media.length > 0 && (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              marginBottom: '2rem',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(0, 0, 0, 0.1)',
              border: '3px solid #3d2817',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {project.media.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: idx === currentMediaIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: idx === currentMediaIndex ? 'auto' : 'none'
                  }}
                >
                  {item.type === 'link' && (
                    <iframe
                      src={getYouTubeEmbedUrl(item.src)}
                      title={item.caption || project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none'
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {item.type === 'video' && (
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      src={item.src}
                      loop
                      muted
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}

                  {item.type === 'image' && (
                    <img
                      src={item.src}
                      alt={item.caption || project.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
              ))}

              {hasMultipleMedia && (
                <>
                  <button
                    onClick={prevMedia}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(61, 40, 23, 0.8)',
                      border: '2px solid #8b7355',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    aria-label="Previous media"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="#f6efe2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <button
                    onClick={nextMedia}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(61, 40, 23, 0.8)',
                      border: '2px solid #8b7355',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    aria-label="Next media"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18L15 12L9 6" stroke="#f6efe2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '0.5rem',
                    zIndex: 10
                  }}>
                    {project.media.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentMediaIndex(idx)}
                        style={{
                          width: idx === currentMediaIndex ? '32px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: idx === currentMediaIndex 
                            ? '#8b7355'
                            : 'rgba(61, 40, 23, 0.4)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        aria-label={`View media ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1a1a1a',
                fontFamily: "'Crimson Text', serif"
              }}>
                Overview
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: '#2a2a2a'
              }}>
                {project.description}
              </p>
            </div>
          )}

          {/* Key Learnings */}
          {project.learnings && project.learnings.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1a1a1a',
                fontFamily: "'Crimson Text', serif"
              }}>
                Key Findings
              </h3>
              <ul style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem',
                listStyle: 'none',
                padding: 0
              }}>
                {project.learnings.map((learning, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      padding: '1rem',
                      background: 'rgba(61, 40, 23, 0.08)',
                      border: '2px solid rgba(61, 40, 23, 0.15)',
                      borderRadius: '8px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                      <circle cx="12" cy="12" r="10" stroke="#8b7355" strokeWidth="2"/>
                      <path d="M8 12l2 2 4-4" stroke="#8b7355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: '#2a2a2a'
                    }}>
                      {learning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#1a1a1a',
                fontFamily: "'Crimson Text', serif"
              }}>
                Technologies Used
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      background: 'rgba(61, 40, 23, 0.12)',
                      border: '2px solid rgba(61, 40, 23, 0.2)',
                      color: '#3d2817'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}