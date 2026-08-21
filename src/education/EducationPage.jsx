'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import lockers from './lockers'
import SectionHeader from './SectionHeader'
import LockerWall from './LockerWall'
import LockerDoorPanel from './LockerDoorPanel'
import ArtifactViewer from './ArtifactViewer'

/**
 * Education Section — The Locker Wall
 *
 * Overlay stack rule (§2):
 *   Layer 0 — LockerWall (a full hallway; dimmed when a locker is open)
 *   Layer 1 — LockerDoorPanel (hinge-open door + cavity + nav)
 *   Layer 2 — ArtifactViewer (photo | pdf | poster) — SINGLE instance, ever
 *
 * Keyboard:
 *   Esc  → closes topmost layer only
 *   ←/→  → prev/next locker (when door panel focused, viewer closed)
 */
export default function EducationPage() {
  const navigate = useNavigate()

  const [openLockerId, setOpenLockerId] = useState(null)
  const [viewerState, setViewerState] = useState(null) // { mode, payload } | null
  const [imageIndices, setImageIndices] = useState({}) // { [lockerId]: number }

  const currentLocker = useMemo(
    () => lockers.find((l) => l.id === openLockerId) || null,
    [openLockerId]
  )

  const currentImageIndex = openLockerId ? imageIndices[openLockerId] || 0 : 0

  const openLocker = useCallback((id) => {
    const locker = lockers.find((l) => l.id === id)
    if (!locker || locker.locked) return

    setOpenLockerId(id)
    setViewerState(null)

    setImageIndices((prev) =>
      prev[id] !== undefined ? prev : { ...prev, [id]: 0 }
    )
  }, [])

  const closeLocker = useCallback(() => {
    setOpenLockerId(null)
    setViewerState(null)
  }, [])

  const openViewer = useCallback((mode, payload) => {
    setViewerState({ mode, payload })
  }, [])

  const closeViewer = useCallback(() => {
    setViewerState(null)
  }, [])

  const setImageIndexForLocker = useCallback((lockerId, updater) => {
    setImageIndices((prev) => ({
      ...prev,
      [lockerId]: typeof updater === 'function' ? updater(prev[lockerId] || 0) : updater
    }))
  }, [])

  const goToLocker = useCallback(
    (direction) => {
      if (!openLockerId) return
      const idx = lockers.findIndex((l) => l.id === openLockerId)
      const target = lockers[idx + direction]
      if (!target || target.locked) return

      setViewerState(null)
      setOpenLockerId(target.id)
      setImageIndices((prev) =>
        prev[target.id] !== undefined ? prev : { ...prev, [target.id]: 0 }
      )
    },
    [openLockerId]
  )

  const goPrev = useCallback(() => goToLocker(-1), [goToLocker])
  const goNext = useCallback(() => goToLocker(1), [goToLocker])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewerState) {
          e.preventDefault()
          closeViewer()
        } else if (openLockerId) {
          e.preventDefault()
          closeLocker()
        }
        return
      }

      if (!openLockerId || viewerState) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [viewerState, openLockerId, closeViewer, closeLocker, goPrev, goNext])

  useEffect(() => {
    if (!currentLocker?.images?.length) return
    const timer = setInterval(() => {
      setImageIndices((prev) => ({
        ...prev,
        [currentLocker.id]: ((prev[currentLocker.id] || 0) + 1) % currentLocker.images.length
      }))
    }, 4000)
    return () => clearInterval(timer)
  }, [currentLocker])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at 50% 30%, #1a1815 0%, #0d0c0a 60%, #050403 100%)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Special Elite', monospace",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Gritty Film Grain Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Retro Overhead Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.07) 0%, rgba(212, 175, 55, 0.02) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=JetBrains+Mono:wght@600;700;800&display=swap');
      `}</style>

      {/* ── Layer 0: Wall ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          opacity: openLockerId ? 0.35 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: openLockerId ? 'none' : 'auto',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2
        }}
      >
        <SectionHeader
          kicker="ACADEMIC DOSSIER"
          title="Institutional Archive"
          description="Academic credentials & institutional milestones • Classified Records"
        />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <LockerWall
            lockers={lockers}
            onSelect={openLocker}
            openLockerId={openLockerId}
          />
        </div>
      </div>

      {/* ── Layer 1: Door panel ── */}
      {currentLocker && (
        <LockerDoorPanel
          locker={currentLocker}
          lockers={lockers}
          currentImageIndex={currentImageIndex}
          onImageChange={(updater) => setImageIndexForLocker(currentLocker.id, updater)}
          onOpenViewer={openViewer}
          onClose={closeLocker}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {/* ── Layer 2: ArtifactViewer (single instance, ever) ── */}
      <ArtifactViewer
        mode={viewerState?.mode}
        payload={viewerState?.payload}
        onClose={closeViewer}
      />
    </div>
  )
}