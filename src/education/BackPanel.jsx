// src/education/components/BackPanel.jsx
export default function BackPanel({ locker }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
      padding: '2.5rem',
      position: 'relative',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Ventilation slits at top */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #000 0%, #333 50%, #000 100%)',
            borderRadius: '2px'
          }} />
        ))}
      </div>

      {/* Header section */}
      <div style={{
        textAlign: 'center',
        paddingTop: '1rem',
        borderBottom: '2px solid #00ff00',
        paddingBottom: '1rem'
      }}>
        <div style={{
          fontSize: '0.9rem',
          color: '#00ff00',
          fontWeight: '700',
          letterSpacing: '0.2em',
          marginBottom: '0.5rem',
          textShadow: '0 0 10px rgba(0,255,0,0.5)'
        }}>
          EDUCATIONAL RECORD
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '0.5rem',
          fontFamily: "'Special Elite', monospace"
        }}>
          {locker.title}
        </h2>
        <div style={{
          fontSize: '1.3rem',
          color: '#00ff00',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          {locker.degree}
        </div>
      </div>

      {/* Institution info */}
      <div style={{
        background: 'rgba(0,255,0,0.1)',
        border: '1px solid rgba(0,255,0,0.3)',
        borderRadius: '8px',
        padding: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gap: '0.75rem',
          fontSize: '0.95rem',
          fontFamily: "'Special Elite', monospace"
        }}>
          {[
            { label: 'INSTITUTION:', value: locker.institution },
            { label: 'LOCATION:', value: locker.location },
            { label: 'PERIOD:', value: locker.period },
            { label: 'GPA/HONORS:', value: locker.gpa },
            { label: 'FOCUS AREA:', value: locker.focus }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'contents',
              borderBottom: i < 4 ? '1px solid rgba(0,255,0,0.2)' : 'none'
            }}>
              <div style={{
                color: '#888',
                fontWeight: '700'
              }}>
                {item.label}
              </div>
              <div style={{
                color: '#fff',
                fontWeight: '600'
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        borderLeft: '4px solid #00ff00',
        padding: '1rem',
        borderRadius: '4px'
      }}>
        <p style={{
          fontSize: '1rem',
          lineHeight: '1.7',
          color: '#ccc',
          fontFamily: "'Crimson Text', serif",
          margin: 0
        }}>
          {locker.description}
        </p>
      </div>

      {/* Skills */}
      <div>
        <div style={{
          fontSize: '0.85rem',
          color: '#888',
          marginBottom: '0.75rem',
          fontWeight: '700',
          letterSpacing: '0.1em',
          fontFamily: "'Special Elite', monospace"
        }}>
          KEY COMPETENCIES
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {locker.skills.map((skill, i) => (
            <span key={i} style={{
              padding: '0.4rem 0.8rem',
              background: 'rgba(0,255,0,0.2)',
              border: '1px solid #00ff00',
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: '#00ff00',
              fontFamily: "'Special Elite', monospace"
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}