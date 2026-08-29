import React, { useState } from 'react'

/**
 * AttributionModal Component
 *
 * Clean, high-readability credits & attributions modal for third-party external assets.
 */
export default function AttributionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('models')
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  // All 25 Third-Party 3D Models
  const modelsData = [
    { name: 'Display Terminal Unit', author: 'Edwin Wagha', license: 'CC-BY 4.0', source: 'https://sketchfab.com/edwinwagha', tag: 'Interactive CRT Terminal' },
    { name: 'Filing Cabinet - 6MB', author: 'Mehdi Shahsavan', license: 'CC-BY 4.0', source: 'https://sketchfab.com/ahmagh2e', tag: 'Evidence Storage' },
    { name: 'Couch & Sofa Set', author: 'Blaž Mraz', license: 'CC-BY 4.0', source: 'https://sketchfab.com/Mraz3D', tag: 'Lounge Seating' },
    { name: 'Office Assets Pack', author: 'SeverDoes3D', license: 'CC-BY 4.0', source: 'https://sketchfab.com/SeverDoes3D', tag: 'Precinct Desk Props' },
    { name: 'Vintage Newspaper', author: 'Qu3st10n', license: 'CC-BY 4.0', source: 'https://sketchfab.com/Qu3st10n', tag: 'Evidence Desk Article' },
    { name: 'Antique Wet Plate Camera', author: 'Lorenzo Drago', license: 'CC-BY 4.0', source: 'https://sketchfab.com/LorenzoDrago', tag: 'Vintage Field Camera' },
    { name: 'School Locker Row', author: 'Blackoutgfx', license: 'CC-BY 4.0', source: 'https://sketchfab.com/Blackoutgfx', tag: 'Wall Storage Lockers' },
    { name: 'Ticket Booth Kiosk', author: 'nickheitzman', license: 'CC-BY 4.0', source: 'https://sketchfab.com/nickheitzman', tag: 'Events Archive Kiosk' },
    { name: 'Childhood TV Kiosk', author: 'noodlepirate', license: 'CC-BY 4.0', source: 'https://sketchfab.com/noodlepirate', tag: 'Retro Television Desk' },
    { name: 'Binder Notebook', author: 'Console Art Cybernetic', license: 'CC-BY 4.0', source: 'https://sketchfab.com/cacybernetic', tag: 'Case File Binder' },
    { name: 'Grandfather Clock', author: 'Carl-HeinzLangley & Lyskilde', license: 'CC-BY 4.0', source: 'https://sketchfab.com/Carl-HeinzLangley', tag: 'Precinct Pendulum Clock' },
    { name: 'Rugged Military Radar Tablet', author: '3DMOAN', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3DMOAN', tag: 'Surveillance Radar Unit' },
    { name: 'Water Dispenser', author: 'Sibghat Baloch', license: 'CC-BY 4.0', source: 'https://sketchfab.com/sibghatbaloch', tag: 'Precinct Water Cooler' },
    { name: 'Antique Fireplace', author: 'Laetitia Irata', license: 'CC-BY 4.0', source: 'https://sketchfab.com/LaetitiaIrata', tag: 'Hearth & Mantel' },
    { name: 'Antique Globe', author: 'Vamsidharan & AnnaBelle Fibonacci', license: 'CC-BY 4.0', source: 'https://sketchfab.com/Vamsidharan', tag: 'Desk Navigation Globe' },
    { name: 'Old Upright Piano', author: 'paraverun', license: 'CC-BY 4.0', source: 'https://sketchfab.com/paraverun', tag: 'Lounge Upright Piano' },
    { name: 'Violin Instrument', author: 'RafalTlalka & DailyArt', license: 'CC-BY 4.0', source: 'https://sketchfab.com/RafalTlalka', tag: 'Acoustic Violin' },
    { name: 'TV Remote Control', author: 'Vijaysarathi', license: 'CC-BY 4.0', source: 'https://sketchfab.com/vjprojects2020', tag: 'Television Controller' },
    { name: 'Refracting Telescope', author: 'Théo Richard', license: 'CC-BY 4.0', source: 'https://sketchfab.com/theorichard', tag: 'Astronomical Telescope' },
    { name: 'Old Red Payphone', author: 'dashkilya', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/old-red-payphone-60a624c1a9044cc48eba96bcfcbe2278', tag: 'Vintage Payphone' },
    { name: '3D Printer', author: 'Michael V', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/3d-printer-3150a227e54a419e956daba61610e904', tag: 'Interactive 3D Printer' },
    { name: 'Kodak 400 Color Film', author: 'KilianPohl', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/kodak-400-color-film-24-exp-0757a34d138149b2bbe876b8fb463bc2', tag: '35mm Film Canister' },
    { name: 'Kodak Gold III 100 35mm Roll', author: 'KilianPohl', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/kodak-gold-iii-100-35mm-film-roll-6601bc8c59824e1fa67d1bbbf90eeebf', tag: '35mm Film Roll' },
    { name: 'Classic Table Lamp', author: 'AndreiVNK', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/classic-table-lamp-1a3292317bb342b4b33431081338a5c3', tag: 'Desk Table Lamp' },
    { name: 'Low Poly Trophy', author: 'Ege (EgeLanso_Dev)', license: 'CC-BY 4.0', source: 'https://sketchfab.com/3d-models/low-poly-trophy-f36afd27adeb4edf8e036f763c95608b', tag: 'Golden Trophy' },
  ]

  // Videos & Channel Links
  const videoData = [
    {
      title: 'Beethoven — Piano Sonata No. 14 "Moonlight Sonata" (III. Presto agitato)',
      creator: 'Valentina Lisitsa',
      channel: 'Valentina Lisitsa QOR Records',
      url: 'https://www.youtube.com/watch?v=zucBfXpCA6s',
      usage: 'Interactive Piano Easter Egg Audio & Video Stream',
      badge: 'Piano Stream',
    },
    {
      title: 'Beethoven — Violin Sonata No. 9 "Kreutzer Sonata" (I. Adagio sostenuto)',
      creator: 'Ai Takamatsu (高松あい)',
      channel: '高松あい_violin (@ai_takamatsu)',
      url: 'https://youtu.be/fTWZm8sijwQ',
      usage: 'Interactive Violin Easter Egg Audio & Video Stream',
      badge: 'Violin Stream',
    },
    {
      title: 'OpenFOAM CFD Aerodynamic & Turbulence Simulation Walkthrough',
      creator: 'OpenFOAM CFD Laboratory',
      channel: 'Computational Fluid Dynamics Research',
      url: 'https://www.youtube.com/watch?v=iP6ZABrm8Lo',
      usage: 'OpenFOAM Cinema Drive-In Theater Screening',
      badge: 'CFD Cinema',
    },
    {
      title: 'Starry Night Peak & Paranal Observatory Science Stream',
      creator: 'European Southern Observatory (ESO)',
      channel: 'ESO Public Science Outreach',
      url: 'https://www.youtube.com/watch?v=JuSsvM8B4Jc',
      usage: 'Astronomical Telescope Night Sky Viewfinder',
      badge: 'Observatory',
    },
    {
      title: 'ChinDoesSims Official YouTube Channel',
      creator: 'Chinmay Patil',
      channel: 'ChinDoesSims (@ChinDoesSims)',
      url: 'https://www.youtube.com/@ChinDoesSims',
      usage: 'Official Developer Channel — CFD, Aerodynamics & OpenFOAM Simulations',
      badge: 'Main Channel',
    },
  ]

  // Classical Music Performance Streams
  const musicData = [
    {
      title: 'Piano Sonata No. 14, Op. 27 No. 2, III. Presto agitato ("Moonlight Sonata")',
      artist: 'Valentina Lisitsa',
      license: 'YouTube Embedded Stream',
      url: 'https://www.youtube.com/watch?v=zucBfXpCA6s',
      type: 'Piano Performance',
    },
    {
      title: 'Violin Sonata No. 9, Op. 47, I. Adagio sostenuto – Presto ("Kreutzer Sonata")',
      artist: 'Ai Takamatsu (高松あい)',
      license: 'YouTube Embedded Stream',
      url: 'https://youtu.be/fTWZm8sijwQ',
      type: 'Violin Performance',
    },
  ]

  // External Astrophotography & Photography
  const artData = [
    {
      title: 'Comet C/2006 P1 (McNaught) — Paranal Observatory',
      author: 'S. Deiries / European Southern Observatory (ESO)',
      url: 'https://www.eso.org/public/images/mc_naught55/',
      notes: 'Great Comet of 2007 photography captured at Paranal Observatory, featured in telescope picture frame.',
      type: 'Astrophotography',
    },
    {
      title: 'Snowy Mountain Peak Under Starry Sky',
      author: 'Manuel Will (Unsplash)',
      url: 'https://unsplash.com/photos/snowy-mountain-peak-under-starry-sky-gd3t5Dtbwkw',
      notes: 'High-altitude astronomical night sky photography.',
      type: 'Photography',
    },
  ]

  // Search filter for models
  const filteredModels = modelsData.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(3, 6, 12, 0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
      onClick={onClose}
    >
      {/* Custom Slim Scrollbars & Tab Nav Styling */}
      <style>{`
        .attribution-custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .attribution-custom-scroll::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 4px;
        }
        .attribution-custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.4);
          border-radius: 4px;
        }
        .attribution-custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.8);
        }
        .attribution-tab-nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          height: '86vh',
          background: 'linear-gradient(165deg, #0f172a 0%, #090d16 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(245, 158, 11, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Single Top Header Bar with Close Button */}
        <div
          style={{
            padding: '1.25rem 1.8rem',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
              }}
            >
              🏆
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em',
                }}
              >
                Project Credits & Attributions
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 500 }}>
                Third-Party 3D Models, Media Streams & External Photography
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close Credits (Esc)"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div
          className="attribution-tab-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#070a12',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0 1.2rem',
            gap: '0.5rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            flexShrink: 0,
          }}
        >
          {[
            { id: 'models', label: '📦 3D Models', count: modelsData.length },
            { id: 'videos', label: '🎬 Videos & Links', count: videoData.length },
            { id: 'music', label: '🎵 Classical Streams', count: musicData.length },
            { id: 'art', label: '🖼️ External Photography', count: artData.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 1.4rem',
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                  color: isActive ? '#fbbf24' : '#94a3b8',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#0f172a' : '#94a3b8',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            padding: '0.8rem 1.8rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {activeTab === 'models' && `Showing ${filteredModels.length} of ${modelsData.length} 3D GLTF models`}
            {activeTab === 'videos' && `Showing ${videoData.length} video streams & official channels`}
            {activeTab === 'music' && `Showing ${musicData.length} classical performance streams`}
            {activeTab === 'art' && `Showing ${artData.length} external astrophotography assets`}
          </div>

          {activeTab === 'models' && (
            <input
              type="text"
              placeholder="Search models or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: '#070a12',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#f8fafc',
                fontSize: '0.82rem',
                outline: 'none',
                width: '220px',
              }}
            />
          )}
        </div>

        {/* Main Content Body */}
        <div className="attribution-custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '1.6rem' }}>
          {/* TAB 1: 3D MODELS */}
          {activeTab === 'models' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1rem',
              }}
            >
              {filteredModels.map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '10px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.8rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <div style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 700 }}>
                        {item.name}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {item.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                      Artist: {item.author}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                      {item.license}
                    </span>
                    {item.source && (
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.82rem', color: '#fbbf24', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        Source Link ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: VIDEOS & LINKS */}
          {activeTab === 'videos' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {videoData.map((v, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>▶</span> {v.title}
                    </div>
                    <span style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 700, padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {v.badge}
                    </span>
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 600 }}>
                    Creator / Channel: {v.creator} ({v.channel})
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: '1.6' }}>
                    Portfolio Integration: {v.usage}
                  </div>
                  <div style={{ marginTop: '0.6rem' }}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        padding: '8px 18px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                      }}
                    >
                      <span>▶</span> Watch Video on YouTube ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: CLASSICAL MUSIC STREAMS */}
          {activeTab === 'music' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {musicData.map((m, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '10px',
                    padding: '1.2rem 1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🎵</span> {m.title}
                    </div>
                    <div style={{ color: '#38bdf8', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 600 }}>
                      Performer: {m.artist}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                      {m.type}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                      {m.license}
                    </span>
                    {m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.84rem', color: '#fbbf24', textDecoration: 'none', fontWeight: 700 }}
                      >
                        Watch Stream ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: EXTERNAL PHOTOGRAPHY */}
          {activeTab === 'art' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {artData.map((a, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '10px',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>🖼️</span> {a.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                      {a.type}
                    </span>
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '0.88rem', fontWeight: 600 }}>Creator: {a.author}</div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: 1.6 }}>{a.notes}</div>
                  {a.url && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.84rem', color: '#fbbf24', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        View Original Source ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
