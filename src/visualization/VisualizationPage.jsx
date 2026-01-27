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
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
      `}</style>

      {/* Back Button - Top Left Corner */}
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

      {/* Main Desktop Setup Container */}
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
        padding: '2rem'
      }}>
        
        {/* CRT Monitor */}
        <div style={{
          position: 'relative',
          width: '800px',
          maxWidth: '90vw',
          aspectRatio: '4/3',
          marginBottom: '2rem'
        }}>
          
          {/* Monitor Bezel */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)',
            borderRadius: '12px 12px 24px 24px',
            padding: '2.5rem 2.5rem 3.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
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
              
              {/* CRT Scanlines */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 2px)',
                pointerEvents: 'none',
                zIndex: 10
              }} />

              {/* Desktop Area */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
                position: 'relative',
                padding: '1rem',
                overflowY: 'auto'
              }}>
                
                {/* Desktop Icons Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, 90px)',
                  gap: '1rem',
                  padding: '1rem'
                }}>
                  {visualizationsList.map((viz) => (
                    <div
                      key={viz.id}
                      className="desktop-icon"
                      onClick={() => handleVizClick(viz)}
                      onDoubleClick={() => handleVizClick(viz)}
                      style={{
                        width: '90px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        borderRadius: '2px',
                        userSelect: 'none'
                      }}
                    >
                      {/* Icon Image Container */}
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
                        
                        {/* WIP Corner Badge */}
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

                      {/* Icon Label */}
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

                {/* Taskbar */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '30px',
                  background: 'linear-gradient(180deg, #245EDC 0%, #1941A5 100%)',
                  borderTop: '2px solid #0831D9',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 4px',
                  gap: '4px',
                  boxShadow: '0 -2px 4px rgba(0,0,0,0.3)'
                }}>
                  
                  {/* Start Button */}
                  <div style={{
                    height: '24px',
                    background: 'linear-gradient(180deg, #3FA142 0%, #2D8B2F 100%)',
                    border: '1px solid #fff',
                    borderRight: '1px solid #003C00',
                    borderBottom: '1px solid #003C00',
                    borderRadius: '2px',
                    padding: '0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
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
                      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      ◉
                    </div>
                    start
                  </div>

                  {/* Clock */}
                  <div style={{
                    marginLeft: 'auto',
                    height: '20px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(0,0,0,0.3)',
                    borderRadius: '2px',
                    padding: '0 8px',
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
            </div>

            {/* Monitor Brand Label */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#666',
              letterSpacing: '2px',
              fontWeight: 'bold'
            }}>
              VIZ-TRON XP
            </div>

            {/* Power LED */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '24px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00ff00',
              boxShadow: '0 0 8px #00ff00'
            }} />
          </div>
        </div>

        {/* Desktop Base - Keyboard and Mouse area */}
        <div style={{
          width: '900px',
          maxWidth: '95vw',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center'
        }}>
          
          {/* Keyboard */}
          <div style={{
            width: '700px',
            maxWidth: '100%',
            height: '180px',
            background: 'linear-gradient(135deg, #e8e8e8 0%, #c8c8c8 100%)',
            borderRadius: '8px 8px 4px 4px',
            border: '2px solid #a0a0a0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)',
            padding: '1rem',
            position: 'relative'
          }}>
            {/* Keyboard Keys - Simplified grid representation */}
            <div style={{
              display: 'grid',
              gridTemplateRows: 'repeat(5, 1fr)',
              gap: '4px',
              height: '100%'
            }}>
              {/* Row 1 - Function keys */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(15, 1fr)',
                gap: '3px'
              }}>
                {[...Array(15)].map((_, i) => (
                  <div key={i} style={{
                    background: 'linear-gradient(180deg, #f0f0f0, #d0d0d0)',
                    border: '1px solid #a0a0a0',
                    borderRadius: '2px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)'
                  }} />
                ))}
              </div>
              
              {/* Rows 2-5 - Main keys */}
              {[...Array(4)].map((_, rowIdx) => (
                <div key={rowIdx} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(15, 1fr)',
                  gap: '3px'
                }}>
                  {[...Array(15)].map((_, i) => (
                    <div key={i} style={{
                      background: 'linear-gradient(180deg, #f0f0f0, #d0d0d0)',
                      border: '1px solid #a0a0a0',
                      borderRadius: '2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.5)'
                    }} />
                  ))}
                </div>
              ))}
            </div>

            {/* Keyboard Brand */}
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '12px',
              fontSize: '8px',
              color: '#666',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              RETRO KB-2000
            </div>
          </div>

          {/* Mouse */}
          <div style={{
            width: '80px',
            height: '110px',
            background: 'linear-gradient(135deg, #e8e8e8 0%, #c8c8c8 100%)',
            borderRadius: '40px 40px 35px 35px',
            border: '2px solid #a0a0a0',
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
            position: 'relative',
            alignSelf: 'flex-end',
            marginRight: '10%'
          }}>
            {/* Mouse Buttons */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '60px',
              display: 'flex',
              gap: '2px'
            }}>
              {/* Left Button */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, #f0f0f0, #d8d8d8)',
                borderRadius: '20px 8px 0 0',
                border: '1px solid #b0b0b0',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)'
              }} />
              
              {/* Right Button */}
              <div style={{
                flex: 1,
                background: 'linear-gradient(180deg, #f0f0f0, #d8d8d8)',
                borderRadius: '8px 20px 0 0',
                border: '1px solid #b0b0b0',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5)'
              }} />
            </div>

            {/* Scroll Wheel */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '20px',
              background: 'linear-gradient(90deg, #606060, #808080)',
              borderRadius: '5px',
              border: '1px solid #404040',
              boxShadow: 'inset 0 0 3px rgba(0,0,0,0.5)'
            }} />

            {/* Cable */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '12px',
              background: '#2a2a2a',
              borderRadius: '3px 3px 0 0'
            }} />
          </div>
        </div>

        {/* CPU Tower - Positioned to the right side */}
        <div style={{
          position: 'absolute',
          right: '5%',
          bottom: '8%',
          width: '160px',
          height: '400px',
          background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
          borderRadius: '4px',
          border: '2px solid #1a1a1a',
          boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Front Panel */}
          <div style={{
            width: '100%',
            flex: 1,
            background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
            borderRadius: '2px',
            padding: '1rem',
            position: 'relative'
          }}>
            {/* Power Button */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00ff00, #00cc00)',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 20px rgba(0,255,0,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              border: '2px solid #006600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#003300',
              fontWeight: 'bold'
            }}>
              ◉
            </div>

            {/* LED Indicators */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00ff00',
                  boxShadow: '0 0 8px rgba(0,255,0,0.6)'
                }} />
                <span style={{
                  fontSize: '9px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>PWR</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ff8800',
                  boxShadow: '0 0 8px rgba(255,136,0,0.6)'
                }} />
                <span style={{
                  fontSize: '9px',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>HDD</span>
              </div>
            </div>

            {/* Drive Bays */}
            <div style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  width: '100%',
                  height: '30px',
                  background: 'linear-gradient(90deg, #1a1a1a, #2a2a2a)',
                  border: '1px solid #0a0a0a',
                  borderRadius: '2px',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
                }} />
              ))}
            </div>

            {/* Brand Label */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              color: '#666',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textAlign: 'center'
            }}>
              RETRO<br/>TOWER
            </div>
          </div>

          {/* Bottom Ventilation */}
          <div style={{
            width: '100%',
            height: '40px',
            background: '#1a1a1a',
            borderRadius: '0 0 2px 2px',
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '3px',
            padding: '8px',
            borderTop: '1px solid #0a0a0a'
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, #0a0a0a, #1a1a1a)',
                borderRadius: '1px'
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* IE Window - Lazy Loaded */}
      {selectedViz && (
        <Suspense fallback={
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
            zIndex: 100,
            fontFamily: "'Tahoma', sans-serif"
          }}>
            Loading...
          </div>
        }>
          <VizWindow viz={selectedViz} onClose={handleClose} />
        </Suspense>
      )}
    </div>
  )
}