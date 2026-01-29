// src/visualization/VisualizationPage.jsx
'use client'

import { useState, useCallback, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import visualizationsList from './VisualizationList'

const VizWindow = lazy(() => import('./VizWindow'))

export default function VisualizationPage() {
  const [selectedViz, setSelectedViz] = useState(null)
  const navigate = useNavigate()

  const handleVizClick = useCallback((viz) => {
    setSelectedViz(viz)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedViz(null)
  }, [])

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
      justifyContent: 'center'
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
        }
        
        .desktop-icon:active {
          background: rgba(49, 106, 197, 0.5);
        }

        .monitor-screen {
          background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
          box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
        }
        
        .desktop-content::-webkit-scrollbar {
          width: 12px;
        }
        
        .desktop-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .desktop-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 6px;
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

      {/* Main Computer Monitor */}
      <div style={{
        width: '90%',
        maxWidth: '1200px',
        height: '85vh',
        maxHeight: '800px',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        
        {/* Monitor */}
        <div style={{
          flex: 1,
          height: '100%',
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
              border: '2px solid #000'
            }}>
              
              {/* CRT Scanlines Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px)',
                pointerEvents: 'none',
                zIndex: 10
              }} />

              {/* Content - either Desktop or IE Window */}
              {!selectedViz ? (
                /* Desktop Interface */
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  
                  {/* Desktop Icons Area */}
                  <div className="desktop-content" style={{
                    flex: 1,
                    padding: '1.5rem',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, 90px)',
                      gap: '1.5rem',
                      justifyContent: 'start'
                    }}>
                      {visualizationsList.map((viz) => (
                        <div
                          key={viz.id}
                          className="desktop-icon"
                          onClick={() => handleVizClick(viz)}
                          style={{
                            width: '90px',
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            borderRadius: '2px',
                            userSelect: 'none'
                          }}
                        >
                          {/* Icon */}
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                            border: '2px solid #003C74',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            position: 'relative'
                          }}>
                            {viz.icon}
                            
                            {viz.isWIP && (
                              <div style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '16px',
                                height: '16px',
                                background: '#FFD700',
                                border: '1px solid #000',
                                borderRadius: '50%',
                                fontSize: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#000'
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
                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                            lineHeight: '1.2',
                            wordWrap: 'break-word',
                            maxWidth: '100%',
                            fontFamily: "'Tahoma', sans-serif"
                          }}>
                            {viz.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Windows XP Taskbar */}
                  <div style={{
                    height: '32px',
                    background: 'linear-gradient(180deg, #245EDC 0%, #1941A5 100%)',
                    borderTop: '2px solid #0831D9',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 6px',
                    gap: '6px',
                    boxShadow: '0 -2px 4px rgba(0,0,0,0.3)',
                    flexShrink: 0
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
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
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

                    {/* System Tray - Clock */}
                    <div style={{
                      marginLeft: 'auto',
                      height: '22px',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(0,0,0,0.3)',
                      borderRadius: '2px',
                      padding: '0 10px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '11px',
                      color: '#fff',
                      fontFamily: "'Tahoma', sans-serif"
                    }}>
                      {new Date().toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* IE Window Inside Screen */
                <Suspense fallback={
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '14px',
                    fontFamily: "'Tahoma', sans-serif"
                  }}>
                    Loading...
                  </div>
                }>
                  <VizWindow viz={selectedViz} onClose={handleClose} />
                </Suspense>
              )}
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

        {/* CPU Tower */}
        <div style={{
          width: '180px',
          height: '500px',
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