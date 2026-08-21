import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [hubHovered, setHubHovered] = useState(false);
  const [openfoamHovered, setOpenfoamHovered] = useState(false);
  const [educationHovered, setEducationHovered] = useState(false);
  const [careerHovered, setCareerHovered] = useState(false);
  const [projectsHovered, setProjectsHovered] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  const [showClickableZones, setShowClickableZones] = useState(false);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      margin: 0,
      padding: '40px 20px',
      boxSizing: 'border-box',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none'
    }}>
      {/* ===== CLICKABLE ZONES TOGGLE (fixed to viewport) ===== */}
      <button
        className="clickable-zones-btn"
        onClick={() => setShowClickableZones(prev => !prev)}
        style={{
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 9999,
          fontFamily: 'Libre Baskerville, serif',
          fontSize: '0.65rem',
          padding: '0.4rem 0.75rem',
          background: showClickableZones ? '#8b0000' : 'rgba(26, 26, 26, 0.85)',
          color: '#f5f0e8',
          border: showClickableZones ? '1.5px solid #8b0000' : '1.5px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          outline: 'none',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)'
        }}
      >
        <span style={{ fontSize: '0.7rem' }}>{showClickableZones ? '◉' : '○'}</span>
        Clickable Zones
      </button>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IM+Fell+English:ital@0;1&family=UnifrakturMaguntia&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-0.3deg); }
          50% { transform: translateY(-4px) rotate(-0.3deg); }
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

        .newspaper-container,
        .newspaper-container * {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }

        .newspaper-container {
          animation: fadeIn 1.2s ease-out, float 10s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .newspaper-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.02) 2px, rgba(0, 0, 0, 0.02) 4px);
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
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
          transition: left 0.5s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .article-link {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .article-link:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        .divider-vertical {
          border-left: 1px solid #b8b0a8;
        }

        .headline-hover {
          transition: color 0.2s ease;
        }

        .headline-hover.clickable {
          cursor: pointer;
        }

        .headline-hover.clickable:hover {
          color: #8b0000;
        }

        @keyframes clickableGlow {
          0%, 100% { box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.4); }
          50% { box-shadow: 0 0 8px 3px rgba(139, 0, 0, 0.6); }
        }

        .clickable-zone-highlight {
          animation: clickableGlow 1.5s ease-in-out infinite !important;
          outline: 2px dashed #8b0000 !important;
          outline-offset: 3px;
          position: relative;
        }

        .clickable-zone-highlight::after {
          content: 'CLICKABLE';
          position: absolute;
          top: -10px;
          right: -4px;
          background: #8b0000;
          color: #f5f0e8;
          font-family: 'Libre Baskerville', serif;
          font-size: 0.5rem;
          padding: 1px 5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 1px;
          z-index: 10;
          pointer-events: none;
        }

        .clickable-zones-btn {
          transition: all 0.3s ease;
        }

        .clickable-zones-btn:hover {
          background: #1a1a1a !important;
          color: #f5f0e8 !important;
        }
      `}</style>

      <section className="newspaper-container" style={{
        width: '100%',
        maxWidth: '1100px',
        background: '#f5f0e8',
        backgroundImage: `
          linear-gradient(rgba(245, 240, 232, 0.95), rgba(245, 240, 232, 0.95)),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")
        `,
        boxShadow: `
          0 30px 80px rgba(0, 0, 0, 0.7),
          0 0 0 1px #d4cfc7,
          0 0 0 3px #8b8378,
          0 0 40px rgba(0, 0, 0, 0.5)
        `,
        borderRadius: '1px',
        transform: 'rotate(-0.4deg)',
        boxSizing: 'border-box',
        zIndex: 2
      }}>
        <div style={{
          padding: '2rem 2.5rem',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 2
        }}>

          {/* ===== MASTHEAD ===== */}
          <div style={{
            textAlign: 'center',
            borderBottom: '3px double #1a1a1a',
            paddingBottom: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: 'Libre Baskerville, serif',
              fontSize: '0.65rem',
              color: '#444',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem'
            }}>
              <span>Vol. CXXIV &mdash; No. 42</span>
              <span style={{ fontStyle: 'italic' }}>Established 1897</span>
              <span>Price: Free</span>
            </div>
            <h1 style={{
              fontFamily: 'UnifrakturMaguntia, serif',
              fontSize: '4.5rem',
              fontWeight: '400',
              color: '#1a1a1a',
              margin: '0.25rem 0',
              lineHeight: '0.9',
              letterSpacing: '0.02em'
            }}>
              The Daily Engineer
            </h1>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ height: '1px', background: '#1a1a1a', flex: 1, maxWidth: '120px' }} />
              <p style={{
                fontFamily: 'Libre Baskerville, serif',
                fontSize: '0.7rem',
                color: '#444',
                margin: 0,
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}>
                All the News That&apos;s Fit to Simulate
              </p>
              <div style={{ height: '1px', background: '#1a1a1a', flex: 1, maxWidth: '120px' }} />
            </div>
          </div>

          {/* ===== DATE BAR ===== */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1a1a1a',
            padding: '0.4rem 0',
            marginBottom: '1.5rem',
            fontFamily: 'Libre Baskerville, serif',
            fontSize: '0.7rem',
            color: '#444',
            letterSpacing: '0.05em'
          }}>
            <span>Thursday, August 20, 2026</span>
            <span style={{ fontStyle: 'italic' }}>Late Edition</span>
            <span>Munich &middot; Clear Skies</span>
          </div>

          {/* ===== MAIN HEADLINE ===== */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #1a1a1a',
            paddingBottom: '1rem'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.4rem',
              fontWeight: '900',
              color: '#1a1a1a',
              margin: '0 0 0.5rem 0',
              lineHeight: '1.05',
              textTransform: 'uppercase',
              letterSpacing: '0.02em'
            }} className="headline-hover">
              LOCAL ENGINEER SOUGHT AFTER FOR <br />
              &apos;CRIMES AGAINST INEFFICIENCY&apos;
            </h2>
            <p style={{
              fontFamily: 'Libre Baskerville, serif',
              fontSize: '0.85rem',
              color: '#555',
              margin: 0,
              fontStyle: 'italic',
              letterSpacing: '0.03em'
            }}>
              Aerospace graduate known for OpenFOAM solvers, drone aerodynamics, and leaving no mesh unrefined
            </p>
          </div>

          {/* ===== PANORAMIC PHOTOGRAPH ===== */}
          <div style={{
            width: '100%',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              border: '4px solid #1a1a1a',
              padding: '6px',
              background: '#e8e3db',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
              display: 'inline-block',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '100%',
                height: '0',
                paddingBottom: '37.5%',
                background: 'linear-gradient(135deg, #b8b0a8 0%, #8b8378 100%)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img
                  src="/Me2-3x8.jpg"
                  alt="Chinmay S. Patil — Panoramic"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: '50% 30%',
                    filter: 'sepia(0.3) contrast(1.15) grayscale(0.2)',
                    pointerEvents: 'none'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="color:#404040;font-family:Libre Baskerville,serif;font-size:0.75rem;text-align:center;padding:2rem;user-select:none;">PHOTOGRAPH UNAVAILABLE</div>';
                  }}
                />
              </div>
              <p style={{
                fontFamily: 'Libre Baskerville, serif',
                fontSize: '0.65rem',
                color: '#555',
                margin: '0.4rem 0 0 0',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Fig. 1 &mdash; Suspect at large, last photographed in Gothenburg
              </p>
            </div>
          </div>

          {/* ===== THREE COLUMN LAYOUT ===== */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {/* ===== LEFT COLUMN ===== */}
            <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Profile Article */}
              <article>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.2',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover">
                  Profile: Chinmay S. Patil
                </h3>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.8rem',
                  lineHeight: '1.7',
                  color: '#333',
                  margin: '0 0 0.75rem 0',
                  textAlign: 'justify'
                }}>
                  <span style={{
                    float: 'left',
                    fontSize: '3rem',
                    lineHeight: '0.8',
                    paddingRight: '0.5rem',
                    paddingTop: '0.1rem',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '900',
                    color: '#1a1a1a'
                  }}>C</span>
                  hinmay S. Patil was last seen pursuing a Masters in Aerospace Engineering at the Technical University of Munich. Prior to that, he earned a Bachelor of Mechanical Engineering with Minors in AI/ML from VIT Chennai (CGPA 8.83), where he built a reputation for turning CFD cases into publishable results.
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.8rem',
                  lineHeight: '1.7',
                  color: '#333',
                  margin: '0 0 0.75rem 0',
                  textAlign: 'justify'
                }}>
                  Authorities say he is armed with OpenFOAM, Ansys, Python, and SolidWorks. Recent sightings place him designing drones at Raphe mPhibr and running high-fidelity rotor-wake simulations at the NMCAD Lab, IISc Bangalore. Approach with curiosity&mdash;he is known to recruit bystanders into solver-development projects.
                </p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.7rem',
                  color: '#666',
                  fontStyle: 'italic',
                  borderTop: '1px solid #ccc',
                  paddingTop: '0.5rem'
                }}>
                  <span>By Staff Reporter</span>
                  <span>&middot;</span>
                  <span>Aerospace Bureau</span>
                </div>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.5rem 0' }} />

              {/* Skills Section */}
              <article>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover">
                  Known Areas of Expertise
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.4rem',
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.78rem',
                  color: '#333'
                }}>
                  {[
                    'OpenFOAM & CFD',
                    'Ansys & STAR-CCM+',
                    'SolidWorks & FreeCAD',
                    'Python & APDL',
                    'Aeroacoustics (FW-H)',
                    'ML for Engineering'
                  ].map((skill, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.4rem',
                      borderRadius: '1px'
                    }}>
                      <span style={{ color: '#8b0000', fontSize: '0.6rem' }}>&#9632;</span>
                      <span style={{ fontWeight: '600' }}>{skill}</span>
                    </div>
                  ))}
                </div>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.5rem 0' }} />

              {/* Experience Brief */}
              <article
                className={`article-link${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate('/professionaldiary')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/professionaldiary');
                  }
                }}
                onMouseEnter={() => setCareerHovered(true)}
                onMouseLeave={() => setCareerHovered(false)}
                style={{
                  padding: '0.5rem',
                  margin: '-0.5rem',
                  borderRadius: '1px',
                  outline: careerHovered ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: careerHovered ? '#8b0000' : '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover clickable">
                  Career Dispatches
                </h3>
                <div style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#333',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 0.4rem 0', textAlign: 'justify' }}>
                    <strong>Raphe mPhibr</strong> &mdash; Mechanical Research Engineer designing and manufacturing drones with DFAM constraints.
                  </p>
                  <p style={{ margin: '0 0 0.4rem 0', textAlign: 'justify' }}>
                    <strong>NMCAD Lab, IISc</strong> &mdash; Rotor-wake CFD in OpenFOAM; LES aeroacoustics in Fluent with FW-H.
                  </p>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    <strong>CSIR SERC</strong> &mdash; Wind-engineering CFD assessing drone propeller efficiency in OpenFOAM.
                  </p>
                </div>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#8b0000',
                  margin: '0.4rem 0 0 0',
                  fontStyle: 'italic',
                  fontWeight: '700'
                }}>
                  Read the full timeline &rarr;
                </p>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.5rem 0' }} />

              {/* Quote Box */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.03)',
                borderLeft: '3px solid #1a1a1a',
                padding: '0.75rem 1rem',
                margin: '0.5rem 0'
              }}>
                <p style={{
                  fontFamily: 'IM Fell English, serif',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  color: '#333',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  &ldquo;If it moves, simulate it. If it doesn&apos;t move, mesh it anyway.&rdquo;
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.7rem',
                  color: '#666',
                  margin: '0.5rem 0 0 0',
                  textAlign: 'right'
                }}>
                  &mdash; C.S. Patil, on his approach to engineering
                </p>
              </div>
            </div>

            {/* ===== CENTER COLUMN (Portrait + CTA) ===== */}
            <div className="divider-vertical" style={{
              flex: '0.9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              paddingLeft: '1.5rem'
            }}>
              {/* Portrait */}
              <div style={{ width: '100%', textAlign: 'center' }}>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.65rem',
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 0.5rem 0',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '0.3rem'
                }}>
                  Photograph of the Subject
                </p>
                <div style={{
                  position: 'relative',
                  border: '4px solid #1a1a1a',
                  padding: '6px',
                  background: '#e8e3db',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  display: 'inline-block'
                }}>
                  <div style={{
                    width: '240px',
                    height: '280px',
                    background: 'linear-gradient(135deg, #b8b0a8 0%, #8b8378 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <img
                      src="/portrait.jpg"
                      alt="Chinmay S. Patil"
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: '50% 20%',
                        filter: 'sepia(0.3) contrast(1.15) grayscale(0.2)',
                        pointerEvents: 'none'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="color:#404040;font-family:Libre Baskerville,serif;font-size:0.75rem;text-align:center;padding:1rem;user-select:none;">PHOTOGRAPH<br/>UNAVAILABLE<br/><small style="font-size:0.6rem;">Last seen in lab coat</small></div>';
                      }}
                    />
                  </div>
                  <p style={{
                    fontFamily: 'Libre Baskerville, serif',
                    fontSize: '0.65rem',
                    color: '#555',
                    margin: '0.4rem 0 0 0',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    Fig. 2 &mdash; Identification portrait
                  </p>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* Subject Dossier
              <div style={{ width: '100%' }}>
                <h4 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '0.3rem'
                }}>
                  Subject Dossier
                </h4>
                <table style={{
                  width: '100%',
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.72rem',
                  color: '#333',
                  borderCollapse: 'collapse'
                }}>
                  <tbody>
                    {[
                      ['Full Name', 'Chinmay S. Patil'],
                      ['Alias', '"The Mesh Refiner"'],
                      ['Nationality', 'Indian'],
                      ['Current Base', 'Munich, Germany'],
                      ['Degree', 'M.Sc. Aerospace (TUM)'],
                      ['Status', 'At Large'],
                    ].map(([label, value], i) => (
                      <tr key={i} style={{
                        borderBottom: i < 5 ? '1px dotted #ccc' : 'none'
                      }}>
                        <td style={{
                          padding: '0.3rem 0.4rem 0.3rem 0',
                          fontWeight: '700',
                          color: '#555',
                          whiteSpace: 'nowrap',
                          verticalAlign: 'top',
                          width: '40%'
                        }}>{label}</td>
                        <td style={{
                          padding: '0.3rem 0',
                          verticalAlign: 'top'
                        }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> */}

              {/* <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} /> */}



              {/* CTA — Enter Archive */}
              <div style={{
                width: '100%',
                border: '2px solid #1a1a1a',
                padding: '1rem',
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.02)',
              }}>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Have Information?
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#444',
                  margin: '0 0 0.75rem 0',
                  lineHeight: '1.5'
                }}>
                  Explore the full portfolio archive of projects, education, and case files&hellip;
                </p>
                <button
                  className={`cta-button${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                  type="button"
                  onClick={() => navigate('/hub')}
                  onMouseEnter={() => setHubHovered(true)}
                  onMouseLeave={() => setHubHovered(false)}
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    padding: '0.6rem 1.2rem',
                    background: hubHovered ? '#1a1a1a' : '#f5f0e8',
                    color: hubHovered ? '#f5f0e8' : '#1a1a1a',
                    border: '2px solid #1a1a1a',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    width: '100%'
                  }}
                >
                  Enter the Archive &rarr;
                </button>
              </div>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* Last Known Whereabouts */}
              <div style={{ width: '100%' }}>
                <h4 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>
                  Last Known Whereabouts
                </h4>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  lineHeight: '1.6',
                  color: '#333',
                  margin: '0 0 0.4rem 0',
                  textAlign: 'justify'
                }}>
                  Subject was last observed frequenting the Boltzmannstraße campus, reportedly seen entering computational labs at odd hours carrying a ThinkPad and muttering about &ldquo;y-plus values.&rdquo;
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.7rem',
                  lineHeight: '1.6',
                  color: '#555',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  Prior sightings confirmed in Bangalore, Chennai, and Gothenburg.
                </p>
              </div>

              {/* <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} /> */}

              {/* Publications on File */}
              {/* <div style={{ width: '100%' }}>
                <h4 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>
                  Publications on File
                </h4>
                <div style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.7rem',
                  color: '#333',
                  lineHeight: '1.5'
                }}>
                  {[
                    'Aeroacoustic analysis using FW-H analogy (OpenFOAM)',
                    'PCM heat transfer with effective heat capacity method',
                    'Free-fall dynamics CFD formulation & validation',
                  ].map((pub, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '0.4rem',
                      padding: '0.25rem 0',
                      borderBottom: i < 2 ? '1px dotted #ddd' : 'none'
                    }}>
                      <span style={{ color: '#8b0000', fontSize: '0.55rem', marginTop: '0.15rem' }}>&#9830;</span>
                      <span>{pub}</span>
                    </div>
                  ))}
                </div>
              </div> */}

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* Reward ad */}
              <div style={{
                width: '100%',
                border: '2px solid #1a1a1a',
                padding: '0.75rem',
                textAlign: 'center',
                background: 'rgba(139, 0, 0, 0.04)',
              }}>
                <p style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.85rem',
                  fontWeight: '900',
                  color: '#1a1a1a',
                  margin: '0 0 0.3rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Reward Offered
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.72rem',
                  color: '#333',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Insightful conversations, collaborative CFD projects, and engineering solutions gladly accepted.
                </p>
              </div>
            </div>

            {/* ===== RIGHT COLUMN ===== */}
            <div className="divider-vertical" style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              paddingLeft: '1.5rem'
            }}>
              {/* Education */}
              <article
                className={`article-link${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate('/education')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/education');
                  }
                }}
                onMouseEnter={() => setEducationHovered(true)}
                onMouseLeave={() => setEducationHovered(false)}
                style={{
                  padding: '0.5rem',
                  margin: '-0.5rem',
                  borderRadius: '1px',
                  outline: educationHovered ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: educationHovered ? '#8b0000' : '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover clickable">
                  Education Chronicle
                </h3>
                <div style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#333',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 0.4rem 0', textAlign: 'justify' }}>
                    <strong>Technical University of Munich</strong> &mdash; Masters in Aerospace Engineering (Oct 2025&ndash;Present).
                  </p>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    <strong>VIT Chennai</strong> &mdash; B.Tech Mechanical Engineering with Minors in AI/ML, CGPA 8.83 (Jun 2021&ndash;Aug 2025).
                  </p>
                </div>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#8b0000',
                  margin: '0.4rem 0 0 0',
                  fontStyle: 'italic',
                  fontWeight: '700'
                }}>
                  View full education record &rarr;
                </p>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* Projects Brief */}
              <article
                className={`article-link${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate('/projects')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/projects');
                  }
                }}
                onMouseEnter={() => setProjectsHovered(true)}
                onMouseLeave={() => setProjectsHovered(false)}
                style={{
                  padding: '0.5rem',
                  margin: '-0.5rem',
                  borderRadius: '1px',
                  outline: projectsHovered ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: projectsHovered ? '#8b0000' : '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover clickable">
                  Projects Desk
                </h3>
                <div style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#333',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 0.4rem 0', textAlign: 'justify' }}>
                    Active development includes Effective Heat Capacity PCM solvers, free-fall CFD formulations, and FW-H aeroacoustic post-processing utilities&mdash;all built on OpenFOAM.
                  </p>
                  <p style={{ margin: 0, textAlign: 'justify' }}>
                    Prior cases: propeller aeroacoustics, parapet-roof solar loads, drone downwash, and hybrid battery cooling (67% efficiency gain).
                  </p>
                </div>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#8b0000',
                  margin: '0.4rem 0 0 0',
                  fontStyle: 'italic',
                  fontWeight: '700'
                }}>
                  Open the case files &rarr;
                </p>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* OpenFOAM Section — linked */}
              <article
                className={`article-link${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate('/openfoam')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/openfoam');
                  }
                }}
                onMouseEnter={() => setOpenfoamHovered(true)}
                onMouseLeave={() => setOpenfoamHovered(false)}
                style={{
                  padding: '0.5rem',
                  margin: '-0.5rem',
                  borderRadius: '1px',
                  outline: openfoamHovered ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: openfoamHovered ? '#8b0000' : '#1a1a1a',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }} className="headline-hover clickable">
                  The OpenFOAM Column
                </h3>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  lineHeight: '1.6',
                  color: '#333',
                  margin: '0 0 0.4rem 0',
                  textAlign: 'justify'
                }}>
                  A specimen rack of OpenFOAM solvers, tutorials, and case studies&mdash;from rotor-wake LES to PCM battery cooling&mdash;has been compiled for public reference.
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#8b0000',
                  margin: 0,
                  fontStyle: 'italic',
                  fontWeight: '700'
                }}>
                  Browse the OpenFOAM archive &rarr;
                </p>
              </article>

              <div style={{ borderTop: '1px solid #b8b0a8', margin: '0.25rem 0' }} />

              {/* Contact teaser — linked */}
              <article
                className={`article-link${showClickableZones ? ' clickable-zone-highlight' : ''}`}
                role="link"
                tabIndex={0}
                onClick={() => navigate('/contactme')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/contactme');
                  }
                }}
                onMouseEnter={() => setContactHovered(true)}
                onMouseLeave={() => setContactHovered(false)}
                style={{
                  padding: '0.5rem',
                  margin: '-0.5rem',
                  borderRadius: '1px',
                  outline: contactHovered ? '1px solid #1a1a1a' : '1px solid transparent'
                }}
              >
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: contactHovered ? '#8b0000' : '#8b0000',
                  margin: '0 0 0.4rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  borderBottom: '2px solid #8b0000',
                  paddingBottom: '0.3rem'
                }} className="headline-hover clickable">
                  Classifieds: Contact Desk
                </h3>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  lineHeight: '1.6',
                  color: '#333',
                  margin: 0,
                  textAlign: 'justify'
                }}>
                  Persons wishing to reach the subject are directed to the rotary telephone contact bureau. Operators standing by.
                </p>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.75rem',
                  color: '#8b0000',
                  margin: '0.4rem 0 0 0',
                  fontStyle: 'italic',
                  fontWeight: '700'
                }}>
                  Dial the tip line &rarr;
                </p>
              </article>

              <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                <p style={{
                  fontFamily: 'Libre Baskerville, serif',
                  fontSize: '0.6rem',
                  color: '#888',
                  margin: 0,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Edition No. CSP-2026 &middot; All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
