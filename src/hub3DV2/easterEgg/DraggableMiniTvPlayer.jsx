import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEasterEgg } from './EasterEggContext'
import { moonlightSonataAttribution, kreutzerSonataAttribution, mcnaughtAttribution, nightMountainAttribution } from './easterEggsData'

/**
 * DraggableMiniTvPlayer Component
 *
 * Floating Picture-in-Picture Mini Retro Precinct CRT TV.
 * Smooth, jitter-free playback with initial timestamp synchronization on route transitions.
 */
export default function DraggableMiniTvPlayer() {
  const { activeEgg, isTvPaused, togglePause, closeEgg, isMinimized, toggleMinimize, currentTimeRef } = useEasterEgg()
  const location = useLocation()
  const navigate = useNavigate()
  const iframeRef = useRef(null)

  // Read initial timestamp once on mount
  const initialTimeRef = useRef(Math.floor(currentTimeRef?.current || 0))

  // Default position: Bottom-Right corner
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 340) : 20,
    y: typeof window !== 'undefined' ? Math.max(20, window.innerHeight - 260) : 20
  }))

  const [isDragging, setIsDragging] = useState(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  // Keep position inside viewport on resize
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => ({
        x: Math.min(prev.x, Math.max(10, window.innerWidth - 320)),
        y: Math.min(prev.y, Math.max(10, window.innerHeight - 220))
      }))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle Dragging
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A') return
    setIsDragging(true)
    dragOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    }
  }

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return
      const playerWidth = isMinimized ? 230 : 300
      const playerHeight = isMinimized ? 48 : 250

      const newX = Math.max(10, Math.min(window.innerWidth - playerWidth - 10, e.clientX - dragOffsetRef.current.x))
      const newY = Math.max(10, Math.min(window.innerHeight - playerHeight - 10, e.clientY - dragOffsetRef.current.y))

      setPos({ x: newX, y: newY })
    },
    [isDragging, isMinimized]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch Support
  const handleTouchStart = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A') return
    const touch = e.touches[0]
    setIsDragging(true)
    dragOffsetRef.current = {
      x: touch.clientX - pos.x,
      y: touch.clientY - pos.y
    }
  }

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return
      const touch = e.touches[0]
      const playerWidth = isMinimized ? 230 : 300
      const playerHeight = isMinimized ? 48 : 250

      const newX = Math.max(10, Math.min(window.innerWidth - playerWidth - 10, touch.clientX - dragOffsetRef.current.x))
      const newY = Math.max(10, Math.min(window.innerHeight - playerHeight - 10, touch.clientY - dragOffsetRef.current.y))

      setPos({ x: newX, y: newY })
    },
    [isDragging, isMinimized]
  )

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove])

  // Sync Youtube postMessage pause/play state
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return
    const command = isTvPaused ? 'pauseVideo' : 'playVideo'
    try {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      )
    } catch (err) {
      console.warn('Mini player YouTube postMessage error:', err)
    }
  }, [isTvPaused])

  // Hide mini player if no active egg OR user is inside 3D precinct lounge (where 3D TV is present)
  const isInside3DHub = location.pathname === '/hub3DV2' || location.pathname === '/hub3D'
  if (!activeEgg || isInside3DHub) return null

  const data = activeEgg === 'nightMountain'
    ? nightMountainAttribution
    : activeEgg === 'mcnaught'
    ? mcnaughtAttribution
    : activeEgg === 'violin'
    ? kreutzerSonataAttribution
    : moonlightSonataAttribution

  const startSec = initialTimeRef.current
  const embedUrlWithTime = `${data.source.embedUrl}${startSec > 0 ? `&start=${startSec}` : ''}`
  const icon = activeEgg === 'nightMountain' ? '🔭' : activeEgg === 'mcnaught' ? '☄️' : activeEgg === 'violin' ? '🎻' : '🎹'

  return (
    <div
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 99999,
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: 'none',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(227, 179, 65, 0.3)',
        borderRadius: '12px',
        border: '1.5px solid #e3b341',
        background: 'rgba(13, 17, 23, 0.96)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        width: isMinimized ? '230px' : '300px',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Draggable Header Bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          background: 'linear-gradient(90deg, #1d1814, #120e0b)',
          borderBottom: '1px solid rgba(227, 179, 65, 0.3)',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        title="Click & drag to move Mini TV player anywhere"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <span style={{ fontSize: '14px' }}>{icon}</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#ffea9f',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {isMinimized ? 'PRECINCT TV' : 'PRECINCT MINI TV'}
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Pause / Play */}
          <button
            onClick={togglePause}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '11px'
            }}
            title={isTvPaused ? 'Play' : 'Pause'}
          >
            {isTvPaused ? '▶' : '⏸'}
          </button>

          {/* Minimize / Expand */}
          <button
            onClick={toggleMinimize}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffea9f',
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px'
            }}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▢' : '–'}
          </button>

          {/* Return to 3D Precinct Lounge */}
          <button
            onClick={() => navigate('/hub3DV2')}
            style={{
              background: 'rgba(227, 179, 65, 0.2)',
              border: '1px solid rgba(227, 179, 65, 0.5)',
              color: '#ffea9f',
              borderRadius: '4px',
              padding: '0 6px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600'
            }}
            title="Return to 3D TV in Precinct Lounge"
          >
            3D ↗
          </button>

          {/* Close Player */}
          <button
            onClick={closeEgg}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#ff8888',
              borderRadius: '4px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold'
            }}
            title="Close TV Player"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expanded Video Body */}
      {!isMinimized && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Embedded YouTube Iframe */}
          <div style={{ position: 'relative', width: '100%', height: '165px', background: '#000' }}>
            <iframe
              ref={iframeRef}
              key={activeEgg}
              width="100%"
              height="100%"
              src={embedUrlWithTime}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            />
            {isTvPaused && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffea9f',
                  fontSize: '13px',
                  fontWeight: '700',
                  gap: '6px',
                  pointerEvents: 'none'
                }}
              >
                <span>⏸️</span> PAUSED
              </div>
            )}
          </div>

          {/* Attribution Footer */}
          <div style={{ padding: '8px 12px', background: 'rgba(10, 8, 6, 0.9)' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffea9f',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}
            >
              {data.work || data.title} — {data.title}
            </div>
            <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
              <span>{data.creator.name} ({data.creator.role})</span>
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
        </div>
      )}
    </div>
  )
}
