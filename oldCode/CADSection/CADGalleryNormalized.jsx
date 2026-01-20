// app/components/CADGalleryNormalized.jsx
"use client"
import { useState, useEffect, useRef } from 'react'
import CADGLTFList from '../consts/CADGLTFList'  // Import data
import GLTFViewerModal from './GLTFViewerModal'   // Import modal

export default function CADGalleryNormalized() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollContainerRef = useRef(null)
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const PROJECTS_PER_PAGE = 4

  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const widthScale = viewportWidth / BASE_WIDTH
      const heightScale = viewportHeight / BASE_HEIGHT
      setScale(Math.min(widthScale, heightScale))
    }
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

  const projects = CADGLTFList
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.clientWidth
      const page = Math.round(scrollLeft / containerWidth)
      setCurrentPage(Math.min(page, totalPages - 1))
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [totalPages])

  const scrollToPage = (index) => {
    const container = scrollContainerRef.current
    if (!container) return
    const containerWidth = container.clientWidth
    container.scrollTo({ left: containerWidth * index, behavior: 'smooth' })
  }

  return (
    <>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: BASE_WIDTH, height: BASE_HEIGHT, position: 'relative', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '1400px', height: '900px', display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{ fontSize: '14px', color: 'hsl(140, 70%, 60%)', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>3D Design Portfolio</div>
            <h2 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '16px', background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: '1.1' }}>CAD Projects</h2>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.68)', maxWidth: '900px' }}>Explore my mechanical design work — from precision engineering to creative product design.</p>
          </div>

          {/* Navigation */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '24px', flexShrink: 0 }}>
              <button onClick={() => scrollToPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0} style={{ width: '44px', height: '44px', borderRadius: '50%', background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === 0 ? 0.3 : 1, transition: 'all 0.3s ease' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>{Array.from({ length: totalPages }).map((_, idx) => (<button key={idx} onClick={() => scrollToPage(idx)} style={{ width: idx === currentPage ? '52px' : '36px', height: '7px', borderRadius: '4px', background: idx === currentPage ? 'hsl(140, 70%, 60%)' : 'rgba(255, 255, 255, 0.15)', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: idx === currentPage ? '0 0 12px hsl(140, 70%, 60% / 0.5)' : 'none' }} />))}</div>
              <button onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage === totalPages - 1} style={{ width: '44px', height: '44px', borderRadius: '50%', background: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: currentPage === totalPages - 1 ? 0.3 : 1, transition: 'all 0.3s ease' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            </div>
          )}

          {/* Gallery Grid */}
          <div ref={scrollContainerRef} style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory', display: 'flex', WebkitOverflowScrolling: 'touch', minHeight: 0 }}>
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div key={pageIndex} style={{ minWidth: '100%', width: '100%', height: '100%', flexShrink: 0, scrollSnapAlign: 'start', scrollSnapStop: 'always', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '24px', width: '100%', height: '100%', maxHeight: '720px' }}>
                  {projects.slice(pageIndex * PROJECTS_PER_PAGE, (pageIndex + 1) * PROJECTS_PER_PAGE).map((project) => (
                    <div key={project.id} style={{ borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))', border: '1px solid rgba(255, 255, 255, 0.08)', transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', position: 'relative', height: '100%' }} className="cad-card">
                      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                        <img src={project.coverPhoto} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: '12px', left: '12px', padding: '6px 12px', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '6px', fontSize: '14px', fontWeight: '700', color: project.color }}>{project.year}</div>
                        <h3 style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '22px', fontWeight: '700', color: '#fff', margin: 0, maxWidth: '60%', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{project.title}</h3>
                        <button onClick={() => setSelectedProject(project)} style={{ position: 'absolute', bottom: '16px', right: '16px', padding: '12px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)', color: project.color, border: `1px solid ${project.color}60`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', boxShadow: `0 4px 16px ${project.color}30` }} className="view-3d-button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>View 3D</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Render the modal when a project is selected */}
      {selectedProject && (
        <GLTFViewerModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
      
      <style jsx>{`div::-webkit-scrollbar { display: none; } .cad-card:hover { transform: translateY(-6px); border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5); } .view-3d-button:hover { transform: scale(1.08); background: rgba(0, 0, 0, 0.95) !important; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7) !important; } .view-3d-button:active { transform: scale(1); }`}</style>
    </>
  )
}