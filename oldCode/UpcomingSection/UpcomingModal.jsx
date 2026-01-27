import { useState, useEffect, useRef } from 'react'

function UpcomingModal({ project, onClose }) {
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
          maxWidth: '900px',
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '48px',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
              }}>
                {project.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  color: project.color,
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  {project.category}
                </div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {project.title}
                </h2>
              </div>
            </div>

            {/* Status Row */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginTop: '16px'
            }}>
              <div style={{
                padding: '8px 16px',
                background: `${project.color}15`,
                border: `2px solid ${project.color}40`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: project.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {project.status}
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
                📅 ETA: {project.estimatedCompletion}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.95)'
              }}>
                Development Progress
              </h3>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: project.color,
                fontFamily: 'monospace'
              }}>
                {project.progress}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${project.progress}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${project.color}, ${project.color}CC)`,
                borderRadius: '6px',
                boxShadow: `0 0 16px ${project.color}80`,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Project Overview
            </h3>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.8',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              {project.description}
            </p>
          </div>

          {/* Solver Info */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Computational Approach
            </h3>
            <div style={{
              padding: '16px 20px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: `2px solid ${project.color}30`,
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke={project.color} strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke={project.color} strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke={project.color} strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke={project.color} strokeWidth="2"/>
              </svg>
              <div>
                <div style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '4px'
                }}>
                  OpenFOAM Solver
                </div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: project.color,
                  fontFamily: 'monospace'
                }}>
                  {project.solver}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Challenges */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'rgba(255, 255, 255, 0.95)'
            }}>
              Current Challenges
            </h3>
            <div style={{
              display: 'grid',
              gap: '12px'
            }}>
              {project.challenges.map((challenge, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease'
                  }}
                  className="challenge-item"
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: project.color,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${project.color}80`
                  }} />
                  <span style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.85)',
                    flex: 1
                  }}>
                    {challenge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

        .challenge-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  )
};

export default UpcomingModal;