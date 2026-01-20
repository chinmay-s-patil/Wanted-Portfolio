'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import diaryEntries from './diaryList.jsx';

export default function ProfessionalDiary() {
  const navigate = useNavigate();
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const currentEntry = diaryEntries[currentEntryIndex];
  const isLocked = currentEntry?.locked;

  const yearTabs = diaryEntries.map((entry, index) => {
    const year = entry.dates.start.split('-')[0];
    const shortYear = `'${year.slice(-2)}`;
    return {
      index,
      shortYear,
      fullRange: `${entry.dates.start.replace('-', ' ')} — ${entry.dates.end.replace('-', ' ')}`,
      year
    };
  });

  useEffect(() => {
    if (!currentEntry?.photos || currentEntry.photos.length === 0) return;
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % currentEntry.photos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentEntry?.photos]);

  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [currentEntryIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft' && currentEntryIndex > 0) {
        setCurrentEntryIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentEntryIndex < diaryEntries.length - 1) {
        setCurrentEntryIndex(prev => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentEntryIndex]);

  // LOCK BODY SCROLLING - FORCE NO SCROLL
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a0f08 0%, #0d0906 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden' // Prevent any scrolling on container
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
        
        /* Force no scroll on html and body */
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
        }
      `}</style>

      {/* Back Button - NOW USING NAVIGATE FOR VITE */}
      <button 
        onClick={() => navigate('/hub')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 20,
          background: 'linear-gradient(135deg, #3d2817 0%, #2a1a10 100%)',
          color: '#f4e8d0',
          border: '1px solid #4a3020',
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: "'Special Elite', monospace",
          fontSize: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        }}
      >
        ← Back
      </button>

      {/* Diary Book */}
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        height: '85vh',
        maxHeight: '800px',
        position: 'relative',
        filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.7))',
        zIndex: 1
      }}>
        
        {/* Leather cover */}
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          right: '-12px',
          bottom: '-12px',
          background: 'linear-gradient(135deg, #3d2817 0%, #2a1a10 30%, #1e120a 100%)',
          borderRadius: '8px 24px 24px 8px',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8), 0 15px 40px rgba(0, 0, 0, 0.6)',
          zIndex: -1,
          border: '1px solid #4a3020'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
            borderRadius: '8px 24px 24px 8px',
            opacity: 0.4
          }} />
        </div>

        {/* Pages container */}
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, #f4e8d0 0%, #f9f3e9 49.5%, #f4e8d0 50%, #f9f3e9 100%)',
          borderRadius: '0 8px 8px 0',
          border: '1px solid #d4c4a8',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr',
          position: 'relative',
          overflow: 'hidden', // Prevent any overflow scrolling
          boxShadow: 'inset 0 0 20px rgba(139, 69, 19, 0.1)'
        }}>
          
          {/* Page texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paperNoise)' opacity='0.15'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Center binding */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '-10px',
            bottom: '-10px',
            width: '24px',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(to right, #e8d9bc 0%, #d4c4a8 20%, #b8a58c 50%, #d4c4a8 80%, #e8d9bc 100%)',
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            zIndex: 2
          }}>
            {[20, 35, 50, 65, 80].map((top) => (
              <div key={top} style={{
                position: 'absolute',
                top: `${top}%`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '3px',
                background: 'linear-gradient(to right, #8b7355, #6b5d4d, #8b7355)',
                borderRadius: '2px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }} />
            ))}
          </div>

          {/* Left Page - Metadata + Field Notes */}
          <div style={{
            padding: '2rem',
            fontFamily: "'Special Elite', monospace",
            position: 'relative',
            background: 'linear-gradient(to bottom, #f9f3e9 0%, #f4e8d0 100%)',
            borderRight: '1px solid rgba(139, 69, 19, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '8px',
              background: 'linear-gradient(to left, rgba(0,0,0,0.05), transparent)',
              pointerEvents: 'none'
            }} />
            
            {isLocked ? (
              <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                opacity: 0.7
              }}>
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '2rem',
                  opacity: 0.2,
                  filter: 'sepia(1)'
                }}>
                  🔒
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#5d4a2a',
                  marginBottom: '1rem',
                  fontFamily: "'Crimson Text', serif",
                  letterSpacing: '0.05em'
                }}>
                  THIS CHAPTER IS<br />YET TO BE WRITTEN.
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#8b7355',
                  fontStyle: 'italic',
                  fontFamily: "'Courier Prime', monospace"
                }}>
                  (Ideas brewing...)
                </div>
              </div>
            ) : (
              <>
                {/* Metadata Section */}
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#3d2817',
                  marginBottom: '1rem',
                  fontFamily: "'Crimson Text', serif",
                  letterSpacing: '0.02em',
                  borderBottom: '2px solid #d4c4a8',
                  paddingBottom: '0.5rem'
                }}>
                  {currentEntry.organization}
                </div>

                <div style={{
                  fontSize: '1.4rem',
                  color: '#5d4a2a',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  fontFamily: "'Crimson Text', serif"
                }}>
                  {currentEntry.role}
                </div>

                <div style={{
                  fontSize: '1rem',
                  color: '#7a6a55',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ opacity: 0.7 }}>📍</span>
                  {currentEntry.location}
                </div>

                <div style={{
                  fontSize: '1rem',
                  color: '#7a6a55',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ opacity: 0.7 }}>📅</span>
                  {currentEntry.dates.start} — {currentEntry.dates.end}
                </div>

                {currentEntry.tools.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#8b7355',
                      marginBottom: '0.75rem',
                      fontWeight: '600',
                      fontFamily: "'Courier Prime', monospace"
                    }}>
                      Tools Used
                    </div>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '2.5rem'
                    }}>
                      {currentEntry.tools.map((tool, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '0.4rem 0.8rem',
                            background: '#3d2817',
                            color: '#f4e8d0',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontFamily: "'Courier Prime', monospace",
                            border: '1px solid #2a1a10',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Notes Section - NOW BELOW metadata */}
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: '#3d2817',
                  marginBottom: '1.5rem',
                  textAlign: 'center',
                  fontFamily: "'Special Elite', monospace",
                  letterSpacing: '0.1em',
                  borderBottom: '1px dashed #c9b8a0',
                  paddingBottom: '1rem',
                  position: 'relative'
                }}>
                  Field Notes
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '1px',
                    background: '#c9b8a0'
                  }} />
                </div>

                <div style={{
                  marginBottom: '1rem'
                }}>
                  {currentEntry.notes.map((note, i) => (
                    <div
                      key={i}
                      style={{
                        marginBottom: '1.25rem',
                        fontSize: '1rem',
                        lineHeight: '1.8',
                        color: '#2a2a2a',
                        paddingLeft: '1.5rem',
                        position: 'relative',
                        borderLeft: '2px solid transparent',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Crimson Text', serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderLeftColor = '#c9b8a0';
                        e.currentTarget.style.paddingLeft = '1.75rem';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderLeftColor = 'transparent';
                        e.currentTarget.style.paddingLeft = '1.5rem';
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        left: '0.5rem',
                        color: '#8b7355',
                        fontWeight: 'bold'
                      }}>—</span>
                      {note}
                    </div>
                  ))}
                </div>
              </>
            )}  
          </div>

          {/* Center line */}
          <div style={{ 
            background: 'linear-gradient(to bottom, #d4c4a8, #b8a58c, #d4c4a8)',
            position: 'relative',
            zIndex: 3
          }} />

          {/* Right Page - ONLY Project Gallery */}
          <div style={{
            padding: '2rem',
            fontFamily: "'Special Elite', monospace",
            position: 'relative',
            background: 'linear-gradient(to bottom, #f9f3e9 0%, #f4e8d0 100%)',
            borderLeft: '1px solid rgba(139, 69, 19, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '8px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.05), transparent)',
              pointerEvents: 'none'
            }} />
            
            {!isLocked && currentEntry.photos && currentEntry.photos.length > 0 && (
              <>
                <div style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#8b7355',
                  marginBottom: '0.75rem',
                  fontWeight: '600',
                  fontFamily: "'Courier Prime', monospace"
                }}>
                  Project Gallery
                </div>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid #c9b8a0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {currentEntry.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`${currentEntry.organization} photo ${i + 1}`}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: i === currentPhotoIndex ? 1 : 0,
                        transition: 'opacity 1s ease-in-out'
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right-side Year Tabs - FLUSH AGAINST RIGHT EDGE */}
      <div style={{
        position: 'absolute',
        right: 'calc((100vw - min(95vw, 1400px)) / 2)',
        top: '50%',
        transform: 'translateY(-50%) translateX(100%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {yearTabs.map((tab) => {
          const isActive = currentEntryIndex === tab.index;
          const isHovered = hoveredTab === tab.index;
          const shouldExpand = isHovered || isActive;
          
          return (
            <button
              key={tab.index}
              onClick={() => setCurrentEntryIndex(tab.index)}
              onMouseEnter={() => setHoveredTab(tab.index)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                position: 'relative',
                width: shouldExpand ? '240px' : '50px',
                height: shouldExpand ? '70px' : '50px',
                background: isActive 
                  ? 'linear-gradient(135deg, #3d2817 0%, #2a1a10 100%)' 
                  : 'linear-gradient(135deg, #2a1a10 0%, #1e120a 100%)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isActive
                  ? '0 6px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)'
                  : '0 4px 12px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: shouldExpand ? '1rem' : '0',
                color: '#f4e8d0',
                fontFamily: "'Special Elite', monospace",
                fontWeight: isActive ? 'bold' : 'normal',
                overflow: 'hidden',
                border: `2px solid ${isActive ? "#8b7355" : "#4a3020"}`
              }}
            >
              {shouldExpand ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    fontWeight: 'bold'
                  }}>
                    {tab.fullRange}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#c9b8a0',
                    fontFamily: "'Courier Prime', monospace",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                    padding: '0 0.5rem'
                  }}>
                    {diaryEntries[tab.index].organization}
                  </div>
                </div>
              ) : (
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: isActive ? '#c4a574' : '#f4e8d0'
                }}>
                  {tab.shortYear}
                </div>
              )}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: '-3px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '5px',
                  height: '70%',
                  background: '#c4a574',
                  borderRadius: '0 3px 3px 0',
                  boxShadow: '0 0 10px rgba(196, 165, 116, 0.5)'
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}