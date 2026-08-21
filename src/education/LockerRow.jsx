'use client'

import { useState, useCallback } from 'react'

/**
 * LockerRow — Three lockers in a row with real CSS 3D hinge doors.
 *
 * Architecture:
 *   <LockerRow>      perspective + fixed 3/4 scene angle
 *     <Locker> × 3    body + cavity + rotating door
 *       <Cavity>      static interior, revealed when door opens
 *         <PdfPanel>  native iframe + download link
 *       <LockerDoor>  rotates on left-edge hinge
 *         <DoorFace>  exterior: vents, dial, tag
 *         <DoorBack>  interior: photos + handwritten note
 */

export default function LockerRow({ lockers, openLockerId, onToggle, onOpenPhoto, onOpenDocument }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3rem',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floor gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#aaa',
          textAlign: 'center',
          fontFamily: "'Special Elite', monospace",
          letterSpacing: '0.1em',
          position: 'relative',
          zIndex: 10,
          margin: 0
        }}
      >
        SELECT A LOCKER TO VIEW CREDENTIALS
      </p>

      {/* Locker row with 3/4 perspective */}
      <div
        style={{
          perspective: '1200px',
          perspectiveOrigin: 'center center',
          position: 'relative',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            justifyContent: 'center',
            transform: 'rotateY(6deg) rotateX(-1deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {lockers.map((locker) => (
            <Locker
              key={locker.id}
              locker={locker}
              isOpen={openLockerId === locker.id}
              onToggle={() => onToggle(locker.id)}
              onOpenPhoto={onOpenPhoto}
              onOpenDocument={onOpenDocument}
            />
          ))}
        </div>
      </div>

      {/* Reduced motion override */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .locker-door {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ================================================================== */
// SINGLE LOCKER
function Locker({ locker, isOpen, onToggle, onOpenPhoto, onOpenDocument }) {
  const isLocked = locker.locked
  const [isHovered, setIsHovered] = useState(false)

  const handleKeyDown = useCallback(
    (e) => {
      if (isLocked) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      }
    },
    [isLocked, onToggle]
  )

  const doorAngle = isOpen ? -110 : isHovered ? -8 : 0

  return (
    <div
      style={{
        position: 'relative',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        filter: isLocked ? 'grayscale(0.4)' : 'none',
        opacity: isLocked ? 0.6 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Pedestal */}
      <div
        style={{
          width: '260px',
          height: '18px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.7)'
        }}
      />

      {/* Locker body shell */}
      <div
        role={isLocked ? undefined : 'button'}
        tabIndex={isLocked ? -1 : 0}
        aria-expanded={isOpen}
        aria-label={
          isOpen
            ? `Close ${locker.institution} locker`
            : `Open ${locker.institution} locker`
        }
        onClick={!isLocked ? onToggle : undefined}
        onKeyDown={handleKeyDown}
        style={{
          width: '260px',
          height: isLocked ? '340px' : '420px',
          position: 'relative',
          transform: 'translateY(-4px)',
          outline: 'none'
        }}
      >
        {/* CAVITY (static, behind door) */}
        <Cavity
          locker={locker}
          isVisible={isOpen}
          onOpenDocument={onOpenDocument}
          onClose={onToggle}
        />

        {/* DOOR (rotates on hinge) */}
        <div
          className="locker-door"
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${doorAngle}deg)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10
          }}
        >
          {/* Front face — exterior details */}
          <DoorFace locker={locker} />

          {/* Back face — interior photos + note */}
          <DoorBack
            locker={locker}
            onOpenPhoto={onOpenPhoto}
          />
        </div>
      </div>

      {/* Locked message */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            bottom: '-56px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '220px',
            background: 'rgba(0,0,0,0.7)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              color: '#c4a574',
              fontFamily: "'Special Elite', monospace",
              lineHeight: 1.4
            }}
          >
            {locker.message}
          </div>
          {locker.subtitle && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#666',
                marginTop: '4px',
                fontStyle: 'italic'
              }}
            >
              {locker.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
// DOOR FRONT — vents, dial, tag (visible when closed)
function DoorFace({ locker }) {
  const isLocked = locker.locked

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backfaceVisibility: 'hidden',
        background: `linear-gradient(135deg, ${locker.color} 0%, ${locker.color}dd 30%, ${locker.color}88 70%, ${locker.color}55 100%)`,
        borderRadius: '8px 8px 4px 4px',
        border: '3px solid rgba(0,0,0,0.4)',
        boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
        overflow: 'hidden'
      }}
    >
      {/* Inner frame */}
      <div
        style={{
          position: 'absolute',
          inset: '12px',
          border: '2px solid rgba(255,255,255,0.08)',
          borderRadius: '4px',
          pointerEvents: 'none'
        }}
      />

      {/* Hinges */}
      <div
        style={{
          position: 'absolute',
          left: '-7px',
          top: '60px',
          width: '14px',
          height: '44px',
          background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
          borderRadius: '2px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.5)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-7px',
          bottom: '60px',
          width: '14px',
          height: '44px',
          background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
          borderRadius: '2px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.5)'
        }}
      />

      {/* Name tag slot */}
      <div
        style={{
          position: 'absolute',
          top: '48px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.75)',
          padding: '10px 20px',
          borderRadius: '4px',
          fontSize: '2rem',
          fontWeight: '700',
          color: isLocked ? '#666' : '#f6efe2',
          fontFamily: "'Special Elite', monospace",
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          letterSpacing: '0.05em'
        }}
      >
        {locker.number}
      </div>

      {/* Combination dial */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '44px',
          height: '44px',
          background: 'radial-gradient(circle, #999 0%, #555 100%)',
          borderRadius: '50%',
          boxShadow:
            'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1), 0 0 0 3px rgba(0,0,0,0.3)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '18px',
            height: '18px',
            background: '#222',
            borderRadius: '3px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)'
          }}
        />
      </div>

      {/* Ventilation slits */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: '2px',
              borderRadius: '1px',
              background: 'linear-gradient(90deg, #000 0%, #333 50%, #000 100%)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#f6efe2',
          padding: '6px 18px',
          borderRadius: '3px',
          fontSize: '1rem',
          fontWeight: '700',
          color: locker.color,
          fontFamily: "'Special Elite', monospace",
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap'
        }}
      >
        {locker.label}
      </div>

      {/* Metallic sheen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: '55%',
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)',
          pointerEvents: 'none'
        }}
      />

      {/* Locked overlay stripe */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  )
}

