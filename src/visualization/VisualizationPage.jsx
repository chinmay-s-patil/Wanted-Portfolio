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
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Special Elite', monospace"
    }}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes powerOn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px #00ff00; }
          50% { box-shadow: 0 0 20px #00ff00; }
        }
        
        .monitor-container {
          animation: powerOn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .viz-tile {
          transition: all 0.3s ease;
        }
        
        .viz-tile:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,255,0,0.3);
        }
      `}</style>

      {/* Back Button */}
      <button
        onClick={() => navigate('/hub')}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(40, 40, 40, 0.9)',
          border: '2px solid #00ff00',
          color: '#00ff00',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: "'Special Elite', monospace",
          boxShadow: '0 4px 12px rgba(0,255,0,0.3)'
        }}
      >
        ← BACK TO HQ
      </button>

      {/* Monitor Container */}
      <div className="monitor-container" style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        
        {/* Monitor Frame */}
        <div style={{
          width: '95%',
          maxWidth: '1400px',
          height: '85vh',
          background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
          border: '8px solid #333',
          position: 'relative'
        }}>
          
          {/* Power LED */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '2rem',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#00ff00',
            animation: 'glow 2s infinite',
            boxShadow: '0 0 10px #00ff00'
          }} />

          {/* Brand Label */}
          <div style={{
            position: 'absolute',
            bottom: '1.2rem',
            left: '2rem',
            fontSize: '1.2rem',
            fontWeight: '700',
            color: '#666',
            letterSpacing: '0.3em'
          }}>
            VIZ-TRON
          </div>

          {/* Screen */}
          <div style={{
            width: '100%',
            height: '100%',
            background: '#000',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.8)'
          }}>
            
            {/* Scanlines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 2px, transparent 4px)',
              pointerEvents: 'none',
              zIndex: 10
            }} />

            {/* CRT Curvature */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
              pointerEvents: 'none',
              zIndex: 9
            }} />

            {/* Content Area */}
            <div style={{
              width: '100%',
              height: '100%',
              padding: '2rem',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1
            }}>
              
              {/* Header */}
              <div style={{
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <h1 style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: '#00ff00',
                  textShadow: '0 0 10px #00ff00',
                  marginBottom: '0.5rem'
                }}>
                  VISUALIZATION PROGRAMS
                </h1>
                <p style={{
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                  color: '#0f0',
                  opacity: 0.7,
                  letterSpacing: '0.15em'
                }}>
                  SELECT A PROGRAM TO EXECUTE
                </p>
              </div>

              {/* Program Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem',
                padding: '1rem'
              }}>
                {visualizationsList.map((viz) => (
                  <div
                    key={viz.id}
                    className="viz-tile"
                    onClick={() => handleVizClick(viz)}
                    style={{
                      background: 'rgba(0, 255, 0, 0.05)',
                      border: `2px solid ${viz.color}40`,
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* WIP Badge */}
                    {viz.isWIP && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                        color: '#000',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        letterSpacing: '0.1em'
                      }}>
                        WIP
                      </div>
                    )}

                    {/* Icon */}
                    <div style={{
                      fontSize: '3rem',
                      marginBottom: '1rem',
                      textAlign: 'center',
                      filter: 'drop-shadow(0 4px 12px rgba(0,255,0,0.3))'
                    }}>
                      {viz.icon}
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      color: viz.color,
                      marginBottom: '0.75rem',
                      textAlign: 'center'
                    }}>
                      {viz.title}
                    </h3>

                    {/* Category */}
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#0f0',
                      textAlign: 'center',
                      marginBottom: '1rem',
                      opacity: 0.7,
                      letterSpacing: '0.1em'
                    }}>
                      {viz.category}
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'rgba(0, 255, 0, 0.8)',
                      lineHeight: '1.5',
                      marginBottom: '1rem'
                    }}>
                      {viz.description}
                    </p>

                    {/* Tech Stack */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginTop: 'auto'
                    }}>
                      {viz.tech.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '4px 10px',
                            background: 'rgba(0, 255, 0, 0.1)',
                            border: '1px solid rgba(0, 255, 0, 0.3)',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            color: '#0f0'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Execute Button */}
                    <div style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem',
                      background: `${viz.color}20`,
                      border: `2px solid ${viz.color}`,
                      borderRadius: '8px',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      color: viz.color,
                      letterSpacing: '0.1em'
                    }}>
                      ▶ EXECUTE PROGRAM
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Viz Window - Lazy Loaded */}
      {selectedViz && (
        <Suspense fallback={
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00ff00',
            fontSize: '1.5rem',
            zIndex: 100
          }}>
            LOADING PROGRAM...
          </div>
        }>
          <VizWindow viz={selectedViz} onClose={handleClose} />
        </Suspense>
      )}
    </div>
  )
}