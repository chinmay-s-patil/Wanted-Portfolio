// src/visualization/WikiWindow.jsx
import { useEffect, useState } from 'react'

export default function WikiBrowser({ viz, onClose }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const nextScreen = () => {
    setCurrentScreenIndex((prev) => (prev + 1) % viz.screenshots.length)
  }

  const prevScreen = () => {
    setCurrentScreenIndex((prev) => (prev - 1 + viz.screenshots.length) % viz.screenshots.length)
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Tahoma', sans-serif",
        animation: 'ieOpen 0.2s ease-out',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'text',
        WebkitUserSelect: 'text'
      }}
    >
      <style jsx>{`
        @keyframes ieOpen {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Title Bar */}
      <div style={{
        background: 'linear-gradient(180deg, #0058EE 0%, #0054E3 50%, #003FD1 100%)',
        padding: '3px 4px 3px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #0054E3',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: 'linear-gradient(135deg, #4DA6FF 0%, #0066CC 100%)',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#fff'
          }}>
            e
          </div>
          <span style={{
            fontSize: '11px',
            color: '#fff',
            fontWeight: 'bold'
          }}>
            {viz.title}.wiki - Internet Explorer
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2px' }}>
          {/* Minimize button - does nothing */}
          <button style={{
            width: '21px', height: '20px',
            background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
            border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
            cursor: 'default', fontSize: '11px', fontWeight: 'bold', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
          }}>_</button>
          
          {/* Maximize button - does nothing */}
          <button style={{
            width: '21px', height: '20px',
            background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
            border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
            cursor: 'default', fontSize: '11px', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
          }}>□</button>
          
          {/* Close button - ONLY this one triggers onClose */}
          <button onClick={onClose} style={{
            width: '21px', height: '20px',
            background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
            border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
            cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
          }}>✕</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div style={{
        background: '#ECE9D8',
        borderBottom: '1px solid #C0C0C0',
        padding: '2px 4px',
        display: 'flex',
        gap: '8px',
        fontSize: '11px',
        flexShrink: 0
      }}>
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map((menu) => (
          <div key={menu} style={{ padding: '2px 6px', cursor: 'default' }}>{menu}</div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        background: 'linear-gradient(180deg, #F1F0E9 0%, #D6D3CE 100%)',
        borderBottom: '1px solid #919B9C',
        padding: '3px 4px',
        display: 'flex',
        gap: '2px',
        alignItems: 'center',
        flexShrink: 0
      }}>
        {/* Navigation buttons - disabled */}
        <button disabled style={{
          width: '24px', height: '22px',
          background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
          border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
          cursor: 'default', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.6
        }}>←</button>
        <button disabled style={{
          width: '24px', height: '22px',
          background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
          border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
          cursor: 'default', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.6
        }}>→</button>

        <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 4px' }} />

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: '#000' }}>Address</span>
          <div style={{
            flex: 1, height: '20px', background: '#fff',
            border: '1px solid #7F9DB9', borderTop: '1px solid #003C74', borderLeft: '1px solid #003C74',
            padding: '2px 4px', display: 'flex', alignItems: 'center', fontSize: '11px'
          }}>
            <span style={{ color: '#000' }}>http://www.{viz.title.toLowerCase().replace(/\s+/g, '')}.wiki</span>
          </div>
        </div>

        <button disabled style={{
          height: '22px', padding: '0 12px',
          background: 'linear-gradient(180deg, #D4D0C8 0%, #C0C0C0 100%)',
          border: '1px solid #fff', borderRight: '1px solid #808080', borderBottom: '1px solid #808080',
          cursor: 'default', fontSize: '11px', fontWeight: 'bold',
          opacity: 0.6
        }}>Go</button>
      </div>

      {/* Content Area */}
      <div style={{
        padding: '16px',
        overflowY: 'auto',
        flex: 1,
        background: '#fff'
      }}>
        {/* Wiki-style Header */}
        <div style={{ borderBottom: '1px solid #A7D7F9', paddingBottom: '8px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 'normal', color: '#000', margin: '0 0 4px 0', fontFamily: "'Georgia', serif" }}>
            {viz.title}
          </h1>
          <div style={{ fontSize: '11px', color: '#666' }}>
            From {viz.title}.wiki, the free encyclopedia
          </div>
        </div>

        {/* Screenshot Gallery */}
        {viz.screenshots && viz.screenshots.length > 0 && (
          <div style={{
            float: 'right', marginLeft: '20px', marginBottom: '20px',
            width: '420px', border: '1px solid #A7D7F9', background: '#F9F9F9', padding: '6px'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '270px', background: '#000', marginBottom: '6px' }}>
              {viz.screenshots.map((screenshot, idx) => (
                <img
                  key={idx}
                  src={screenshot}
                  alt={`Screenshot ${idx + 1}`}
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
                    opacity: idx === currentScreenIndex ? 1 : 0, transition: 'opacity 0.3s'
                  }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ))}
            </div>
            
            {viz.screenshots.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', padding: '4px' }}>
                <button onClick={prevScreen} style={{ padding: '3px 10px', fontSize: '12px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}>‹ Prev</button>
                <span style={{ fontSize: '12px', padding: '2px 8px' }}>{currentScreenIndex + 1} / {viz.screenshots.length}</span>
                <button onClick={nextScreen} style={{ padding: '3px 10px', fontSize: '12px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}>Next ›</button>
              </div>
            )}
            
            <div style={{ fontSize: '12px', color: '#666', padding: '4px', textAlign: 'center' }}>{viz.title} Interface</div>
          </div>
        )}

        {/* Wiki Content */}
        <div style={{ fontSize: '14px', lineHeight: '1.65', color: '#000' }}>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>{viz.title}</strong> is a {viz.type} application designed for {viz.category.toLowerCase()}. 
            {viz.isWIP && ' This project is currently in development.'}
          </p>

          <p style={{ margin: '0 0 12px 0' }}>{viz.longDescription}</p>

          <h2 style={{ fontSize: '17px', fontWeight: 'normal', borderBottom: '1px solid #A7D7F9', padding: '4px 0', margin: '20px 0 12px 0', fontFamily: "'Georgia', serif" }}>Features</h2>
          <ul style={{ margin: '0 0 12px 0', paddingLeft: '24px' }}>
            {viz.features.map((feature, i) => <li key={i} style={{ margin: '4px 0' }}>{feature}</li>)}
          </ul>

          <h2 style={{ fontSize: '17px', fontWeight: 'normal', borderBottom: '1px solid #A7D7F9', padding: '4px 0', margin: '20px 0 12px 0', fontFamily: "'Georgia', serif" }}>Technical Details</h2>
          <table style={{ border: '1px solid #A7D7F9', background: '#F9F9F9', marginBottom: '12px', width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 'bold', width: '30%', borderBottom: '1px solid #A7D7F9' }}>Type</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #A7D7F9' }}>{viz.type.toUpperCase()}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #A7D7F9' }}>Year</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #A7D7F9' }}>{viz.year}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 'bold', borderBottom: '1px solid #A7D7F9' }}>Technology Stack</td>
                <td style={{ padding: '4px 8px', borderBottom: '1px solid #A7D7F9' }}>{viz.tech.join(', ')}</td>
              </tr>
              <tr>
                <td style={{ padding: '4px 8px', fontWeight: 'bold' }}>Status</td>
                <td style={{ padding: '4px 8px' }}>{viz.isWIP ? 'Work in Progress' : 'Available'}</td>
              </tr>
            </tbody>
          </table>

          {/* Access Information */}
          <div style={{ background: '#FFFFCC', border: '1px solid #FFD700', padding: '12px', margin: '16px 0', fontSize: '12px' }}>
            <strong>💡 Access Information:</strong> {viz.accessType}
            <br />
            {viz.link ? (
              <a href={viz.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0645AD', textDecoration: 'underline' }}>{viz.ctaText}</a>
            ) : (
              <a href="mailto:chinmaypatil2412@gmail.com" style={{ color: '#0645AD', textDecoration: 'underline' }}>{viz.ctaText}</a>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ background: '#ECE9D8', borderTop: '1px solid #fff', padding: '2px 4px', display: 'flex', gap: '8px', fontSize: '11px', color: '#000', flexShrink: 0 }}>
        <div>Done</div>
        <div style={{ marginLeft: 'auto' }}>Internet</div>
      </div>
    </div>
  )
}