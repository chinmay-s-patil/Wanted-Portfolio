'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

/**
 * Single shared overlay (Layer 2).
 * Mode: 'photo' | 'pdf' | 'poster'
 * Guarantees only one viewer is ever mounted.
 * Uses createPortal to document.body with z-index: 99999 to render on top of all 3D layers.
 */
export default function ArtifactViewer({ mode, payload, onClose }) {
  const dialogRef = useRef(null)
  const prevActiveRef = useRef(null)

  // Focus trap + return focus on close
  useEffect(() => {
    if (!mode) return

    prevActiveRef.current = document.activeElement

    const timer = setTimeout(() => {
      dialogRef.current?.focus()
    }, 50)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = originalOverflow
      prevActiveRef.current?.focus?.()
    }
  }, [mode])

  if (!mode) return null

  const viewerContent = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={
        mode === 'photo'
          ? 'Photo lightbox'
          : mode === 'pdf'
            ? 'Document preview'
            : 'Poster full view'
      }
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(6px)',
        transform: 'translateZ(1000px)'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close viewer"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(40,40,40,0.9)',
          border: '2px solid #666',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Special Elite', monospace",
          fontSize: '1.4rem',
          transition: 'all 0.25s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ff4444'
          e.currentTarget.style.color = '#ff4444'
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#666'
          e.currentTarget.style.color = '#fff'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        ✕
      </button>

      {/* Content area */}
      <div
        style={{
          width: '100%',
          maxWidth: mode === 'pdf' ? '1100px' : mode === 'poster' ? '900px' : '95vw',
          maxHeight: '90vh',
          position: 'relative',
          zIndex: 99999,
          animation: 'viewerFadeIn 0.3s ease-out'
        }}
      >
        {mode === 'photo' && <PhotoView payload={payload} />}
        {mode === 'pdf' && <PdfView payload={payload} />}
        {mode === 'poster' && <PosterView payload={payload} />}
      </div>

      <style>{`
        @keyframes viewerFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(viewerContent, document.body)
    : viewerContent
}

/* ------------------------------------------------------------------ */
// PHOTO LIGHTBOX
function PhotoView({ payload }) {
  const { src, alt } = payload || {}
  if (!src) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}
    >
      <img
        src={src}
        alt={alt || 'Photo'}
        style={{
          maxWidth: '100%',
          maxHeight: '85vh',
          objectFit: 'contain',
          borderRadius: '4px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
// PDF PREVIEW (native iframe — clean, bright, zero bloat)
function PdfView({ payload }) {
  const { url, title, size } = payload || {}
  if (!url) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        height: '85vh',
        background: '#1a1a1a',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.2rem' }}>📄</span>
          <div>
            <div
              style={{
                fontSize: '0.95rem',
                color: '#fff',
                fontWeight: '600',
                fontFamily: "'Special Elite', monospace"
              }}
            >
              {title || 'Document'}
            </div>
            {size && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  fontFamily: "'Special Elite', monospace"
                }}
              >
                PDF, {size}
              </div>
            )}
          </div>
        </div>
        <a
          href={url}
          download
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 1rem',
            background: 'rgba(0,255,0,0.15)',
            border: '1px solid rgba(0,255,0,0.4)',
            borderRadius: '6px',
            color: '#00ff00',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: "'Special Elite', monospace",
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,255,0,0.25)'
            e.currentTarget.style.borderColor = '#00ff00'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,255,0,0.15)'
            e.currentTarget.style.borderColor = 'rgba(0,255,0,0.4)'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </a>
      </div>

      {/* Native PDF render */}
      <iframe
        src={url}
        title={title || 'PDF preview'}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          background: '#fff'
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
// POSTER FULL VIEW
function PosterView({ payload }) {
  const { locker } = payload || {}
  if (!locker) return null

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
        padding: '3rem',
        borderRadius: '4px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.1)',
        maxHeight: '85vh',
        overflow: 'auto',
        position: 'relative'
      }}
    >
      {/* Push pin */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '16px',
          height: '16px',
          background: 'radial-gradient(circle, #c00 0%, #800 100%)',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
        }}
      />

      <h2
        style={{
          fontSize: '2.2rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          color: '#1a1a1a',
          fontFamily: "'Special Elite', monospace",
          letterSpacing: '1px'
        }}
      >
        {locker.title}
      </h2>

      <div
        style={{
          fontSize: '1.4rem',
          color: locker.color,
          fontWeight: '600',
          marginBottom: '1rem',
          fontFamily: "'Special Elite', monospace"
        }}
      >
        {locker.degree}
      </div>

      <div
        style={{
          fontSize: '0.95rem',
          color: '#555',
          marginBottom: '1.5rem',
          fontFamily: "'Special Elite', monospace",
          letterSpacing: '0.5px'
        }}
      >
        {locker.institution} | {locker.period}
      </div>

      <p
        style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: '#2a2a2a',
          marginBottom: '2rem',
          fontFamily: "'Special Elite', monospace"
        }}
      >
        {locker.description}
      </p>

      {locker.highlights && locker.highlights.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#666',
              marginBottom: '0.75rem',
              fontWeight: '600',
              fontFamily: "'Special Elite', monospace",
              letterSpacing: '0.1em'
            }}
          >
            HIGHLIGHTS
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#2a2a2a' }}>
            {locker.highlights.map((h, i) => (
              <li
                key={i}
                style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  marginBottom: '0.4rem',
                  fontFamily: "'Special Elite', monospace"
                }}
              >
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div
          style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '0.75rem',
            fontWeight: '600',
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '0.1em'
          }}
        >
          KEY COMPETENCIES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {locker.skills?.map((skill, i) => (
            <span
              key={i}
              style={{
                padding: '0.4rem 0.8rem',
                background: locker.color,
                color: '#f6efe2',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontFamily: "'Special Elite', monospace",
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}