/* ================================================================== */
// DOOR BACK — photos + handwritten note (visible when open)
function DoorBack({ locker, onOpenPhoto }) {
  const photos = (locker.images || []).slice(0, 3)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        background: 'linear-gradient(135deg, #1a3a5c 0%, #0d2137 100%)',
        borderRadius: '8px 8px 4px 4px',
        border: '3px solid rgba(0,0,0,0.4)',
        overflow: 'hidden'
      }}
    >
      {/* Un-mirror wrapper */}
      <div
        style={{
          transform: 'scaleX(-1)',
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: '1rem',
          boxSizing: 'border-box'
        }}
      >
        {/* Photos taped to door */}
        {photos.map((src, i) => (
          <PhotoTape
            key={src}
            src={src}
            alt={`${locker.institution} photo ${i + 1}`}
            rotation={[-4, 2, -1][i] || 0}
            position={
              [
                { top: '8%', left: '8%' },
                { top: '8%', right: '8%' },
                { top: '38%', left: '50%', marginLeft: '-35px' }
              ][i] || { top: '20%', left: '20%' }
            }
            onClick={(e) => {
              e.stopPropagation()
              onOpenPhoto?.(src, `${locker.institution} photo ${i + 1}`)
            }}
          />
        ))}

        {/* Handwritten note */}
        {locker.note && <Note text={locker.note} />}
      </div>
    </div>
  )
}

