// src/education/components/LeftDoor.jsx
import { useState, useEffect } from 'react'

export default function LeftDoor({ locker, currentImageIndex, onImageChange }) {
  const getImagePath = (idx) => {
    if (locker.id === 'masters') {
      return `${locker.imageBase} (${idx + 1})${locker.imageExt}`
    } else if (locker.id === 'bachelors') {
      return `${locker.imageBase} (${idx + 1})${locker.imageExts[idx]}`
    }
    return ''
  }

  // Auto-advance slideshow
  useEffect(() => {
    if (!locker.imageCount) return
    const timer = setInterval(() => {
      onImageChange((prev) => (prev + 1) % locker.imageCount)
    }, 4000)
    return () => clearInterval(timer)
  }, [locker.imageCount, onImageChange])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      borderRight: '4px solid #3d2817',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative magnetic strip */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        height: '8px',
        background: 'linear-gradient(90deg, #666 0%, #888 50%, #666 100%)',
        borderRadius: '2px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
      }} />

      {/* Title */}
      <div style={{
        marginTop: '2rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#00ff00',
        fontFamily: "'Special Elite', monospace",
        textShadow: '0 0 10px rgba(0,255,0,0.5)',
        letterSpacing: '0.1em'
      }}>
        MEMORY WALL
      </div>

      {/* Main slideshow area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 6rem)',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '3px solid #444',
        boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
        background: '#000'
      }}>
        {locker.imageCount && [...Array(locker.imageCount)].map((_, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentImageIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {idx === currentImageIndex && (
              <img
                src={getImagePath(idx)}
                alt={`${locker.institution} ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        ))}

        {/* Counter */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          background: 'rgba(0,0,0,0.8)',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          color: '#00ff00',
          fontFamily: "'Special Elite', monospace",
          fontSize: '0.85rem',
          border: '1px solid #00ff00',
          boxShadow: '0 0 10px rgba(0,255,0,0.3)'
        }}>
          {currentImageIndex + 1} / {locker.imageCount}
        </div>
      </div>
    </div>
  )
}