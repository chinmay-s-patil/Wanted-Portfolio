import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * HubHelpGuideModal Component
 *
 * Retro police precinct evidence directory & portfolio guide overlay.
 * Opens when the Evidence Board is clicked.
 * Allows users to visit any portfolio section directly or understand room models.
 */
export default function HubHelpGuideModal({ isOpen, onClose }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const sections = [
    {
      id: 'computer',
      icon: '🖥️',
      title: 'Computer Terminal',
      tagline: 'Visualization & Graphics',
      route: '/visualization',
      desc: 'Explore interactive 3D WebGL data visualizations, custom shaders, and real-time graphics rendering.',
      location: 'Desktop workstation on the back desk'
    },
    {
      id: 'printer',
      icon: '🖨️',
      title: '3D Printer Workstation',
      tagline: 'CAD Models & Engineering',
      route: '/cad',
      desc: 'Browse parametric 3D CAD models, rapid prototyping projects, and physical engineering designs.',
      location: 'Worktable on the right side wall'
    },
    {
      id: 'cabinet',
      icon: '🗄️',
      title: 'Filing Cabinets',
      tagline: 'Project Archive & Repos',
      route: '/projects',
      desc: 'Full repository archive of software engineering projects, open-source code, and technical builds.',
      location: 'Double steel cabinet towers by the right wall'
    },
    {
      id: 'newspaper',
      icon: '📜',
      title: 'Crime Scene Newspaper',
      tagline: 'Biography & Case File',
      route: '/about',
      desc: 'Read the lead case story detailing background, career experience, and technical skill breakdown.',
      location: 'Front center coffee table'
    },
    {
      id: 'binder',
      icon: '📓',
      title: 'Detective Case Binder',
      tagline: 'Education & Certifications',
      route: '/education',
      desc: 'Inspect academic records, university degrees, specialized certifications, and coursework.',
      location: 'Beside the newspaper on the coffee table'
    },
    {
      id: 'ticketbooth',
      icon: '🎟️',
      title: 'Drive-In Ticket Booth',
      tagline: 'OpenFOAM CFD Cinema',
      route: '/openfoam',
      desc: 'Vintage drive-in cinema ticket kiosk linking to OpenFOAM CFD fluid dynamic case studies.',
      location: 'Standing in the back-left corner section of the lounge'
    },
    {
      id: 'radartablet',
      icon: '📡',
      title: 'Tactical Radar Tablet',
      tagline: 'Algorithmic Solvers',
      route: '/solvers',
      desc: 'Rugged military radar tablet with glowing CRT screen linking to algorithmic & physics solvers.',
      location: 'Mounted on the left side of the main workstation desk'
    },
    {
      id: 'camera',
      icon: '📷',
      title: 'Vintage Wet-Plate Camera',
      tagline: 'Events & Media Gallery',
      route: '/events',
      desc: 'Antique accordion camera on wooden tripod linking to events, photography, and media gallery.',
      location: 'Standing in the lounge near the TV console'
    },
    {
      id: 'tv',
      icon: '📺',
      title: 'Retro Television Console',
      tagline: 'Events & Presentations',
      route: '/events',
      desc: 'Watch project demonstration videos, tech talk recordings, and media presentations.',
      location: 'Wooden TV console on the front wall'
    },
    {
      id: 'lockers',
      icon: '🗄️',
      title: 'Locker Wall',
      tagline: 'Personal Wiki & Docs',
      route: '/wiki',
      desc: 'Technical documentation, engineering notes, cheat sheets, and personal knowledge base.',
      location: 'Storage locker bank along the left wall'
    },
    {
      id: 'payphone',
      icon: '📞',
      title: 'Vintage Payphone',
      tagline: 'Contact & Communications',
      route: '/contact',
      desc: 'Direct communication channels, email links, social handles, and message transmission.',
      location: 'Mounted on the left precinct wall'
    }
  ]

  const handleVisit = (route) => {
    onClose()
    navigate(route)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10, 8, 6, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1d1814 0%, #120e0b 100%)',
          border: '2px solid #c59b27',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(197, 155, 39, 0.25), inset 0 0 20px rgba(0, 0, 0, 0.9)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#e2d5c3',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(197, 155, 39, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(25, 20, 15, 0.8)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <h2 style={{ margin: 0, color: '#ffea9f', fontSize: '22px', letterSpacing: '0.5px' }}>
                Precinct Investigation Directory
              </h2>
            </div>
            <p style={{ margin: '6px 0 0 0', color: '#a0907c', fontSize: '13px' }}>
              Click any section below to visit directly, or use the 3D room props to navigate.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #c59b27',
              color: '#ffea9f',
              borderRadius: '6px',
              width: '36px',
              height: '36px',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#c59b27'
              e.currentTarget.style.color = '#120e0b'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#ffea9f'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Section List Grid */}
        <div
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px'
          }}
        >
          {sections.map((sec) => (
            <div
              key={sec.id}
              style={{
                background: 'rgba(30, 24, 18, 0.7)',
                border: '1px solid rgba(197, 155, 39, 0.25)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#c59b27'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(197, 155, 39, 0.25)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '22px' }}>{sec.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', color: '#ffea9f' }}>{sec.title}</h3>
                    <span style={{ fontSize: '11px', color: '#c59b27', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {sec.tagline}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '8px 0', fontSize: '12px', color: '#bcae9c', lineHeight: '1.4' }}>
                  {sec.desc}
                </p>
                <div style={{ fontSize: '11px', color: '#7e7060', fontStyle: 'italic', marginBottom: '12px' }}>
                  📍 3D Location: {sec.location}
                </div>
              </div>

              <button
                onClick={() => handleVisit(sec.route)}
                style={{
                  background: 'linear-gradient(135deg, #c59b27 0%, #9e7a1c 100%)',
                  color: '#120e0b',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  transition: 'opacity 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1.0')}
              >
                <span>Visit Section</span>
                <span>→</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(197, 155, 39, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(20, 16, 12, 0.9)',
            fontSize: '12px',
            color: '#a0907c'
          }}
        >
          <span>💡 Tip: You can also click any 3D prop inside the retro precinct room to navigate!</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid rgba(197, 155, 39, 0.4)',
              color: '#e2d5c3',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Explore 3D Room
          </button>
        </div>
      </div>
    </div>
  )
}
