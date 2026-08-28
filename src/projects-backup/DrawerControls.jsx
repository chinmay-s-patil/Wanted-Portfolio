import { useEffect, useCallback } from 'react'
import { useCabinetStore } from './useCabinetStore'
import projectsData from './projectsData'

export default function DrawerControls({ onSelectProject, onToggleList }) {
  const openDrawerId = useCabinetStore((s) => s.openDrawerId)
  const setOpenDrawer = useCabinetStore((s) => s.setOpenDrawer)
  const activeFolderIndex = useCabinetStore((s) => s.activeFolderIndex)
  const setActiveFolderIndex = useCabinetStore((s) => s.setActiveFolderIndex)

  const drawer = openDrawerId
    ? projectsData.drawers.find((d) => d.id === openDrawerId)
    : null

  const totalFolders = drawer?.folders?.length || 0
  const activeFolder = drawer?.folders?.[activeFolderIndex]

  const handlePrev = useCallback(() => {
    if (totalFolders <= 1) return
    setActiveFolderIndex((activeFolderIndex - 1 + totalFolders) % totalFolders)
  }, [activeFolderIndex, totalFolders, setActiveFolderIndex])

  const handleNext = useCallback(() => {
    if (totalFolders <= 1) return
    setActiveFolderIndex((activeFolderIndex + 1) % totalFolders)
  }, [activeFolderIndex, totalFolders, setActiveFolderIndex])

  const handleOpen = useCallback(() => {
    if (activeFolder) {
      onSelectProject(activeFolder)
    }
  }, [activeFolder, onSelectProject])

  // Keyboard navigation support
  useEffect(() => {
    if (!drawer) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleOpen()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpenDrawer(openDrawerId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawer, handlePrev, handleNext, handleOpen, openDrawerId, setOpenDrawer])

  if (!drawer || !activeFolder) return null

  return (
    <div className="drawer-controls-container">
      <div className="drawer-controls-card">
        {/* Header */}
        <div className="drawer-controls-header">
          <div className="drawer-controls-badge">
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: drawer.color || '#c4a574',
                boxShadow: `0 0 6px ${drawer.color}`
              }}
            />
            <span>{drawer.label.toUpperCase()}</span>
            <span>&bull;</span>
            <span>FILE {activeFolderIndex + 1} OF {totalFolders}</span>
          </div>

          {/* Quick index selector dots */}
          <div className="drawer-controls-dots">
            {drawer.folders.map((f, i) => (
              <div
                key={f.id}
                className={`drawer-dot ${i === activeFolderIndex ? 'active' : ''}`}
                onClick={() => setActiveFolderIndex(i)}
                title={`File ${i + 1}: ${f.title}`}
              />
            ))}
          </div>

          <button
            type="button"
            className="drawer-close-top"
            onClick={() => setOpenDrawer(openDrawerId)}
          >
            CLOSE (ESC)
          </button>
        </div>

        {/* Active File Summary */}
        <div className="drawer-controls-info">
          <h3 className="drawer-file-title">
            {activeFolder.title}
          </h3>
          <div className="drawer-file-meta">
            <span>CATEGORY: {activeFolder.category || 'GENERAL'}</span>
            <span>&bull;</span>
            <span>PERIOD: {activeFolder.period}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="drawer-controls-actions">
          <button
            type="button"
            className="drawer-btn"
            onClick={handlePrev}
            disabled={totalFolders <= 1}
            title="Previous file (Left Arrow)"
          >
            &#9664; PREV
          </button>

          <button
            type="button"
            className="drawer-btn drawer-btn-primary"
            onClick={handleOpen}
            title="Open full case file (Enter)"
          >
            <span>INSPECT CASE FILE</span>
            <span style={{ fontSize: '0.9rem' }}>↗</span>
          </button>

          {onToggleList && (
            <button
              type="button"
              className="drawer-btn"
              onClick={onToggleList}
              title="View all files in drawer list"
            >
              <span>ALL FILES</span>
              <span>☰</span>
            </button>
          )}

          <button
            type="button"
            className="drawer-btn"
            onClick={handleNext}
            disabled={totalFolders <= 1}
            title="Next file (Right Arrow)"
          >
            NEXT &#9654;
          </button>
        </div>
      </div>
    </div>
  )
}
