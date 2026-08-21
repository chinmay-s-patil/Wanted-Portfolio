import { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CabinetScene from './CabinetScene'
import DrawerControls from './DrawerControls'
import DrawerPanel from './DrawerPanel'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'
import './Projects.css'

const ProjectFolder = lazy(() => import('./ProjectFolder'))

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [showDrawerList, setShowDrawerList] = useState(false)
  const navigate = useNavigate()

  const openDrawerId = useCabinetStore((s) => s.openDrawerId)
  const setOpenDrawer = useCabinetStore((s) => s.setOpenDrawer)

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null)
  }, [])

  // Reset showDrawerList if drawer is closed
  useEffect(() => {
    if (!openDrawerId) {
      setShowDrawerList(false)
    }
  }, [openDrawerId])

  // Mouse wheel scroll changes open drawer ONLY if a drawer is open AND list panel is closed
  useEffect(() => {
    let lastScrollTime = 0

    const handleWheel = (e) => {
      // Don't intercept scroll if project detail modal OR file list panel is open
      if (selectedProject || showDrawerList) return

      const currentDrawerId = useCabinetStore.getState().openDrawerId
      if (!currentDrawerId) return

      const now = Date.now()
      if (now - lastScrollTime < 240) return

      const drawerIds = projectsData.drawers.map((d) => d.id)
      const setDrawer = useCabinetStore.getState().setOpenDrawer

      const currentIndex = drawerIds.indexOf(currentDrawerId)
      if (currentIndex === -1) return

      if (e.deltaY > 0) {
        lastScrollTime = now
        const nextIndex = (currentIndex + 1) % drawerIds.length
        setDrawer(drawerIds[nextIndex])
      } else if (e.deltaY < 0) {
        lastScrollTime = now
        const prevIndex = (currentIndex - 1 + drawerIds.length) % drawerIds.length
        setDrawer(drawerIds[prevIndex])
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [selectedProject, showDrawerList])

  // Keyboard Navigation Matrix
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedProject) {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleCloseProject()
        }
        return
      }

      if (showDrawerList) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setShowDrawerList(false)
        }
        return
      }

      const drawerIds = projectsData.drawers.map((d) => d.id)
      const currentDrawerId = useCabinetStore.getState().openDrawerId
      const setDrawer = useCabinetStore.getState().setOpenDrawer
      const activeFolderIndex = useCabinetStore.getState().activeFolderIndex
      const setActiveFolderIndex = useCabinetStore.getState().setActiveFolderIndex

      const currentDrawerIndex = currentDrawerId ? drawerIds.indexOf(currentDrawerId) : -1
      const currentDrawer = currentDrawerId ? projectsData.drawers.find((d) => d.id === currentDrawerId) : null
      const totalFolders = currentDrawer?.folders?.length || 0

      if (currentDrawerId) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          const prevIndex = (currentDrawerIndex - 1 + drawerIds.length) % drawerIds.length
          setDrawer(drawerIds[prevIndex])
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          const nextIndex = (currentDrawerIndex + 1) % drawerIds.length
          setDrawer(drawerIds[nextIndex])
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          if (totalFolders > 1) {
            setActiveFolderIndex((activeFolderIndex - 1 + totalFolders) % totalFolders)
          }
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          if (totalFolders > 1) {
            setActiveFolderIndex((activeFolderIndex + 1) % totalFolders)
          }
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (currentDrawer && currentDrawer.folders[activeFolderIndex]) {
            handleProjectClick(currentDrawer.folders[activeFolderIndex])
          }
        } else if (e.key === 'Escape') {
          e.preventDefault()
          setDrawer(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedProject, showDrawerList, handleCloseProject, handleProjectClick])

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedProject])

  return (
    <div className="evidence-room" aria-label="Evidence Locker Archive">
      {/* SVG Noise Texture Overlay */}
      <svg className="evidence-noise-overlay" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <filter id="evidenceGritFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.12 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#evidenceGritFilter)" />
      </svg>

      {/* Atmospheric Overhead Spotlight Cone */}
      <div className="evidence-spotlight" aria-hidden="true" />
      <div className="evidence-light-cone" aria-hidden="true" />

      {/* Back to Hub Button */}
      <button
        type="button"
        className="projects-back-btn"
        onClick={() => navigate('/hub')}
        aria-label="Back to Hub"
      >
        ← Back to Hub
      </button>

      {/* Vintage Directory Sidebar */}
      <div className="directory-sidebar">
        <div className="directory-title">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          EVIDENCE DIRECTORY
        </div>

        {projectsData.drawers.map((d, index) => {
          const isActive = openDrawerId === d.id
          return (
            <button
              key={d.id}
              className={`directory-btn ${isActive ? 'active' : ''}`}
              onClick={() => setOpenDrawer(d.id)}
              title={`Open Drawer ${index + 1}: ${d.label}`}
            >
              <div className="directory-label">
                <span
                  className="directory-dot"
                  style={{
                    backgroundColor: d.color || '#c4a574',
                    boxShadow: isActive ? `0 0 8px ${d.color}` : 'none'
                  }}
                />
                <span>0{index + 1} &bull; {d.label}</span>
              </div>
              <span className="directory-count">{d.folders.length}</span>
            </button>
          )
        })}
      </div>

      {/* Main Page Layout */}
      <div className="evidence-page-layout">
        <div className="evidence-header-block">
          <h1 className="evidence-title">
            EVIDENCE LOCKER
          </h1>
          <div className="evidence-header-divider" />
          <p className="evidence-subtitle">
            Click any drawer to inspect files &bull; &uarr;&darr; Drawers &bull; &larr;&rarr; Files &bull; [ESC] Close
          </p>
        </div>

        <div className="scene-container">
          <CabinetScene onSelectProject={handleProjectClick} />
        </div>
      </div>

      {/* Bottom Console Controls when a drawer is open */}
      <DrawerControls
        onSelectProject={handleProjectClick}
        onToggleList={() => setShowDrawerList((prev) => !prev)}
      />

      {/* Slide-out Drawer File List Panel */}
      {showDrawerList && (
        <DrawerPanel
          onSelectProject={handleProjectClick}
          onClose={() => setShowDrawerList(false)}
        />
      )}

      {/* Full Project File Detail Inspection Modal */}
      {selectedProject && (
        <Suspense fallback={
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.88)',
            color: '#c4a574',
            fontFamily: "'Special Elite', monospace",
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(196,165,116,0.2)',
                borderTopColor: '#c4a574',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              Retrieving case file...
            </div>
          </div>
        }>
          <ProjectFolder project={selectedProject} onClose={handleCloseProject} />
        </Suspense>
      )}
    </div>
  )
}