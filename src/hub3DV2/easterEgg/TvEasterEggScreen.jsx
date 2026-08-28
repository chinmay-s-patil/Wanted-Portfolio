import React, { useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useEasterEgg } from './EasterEggContext'
import { moonlightSonataAttribution, kreutzerSonataAttribution, mcnaughtAttribution } from './easterEggsData'

/**
 * TvEasterEggScreen Component
 *
 * Renders the embedded YouTube player fitted precisely to the CRT TV screen bezel.
 * Reads initial start timestamp on mount without re-rendering or reloading iframe during playback.
 */
export default function TvEasterEggScreen({ isActive, activeEgg, isPaused = false, onClose }) {
  const { currentTimeRef } = useEasterEgg()
  const iframeRef = useRef(null)
  const egg = activeEgg || (isActive ? 'piano' : null)

  // Read start timestamp once on mount
  const initialTimeRef = useRef(Math.floor(currentTimeRef?.current || 0))

  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return
    const command = isPaused ? 'pauseVideo' : 'playVideo'
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      )
    } catch (err) {
      console.warn('YouTube postMessage error:', err)
    }
  }, [isPaused])

  if (!egg) return null

  const data = egg === 'mcnaught'
    ? mcnaughtAttribution
    : egg === 'violin'
    ? kreutzerSonataAttribution
    : moonlightSonataAttribution

  const startSec = initialTimeRef.current
  const embedUrlWithTime = `${data.source.embedUrl}${startSec > 0 ? `&start=${startSec}` : ''}`
  const icon = egg === 'mcnaught' ? '☄️' : egg === 'violin' ? '🎻' : '🎹'
  const badgeTitle = egg === 'mcnaught'
    ? 'Comet McNaught Easter Egg Discovered'
    : egg === 'violin'
    ? 'Violin Easter Egg Discovered'
    : 'Piano Easter Egg Discovered'

  return (
    <>
      {/* 1. 3D CRT Screen Embedded YouTube Player */}
      <Html
        transform
        position={[0, 4.45, 0.55]}
        rotation={[0, 0, 0]}
        scale={[0.54, 0.54, 0.54]}
        style={{
          width: '260px',
          height: '195px',
          background: '#000000',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 0 15px rgba(227, 179, 65, 0.5), inset 0 0 10px rgba(0, 0, 0, 0.8)',
          border: '2px solid rgba(227, 179, 65, 0.7)',
          pointerEvents: 'none'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <iframe
            ref={iframeRef}
            key={egg}
            width="100%"
            height="100%"
            src={embedUrlWithTime}
            title={data.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', objectFit: 'cover' }}
          />
        </div>
      </Html>

      {/* 2. Floating Global Attribution UI Banner when TV Active */}
      <Html position={[0, 2.2, 0]} center style={{ pointerEvents: 'auto' }}>
        <div
          style={{
            background: 'rgba(13, 17, 23, 0.95)',
            border: '1px solid #e3b341',
            borderRadius: '12px',
            padding: '14px 22px',
            color: '#ffffff',
            fontFamily: "'Inter', sans-serif",
            boxShadow: '0 8px 32px rgba(227, 179, 65, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: 'max-content',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ fontSize: '28px' }}>{isPaused ? '⏸️' : icon}</div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', color: '#e3b341', textTransform: 'uppercase' }}>
              {isPaused ? 'TV Playback Paused (Click Remote to Resume)' : badgeTitle}
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
              {data.title}
            </div>
            <div style={{ fontSize: '12px', color: '#8b949e', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>{data.creator.name} ({data.creator.role})</span>
              <span>•</span>
              <a
                href={data.source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#58a6ff', textDecoration: 'none' }}
              >
                Source ↗
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '6px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              marginLeft: '12px'
            }}
          >
            Close [×]
          </button>
        </div>
      </Html>
    </>
  )
}
