// src/visualization/VizWindow.jsx
import { useEffect, useState } from 'react'

export default function VizWindow({ viz, onClose }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

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

  const nextScreen = () => {
    setCurrentScreenIndex((prev) => (prev + 1) % viz.screenshots.length)
  }

  const prevScreen = () => {
    setCurrentScreenIndex((prev) => (prev - 1 + viz.screenshots.length) % viz.screenshots.length)
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
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Window */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: '16px',
          border: '3px solid #00ff00',
          boxShadow: '0 0 40px rgba(0,255,0,0.3)',
          overflow: 'hidden',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Title Bar */}
        <div style={{
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          padding: '1rem 1.5rem',
          borderBottom: '2px solid #00ff00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{viz.icon}</span>
            <div>
              <div style={{
                fontSize: '1.2rem',
                fontWeight: '700',
                color: viz.color
              }}>
                {viz.title}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#0f0',
                opacity: 0.7
              }}>
                {viz.type.toUpperCase()} | {viz.year}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 0, 0, 0.2)',
              border: '2px solid #ff0000',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff0000',
              fontSize: '1.2rem',
              fontWeight: '700'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 80px)'
        }}>
          
          {/* Screenshots */}
          {viz.screenshots && viz.screenshots.length > 0 && (
            <div style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              marginBottom: '2rem',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#000',
              border: '2px solid #00ff00'
            }}>
              {viz.screenshots.map((screenshot, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: idx === currentScreenIndex ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={screenshot}
                    alt={`${viz.title} screenshot ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div style="font-size: 64px; color: ${viz.color}; opacity: 0.3;">
                          ${viz.icon}
                        </div>
                      `
                    }}
                  />
                </div>
              ))}

              {/* Navigation */}
              {viz.screenshots.length > 1 && (
                <>
                  <button
                    onClick={prevScreen}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0, 255, 0, 0.2)',
                      border: '2px solid #00ff00',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00ff00',
                      fontSize: '1.5rem',
                      zIndex: 10
                    }}
                  >
                    ‹
                  </button>

                  <button
                    onClick={nextScreen}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(0, 255, 0, 0.2)',
                      border: '2px solid #00ff00',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00ff00',
                      fontSize: '1.5rem',
                      zIndex: 10
                    }}
                  >
                    ›
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
                        onClick={() => setCurrentScreenIndex(idx)}
                        style={{
                          width: idx === currentScreenIndex ? '32px' : '8px',
                          height: '8px',
                          borderRadius: '4px',
                          background: idx === currentScreenIndex ? '#00ff00' : 'rgba(0, 255, 0, 0.3)',
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
          )}

          {/* Description */}
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.2)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#00ff00',
              marginBottom: '1rem',
              letterSpacing: '0.1em'
            }}>
              PROGRAM DESCRIPTION
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'rgba(0, 255, 0, 0.9)',
              lineHeight: '1.7'
            }}>
              {viz.longDescription}
            </p>
          </div>

          {/* Features */}
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 255, 0, 0.03)',
            border: '1px solid rgba(0, 255, 0, 0.15)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#00ff00',
              marginBottom: '1rem',
              letterSpacing: '0.1em'
            }}>
              KEY FEATURES
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem'
            }}>
              {viz.features.map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(0, 255, 0, 0.05)',
                    border: '1px solid rgba(0, 255, 0, 0.2)',
                    borderRadius: '6px'
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
                    fontSize: '0.85rem',
                    color: 'rgba(0, 255, 0, 0.9)'
                  }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(0, 255, 0, 0.03)',
            border: '1px solid rgba(0, 255, 0, 0.15)',
            borderRadius: '8px'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#00ff00',
              marginBottom: '1rem',
              letterSpacing: '0.1em'
            }}>
              TECHNOLOGY STACK
            </h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              {viz.tech.map((tech, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(0, 255, 0, 0.1)',
                    border: '1px solid #00ff00',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#00ff00',
                    fontWeight: '600'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            padding: '1.5rem',
            background: `${viz.color}15`,
            border: `2px solid ${viz.color}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: viz.color,
                marginBottom: '0.5rem'
              }}>
                {viz.accessType}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'rgba(0, 255, 0, 0.7)'
              }}>
                {viz.type === 'exe' || viz.type === 'python'
                  ? 'Contact for beta access'
                  : 'Available now'}
              </div>
            </div>
            {viz.link ? (
                <a
                href={viz.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: viz.color,
                  color: '#000',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {viz.ctaText} →
              </a>
            ) : (
                <a
                href="mailto:chinmaypatil2412@gmail.com"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: viz.color,
                  color: '#000',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {viz.ctaText} ✉
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}