function PhotoTape({ src, alt, rotation, position, onClick }) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View photo: ${alt}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onClick?.(e)
        }
      }}
      style={{
        position: 'absolute',
        ...position,
        width: '70px',
        height: '52px',
        transform: `rotate(${rotation}deg)`,
        cursor: 'pointer',
        zIndex: 2
      }}
    >
      {/* Tape */}
      <div
        style={{
          position: 'absolute',
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '12px',
          background: 'rgba(255,255,200,0.55)',
          borderRadius: '2px',
          zIndex: 3,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
        }}
      />

      {/* Photo */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          border: '2px solid #fff',
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}

function Note({ text }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '12%',
        left: '50%',
        transform: 'translateX(-50%) rotate(-2deg)',
        width: '82%',
        padding: '0.75rem',
        background: '#f6efe2',
        borderRadius: '2px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        zIndex: 2
      }}
    >
      {/* Tape */}
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          left: '30%',
          width: '30px',
          height: '14px',
          background: 'rgba(255,255,200,0.65)',
          borderRadius: '2px',
          transform: 'rotate(-5deg)'
        }}
      />

      <p
        style={{
          margin: 0,
          fontFamily: "'Caveat', cursive",
          fontSize: '1.05rem',
          lineHeight: 1.3,
          color: '#2a2a2a'
        }}
      >
        {text}
      </p>
    </div>
  )
}

/* ================================================================== */
// CAVITY — static interior revealed behind the door
function Cavity({ locker, isVisible, onOpenDocument, onClose }) {
  if (!isVisible) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: '4px',
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
          borderRadius: '6px',
          border: '1px solid rgba(0,0,0,0.6)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
          zIndex: 1
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: '4px',
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)',
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.6)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.4)',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {/* Shelf */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '4px',
          right: '4px',
          height: '4px',
          background: 'linear-gradient(90deg, #333 0%, #555 50%, #333 100%)',
          borderRadius: '2px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.8)'
        }}
      />

      {/* Hook silhouette */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.08)',
          borderBottom: 'none',
          borderRadius: '12px 12px 0 0'
        }}
      />

      {/* Close control */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close locker"
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#aaa',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          zIndex: 20,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ff4444'
          e.currentTarget.style.color = '#ff4444'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          e.currentTarget.style.color = '#aaa'
        }}
      >
        ✕
      </button>

      {/* PDF Panel */}
      {locker.document && (
        <PdfPanel
          document={locker.document}
          onOpenDocument={onOpenDocument}
        />
      )}
    </div>
  )
}

/* ================================================================== */
// PDF PANEL — native iframe inside the cavity
function PdfPanel({ document: doc, onOpenDocument }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '26%',
        left: '8px',
        right: '8px',
        bottom: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '4px',
          border: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            color: '#aaa',
            fontFamily: "'Special Elite', monospace",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120px'
          }}
          title={doc.title}
        >
          📄 {doc.title}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <a
            href={doc.url}
            download
            onClick={(e) => e.stopPropagation()}
            title="Download PDF"
            style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(0,255,0,0.1)',
              border: '1px solid rgba(0,255,0,0.3)',
              borderRadius: '4px',
              color: '#00ff00',
              fontSize: '0.65rem',
              fontFamily: "'Special Elite', monospace",
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,255,0,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,255,0,0.1)'
            }}
          >
            ↓
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDocument?.(doc)
            }}
            title="Open full view"
            style={{
              padding: '0.25rem 0.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.65rem',
              fontFamily: "'Special Elite', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
            }}
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Native PDF iframe */}
      <iframe
        src={doc.url}
        title={doc.title}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
          borderRadius: '4px',
          background: '#fff'
        }}
      />
    </div>
  )
}
// end of LockerRow.jsx