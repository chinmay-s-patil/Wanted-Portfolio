
// Cassette Rack Component
function CassetteRack({ projects, selectedProject, onProjectClick }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignItems: 'center'
    }}>
      <div style={{
        fontSize: '0.9rem',
        color: '#00ff00',
        fontWeight: '700',
        letterSpacing: '0.15em',
        textShadow: '0 0 10px #00ff00'
      }}>
        CASSETTE LIBRARY
      </div>

      <div 
        className="cassette-rack"
        style={{
          width: '340px',
          height: 'calc(6 * 110px + 5 * 1.2rem + 3rem)',
          maxHeight: '75vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
          border: '3px solid #333',
          borderRadius: '12px',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="cassette"
            onClick={() => onProjectClick(project)}
            style={{
              width: '100%',
              height: '110px',
              background: `linear-gradient(90deg, ${project.color}dd 0%, ${project.color}88 100%)`,
              borderRadius: '6px',
              cursor: 'pointer',
              position: 'relative',
              border: selectedProject?.id === project.id 
                ? '3px solid #00ff00' 
                : '3px solid rgba(0,0,0,0.3)',
              boxShadow: selectedProject?.id === project.id
                ? `0 0 20px ${project.color}80, 0 0 40px #00ff0060`
                : '0 4px 12px rgba(0,0,0,0.4)',
              display: 'flex',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: '110px',
              height: '100%',
              overflow: 'hidden',
              borderRight: '3px solid rgba(0,0,0,0.3)',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <img 
                src={project.coverPhoto} 
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.9
                }}
              />
            </div>

            <div style={{
              flex: 1,
              padding: '0.75rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '0.4rem'
            }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: '#fff',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                lineHeight: '1.2',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {project.title}
              </div>
              
              <div style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: '600'
              }}>
                {project.year} • {project.category}
              </div>
            </div>

            {selectedProject?.id === project.id && (
              <div style={{
                position: 'absolute',
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '5px',
                height: '70%',
                background: '#00ff00',
                boxShadow: '0 0 12px #00ff00'
              }} />
            )}
          </div>
        ))}
      </div>

      <div style={{
        fontSize: '0.7rem',
        color: '#666',
        textAlign: 'center',
        fontFamily: "'Courier New', monospace",
        letterSpacing: '0.05em'
      }}>
        {projects.length} CASSETTES AVAILABLE
      </div>
    </div>
  )
}

export default CassetteRack;