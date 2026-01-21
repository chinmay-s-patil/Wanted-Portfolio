// src/education/components/RightDoor.jsx
export default function RightDoor({ locker }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      borderLeft: '4px solid #3d2817',
      padding: '2rem',
      position: 'relative',
      overflow: 'auto'
    }}>
      {/* Decorative magnetic strip */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        right: '1rem',
        height: '8px',
        background: 'linear-gradient(90deg, #666 0%, #888 50%, #666 100%)',
        borderRadius: '2px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
      }} />

      {/* Title */}
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#00ff00',
        fontFamily: "'Special Elite', monospace",
        textShadow: '0 0 10px rgba(0,255,0,0.5)',
        letterSpacing: '0.1em'
      }}>
        RESEARCH & DOCUMENTS
      </div>

      {locker.id === 'masters' ? (
        // Masters - No thesis yet
        <div style={{
          height: 'calc(100% - 6rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            fontSize: '4rem',
            opacity: 0.3
          }}>
            📝
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#888',
            fontFamily: "'Special Elite', monospace",
            lineHeight: '1.6'
          }}>
            THESIS IN PROGRESS
          </div>
          <div style={{
            fontSize: '0.95rem',
            color: '#666',
            fontStyle: 'italic',
            maxWidth: '300px',
            lineHeight: '1.6'
          }}>
            Research work currently underway.
            Documents will be posted here upon completion.
          </div>
        </div>
      ) : (
        // Bachelors - Thesis available
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Thesis card */}
          <div style={{
            background: 'rgba(0,255,0,0.1)',
            border: '2px solid rgba(0,255,0,0.3)',
            borderRadius: '8px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0,255,0,0.15)'
            e.currentTarget.style.borderColor = '#00ff00'
            e.currentTarget.style.transform = 'translateY(-4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,255,0,0.1)'
            e.currentTarget.style.borderColor = 'rgba(0,255,0,0.3)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <div style={{
                fontSize: '2.5rem',
                opacity: 0.7
              }}>
                📄
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#00ff00',
                  marginBottom: '0.5rem',
                  fontFamily: "'Special Elite', monospace"
                }}>
                  B.Tech Thesis
                </div>
                <div style={{
                  fontSize: '1rem',
                  color: '#fff',
                  marginBottom: '0.75rem',
                  lineHeight: '1.5'
                }}>
                  Optimization of Pyrolysis-Based Plastic Oil Yield
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#888',
                  marginBottom: '1rem'
                }}>
                  Final Year Project • 2024-2025
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: '#00ff00',
                  fontWeight: '600'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  DOWNLOAD PDF
                </div>
              </div>
            </div>
          </div>

          {/* Additional documents placeholder */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.9rem',
            color: '#666',
            textAlign: 'center',
            fontStyle: 'italic'
          }}>
            Additional coursework and certificates available upon request
          </div>
        </div>
      )}
    </div>
  )
}