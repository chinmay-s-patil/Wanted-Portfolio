// src/visualization/VisualizationPage.jsx
'use client'

import { useState, useCallback, lazy, Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import visualizationsList from './VisualizationList'
import ViewportScaleStage from '../common/ViewportScaleStage'

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
  const [hddActivity, setHddActivity] = useState(false)

  // Power States: 'ON' | 'SHUTTING_DOWN' | 'OFF' | 'BOOTING' | 'LOGIN'
  const [powerState, setPowerState] = useState('ON')
  const [typedPassword, setTypedPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showStartMenu, setShowStartMenu] = useState(false)

  const navigate = useNavigate()

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate hard drive LED activity flickering when powered on
  useEffect(() => {
    if (powerState !== 'ON' && powerState !== 'BOOTING' && powerState !== 'LOGIN') return
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        setHddActivity(true)
        setTimeout(() => setHddActivity(false), 80 + Math.random() * 150)
      }
    }, 800)
    return () => clearInterval(blinkInterval)
  }, [powerState])

  // Handle Login Screen Auto-Typing 16 Password Dots
  useEffect(() => {
    if (powerState !== 'LOGIN') {
      setTypedPassword('')
      setIsLoggingIn(false)
      return
    }

    let currentLength = 0
    const targetLength = 16
    const typeInterval = setInterval(() => {
      currentLength++
      setTypedPassword('•'.repeat(currentLength))

      if (currentLength >= targetLength) {
        clearInterval(typeInterval)
        // Show logging in welcome state briefly
        setTimeout(() => {
          setIsLoggingIn(true)
          setTimeout(() => {
            setPowerState('ON')
          }, 600)
        }, 300)
      }
    }, 70) // 70ms per dot

    return () => clearInterval(typeInterval)
  }, [powerState])

  const handleVizClick = useCallback((viz) => {
    setSelectedViz(viz)
    setShowStartMenu(false)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedViz(null)
  }, [])

  // Toggle Power Action
  const handlePowerToggle = useCallback(() => {
    if (powerState === 'ON' || powerState === 'LOGIN' || powerState === 'BOOTING') {
      // SHUTDOWN
      setPowerState('SHUTTING_DOWN')
      setShowStartMenu(false)
      setSelectedViz(null)

      setTimeout(() => {
        setPowerState('OFF')
      }, 750)
    } else if (powerState === 'OFF') {
      // BOOT UP SEQUENCE
      setPowerState('BOOTING')

      // Transition from Boot screen to XP Login screen after 1.4s
      setTimeout(() => {
        setPowerState('LOGIN')
      }, 1400)
    }
  }, [powerState])

  return (
    <ViewportScaleStage>
      <div style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 30%, #2e221b 0%, #17110e 60%, #0a0705 100%)',
        overflow: 'hidden',
        position: 'relative',
      fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      userSelect: 'none',
      WebkitUserSelect: 'none'
    }}>
      <style>{`
        @keyframes pulseLed {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 6px rgba(0, 255, 128, 0.8)); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 2px rgba(0, 255, 128, 0.4)); }
        }

        /* CRT Screen Collapse Shutdown Animation */
        @keyframes crtShutdown {
          0% {
            transform: scale(1, 1);
            filter: brightness(1);
            opacity: 1;
          }
          40% {
            transform: scale(1, 0.005);
            filter: brightness(3);
            opacity: 1;
          }
          80% {
            transform: scale(0.005, 0.005);
            filter: brightness(8);
            opacity: 1;
          }
          100% {
            transform: scale(0, 0);
            filter: brightness(0);
            opacity: 0;
          }
        }

        .crt-collapsing {
          animation: crtShutdown 0.75s cubic-bezier(0.77, 0, 0.175, 1) forwards;
          transform-origin: center center;
        }

        /* XP Boot Loading Dots Animation */
        @keyframes xpBootBar {
          0% { left: -30%; }
          100% { left: 100%; }
        }

        .xp-loading-bar {
          position: absolute;
          top: 0;
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, transparent, #316AC5, #4DA6FF, #316AC5, transparent);
          animation: xpBootBar 1.2s infinite linear;
        }

        .desktop-icon-interactive {
          transition: all 0.15s ease;
          cursor: pointer;
        }

        .desktop-icon-interactive:hover {
          background: rgba(49, 106, 197, 0.35);
          outline: 1px dotted rgba(255,255,255,0.7);
          outline-offset: -1px;
        }

        .desktop-icon-interactive:active {
          background: rgba(49, 106, 197, 0.6);
        }

        .icon-grid {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-content: flex-start;
          height: calc(100% - 34px);
          padding: 1.25rem;
          overflow-x: auto;
        }

        .icon-grid::-webkit-scrollbar {
          height: 8px;
        }

        .icon-grid::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }

        .icon-grid::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        .system-icon-inert {
          cursor: default;
          user-select: none;
          pointer-events: none;
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(30, 25, 20, 0.92)',
          border: '1.5px solid rgba(196, 165, 116, 0.4)',
          color: '#c4a574',
          padding: '0.65rem 1.25rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Courier Prime', monospace",
          boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          letterSpacing: '0.05em'
        }}
      >
        &#9664; BACK TO HQ
      </button>

      {/* Workstation Desk Setup Wrapper */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '1.75rem',
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'relative'
      }}>

        {/* MONITOR ASSEMBLY */}
        <div style={{
          width: 'min(1140px, 80vw)',
          height: 'min(780px, 86vh)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Monitor Bezel Frame */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #383430 0%, #221f1c 50%, #161412 100%)',
            borderRadius: '16px',
            padding: '1.75rem 1.75rem 2.25rem',
            boxShadow: '0 30px 90px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.15)',
            border: '3px solid #141210',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Brand Logo */}
            <div style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#8b7355',
              letterSpacing: '3px',
              fontWeight: 'bold',
              marginBottom: '0.6rem',
              fontFamily: "'Special Elite', monospace"
            }}>
              VIZ-COMP 2000 PRO &bull; CRT-FLATPANEL
            </div>

            {/* Screen Viewport (Outer Frame is solid black so CRT collapse shrinks into black!) */}
            <div style={{
              flex: 1,
              borderRadius: '6px',
              position: 'relative',
              overflow: 'hidden',
              border: '3px solid #0a0908',
              background: '#000000',
              display: 'flex',
              flexDirection: 'column'
            }}>

              {/* CRT Scanlines Effect (Only when active) */}
              {powerState !== 'OFF' && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, transparent 1px, transparent 2px)',
                  pointerEvents: 'none',
                  zIndex: 100
                }} />
              )}

              {/* VIEWPORT CONTENT ACCORDING TO POWER STATE */}

              {/* 1. POWERED ON DESKTOP or SHUTTING DOWN */}
              {(powerState === 'ON' || powerState === 'SHUTTING_DOWN') && (
                <div
                  className={powerState === 'SHUTTING_DOWN' ? 'crt-collapsing' : ''}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: '#000'
                  }}
                >
                  {/* Desktop Wallpaper */}
                  <div
                    style={{
                      flex: 1,
                      background: 'linear-gradient(180deg, #3A7CBD 0%, #25588C 60%, #193D66 100%)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => setShowStartMenu(false)}
                  >
                    {/* Icons Grid */}
                    <div className="icon-grid" style={{
                      opacity: selectedViz ? 0.3 : 1,
                      pointerEvents: selectedViz ? 'none' : 'auto',
                      transition: 'opacity 0.3s'
                    }}>
                      {systemIcons.map((item) => (
                        <div
                          key={item.id}
                          className="system-icon-inert"
                          style={{
                            width: '80px',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '4px',
                            userSelect: 'none',
                            marginBottom: '0.4rem'
                          }}
                        >
                          <div style={{
                            width: '44px', height: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.65))'
                          }}>
                            {item.icon}
                          </div>
                          <div style={{
                            fontSize: '11px', color: '#fff', textAlign: 'center',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.9)', lineHeight: '1.2',
                            fontFamily: "'Tahoma', sans-serif",
                            padding: '1px 3px'
                          }}>
                            {item.title}
                          </div>
                        </div>
                      ))}

                      {visualizationsList.map((viz) => (
                        <div
                          key={viz.id}
                          className="desktop-icon-interactive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVizClick(viz)
                          }}
                          style={{
                            width: '80px', padding: '6px', display: 'flex',
                            flexDirection: 'column', alignItems: 'center', gap: '4px',
                            borderRadius: '4px', userSelect: 'none', marginBottom: '0.4rem'
                          }}
                        >
                          <div style={{
                            width: '44px', height: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.65))',
                            position: 'relative'
                          }}>
                            {viz.icon}
                            {viz.isWIP && (
                              <div style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                width: '15px', height: '15px', background: '#FFD700',
                                border: '1px solid #000', borderRadius: '50%', fontSize: '9px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', color: '#000',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
                              }}>
                                !
                              </div>
                            )}
                          </div>

                          <div style={{
                            fontSize: '11px', color: '#fff', textAlign: 'center',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.9)', lineHeight: '1.2',
                            fontFamily: "'Tahoma', sans-serif",
                            background: selectedViz?.id === viz.id ? 'rgba(0,0,139,0.7)' : 'transparent',
                            padding: '1px 3px', borderRadius: '2px'
                          }}>
                            {viz.title}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* IE Browser Overlay */}
                    {selectedViz && (
                      <Suspense fallback={
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(180deg, #3A7CBD 0%, #193D66 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px'
                        }}>
                          Launching browser...
                        </div>
                      }>
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          zIndex: 50
                        }}>
                          <WikiBrowser viz={selectedViz} onClose={handleClose} />
                        </div>
                      </Suspense>
                    )}

                    {/* Start Menu */}
                    {showStartMenu && (
                      <div style={{
                        position: 'absolute', bottom: '0', left: '0', width: '280px',
                        background: '#fff', border: '2px solid #0058EE', borderRadius: '6px 6px 0 0',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden',
                        fontFamily: "'Tahoma', sans-serif"
                      }}>
                        <div style={{
                          background: 'linear-gradient(180deg, #0058EE 0%, #003FD1 100%)',
                          padding: '0.75rem 1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem'
                        }}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '4px', background: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                          }}>
                            👤
                          </div>
                          <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Engineer Workstation</span>
                        </div>

                        <div style={{ padding: '0.5rem', background: '#F1F0E9', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: '#333', cursor: 'pointer', borderRadius: '3px' }} onClick={() => navigate('/hub')}>
                            🏠 Return to Portfolio HQ
                          </div>
                          <div style={{ borderTop: '1px solid #D6D3CE', margin: '0.3rem 0' }} />
                          <div
                            style={{
                              padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: '#fff',
                              background: '#E22626', borderRadius: '4px', cursor: 'pointer',
                              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                            onClick={handlePowerToggle}
                          >
                            <span>⏻</span>
                            <span>Turn Off Computer</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Windows XP Taskbar */}
                  <div style={{
                    height: '32px', background: 'linear-gradient(180deg, #245EDC 0%, #1941A5 100%)',
                    borderTop: '2px solid #0831D9', display: 'flex', alignItems: 'center',
                    padding: '0 6px', gap: '6px', flexShrink: 0, zIndex: 100, position: 'relative'
                  }}>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowStartMenu((prev) => !prev)
                      }}
                      style={{
                        height: '26px', background: 'linear-gradient(180deg, #3FA142 0%, #2D8B2F 100%)',
                        border: '1px solid #fff', borderRight: '1px solid #003C00', borderBottom: '1px solid #003C00',
                        borderRadius: '3px', padding: '0 14px', display: 'flex', alignItems: 'center',
                        gap: '5px', fontSize: '11px', fontWeight: 'bold', color: '#fff', cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '16px', height: '16px', background: 'radial-gradient(circle, #FFD700, #FFA500)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 'bold', color: '#000'
                      }}>
                        ◉
                      </div>
                      start
                    </div>

                    {selectedViz && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px',
                        padding: '0 6px', borderLeft: '1px solid rgba(0,0,0,0.3)', height: '24px'
                      }}>
                        <div style={{
                          height: '22px', padding: '0 8px', background: '#3C8CFF', border: '1px solid #0831D9',
                          borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '4px', color: '#fff', fontSize: '11px'
                        }}>
                          <span style={{ fontSize: '14px' }}>e</span>
                          <span>{selectedViz.title}.wiki</span>
                        </div>
                      </div>
                    )}

                    <div style={{
                      marginLeft: 'auto', height: '22px', background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(0,0,0,0.3)', borderRadius: '2px', padding: '0 10px',
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#fff'
                    }}>
                      <span>🔊</span>
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. POWERED OFF MONITOR EASTER EGG */}
              {powerState === 'OFF' && (
                <div
                  onClick={handlePowerToggle}
                  style={{
                    flex: 1, background: '#000000', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: '#c4a574', fontFamily: "'Courier Prime', monospace", textAlign: 'center',
                    padding: '2rem', userSelect: 'none'
                  }}
                >
                  <div style={{
                    border: '2px solid rgba(196, 165, 116, 0.5)', padding: '2rem 3rem',
                    borderRadius: '12px', background: 'rgba(15, 12, 10, 0.95)',
                    boxShadow: '0 0 50px rgba(0,0,0,0.95)'
                  }}>
                    <div style={{ fontSize: '1.8rem', color: '#ffdd99', marginBottom: '1rem', fontWeight: 'bold' }}>
                      Haha, turn it back on
                    </div>
                    <div style={{ fontSize: '0.88rem', opacity: 0.7, marginBottom: '1.5rem', color: '#c4a574' }}>
                      VIZCOMP WORKSTATION IS POWERED OFF
                    </div>
                    <div style={{
                      display: 'inline-block', background: 'rgba(196, 165, 116, 0.2)',
                      border: '1px solid #c4a574', color: '#fff', padding: '0.65rem 1.25rem',
                      borderRadius: '6px', fontSize: '0.82rem', letterSpacing: '0.08em',
                      fontWeight: 'bold'
                    }}>
                      [ CLICK HERE OR PRESS POWER BUTTON ON TOWER ]
                    </div>
                  </div>
                </div>
              )}

              {/* 3. XP BOOT SPLASH SCREEN */}
              {powerState === 'BOOTING' && (
                <div style={{
                  flex: 1, background: '#000000', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', color: '#fff',
                  fontFamily: "'Tahoma', sans-serif"
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <span style={{ color: '#F25022' }}>Microsoft</span>
                      <span style={{ color: '#fff' }}>Windows</span>
                      <span style={{ color: '#FFB900', fontSize: '1.2rem', verticalAlign: 'super' }}>XP</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#888', letterSpacing: '3px', marginTop: '0.2rem' }}>
                      Professional Workstation
                    </div>
                  </div>

                  {/* XP Loading Bar Frame */}
                  <div style={{
                    width: '180px', height: '14px', border: '2px solid #555',
                    borderRadius: '4px', background: '#111', position: 'relative', overflow: 'hidden'
                  }}>
                    <div className="xp-loading-bar" />
                  </div>
                </div>
              )}

              {/* 4. MICROSOFT WINDOWS XP LOGIN SCREEN EASTER EGG */}
              {powerState === 'LOGIN' && (
                <div style={{
                  flex: 1, background: 'linear-gradient(180deg, #002B9A 0%, #001865 100%)',
                  display: 'flex', flexDirection: 'column', fontFamily: "'Tahoma', sans-serif",
                  position: 'relative'
                }}>
                  {/* Top Blue Header */}
                  <div style={{ height: '70px', background: '#001A75', borderBottom: '2px solid #0058EE', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
                    <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                      Windows <span style={{ color: '#FFB900' }}>XP</span>
                    </span>
                  </div>

                  {/* Center Welcome Container */}
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem', gap: '3rem'
                  }}>
                    {/* Left Branding */}
                    <div style={{ color: '#fff', textAlign: 'right', borderRight: '1.5px solid rgba(255,255,255,0.2)', paddingRight: '3rem' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                        To begin, click your user name
                      </div>
                      <div style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.4rem' }}>
                        VIZCOMP 2000 PRO WORKSTATION
                      </div>
                    </div>

                    {/* Right User Login Tile */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.12)', border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '8px', padding: '1.25rem 1.75rem', display: 'flex',
                      alignItems: 'center', gap: '1.25rem', backdropFilter: 'blur(4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', minWidth: '320px'
                    }}>
                      <div style={{
                        width: '54px', height: '54px', borderRadius: '6px', background: 'linear-gradient(135deg, #FFB900 0%, #F25022 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.8rem', border: '2px solid #fff', boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                      }}>
                        👨‍💻
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>
                          Chinmay Patil
                        </div>

                        {/* Password Auto-Typing Display */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="password"
                            readOnly
                            value={typedPassword}
                            placeholder="Type password"
                            style={{
                              width: '160px', padding: '4px 8px', borderRadius: '3px',
                              border: '1px solid #7F9DB9', background: '#fff',
                              fontSize: '1.1rem', letterSpacing: '2px', color: '#000',
                              outline: 'none', height: '26px', boxSizing: 'border-box'
                            }}
                          />
                          <button style={{
                            height: '26px', width: '26px', background: 'linear-gradient(180deg, #3FA142 0%, #2D8B2F 100%)',
                            border: '1px solid #fff', borderRadius: '3px', color: '#fff',
                            fontWeight: 'bold', cursor: 'default', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
                          }}>
                            ➔
                          </button>
                        </div>

                        {isLoggingIn && (
                          <div style={{ fontSize: '0.78rem', color: '#FFD700', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
                            Loading your personal settings...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Blue Footer */}
                  <div style={{ height: '50px', background: '#001A75', borderTop: '2px solid #0058EE', display: 'flex', alignItems: 'center', padding: '0 2rem', justifyContent: 'space-between', color: '#fff', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handlePowerToggle}>
                      <span style={{ color: '#E22626', fontSize: '1rem' }}>⏻</span>
                      <span>Turn off computer</span>
                    </div>
                    <div style={{ opacity: 0.6 }}>After you log on, you can add or change accounts.</div>
                  </div>
                </div>
              )}

            </div>

            {/* Monitor Bottom Control Buttons & Power LED */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '0.65rem', padding: '0 0.5rem'
            }}>
              {/* OSD Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['AUTO', 'MENU', '-', '+', 'INPUT'].map((btn) => (
                  <button
                    key={btn}
                    style={{
                      background: '#1a1816', border: '1px solid #332f2b', borderRadius: '3px',
                      color: '#665c52', fontSize: '8px', padding: '2px 6px', cursor: 'default',
                      fontFamily: "'Courier Prime', monospace"
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              {/* Monitor Power LED */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '9px', color: '#665c52', fontFamily: "'Courier Prime', monospace" }}>POWER</span>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: powerState !== 'OFF' ? '#00ff88' : '#ffaa00',
                  boxShadow: powerState !== 'OFF' ? '0 0 8px #00ff88' : 'none',
                  animation: powerState !== 'OFF' ? 'pulseLed 2s infinite' : 'none'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* REFINED HIGH-FIDELITY VINTAGE CPU TOWER */}
        <div style={{
          width: '240px', height: 'min(750px, 84vh)', flexShrink: 0,
          background: 'linear-gradient(160deg, #2c2825 0%, #1a1715 60%, #100e0d 100%)',
          borderRadius: '12px', border: '3px solid #141210',
          boxShadow: '-15px 25px 70px rgba(0,0,0,0.85), inset 0 2px 4px rgba(255,255,255,0.12)',
          display: 'flex', flexDirection: 'column', padding: '1.25rem 1rem',
          boxSizing: 'border-box', position: 'relative', gap: '1rem'
        }}>
          {/* Top Brand Plate */}
          <div style={{
            background: 'linear-gradient(180deg, #181513 0%, #25211e 100%)',
            border: '1.5px solid rgba(139, 115, 85, 0.3)', borderRadius: '6px',
            padding: '0.6rem 0.5rem', textAlign: 'center', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              fontSize: '0.82rem', fontWeight: 'bold',
              color: powerState !== 'OFF' ? '#c4a574' : '#554838',
              letterSpacing: '0.15em', fontFamily: "'Special Elite', monospace"
            }}>
              VIZCOMP-2000
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: powerState !== 'OFF' ? '#8b7355' : '#44382c',
              letterSpacing: '0.1em', fontFamily: "'Courier Prime', monospace", marginTop: '0.1rem'
            }}>
              ULTRA WORKSTATION &bull; {powerState !== 'OFF' ? '4.0 GHz' : 'STANDBY'}
            </div>
          </div>

          {/* 5.25" Optical Disc Drives */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              background: '#161412', border: '1.5px solid #36302a', borderRadius: '4px',
              padding: '0.45rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.62rem', color: '#a09080', fontWeight: 'bold', fontFamily: "'Courier Prime', monospace" }}>
                  DVD+R DL / RW
                </span>
                <span style={{ fontSize: '0.52rem', color: '#655a4e' }}>HIGH-SPEED OPTICAL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: powerState !== 'OFF' ? '#00ff88' : 'rgba(0,255,136,0.15)',
                  boxShadow: powerState !== 'OFF' ? '0 0 5px #00ff88' : 'none'
                }} />
                <div style={{ width: '18px', height: '6px', background: '#2b2622', border: '1px solid #4a423a', borderRadius: '2px' }} />
              </div>
            </div>

            <div style={{
              background: '#161412', border: '1.5px solid #36302a', borderRadius: '4px',
              padding: '0.45rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.62rem', color: '#a09080', fontWeight: 'bold', fontFamily: "'Courier Prime', monospace" }}>
                  COMPACT DISC REWRITABLE
                </span>
                <span style={{ fontSize: '0.52rem', color: '#655a4e' }}>52X SPEED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: powerState !== 'OFF' ? 'rgba(0,255,136,0.3)' : 'rgba(0,255,136,0.05)'
                }} />
                <div style={{ width: '18px', height: '6px', background: '#2b2622', border: '1px solid #4a423a', borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          {/* 3.5" Floppy Disk Drive & LED */}
          <div style={{
            background: '#141210', border: '1.5px solid #36302a', borderRadius: '4px',
            padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.6rem', color: '#8b7355', fontFamily: "'Courier Prime', monospace" }}>
                3.5" FLOPPY DISK (1.44MB)
              </span>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: (powerState !== 'OFF' && hddActivity) ? '#ffaa00' : 'rgba(255,170,0,0.15)',
                boxShadow: (powerState !== 'OFF' && hddActivity) ? '0 0 8px #ffaa00' : 'none'
              }} />
            </div>

            <div style={{
              width: '100%', height: '8px', background: '#070605', borderRadius: '2px',
              border: '1px solid #2a2520', position: 'relative'
            }}>
              <div style={{
                position: 'absolute', right: '12px', top: '-3px', width: '10px', height: '14px',
                background: '#2a241f', border: '1px solid #4a4038', borderRadius: '2px'
              }} />
            </div>
          </div>

          {/* Digital 7-Segment Readout */}
          <div style={{
            background: '#0a0908', border: '1.5px solid #2a2520', borderRadius: '6px',
            padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.6rem', color: '#8b7355', fontFamily: "'Courier Prime', monospace" }}>CPU FREQ</span>
            <span style={{
              fontFamily: "'Courier Prime', monospace", fontWeight: 'bold', fontSize: '1.1rem',
              color: powerState !== 'OFF' ? '#ff3333' : '#331111', letterSpacing: '0.15em',
              textShadow: powerState !== 'OFF' ? '0 0 8px rgba(255, 51, 51, 0.8)' : 'none'
            }}>
              {powerState !== 'OFF' ? '4.0 GHz' : ' OFF '}
            </span>
          </div>

          {/* Master Power Button (Centered, Reset button removed) */}
          <div style={{
            background: 'linear-gradient(180deg, #1f1c19 0%, #161412 100%)',
            border: '1.5px solid rgba(139, 115, 85, 0.25)', borderRadius: '8px',
            padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handlePowerToggle}
                title={powerState !== 'OFF' ? "Click to Power Off Workstation" : "Click to Boot Workstation"}
                style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: powerState !== 'OFF'
                    ? 'radial-gradient(circle at 35% 35%, #00ff88 0%, #009955 60%, #004d2a 100%)'
                    : 'radial-gradient(circle at 35% 35%, #445544 0%, #223322 100%)',
                  border: '3px solid #c4a574',
                  boxShadow: powerState !== 'OFF' ? '0 0 16px rgba(0,255,136,0.6), inset 0 2px 4px rgba(255,255,255,0.4)' : 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: powerState !== 'OFF' ? '#fff' : '#668866', fontSize: '1.3rem', fontWeight: 'bold'
                }}
              >
                ⏻
              </button>
              <span style={{ fontSize: '0.6rem', color: '#8b7355', marginTop: '0.35rem', display: 'block', fontFamily: "'Courier Prime', monospace", fontWeight: 'bold' }}>
                POWER
              </span>
            </div>
          </div>

          {/* Front I/O Ports */}
          <div style={{
            background: '#12100e', border: '1px solid #2a2520', borderRadius: '4px',
            padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '0.55rem', color: '#655a4e', fontFamily: "'Courier Prime', monospace" }}>FRONT I/O</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ width: '12px', height: '6px', background: '#080706', border: '1px solid #4a423a', borderRadius: '1px' }} />
              <div style={{ width: '12px', height: '6px', background: '#080706', border: '1px solid #4a423a', borderRadius: '1px' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ff88', border: '1px solid #006633' }} />
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ff0077', border: '1px solid #660033' }} />
            </div>
          </div>

          {/* Bottom Mesh Ventilation Grille */}
          <div style={{
            marginTop: 'auto', width: '100%', height: '56px', background: '#0a0908',
            borderRadius: '6px', border: '1.5px solid #221e1a', padding: '6px',
            display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '3px'
          }}>
            {[...Array(24)].map((_, i) => (
              <div key={i} style={{ background: 'linear-gradient(180deg, #1c1815 0%, #0c0b0a 100%)', borderRadius: '1px' }} />
            ))}
          </div>
        </div>

      </div>
      </div>
    </ViewportScaleStage>
  )
}