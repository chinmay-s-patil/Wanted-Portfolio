'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Layer 1 — Opened locker interior.
 * Left: poster (~55%). Right: artifact column (~40%). Bottom: nav.
 */
export default function LockerPanel({
  locker,
  lockers,
  currentImageIndex,
  onImageChange,
  onOpenViewer,
  onClose,
  onPrev,
  onNext
}) {
  const panelRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState({})

  // Auto-advance slideshow
  useEffect(() => {
    if (!locker.images?.length) return
    const timer = setInterval(() => {
      onImageChange((prev) => (prev + 1) % locker.images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [locker.images, onImageChange])

  // Focus panel on mount (for keyboard nav)
  useEffect(() => {
    const t = setTimeout(() => panelRef.current?.focus(), 100)
    return () => clearTimeout(t)
  }, [locker.id])

  // Prev / Next locker helpers
  const currentIndex = lockers.findIndex((l) => l.id === locker.id)
  const prevLocker = lockers[currentIndex - 1]
  const nextLocker = lockers[currentIndex + 1]

  const canGoPrev = prevLocker && !prevLocker.locked
  const canGoNext = nextLocker && !nextLocker.locked

  const handlePrev = useCallback(() => {
    if (canGoPrev) onPrev()
  }, [canGoPrev, onPrev])

  const handleNext = useCallback(() => {
    if (canGoNext) onNext()
  }, [canGoNext, onNext])

  // Keyboard nav for prev/next (only when panel has focus and viewer is closed)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    },
    [handlePrev, handleNext]
  )

  const currentImg = locker.images?.[currentImageIndex]

  return (
    <div
      ref={panelRef}
      role="region"
      aria-labelledby="poster-title"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(3px)',
        animation: 'panelFadeIn 0.4s ease-out'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close locker"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          background: 'rgba(40,40,40,0.9)',
          border: '2px solid #666',
          color: '#fff',
          padding: '0.6rem 1.25rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          cursor: 'pointer',
          zIndex: 101,
          fontFamily: "'Special Elite', monospace",
          transition: 'all 0.25s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ff4444'
          e.currentTarget.style.color = '#ff4444'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#666'
          e.currentTarget.style.color = '#fff'
        }}
      >
        ✕ Close Locker
      </button>

      {/* Main content frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '1600px',
          height: 'calc(100% - 5rem)',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr auto',
          gap: '1.5rem',
          position: 'relative'
        }}
      >
        {/* Locker frame border */}
        <div
          style={{
            position: 'absolute',
            inset: '-1.5rem',
            border: `10px solid ${locker.color}`,
            borderRadius: '12px',
            opacity: 0.25,
            pointerEvents: 'none',
            boxShadow: `inset 0 0 60px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)`
          }}
        />

        {/* Top shelf */}
        <div
          style={{
            position: 'absolute',
            top: '-0.75rem',
            left: '0.5rem',
            right: '0.5rem',
            height: '8px',
            background: 'linear-gradient(90deg, #333 0%, #555 50%, #333 100%)',
            borderRadius: '2px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.8)',
            pointerEvents: 'none'
          }}
        />

        {/* Content grid: poster + artifacts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
            overflowY: 'auto',
            padding: '1rem',
            paddingBottom: '0'
          }}
        >
          {/* LEFT — Poster */}
          <Poster
            locker={locker}
            onOpenViewer={() =>
              onOpenViewer('poster', { locker })
            }
          />

          {/* RIGHT — Artifact column */}
          <ArtifactColumn
            locker={locker}
            currentImageIndex={currentImageIndex}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            currentImg={currentImg}
            onOpenViewer={onOpenViewer}
            onImageChange={onImageChange}
          />
        </div>

        {/* BOTTOM — Navigation */}
        <LockerNav
          prevLocker={prevLocker}
          nextLocker={nextLocker}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={handlePrev}
          onNext={handleNext}
          onClose={onClose}
        />
      </div>

      <style>{`
        @keyframes panelFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ================================================================== */
// POSTER (left column)
function Poster({ locker, onOpenViewer }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        minHeight: '100%'
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
          boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
          zIndex: 2
        }}
      />

      <div
        onClick={onOpenViewer}
        role="button"
        tabIndex={0}
        aria-label="View poster full screen"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenViewer()
          }
        }}
        style={{
          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
          padding: '2.5rem',
          borderRadius: '2px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)',
          border: 'none',
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 5% 100%, 0 95%)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)'
        }}
      >
        {/* Watermark circle */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            background: 'rgba(0,0,0,0.04)',
            borderRadius: '50%'
          }}
        />

        {/* Kicker */}
        <div
          style={{
            fontSize: '0.8rem',
            color: locker.color,
            fontWeight: '700',
            letterSpacing: '0.15em',
            marginBottom: '0.5rem',
            fontFamily: "'Special Elite', monospace",
            textTransform: 'uppercase'
          }}
        >
          EDUCATIONAL RECORD
        </div>

        <h2
          id="poster-title"
          style={{
            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
            fontWeight: '700',
            marginBottom: '0.4rem',
            color: '#1a1a1a',
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '1px',
            lineHeight: 1.2
          }}
        >
          {locker.title}
        </h2>

        <div
          style={{
            fontSize: '1.2rem',
            color: locker.color,
            fontWeight: '600',
            marginBottom: '0.75rem',
            fontFamily: "'Special Elite', monospace"
          }}
        >
          {locker.degree}
        </div>

        <div
          style={{
            fontSize: '0.85rem',
            color: '#555',
            marginBottom: '1.25rem',
            fontFamily: "'Special Elite', monospace",
            letterSpacing: '0.5px',
            lineHeight: 1.5
          }}
        >
          {locker.institution}
          <br />
          {locker.period} | {locker.location}
        </div>

        <p
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.75',
            color: '#2a2a2a',
            marginBottom: '1.5rem',
            fontFamily: "'Special Elite', monospace"
          }}
        >
          {locker.description}
        </p>

        {/* Highlights */}
        {locker.highlights && locker.highlights.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#666',
                marginBottom: '0.6rem',
                fontWeight: '600',
                fontFamily: "'Special Elite', monospace",
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Highlights
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.1rem',
                color: '#2a2a2a'
              }}
            >
              {locker.highlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: '1.6',
                    marginBottom: '0.3rem',
                    fontFamily: "'Special Elite', monospace"
                  }}
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#666',
              marginBottom: '0.6rem',
              fontWeight: '600',
              fontFamily: "'Special Elite', monospace",
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Key Competencies
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {locker.skills?.map((skill, i) => (
              <span
                key={i}
                style={{
                  padding: '0.35rem 0.7rem',
                  background: locker.color,
                  color: '#f6efe2',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontFamily: "'Special Elite', monospace",
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Click hint */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px dashed rgba(0,0,0,0.15)',
            fontSize: '0.7rem',
            color: '#999',
            fontFamily: "'Special Elite', monospace",
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}
        >
          Click to expand
        </div>
      </div>
    </div>
  )
}

/* ================================================================== */
// ARTIFACT COLUMN (right column)
function ArtifactColumn({
  locker,
  currentImageIndex,
  imageLoaded,
  setImageLoaded,
  currentImg,
  onOpenViewer,
  onImageChange
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        minHeight: '100%'
      }}
    >
      {/* Photo wall / slideshow */}
      {locker.images?.length > 0 && (
        <div
          style={{
            position: 'relative',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
            border: '6px solid #3d2817',
            background: '#000',
            aspectRatio: '16 / 10'
          }}
        >
          {/* Magnetic corner dots */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              width: '18px',
              height: '18px',
              background: locker.color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 3,
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              background: locker.color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 3,
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '-4px',
              width: '18px',
              height: '18px',
              background: locker.color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 3,
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              background: locker.color,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
              zIndex: 3,
              opacity: 0.8
            }}
          />

          {/* Images */}
          {locker.images.map((src, idx) => (
            <div
              key={src}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === currentImageIndex ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                pointerEvents: idx === currentImageIndex ? 'auto' : 'none',
                cursor: 'pointer'
              }}
              onClick={() =>
                onOpenViewer('photo', { src, alt: `${locker.institution} ${idx + 1}` })
              }
            >
              <img
                src={src}
                alt={`${locker.institution} ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onLoad={() =>
                  setImageLoaded((prev) => ({ ...prev, [src]: true }))
                }
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: imageLoaded[src] !== false ? 'block' : 'none'
                }}
              />
              {!imageLoaded[src] && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#444',
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '0.85rem'
                  }}
                >
                  Loading…
                </div>
              )}
            </div>
          ))}

          {/* Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
              background: 'rgba(0,0,0,0.8)',
              padding: '0.4rem 0.9rem',
              borderRadius: '20px',
              color: '#f6efe2',
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.8rem',
              border: '1px solid rgba(255,255,255,0.1)',
              zIndex: 2
            }}
          >
            {currentImageIndex + 1} / {locker.images.length}
          </div>

          {/* Click hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '0.75rem',
              background: 'rgba(0,0,0,0.7)',
              padding: '0.3rem 0.7rem',
              borderRadius: '4px',
              color: '#aaa',
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.7rem',
              zIndex: 2,
              opacity: 0.8
            }}
          >
            Click to enlarge
          </div>

          {/* Prev/Next image arrows */}
          {locker.images.length > 1 && (
            <>
              <button
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation()
                  onImageChange((prev) =>
                    prev === 0 ? locker.images.length - 1 : prev - 1
                  )
                }}
                style={{
                  position: 'absolute',
                  left: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }}
              >
                ‹
              </button>
              <button
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation()
                  onImageChange((prev) => (prev + 1) % locker.images.length)
                }}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  zIndex: 2,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      {/* Document stack */}
      {locker.documents && locker.documents.length > 0 && (
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              color: '#888',
              marginBottom: '0.6rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              fontFamily: "'Special Elite', monospace",
              textTransform: 'uppercase'
            }}
          >
            Documents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {locker.documents.map((doc, i) => (
              <DocumentCard
                key={i}
                doc={doc}
                onClick={() => onOpenViewer('pdf', doc)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          padding: '1.25rem',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: "'Special Elite', monospace"
        }}
      >
        <InfoRow label="Location" value={locker.location} />
        <InfoRow label="Period" value={locker.period} />
        <InfoRow label="GPA / Honors" value={locker.gpa} />
        <InfoRow label="Focus" value={locker.focus} />
      </div>
    </div>
  )
}

