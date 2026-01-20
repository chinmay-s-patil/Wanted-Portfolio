import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WantedPosterLanding() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0806 0%, #1a1410 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Crimson+Text:wght@600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1.5deg); }
          50% { transform: translateY(-10px) rotate(-1.5deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .poster-container {
          animation: fadeIn 0.8s ease-out, float 6s ease-in-out infinite;
        }

        .cta-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(196, 165, 116, 0.4);
        }

        .stamp {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Atmospheric background elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 30% 50%, rgba(196, 165, 116, 0.05), transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Wanted Poster */}
      <section 
        className="poster-container"
        aria-labelledby="wanted-title"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 0 8px #3d2817',
          borderRadius: '4px',
          height: 'clamp(600px, 90vh, 900px)',
          transform: 'rotate(-1.5deg)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`
        }}
      >
        {/* Push pins */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '20px',
          background: 'radial-gradient(circle, #dc2626 0%, #991b1b 100%)',
          borderRadius: '50%',
          boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 -2px 4px rgba(0,0,0,0.3)',
          border: '3px solid #7f1d1d',
          zIndex: 10
        }} />

        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(1.5rem, 4vh, 3rem) clamp(1.5rem, 4vw, 3rem)'
        }}>
          {/* Header */}
          <h1 
            id="wanted-title"
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: 'clamp(3rem, 10vh, 6rem)',
              fontWeight: '700',
              textAlign: 'center',
              color: '#1a1410',
              marginBottom: '0.5rem',
              textShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            WANTED
          </h1>
          
          <p style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: 'clamp(0.65rem, 1.5vh, 1rem)',
            textAlign: 'center',
            letterSpacing: '0.2em',
            fontWeight: '600',
            color: '#5d4a2a',
            marginBottom: 'clamp(1rem, 2.5vh, 2rem)'
          }}>
            FOR ENGINEERING CRIMES
          </p>

          {/* Portrait Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'clamp(1rem, 2.5vh, 2rem)'
          }}>
            <div style={{
              position: 'relative',
              border: '6px solid #3d2817',
              padding: '8px',
              background: '#e8dcc8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                width: 'clamp(140px, 18vw, 220px)',
                height: 'clamp(170px, 22vh, 270px)',
                background: 'linear-gradient(135deg, #8b7355 0%, #5d4a2a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <img 
                  src="/portrait.jpg" 
                  alt="Chinmay S. Patil" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="color: #f6efe2; font-family: \'Special Elite\', monospace; font-size: 0.8rem;">PHOTO<br/>UNAVAILABLE</div>';
                  }}
                />
              </div>
              {/* Tape effects */}
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '20%',
                width: '50px',
                height: '20px',
                background: 'rgba(246, 239, 226, 0.7)',
                transform: 'rotate(-15deg)',
                border: '1px solid rgba(139, 115, 85, 0.3)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '20%',
                width: '50px',
                height: '20px',
                background: 'rgba(246, 239, 226, 0.7)',
                transform: 'rotate(15deg)',
                border: '1px solid rgba(139, 115, 85, 0.3)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
            </div>
          </div>

          {/* Identity Block */}
          <div style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: 'clamp(0.65rem, 1.5vh, 0.95rem)',
            color: '#1a1410',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(0.4rem, 1vh, 0.75rem)'
          }}>
            {[
              { label: 'NAME:', value: 'CHINMAY S. PATIL' },
              { label: 'ALIAS:', value: '"CHIN DOES SIMS"' },
              { label: 'LAST SEEN:', value: 'CFD LAB / TERMINAL' },
              { label: 'SPECIALTY:', value: 'SIMULATION & OPTIMIZATION' }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                borderBottom: '2px solid rgba(61, 40, 23, 0.2)',
                paddingBottom: '0.4rem'
              }}>
                <span style={{
                  fontWeight: '700',
                  minWidth: 'clamp(90px, 12vw, 140px)',
                  color: '#3d2817'
                }}>
                  {item.label}
                </span>
                <span style={{ color: '#5d4a2a' }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: 'clamp(0.75rem, 1.6vh, 1.05rem)',
            lineHeight: '1.6',
            color: '#2a2a2a',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Known for building CFD pipelines, optimization workflows, and visualization tools. 
            Frequently spotted working with OpenFOAM, Python, and large datasets.
          </p>

          {/* Capabilities */}
          <div style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
            <h2 style={{
              fontFamily: "'Special Elite', monospace",
              fontSize: 'clamp(0.8rem, 1.8vh, 1.1rem)',
              fontWeight: '700',
              color: '#3d2817',
              marginBottom: 'clamp(0.5rem, 1vh, 0.75rem)',
              letterSpacing: '0.1em'
            }}>
              KNOWN CAPABILITIES:
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(0.4rem, 1vh, 0.75rem)',
              fontSize: 'clamp(0.65rem, 1.4vh, 0.85rem)',
              fontFamily: "'Crimson Text', serif"
            }}>
              {['CFD & OpenFOAM', 'Automation', 'Visualization', 'ML Optimization'].map((skill, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#2a2a2a'
                }}>
                  <span style={{ color: '#8b7355', fontSize: '1.2em' }}>•</span>
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Stamp */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            <div 
              className="stamp"
              style={{
                border: '5px solid #dc2626',
                color: '#dc2626',
                padding: 'clamp(0.4rem, 1vh, 0.75rem) clamp(1rem, 2.5vw, 2rem)',
                transform: 'rotate(12deg)',
                fontFamily: "'Crimson Text', serif",
                fontSize: 'clamp(0.9rem, 2vh, 1.4rem)',
                fontWeight: '700',
                letterSpacing: '0.15em',
                background: 'rgba(220, 38, 38, 0.05)'
              }}
            >
              ACTIVE CASE
            </div>
          </div>

          {/* Reward Section */}
          <div style={{
            borderTop: '3px solid #3d2817',
            paddingTop: 'clamp(1rem, 2vh, 1.5rem)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h2 style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: 'clamp(1.5rem, 3.5vh, 2.5rem)',
              fontWeight: '700',
              textAlign: 'center',
              color: '#1a1410',
              marginBottom: 'clamp(0.5rem, 1vh, 1rem)'
            }}>
              REWARD
            </h2>
            <div style={{
              fontFamily: "'Special Elite', monospace",
              fontSize: 'clamp(0.65rem, 1.4vh, 0.95rem)',
              textAlign: 'center',
              color: '#5d4a2a',
              marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
              lineHeight: '1.6'
            }}>
              <p style={{ margin: '0.3rem 0' }}>INSIGHTFUL CONVERSATIONS</p>
              <p style={{ margin: '0.3rem 0' }}>COLLABORATIONS</p>
              <p style={{ margin: '0.3rem 0' }}>ENGINEERING WORK</p>
            </div>
          </div>

          {/* CTA Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="cta-button"
              onClick={() => navigate('/hub')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                fontFamily: "'Special Elite', monospace",
                fontSize: 'clamp(0.9rem, 2vh, 1.3rem)',
                fontWeight: '700',
                padding: 'clamp(0.75rem, 1.5vh, 1.25rem) clamp(1.5rem, 3vw, 2.5rem)',
                background: isHovered 
                  ? 'linear-gradient(135deg, #1a1410 0%, #0a0806 100%)'
                  : '#1a1410',
                color: '#f6efe2',
                border: '4px solid #8b7355',
                borderRadius: '4px',
                cursor: 'pointer',
                letterSpacing: '0.1em',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                outline: 'none'
              }}
            >
              INVESTIGATE CASE →
            </button>
          </div>

          {/* Case ID */}
          <p style={{
            fontFamily: "'Special Elite', monospace",
            fontSize: 'clamp(0.5rem, 1.2vh, 0.7rem)',
            textAlign: 'center',
            color: '#8b7355',
            marginTop: 'clamp(0.5rem, 1vh, 1rem)',
            opacity: 0.7
          }}>
            Case File ID: CSP-2412
          </p>
        </div>
      </section>
    </div>
  );
}