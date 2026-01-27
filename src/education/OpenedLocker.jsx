// src/education/components/OpenedLocker.jsx
import { useState } from 'react'
import LeftDoor from './LeftDoor'
import BackPanel from './BackPanel'
import RightDoor from './RightDoor'

export default function OpenedLocker({ locker, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'rgba(40,40,40,0.9)',
          border: '2px solid #666',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 101,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Special Elite', monospace",
          fontSize: '1.5rem',
          transition: 'all 0.3s ease'
        }}
      >
        ✕
      </button>

      {/* Three-panel locker */}
      <div style={{
        width: '95%',
        maxWidth: '1600px',
        height: '85vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr 1fr',
        gap: '0',
        position: 'relative',
        boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
        border: '8px solid #3d2817',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Left door - Photo gallery */}
        <LeftDoor 
          locker={locker} 
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        {/* Back panel - Main info */}
        <BackPanel locker={locker} />

        {/* Right door - Thesis/Documents */}
        <RightDoor locker={locker} />
      </div>
    </div>
  )
}