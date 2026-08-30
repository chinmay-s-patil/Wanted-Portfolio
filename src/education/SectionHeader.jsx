'use client'

import { useNavigate } from 'react-router-dom'

export default function SectionHeader({ kicker = 'ACADEMIC DOSSIER', title = 'Institutional Archive', description = 'Academic credentials & institutional milestones • Classified Records' }) {
  const navigate = useNavigate()

  return (
    <header
      style={{
        position: 'relative',
        padding: '1.75rem 2.5rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        background: 'linear-gradient(180deg, rgba(10, 9, 8, 0.85) 0%, rgba(18, 16, 14, 0.4) 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: '2.5rem',
          background: 'linear-gradient(135deg, #1f1b14 0%, #0f0d0a 100%)',
          border: '1.5px solid #854d0e',
          color: '#d4c8b0',
          padding: '0.55rem 1.25rem',
          borderRadius: '4px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          fontFamily: "'Special Elite', monospace",
          transition: 'all 0.25s ease',
          boxShadow: '0 4px 14px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#eab308'
          e.currentTarget.style.color = '#eab308'
          e.currentTarget.style.boxShadow = '0 0 15px rgba(234, 179, 8, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#854d0e'
          e.currentTarget.style.color = '#d4c8b0'
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.1)'
        }}
      >
        ← BACK TO OFFICE
      </button>

      <div style={{ maxWidth: '800px', textAlign: 'center', margin: '0 auto' }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#eab308',
            fontWeight: '800',
            letterSpacing: '0.25em',
            marginBottom: '0.5rem',
            textShadow: '0 0 8px rgba(234, 179, 8, 0.4)',
            fontFamily: "'JetBrains Mono', 'Special Elite', monospace",
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#eab308', borderRadius: '50%', boxShadow: '0 0 6px #eab308' }} />
          {kicker}
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.7rem)',
            color: '#f5efe6',
            margin: '0 0 0.4rem 0',
            textShadow: '2px 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8)',
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '2px',
            fontWeight: '400',
            lineHeight: 1.2,
            textAlign: 'center'
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 'clamp(0.85rem, 1.3vw, 0.98rem)',
            color: '#a39b8b',
            margin: 0,
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '0.04em',
            lineHeight: 1.4,
            textAlign: 'center'
          }}
        >
          {description}
        </p>
      </div>
    </header>
  )
}