function DocumentCard({ doc, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Open ${doc.title} (PDF, ${doc.size || 'unknown size'})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        background: 'rgba(0,255,0,0.08)',
        border: '1px solid rgba(0,255,0,0.25)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0,255,0,0.14)'
        e.currentTarget.style.borderColor = 'rgba(0,255,0,0.5)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(0,255,0,0.08)'
        e.currentTarget.style.borderColor = 'rgba(0,255,0,0.25)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <span style={{ fontSize: '1.4rem', opacity: 0.7 }}>📄</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#00ff00',
            marginBottom: '0.2rem',
            fontFamily: "'Special Elite', monospace",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {doc.title}
        </div>
        {doc.subtitle && (
          <div
            style={{
              fontSize: '0.8rem',
              color: '#ccc',
              marginBottom: '0.2rem',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {doc.subtitle}
          </div>
        )}
        <div
          style={{
            fontSize: '0.75rem',
            color: '#888',
            fontFamily: "'Special Elite', monospace"
          }}
        >
          {doc.year && `${doc.year} • `}PDF{doc.size && `, ${doc.size}`}
        </div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#00ff00"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.5, flexShrink: 0 }}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.4rem',
        fontSize: '0.85rem'
      }}
    >
      <span style={{ color: '#888' }}>{label}:</span>
      <span style={{ color: '#ddd', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

/* ================================================================== */
// BOTTOM NAVIGATION
function LockerNav({ prevLocker, nextLocker, canGoPrev, canGoNext, onPrev, onNext, onClose }) {
  const btnBase = {
    padding: '0.6rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: "'Special Elite', monospace",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 600,
    letterSpacing: '0.05em'
  }

  return (
    <nav
      aria-label="Locker navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '0.5rem',
        position: 'relative',
        zIndex: 2
      }}
    >
      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label={
          canGoPrev
            ? `Previous locker: ${prevLocker?.label}`
            : prevLocker?.locked
              ? `Previous locker locked: ${prevLocker?.message}`
              : 'No previous locker'
        }
        title={
          canGoPrev
            ? prevLocker?.label
            : prevLocker?.locked
              ? prevLocker?.message
              : "We ain't there yet, buddy."
        }
        style={{
          ...btnBase,
          background: canGoPrev ? 'rgba(40,40,40,0.9)' : 'rgba(30,30,30,0.6)',
          border: canGoPrev ? '2px solid #666' : '2px solid #444',
          color: canGoPrev ? '#fff' : '#666',
          cursor: canGoPrev ? 'pointer' : 'not-allowed'
        }}
        onMouseEnter={(e) => {
          if (canGoPrev) {
            e.currentTarget.style.borderColor = '#00ff00'
            e.currentTarget.style.color = '#00ff00'
          }
        }}
        onMouseLeave={(e) => {
          if (canGoPrev) {
            e.currentTarget.style.borderColor = '#666'
            e.currentTarget.style.color = '#fff'
          }
        }}
      >
        ‹ Prev
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close locker"
        style={{
          ...btnBase,
          background: 'rgba(40,40,40,0.9)',
          border: '2px solid #666',
          color: '#fff',
          padding: '0.6rem 2rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ff4444'
          e.currentTarget.style.color = '#ff4444'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#666'
          e.currentTarget.style.color = '#fff'
        }}
      >
        ✕ Close
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={
          canGoNext
            ? `Next locker: ${nextLocker?.label}`
            : nextLocker?.locked
              ? `Next locker locked: ${nextLocker?.message}`
              : 'No next locker'
        }
        title={
          canGoNext
            ? nextLocker?.label
            : nextLocker?.locked
              ? nextLocker?.message
              : "We ain't there yet, buddy."
        }
        style={{
          ...btnBase,
          background: canGoNext ? 'rgba(40,40,40,0.9)' : 'rgba(30,30,30,0.6)',
          border: canGoNext ? '2px solid #666' : '2px solid #444',
          color: canGoNext ? '#fff' : '#666',
          cursor: canGoNext ? 'pointer' : 'not-allowed'
        }}
        onMouseEnter={(e) => {
          if (canGoNext) {
            e.currentTarget.style.borderColor = '#00ff00'
            e.currentTarget.style.color = '#00ff00'
          }
        }}
        onMouseLeave={(e) => {
          if (canGoNext) {
            e.currentTarget.style.borderColor = '#666'
            e.currentTarget.style.color = '#fff'
          }
        }}
      >
        Next ›
      </button>
    </nav>
  )
}