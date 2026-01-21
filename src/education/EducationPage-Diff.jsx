// src/education/EducationPage.jsx
'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OpenedLocker from './OpenedLocker'
import lockers from './lockers'

export default function EducationPage() {
  const [selectedLocker, setSelectedLocker] = useState(null)
  const navigate = useNavigate()

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      {/* Back Button */}
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
          zIndex: 1000
        }}
      >
        ← BACK TO HQ
      </button>

      {/* Locker shelf view when nothing selected */}
      {!selectedLocker ? (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem'
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#f6efe2',
              marginBottom: '0.5rem',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)'
            }}>
              EDUCATION ARCHIVE
            </h1>
            <p style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              color: '#00ff00',
              textShadow: '0 0 8px rgba(0,255,0,0.4)',
              letterSpacing: '0.15em'
            }}>
              SELECT A LOCKER TO VIEW CREDENTIALS
            </p>
          </div>

          {/* Lockers */}
          <div style={{
            display: 'flex',
            gap: '4rem',
            alignItems: 'flex-end'
          }}>
            {lockers.map((locker) => (
              <div
                key={locker.id}
                onClick={() => !locker.locked && setSelectedLocker(locker)}
                style={{
                  cursor: locker.locked ? 'not-allowed' : 'pointer',
                  opacity: locker.locked ? 0.5 : 1
                }}
              >
                {/* Simple locker representation - keeping your existing locker visual */}
                <div style={{
                  width: '260px',
                  height: '420px',
                  background: `linear-gradient(135deg, ${locker.color} 0%, ${locker.color}dd 100%)`,
                  borderRadius: '8px',
                  border: '3px solid rgba(0,0,0,0.4)',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.6)'
                }}
                onMouseEnter={(e) => !locker.locked && (e.currentTarget.style.transform = 'translateY(-8px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}>
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
                    color: '#f6efe2'
                  }}>
                    {locker.number}
                  </div>

                  {/* Label */}
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
                      fontSize: '0.9rem',
                      color: '#c4a574',
                      textAlign: 'center',
                      width: '200px'
                    }}>
                      {locker.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <OpenedLocker 
          locker={selectedLocker} 
          onClose={() => setSelectedLocker(null)} 
        />
      )}
    </div>
  )
}