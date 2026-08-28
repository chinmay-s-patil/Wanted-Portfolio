import { useEffect, useRef } from 'react'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'

export default function DrawerPanel({ onSelectProject, onClose }) {
  const openDrawerId = useCabinetStore((s) => s.openDrawerId)
  const setOpenDrawer = useCabinetStore((s) => s.setOpenDrawer)
  const panelRef = useRef(null)

  const drawer = openDrawerId
    ? projectsData.drawers.find((d) => d.id === openDrawerId)
    : null

  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (openDrawerId) {
      setOpenDrawer(openDrawerId)
    }
  }

  // Close on Escape
  useEffect(() => {
    if (!drawer) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [drawer, onClose, openDrawerId, setOpenDrawer])

  if (!drawer) return null

  return (
    <>
      {/* Backdrop — click to close panel only */}
      <div
        className="drawer-panel-backdrop"
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="drawer-panel" ref={panelRef}>
        {/* Header */}
        <div className="drawer-panel-header">
          <button
            type="button"
            className="drawer-panel-close"
            onClick={handleClose}
            aria-label="Close drawer panel"
          >
            ✕
          </button>

          <div className="drawer-panel-label">Evidence Drawer</div>
          <h2 className="drawer-panel-title">{drawer.label}</h2>
          <div className="drawer-panel-divider" />
          <div className="drawer-panel-count">
            {drawer.folders.length} case file{drawer.folders.length !== 1 ? 's' : ''} on record
          </div>
        </div>

        {/* Folder list */}
        <div className="drawer-panel-list">
          {drawer.folders.map((folder, idx) => (
            <div
              key={folder.id}
              className="drawer-panel-card"
              onClick={() => onSelectProject(folder)}
              style={{
                animation: `cardFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.06}s both`,
              }}
            >
              {/* Category badge */}
              {folder.category && (
                <span
                  className="drawer-panel-card-category"
                  style={{
                    background: `${drawer.color}22`,
                    color: drawer.color,
                    border: `1px solid ${drawer.color}44`,
                  }}
                >
                  {folder.category}
                </span>
              )}

              <h3 className="drawer-panel-card-title">{folder.title}</h3>

              <div className="drawer-panel-card-period">
                ▸ {folder.period}
              </div>

              {folder.description && (
                <div className="drawer-panel-card-desc">
                  {folder.description}
                </div>
              )}

              {folder.tags && folder.tags.length > 0 && (
                <div className="drawer-panel-card-tags">
                  {folder.tags.slice(0, 4).map((tag, i) => (
                    <span key={i} className="drawer-panel-card-tag">
                      {tag}
                    </span>
                  ))}
                  {folder.tags.length > 4 && (
                    <span className="drawer-panel-card-tag" style={{ opacity: 0.5 }}>
                      +{folder.tags.length - 4}
                    </span>
                  )}
                </div>
              )}

              <span className="drawer-panel-card-arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
