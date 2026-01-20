import { useState, useEffect } from 'react'

function VisualizationModal({ viz, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % viz.screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + viz.screenshots.length) % viz.screenshots.length)
  }

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
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
      }} />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(15, 20, 32, 0.95), rgba(10, 14, 26, 0.95))',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
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
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          className="hover:bg-[rgba(255,255,255,0.1)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Content */}
        <div style={{ 
          overflowY: 'auto', 
          overflowX: 'hidden',
          padding: '2.5rem',
          flex: 1
        }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            {/* WIP Badge */}
            {viz.isWIP && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                color: '#000',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px'
              }}>
                🚧 Work in Progress
              </div>
            )}

            <div style={{
              fontSize: '14px',
              color: viz.color,
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              {viz.category}
            </div>
            
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '12px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {viz.title}
            </h2>

            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginTop: '16px'
            }}>
              <div style={{
                padding: '8px 16px',
                background: `${viz.color}15`,
                border: `1px solid ${viz.color}40`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: viz.color
              }}>
                {viz.year}
              </div>
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {viz.type.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Screenshot Gallery */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            marginBottom: '2rem',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(0, 0, 0, 0.4)'
          }}>
            {viz.screenshots.map((screenshot, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: idx === currentImageIndex ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* ✅ ACTUAL IMAGE - Replace the placeholder div with this */}
                <img 
                  src={screenshot}
                  alt={`${viz.title} screenshot ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain', // Or 'cover' if you want it to fill the space
                    objectPosition: 'center'
                  }}
                  onError={(e) => {
                    // Fallback to icon if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div style="font-size: 64px; color: ${viz.color}; opacity: 0.3;">
                        ${viz.icon}
                      </div>
                    `;
                  }}
                />
              </div>
            ))}
  

            {/* Navigation */}
            {viz.screenshots.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Indicators */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10
                }}>
                  {viz.screenshots.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      style={{
                        width: idx === currentImageIndex ? '32px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: idx === currentImageIndex ? viz.color : 'rgba(255, 255, 255, 0.4)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              About
            </h3>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              {viz.longDescription}
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Key Features
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {viz.features.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: viz.color,
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.85)'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Technologies
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {viz.tech.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            padding: '24px',
            background: `${viz.color}10`,
            border: `1px solid ${viz.color}30`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '8px'
              }}>
                {viz.accessType}
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {viz.type === 'exe' || viz.type === 'python' 
                  ? 'Reach out via email or LinkedIn for beta access'
                  : 'Visit the web app to start using it'}
              </div>
            </div>
            {viz.link ? (
              <a
                href={viz.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  background: viz.color,
                  color: '#0a0e1a',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                className="hover:opacity-90"
              >
                {viz.ctaText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <a
                href="mailto:chinmaypatil2412@gmail.com"
                style={{
                  padding: '12px 24px',
                  background: viz.color,
                  color: '#0a0e1a',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                className="hover:opacity-90"
              >
                {viz.ctaText}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Custom scrollbar for WebKit browsers (Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: hsl(140, 70%, 60%); /* Your accent color */
          border-radius: 4px;
          border: 2px solid rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: hsl(140, 70%, 50%);
        }

        /* For the horizontal scroll container specifically */
        .scroll-container::-webkit-scrollbar {
          height: 8px;
        }

        .scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .scroll-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
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
      `}</style>
    </div>
  )
}

export default VisualizationModal;