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
      background: 'linear-gradient(180deg, #5B9BD5 0%, #3A7CBD 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Tahoma', 'MS Sans Serif', sans-serif"
    }}>
      <style jsx>{`
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
          top: '1rem',
          left: '1rem',
          background: 'linear-gradient(180deg, #ECE9D8 0%, #D6D3CE 100%)',
          border: '1px solid #003C74',
          borderRight: '1px solid #fff',
          borderBottom: '1px solid #fff',
          color: '#000',
          padding: '4px 12px',
          fontSize: '11px',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Tahoma', sans-serif",
          fontWeight: 'bold',
          boxShadow: '1px 1px 0 rgba(0,0,0,0.2)'
        }}
      >
        ← Back to Hub
      </button>

      {/* Computer Monitor Frame */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1200px',
        height: '80vh',
        maxHeight: '700px'
      }}>
        
        {/* Monitor Bezel */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%)',
          borderRadius: '12px 12px 24px 24px',
          padding: '2rem 2rem 3rem',
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
            bottom: '8px',
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
            bottom: '12px',
            right: '24px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00ff00',
            boxShadow: '0 0 8px #00ff00',
            animation: 'float 2s ease-in-out infinite'
          }} />
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