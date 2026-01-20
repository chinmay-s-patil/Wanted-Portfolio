'use client'

import React, { useState, useCallback, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import projectsData from './projectsData'

// Lazy load the project folder component
const ProjectFolder = lazy(() => import('./ProjectFolder'))

export default function ProjectsPage() {
  const [openDrawer, setOpenDrawer] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const router = useRouter()

  const handleDrawerClick = useCallback((drawerId) => {
    setOpenDrawer(prev => prev === drawerId ? null : drawerId)
  }, [])

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null)
  }, [])

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
      overflow: 'auto',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes drawerOpen {
          from { max-height: 0; opacity: 0; }
          to { max-height: 2000px; opacity: 1; }
        }
        
        .drawer-content {
          animation: drawerOpen 0.4s ease-out;
          overflow: hidden;
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => router.push('/hub')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(196, 165, 116, 0.2)',
          border: '2px solid #8b7355',
          color: '#f6efe2',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ← BACK TO HQ
      </button>

      {/* Main Content */}
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8rem 2rem 4rem',
      }}>
        {/* Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: '#f6efe2',
            marginBottom: '0.5rem',
            textShadow: '0 4px 12px rgba(0,0,0,0.8)',
            letterSpacing: '0.05em'
          }}>
            CASE FILES ARCHIVE
          </h1>
          <div style={{
            width: '180px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #c4a574, transparent)',
            margin: '0 auto 1rem'
          }} />
          <p style={{
            fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            color: '#8b7355',
            fontStyle: 'italic',
            letterSpacing: '0.08em'
          }}>
            Click drawers to view folders inside
          </p>
        </div>

        {/* Filing Cabinet */}
        <div style={{
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {projectsData.drawers.map((drawer) => (
            <div key={drawer.id} style={{ width: '100%' }}>
              {/* Drawer Front */}
              <div
                onClick={() => handleDrawerClick(drawer.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '90px',
                  background: `linear-gradient(180deg, ${drawer.color}dd 0%, ${drawer.color}aa 100%)`,
                  border: '4px solid rgba(0,0,0,0.5)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: openDrawer === drawer.id 
                    ? '0 8px 24px rgba(0,0,0,0.7)'
                    : '0 6px 16px rgba(0,0,0,0.6)',
                  transform: openDrawer === drawer.id ? 'translateY(-2px)' : 'translateY(0)',
                  overflow: 'hidden'
                }}
              >
                {/* Handle */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120px',
                  height: '40px',
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)',
                  borderRadius: '6px',
                  border: '3px solid rgba(0,0,0,0.6)',
                  boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '70px',
                    height: '6px',
                    background: 'linear-gradient(90deg, #3a3a3a, #1a1a1a, #3a3a3a)',
                    borderRadius: '3px'
                  }} />
                </div>

                {/* Label */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(246, 239, 226, 0.95)',
                  padding: '6px 20px',
                  borderRadius: '4px',
                  border: '2px solid rgba(0,0,0,0.3)',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#1a1410',
                  letterSpacing: '0.12em'
                }}>
                  {drawer.label}
                </div>

                {/* File Count */}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  color: '#c4a574',
                  fontWeight: '700'
                }}>
                  {drawer.folders.length} FILES
                </div>
              </div>

              {/* Drawer Contents */}
              {openDrawer === drawer.id && (
                <div className="drawer-content" style={{
                  marginTop: '1rem',
                  padding: '2rem',
                  background: 'rgba(61, 40, 23, 0.3)',
                  border: '3px solid #3d2817',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {drawer.folders.map((folder) => (
                      <div
                        key={folder.id}
                        onClick={() => handleProjectClick(folder)}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px) rotate(-2deg)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) rotate(0deg)'
                        }}
                      >
                        {/* Folder Tab */}
                        <div style={{
                          position: 'absolute',
                          top: '-12px',
                          left: '20px',
                          width: '100px',
                          height: '28px',
                          background: `linear-gradient(180deg, ${drawer.color}dd, ${drawer.color}bb)`,
                          borderRadius: '6px 6px 0 0',
                          border: '2px solid rgba(0,0,0,0.3)',
                          borderBottom: 'none',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            color: '#f6efe2',
                            letterSpacing: '0.05em',
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            padding: '0 0.25rem'
                          }}>
                            {folder.shortTitle || folder.title.substring(0, 8)}
                          </div>
                        </div>

                        {/* Folder Body */}
                        <div style={{
                          width: '100%',
                          height: '160px',
                          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
                          border: '3px solid #8b7355',
                          borderRadius: '0 8px 8px 8px',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                          position: 'relative',
                          overflow: 'hidden',
                          zIndex: 1
                        }}>
                          {/* Classified stamp */}
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%) rotate(-12deg)',
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            color: 'rgba(139, 0, 0, 0.15)',
                            border: '3px solid rgba(139, 0, 0, 0.15)',
                            padding: '0.3rem 1rem',
                            letterSpacing: '0.2em',
                            pointerEvents: 'none'
                          }}>
                            CASE FILE
                          </div>

                          {/* Case Number */}
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            color: '#8b7355',
                            fontFamily: "'Courier Prime', monospace"
                          }}>
                            #{folder.id.substring(0, 6).toUpperCase()}
                          </div>
                        </div>

                        {/* Hover label */}
                        <div style={{
                          marginTop: '0.5rem',
                          fontSize: '0.75rem',
                          color: '#c4a574',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          {folder.title.length > 30 ? folder.title.substring(0, 30) + '...' : folder.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Project Folder Modal - Lazy Loaded */}
      {selectedProject && (
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectFolder project={selectedProject} onClose={handleCloseProject} />
        </Suspense>
      )}
    </div>
  )
}