// src/visualization/VisualizationPage.jsx
'use client'

import { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import visualizationsList from './VisualizationList'

const WikiBrowser = lazy(() => import('./WikiBrowser'))

// Classic Windows XP System Icons for authenticity
const systemIcons = [
  { id: 'recycle', title: 'Recycle Bin', icon: '🗑️', color: '#48cae4' },
  { id: 'computer', title: 'My Computer', icon: '🖥️', color: '#48cae4' },
  { id: 'docs', title: 'My Documents', icon: '📁', color: '#fdd835' },
  { id: 'network', title: 'Network Places', icon: '🌐', color: '#48cae4' },
  { id: 'notepad', title: 'Notepad', icon: '📝', color: '#fff' },
]

export default function VisualizationPage() {
  const [selectedViz, setSelectedViz] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()

  // Update time every second (no seconds display to save resources)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleVizClick = useCallback((viz) => {
    setSelectedViz(viz)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedViz(null)
  }, [])

  // Handle system icon clicks (show "not implemented" or placeholder)
  const handleSystemClick = (title) => {
    alert(`${title} is not accessible in this session.`)
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #2a1810 0%, #1a100a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      padding: '2rem'
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .desktop-icon {
          transition: all 0.15s ease;
        }
        
        .desktop-icon:hover {
          background: rgba(49, 106, 197, 0.3);
          outline: 1px dotted rgba(255,255,255,0.5);
          outline-offset: -1px;
        }
        
        .desktop-icon:active {
          background: rgba(49, 106, 197, 0.5);
        }

        .monitor-screen {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
        }
        
        .icon-grid {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          gap: 2rem;
          align-content: flex-start;
          height: calc(100% - 40px);
          padding: 1.5rem;
          overflow-x: auto;
        }

        .icon-grid::-webkit-scrollbar {
          height: 10px;
        }
        
        .icon-grid::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .icon-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(40, 40, 40, 0.9)',
          border: '2px solid #666',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Special Elite', monospace",
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        ← Back to Hub
      </button>

      {/* Main Container - Scaled to 80% */}
      <div style={{
        transform: 'scale(0.8)',
        transformOrigin: 'center',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center'
      }}>
        
        {/* Monitor */}
        <div style={{
          width: '1000px',
          height: '750px',
          position: 'relative'
        }}>
          
          {/* Monitor Bezel */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            borderRadius: '12px',
            padding: '2rem 2rem 2.5rem',
            boxShadow: '0 25px 80px rgba(0,0,0,0.9)',
            border: '3px solid #1a1a1a'
          }}>
            
            {/* Screen */}
            <div className="monitor-screen" style={{
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #000',
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* CRT Scanlines Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px)',
                pointerEvents: 'none',
                zIndex: 10
              }} />

              {/* Desktop Background - Always visible */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                
                {/* Desktop Icons Area - Windows Style Columns */}
                <div className="icon-grid" style={{
                  opacity: selectedViz ? 0.3 : 1, // Dim desktop when window is open
                  pointerEvents: selectedViz ? 'none' : 'auto',
                  transition: 'opacity 0.3s'
                }}>
                  {/* System Icons First */}
                  {systemIcons.map((item) => (
                    <div
                      key={item.id}
                      className="desktop-icon"
                      onClick={() => handleSystemClick(item.title)}
                      style={{
                        width: '75px',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        userSelect: 'none',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: item.id === 'notepad' ? '#fff' : 'transparent',
                        borderRadius: item.id === 'notepad' ? '2px' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))'
                      }}>
                        {item.icon}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#fff',
                        textAlign: 'center',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                        lineHeight: '1.2',
                        wordWrap: 'break-word',
                        maxWidth: '100%',
                        fontFamily: "'Tahoma', sans-serif",
                        background: 'rgba(0,0,139,0.4)', // Windows XP selection blue-ish
                        padding: '0 2px'
                      }}>
                        {item.title}
                      </div>
                    </div>
                  ))}

                  {/* Separator */}
                  <div style={{ width: '20px', height: '20px' }} />

                  {/* Visualization Icons */}
                  {visualizationsList.map((viz) => (
                    <div
                      key={viz.id}
                      className="desktop-icon"
                      onClick={() => handleVizClick(viz)}
                      style={{
                        width: '75px',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '4px',
                        userSelect: 'none',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {/* Icon */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                        border: '2px solid #003C74',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        position: 'relative'
                      }}>
                        {viz.icon}
                        
                        {viz.isWIP && (
                          <div style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-4px',
                            width: '14px',
                            height: '14px',
                            background: '#FFD700',
                            border: '1px solid #000',
                            borderRadius: '50%',
                            fontSize: '9px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            color: '#000',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                          }}>
                            !
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <div style={{
                        fontSize: '11px',
                        color: '#fff',
                        textAlign: 'center',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
                        lineHeight: '1.2',
                        wordWrap: 'break-word',
                        maxWidth: '100%',
                        fontFamily: "'Tahoma', sans-serif",
                        background: selectedViz?.id === viz.id ? 'rgba(0,0,139,0.6)' : 'transparent',
                        padding: '0 2px',
                        borderRadius: '2px'
                      }}>
                        {viz.title}
                      </div>
                    </div>
                  ))}
                </div>

                {/* IE Browser Window Overlay - Renders on top but respects taskbar */}
                {selectedViz && (
                  <Suspense fallback={
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      bottom: '32px', // Leave room for taskbar
                      background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontFamily: "'Tahoma', sans-serif",
                      zIndex: 50
                    }}>
                      Loading...
                    </div>
                  }>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: '32px', // 32px is taskbar height
                      zIndex: 50
                    }}>
                      <WikiBrowser viz={selectedViz} onClose={handleClose} />
                    </div>
                  </Suspense>
                )}
              </div>

              {/* Windows XP Taskbar - ALWAYS VISIBLE */}
              <div style={{
                height: '32px',
                background: 'linear-gradient(180deg, #245EDC 0%, #1941A5 100%)',
                borderTop: '2px solid #0831D9',
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
                gap: '6px',
                boxShadow: '0 -2px 4px rgba(0,0,0,0.3)',
                flexShrink: 0,
                zIndex: 100,
                position: 'relative'
              }}>
                
                {/* Start Button */}
                <div style={{
                  height: '26px',
                  background: 'linear-gradient(180deg, #3FA142 0%, #2D8B2F 100%)',
                  border: '1px solid #fff',
                  borderRight: '1px solid #003C00',
                  borderBottom: '1px solid #003C00',
                  borderRadius: '3px',
                  padding: '0 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: "'Tahoma', sans-serif",
                  textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: 'radial-gradient(circle, #FFD700, #FFA500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: '#000',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    ◉
                  </div>
                  start
                </div>

                {/* Quick Launch Bar (shows IE icon when window is open) */}
                {selectedViz && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginLeft: '4px',
                    padding: '0 6px',
                    borderLeft: '1px solid rgba(0,0,0,0.3)',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    height: '24px'
                  }}>
                    <div style={{
                      height: '22px',
                      padding: '0 8px',
                      background: selectedViz ? '#3C8CFF' : 'transparent',
                      border: selectedViz ? '1px solid #0831D9' : 'none',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#fff',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: "'Tahoma', sans-serif",
                      boxShadow: selectedViz ? 'inset 0 1px 3px rgba(0,0,0,0.3)' : 'none'
                    }}>
                      <span style={{ fontSize: '14px' }}>e</span>
                      <span>{selectedViz.title}.wiki</span>
                    </div>
                  </div>
                )}

                {/* System Tray - Clock (no seconds) */}
                <div style={{
                  marginLeft: 'auto',
                  height: '22px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(0,0,0,0.3)',
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  padding: '0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11px',
                  color: '#fff',
                  fontFamily: "'Tahoma', sans-serif"
                }}>
                  {/* Volume Icon */}
                  <span style={{ fontSize: '12px' }}>🔊</span>
                  
                  {/* Time - No seconds to reduce load */}
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
            </div>

            {/* Monitor Stand Base Label */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '9px',
              color: '#555',
              letterSpacing: '2px',
              fontWeight: 'bold',
              fontFamily: "'Arial', sans-serif"
            }}>
              VIZ-COMP 2000
            </div>

            {/* Power LED */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '2rem',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff00',
              boxShadow: '0 0 10px rgba(0,255,0,0.8)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
          </div>
        </div>
      </div>

      {/* CPU Tower - SEPARATE DIV */}
      <div style={{
        transform: 'scale(0.8)',
        transformOrigin: 'center left',
        width: '180px',
        height: '500px',
        flexShrink: 0,
        marginLeft: '-1rem'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
          borderRadius: '6px',
          border: '3px solid #1a1a1a',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Front Panel */}
          <div style={{
            flex: 1,
            background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
            borderRadius: '3px',
            padding: '1.5rem',
            position: 'relative'
          }}>
            {/* Power Button */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #00ff00, #00cc00)',
              margin: '0 auto 2rem',
              boxShadow: '0 0 25px rgba(0,255,0,0.6), inset 0 2px 6px rgba(255,255,255,0.4)',
              border: '3px solid #006600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#003300',
              fontWeight: 'bold'
            }}>
              ◉
            </div>

            {/* Status LEDs */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '2rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#00ff00',
                  boxShadow: '0 0 10px rgba(0,255,0,0.7)'
                }} />
                <span style={{
                  fontSize: '10px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold'
                }}>POWER</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#ff8800',
                  boxShadow: '0 0 10px rgba(255,136,0,0.7)'
                }} />
                <span style={{
                  fontSize: '10px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  fontWeight: 'bold'
                }}>ACTIVITY</span>
              </div>
            </div>

            {/* Drive Bays */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '2rem'
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  width: '100%',
                  height: '35px',
                  background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a)',
                  border: '1px solid #0a0a0a',
                  borderRadius: '3px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)'
                }} />
              ))}
            </div>

            {/* Brand Badge */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontWeight: 'bold',
                letterSpacing: '2px',
                marginBottom: '4px'
              }}>
                VIZCOMP
              </div>
              <div style={{
                fontSize: '8px',
                color: '#555',
                letterSpacing: '1px'
              }}>
                WORKSTATION
              </div>
            </div>
          </div>

          {/* Bottom Ventilation Grille */}
          <div style={{
            width: '100%',
            height: '50px',
            background: '#1a1a1a',
            borderRadius: '0 0 3px 3px',
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '4px',
            padding: '10px',
            borderTop: '1px solid #0a0a0a'
          }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #0a0a0a, #1a1a1a)',
                borderRadius: '2px'
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}