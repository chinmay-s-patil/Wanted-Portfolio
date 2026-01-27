import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WantedPosterLanding() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a', // Black page background
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(26, 26, 26, 0.8) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(26, 26, 26, 0.6) 0%, transparent 50%)
      `,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Crimson+Text:wght@600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-5px) rotate(-0.5deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(10deg); }
          50% { transform: scale(1.03) rotate(10deg); }
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-1%, -1%); }
          20% { transform: translate(1%, -1%); }
          30% { transform: translate(-1%, 1%); }
          40% { transform: translate(1%, 1%); }
          50% { transform: translate(-1%, -1%); }
          60% { transform: translate(1%, -1%); }
          70% { transform: translate(-1%, 1%); }
          80% { transform: translate(-1%, -1%); }
          90% { transform: translate(1%, 1%); }
        }

        .poster-container {
          animation: fadeIn 1s ease-out, float 8s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .poster-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px);
          animation: grain 0.5s steps(10) infinite;
          pointer-events: none;
          z-index: 1;
        }

        .cta-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(196, 165, 116, 0.3);
        }

        .stamp {
          animation: pulse 4s ease-in-out infinite;
          filter: drop-shadow(2px 2px 3px rgba(0,0,0,0.2));
        }

        .pin {
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.4), 
            inset 0 -3px 6px rgba(0,0,0,0.3),
            inset 0 3px 6px rgba(255,255,255,0.3);
        }
      `}</style>

      {/* Wanted Poster */}
      <section 
        className="poster-container"
        aria-labelledby="wanted-title"
        style={{
          width: '100%',
          maxWidth: '950px',
          background: '#f9f7f4', // Aged paper white
          backgroundImage: `
            linear-gradient(rgba(245, 242, 238, 0.9), rgba(245, 242, 238, 0.9)),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")
          `,
          boxShadow: `
            0 25px 60px rgba(0, 0, 0, 0.6),
            0 0 0 8px #e5e1d8,
            0 0 0 12px #8b7355,
            0 0 30px rgba(0, 0, 0, 0.8)
          `,
          borderRadius: '2px',
          transform: 'rotate(-0.7deg)',
          maxHeight: 'calc(100vh - 40px)',
          boxSizing: 'border-box',
          zIndex: 2
        }}
      >
        {/* Push pin */}
        <div className="pin" style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '24px',
          height: '24px',
          background: 'radial-gradient(circle at 30% 30%, #ef4444 0%, #b91c1c 50%, #7f1d1d 100%)',
          borderRadius: '50%',
          border: '4px solid #7f1d1d',
          zIndex: 10
        }} />

        <div style={{
          height: '100%',
          padding: '2.5rem',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Header */}
          <div style={{
            borderBottom: '4px double #525252',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <h1 
              id="wanted-title"
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: '3.2rem',
                fontWeight: '700',
                textAlign: 'center',
                color: '#1a1a1a',
                margin: '0 0 0.25rem 0',
                textShadow: '3px 3px 0px rgba(0,0,0,0.1)',
                letterSpacing: '0.15em',
                lineHeight: '0.9'
              }}
            >
              WANTED
            </h1>
            
            <p style={{
              fontFamily: "'Special Elite', monospace",
              fontSize: '0.8rem',
              textAlign: 'center',
              letterSpacing: '0.25em',
              fontWeight: '600',
              color: '#444',
              margin: 0
            }}>
              FOR ENGINEERING CRIMES
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'flex',
            gap: '2rem',
            height: 'calc(100% - 100px)'
          }}>
            {/* Left Column - Text Content */}
            <div style={{
              flex: '1.3',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Identity Block */}
              <div style={{
                fontFamily: "'Special Elite', monospace",
                fontSize: '0.8rem',
                color: '#1a1a1a',
                marginBottom: '1.25rem',
                background: 'rgba(245, 242, 238, 0.7)',
                padding: '0.75rem',
                border: '1px solid #d6d3d1',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
              }}>
                {[
                  { label: 'NAME:', value: 'CHINMAY S. PATIL' },
                  { label: 'ALIAS:', value: '"CHIN DOES SIMS"' },
                  { label: 'LAST SEEN AT:', value: 'CFD LAB / TERMINAL' },
                  { label: 'SPECIALTY:', value: 'SIMULATION & OPTIMIZATION' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    borderBottom: i < 3 ? '1px solid rgba(61, 61, 61, 0.15)' : 'none',
                    paddingBottom: '0.4rem',
                    marginBottom: i < 3 ? '0.4rem' : '0',
                    alignItems: 'baseline'
                  }}>
                    <span style={{
                      fontWeight: '700',
                      minWidth: '100px',
                      color: '#3730a3',
                      fontSize: '0.75rem'
                    }}>
                      {item.label}
                    </span>
                    <span style={{ 
                      color: '#1a1a1a', 
                      fontWeight: '600',
                      letterSpacing: '0.05em'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                padding: '0.75rem',
                borderLeft: '4px solid #8b7355',
                marginBottom: '1.25rem'
              }}>
                <p style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: '#1a1a1a',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Known for building CFD pipelines, optimization workflows, and visualization tools. 
                  Frequently spotted working with OpenFOAM, Python, and large datasets. Approach with 
                  caution—extremely collaborative and solution-oriented.
                </p>
              </div>

              {/* Capabilities */}
              <div style={{ 
                marginBottom: '1.25rem',
                flex: 1
              }}>
                <h2 style={{
                  fontFamily: "'Special Elite', monospace",
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#3730a3',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.15em',
                  borderBottom: '2px solid #8b7355',
                  paddingBottom: '0.25rem'
                }}>
                  KNOWN CAPABILITIES:
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  fontFamily: "'Crimson Text', serif"
                }}>
                  {['CFD & OpenFOAM', 'Automation', 'Visualization', 'ML Optimization', 'HPC & Clusters', 'Data Analysis'].map((skill, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#1a1a1a',
                      background: 'rgba(255, 255, 255, 0.4)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '2px'
                    }}>
                      <span style={{ 
                        color: '#8b7355', 
                        fontSize: '1.5em',
                        lineHeight: 0 
                      }}>
                        ■
                      </span>
                      <span style={{ fontWeight: '600' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward Section */}
              <div style={{
                borderTop: '3px double #525252',
                borderBottom: '3px double #525252',
                padding: '0.75rem 0',
                marginBottom: '1rem',
                background: 'rgba(245, 242, 238, 0.7)'
              }}>
                <h2 style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: '1.6rem',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  letterSpacing: '0.1em'
                }}>
                  REWARD
                </h2>
                <div style={{
                  fontFamily: "'Special Elite', monospace",
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  color: '#444',
                  lineHeight: '1.5'
                }}>
                  <p style={{ margin: '0.3rem 0', fontWeight: '600' }}>INSIGHTFUL CONVERSATIONS</p>
                  <p style={{ margin: '0.3rem 0', fontWeight: '600' }}>COLLABORATIVE PROJECTS</p>
                  <p style={{ margin: '0.3rem 0', fontWeight: '600' }}>ENGINEERING SOLUTIONS</p>
                </div>
              </div>

              {/* CTA Button */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: 'auto'
              }}>
                <button
                  className="cta-button"
                  onClick={() => navigate('/hub')}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    padding: '0.7rem 1.5rem',
                    background: isHovered 
                      ? 'linear-gradient(135deg, #1a1a1a 0%, #0f172a 100%)'
                      : 'linear-gradient(135deg, #0f172a 0%, #1a1a1a 100%)',
                    color: '#f9f7f4',
                    border: '3px solid #8b7355',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    letterSpacing: '0.15em',
                    boxShadow: isHovered 
                      ? '0 8px 25px rgba(139, 115, 85, 0.4)'
                      : '0 6px 20px rgba(0,0,0,0.3)',
                    outline: 'none',
                    position: 'relative'
                  }}
                >
                  INVESTIGATE CASE →
                </button>
              </div>

              {/* Case ID */}
              <p style={{
                fontFamily: "'Special Elite', monospace",
                fontSize: '0.65rem',
                textAlign: 'center',
                color: '#6b7280',
                marginTop: '0.75rem',
                opacity: 0.8,
                letterSpacing: '0.1em'
              }}>
                Case File ID: CSP-2412
              </p>
            </div>

            {/* Right Column - Portrait and Stamp */}
            <div style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '1rem'
            }}>
              {/* Portrait Section */}
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  position: 'relative',
                  border: '6px solid #404040',
                  padding: '8px',
                  background: '#e5e1d8',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                  transform: 'rotate(1deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  <div style={{
                    width: '280px',
                    height: '310px',
                    background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img 
                      src="/portrait.jpg" 
                      alt="Chinmay S. Patil" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'sepia(0.2) contrast(1.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="color: #404040; font-family: \'Special Elite\', monospace; font-size: 0.75rem; text-align: center; padding: 1rem;">PHOTO<br/>UNAVAILABLE<br/><small style=\\"font-size: 0.6rem;\\">Last seen in lab coat</small></div>';
                      }}
                    />
                  </div>
                  {/* Tape effects */}
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '15%',
                    width: '50px',
                    height: '20px',
                    background: 'rgba(250, 250, 250, 0.8)',
                    transform: 'rotate(-20deg)',
                    border: '1px solid rgba(163, 163, 163, 0.4)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    borderRadius: '1px'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '15%',
                    width: '50px',
                    height: '20px',
                    background: 'rgba(250, 250, 250, 0.8)',
                    transform: 'rotate(20deg)',
                    border: '1px solid rgba(163, 163, 163, 0.4)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                    borderRadius: '1px'
                  }} />
                </div>
              </div>

              {/* Stamp */}
              <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <div 
                  className="stamp"
                  style={{
                    border: '5px solid #dc2626',
                    color: '#dc2626',
                    padding: '0.6rem 1.2rem',
                    transform: 'rotate(12deg)',
                    fontFamily: "'Special Elite', monospace",
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    letterSpacing: '0.2em',
                    background: 'rgba(220, 38, 38, 0.08)',
                    textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ lineHeight: 1.2 }}>
                    ACTIVE<br/>CASE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional background texture */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(26, 26, 26, 0.4) 0%, transparent 40%),
          radial-gradient(circle at 90% 80%, rgba(26, 26, 26, 0.3) 0%, transparent 40%)
        `,
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </div>
  );
}