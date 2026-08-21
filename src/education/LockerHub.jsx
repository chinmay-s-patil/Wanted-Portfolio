'use client'

export default function LockerHub({ lockers, onSelect, openLockerId }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4rem',
        padding: '2rem',
        position: 'relative'
      }}
    >
      {/* Floor gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, #0a0a0a 0%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Ambient top light */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to bottom, rgba(58,58,58,0.3) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      <p
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#aaa',
          textAlign: 'center',
          fontFamily: "'Special Elite', monospace",
          letterSpacing: '0.1em',
          position: 'relative',
          zIndex: 10,
          margin: 0
        }}
      >
        SELECT A LOCKER TO VIEW CREDENTIALS
      </p>

      <div
        style={{
          display: 'flex',
          gap: '4rem',
          alignItems: 'flex-end',
          perspective: '1200px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10
        }}
      >
        {lockers.map((locker) => (
          <LockerCard
            key={locker.id}
            locker={locker}
            isOpen={openLockerId === locker.id}
            onClick={() => {
              if (!locker.locked) onSelect(locker.id)
            }}
          />
        ))}
      </div>
    </div>
  )
}

function LockerCard({ locker, isOpen, onClick }) {
  const isLocked = locker.locked

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        filter: isLocked ? 'grayscale(0.4)' : 'none',
        opacity: isLocked ? 0.6 : 1,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        if (!isLocked) {
          const door = e.currentTarget.querySelector('.locker-door')
          if (door) door.style.transform = 'rotateY(-8deg) translateY(-6px)'
        }
      }}
      onMouseLeave={(e) => {
        const door = e.currentTarget.querySelector('.locker-door')
        if (door) door.style.transform = 'rotateY(0deg) translateY(0)'
      }}
    >
      {/* Pedestal */}
      <div
        style={{
          width: '260px',
          height: '18px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: '0 0 6px 6px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.7)'
        }}
      />

      {/* Locker body */}
      <div
        style={{
          width: '260px',
          height: isLocked ? '340px' : '420px',
          position: 'relative',
          transform: 'translateY(-4px)'
        }}
      >
        {/* Door */}
        <div
          className="locker-door"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${locker.color} 0%, ${locker.color}dd 30%, ${locker.color}88 70%, ${locker.color}55 100%)`,
            borderRadius: '8px 8px 4px 4px',
            border: '3px solid rgba(0,0,0,0.4)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transformOrigin: 'left center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Inner frame */}
          <div
            style={{
              position: 'absolute',
              inset: '12px',
              border: '2px solid rgba(255,255,255,0.08)',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}
          />

          {/* Hinges */}
          <div
            style={{
              position: 'absolute',
              left: '-7px',
              top: '60px',
              width: '14px',
              height: '44px',
              background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
              borderRadius: '2px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.5)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '-7px',
              bottom: '60px',
              width: '14px',
              height: '44px',
              background: 'linear-gradient(90deg, #444 0%, #666 50%, #444 100%)',
              borderRadius: '2px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.5)'
            }}
          />

          {/* Lock dial */}
          <div
            style={{
              position: 'absolute',
              top: '120px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '44px',
              height: '44px',
              background: 'radial-gradient(circle, #999 0%, #555 100%)',
              borderRadius: '50%',
              boxShadow:
                'inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(255,255,255,0.1), 0 0 0 3px rgba(0,0,0,0.3)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '18px',
                height: '18px',
                background: '#222',
                borderRadius: '3px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8)'
              }}
            />
          </div>

          {/* Number plate */}
          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.75)',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '2rem',
              fontWeight: '700',
              color: isLocked ? '#666' : '#f6efe2',
              fontFamily: "'Special Elite', monospace",
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em'
            }}
          >
            {locker.number}
          </div>

          {/* Ventilation slits */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '24px',
              right: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '2px',
                  borderRadius: '1px',
                  background: 'linear-gradient(90deg, #000 0%, #333 50%, #000 100%)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
                }}
              />
            ))}
          </div>

          {/* Label */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#f6efe2',
              padding: '6px 18px',
              borderRadius: '3px',
              fontSize: '1rem',
              fontWeight: '700',
              color: locker.color,
              fontFamily: "'Special Elite', monospace",
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap'
            }}
          >
            {locker.label}
          </div>

          {/* Metallic sheen */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: '55%',
              bottom: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)',
              pointerEvents: 'none'
            }}
          />

          {/* Locked overlay stripe */}
          {isLocked && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
                pointerEvents: 'none'
              }}
            />
          )}
        </div>

        {/* Interior hint (visible briefly on hover for unlocked) */}
        {!isLocked && (
          <div
            style={{
              position: 'absolute',
              inset: '4px',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.6)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#555',
              fontSize: '0.8rem',
              fontFamily: "'Special Elite', monospace",
              pointerEvents: 'none',
              zIndex: -1
            }}
            className="locker-interior"
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '6px', opacity: 0.5 }}>📂</div>
              <div>CREDENTIALS</div>
            </div>
          </div>
        )}
      </div>

      {/* Locked message */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            bottom: '-56px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            width: '220px',
            background: 'rgba(0,0,0,0.7)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              color: '#c4a574',
              fontFamily: "'Special Elite', monospace",
              lineHeight: 1.4
            }}
          >
            {locker.message}
          </div>
          {locker.subtitle && (
            <div
              style={{
                fontSize: '0.75rem',
                color: '#666',
                marginTop: '4px',
                fontStyle: 'italic'
              }}
            >
              {locker.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  )
}