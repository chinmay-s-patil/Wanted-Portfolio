import { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CabinetScene from './CabinetScene'
import DrawerControls from './DrawerControls'
import DrawerPanel from './DrawerPanel'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'
import './Projects.css'

const ProjectFolder = lazy(() => import('./ProjectFolder'))

const DRAWER_ICONS = {
  'cfd-simulation': '🌊',
  'cad-design': '⚙️',
  'fea-ml': '🧠',
  'experimental-work': '🔬',
}

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

  const totalProjectCount = projectsData.drawers.reduce((acc, d) => acc + d.folders.length, 0)

  return (
    <div className="evidence-room" aria-label="Police Precinct Evidence Archive">
      {/* Clean Ambient Studio Spotlight */}
      <div className="evidence-spotlight" aria-hidden="true" />

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
        <div className="directory-header">
          <div className="directory-title">
            <span>🗄️ POLICE ARCHIVE</span>
            <span className="directory-total-tag">{totalProjectCount} FILES</span>
          </div>
          <p className="directory-sub">Select drawer to open</p>
        </div>

        {projectsData.drawers.map((d, index) => {
          const isActive = openDrawerId === d.id
          const icon = DRAWER_ICONS[d.id] || '📁'

          return (
            <button
              key={d.id}
              className={`directory-btn ${isActive ? 'active' : ''}`}
              onClick={() => setOpenDrawer(d.id)}
              title={`Open Drawer ${index + 1}: ${d.label}`}
            >
              <div className="directory-label">
                <span className="directory-icon">{icon}</span>
                <span
                  className="directory-dot"
                  style={{
                    backgroundColor: d.color || '#d4af37',
                    boxShadow: isActive ? `0 0 10px ${d.color}` : 'none'
                  }}
                />
                <span className="directory-name">0{index + 1} &bull; {d.label}</span>
              </div>
              <span className="directory-count">{d.folders.length}</span>
            </button>
          )
        })}

        <div className="directory-footer">
          <div className="status-indicator">
            <span className="status-ping" />
            <span>CLASSIFIED RECORDS</span>
          </div>
        </div>
      </div>

      {/* Main Page Layout */}
      <div className="evidence-page-layout">
        <div className="evidence-header-block">
          <div className="evidence-badge-tag">DEPARTMENT OF ENGINEERING INVESTIGATIONS</div>
          <h1 className="evidence-title">
            EVIDENCE LOCKER
          </h1>
          <div className="evidence-header-divider" />
          <p className="evidence-subtitle">
            Click any drawer to inspect case files &bull; Use keyboard &uarr;&darr; &larr;&rarr; to navigate
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
            color: '#d4af37',
            fontFamily: "'Courier Prime', monospace",
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(212,175,55,0.2)',
                borderTopColor: '#d4af37',
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