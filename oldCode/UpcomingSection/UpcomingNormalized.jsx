'use client'

import { useState, useEffect, useRef } from 'react'
import upcomingProjects from './UpcomingList'
import UpcomingCard from './UpcomingCard'
import UpcomingModal from './UpcomingModal'

// Main Component
export default function UpcomingSection() {
  const [scale, setScale] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedProject, setSelectedProject] = useState(null)
  const scrollContainerRef = useRef(null)
  
  const BASE_WIDTH = 1920
  const BASE_HEIGHT = 1080
  const ITEMS_PER_PAGE = 4

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

  const totalPages = Math.ceil(upcomingProjects.length / ITEMS_PER_PAGE)

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
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '1400px',
            height: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{
              fontSize: '14px',
              color: 'hsl(140, 70%, 60%)',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              🚧 Work in Progress
            </div>
            <h2 style={{
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.1'
            }}>
              Upcoming Projects
            </h2>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.68)',
              maxWidth: '900px'
            }}>
              A preview of current research and simulations in development — from advanced multiphase flows to novel solver implementations.
            </p>
          </div>

          {/* Page Navigation */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '24px',
              flexShrink: 0
            }}>
              <button
                onClick={() => scrollToPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: currentPage === 0 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === 0 ? 0.3 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToPage(idx)}
                    style={{
                      width: idx === currentPage ? '52px' : '36px',
                      height: '7px',
                      borderRadius: '4px',
                      background: idx === currentPage ? 'hsl(var(--accent))' : 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: idx === currentPage ? '0 0 12px hsl(var(--accent) / 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollToPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: currentPage === totalPages - 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Horizontal Scroll Container */}
          <div 
            ref={scrollContainerRef}
            style={{
              flex: 1,
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              display: 'flex',
              WebkitOverflowScrolling: 'touch',
              minHeight: 0
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                style={{
                  minWidth: '100%',
                  width: '100%',
                  height: '100%',
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '24px',
                  width: '100%',
                  height: '100%',
                  maxHeight: '720px'
                }}>
                  {upcomingProjects
                    .slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE)
                    .map((project) => (
                      <UpcomingCard 
                        key={project.id} 
                        project={project} 
                        onClick={() => setSelectedProject(project)} 
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <UpcomingModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        div::-webkit-scrollbar {
          display: none;
        }

        .upcoming-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
        }

        .upcoming-cta:hover {
          background: ${upcomingProjects[0]?.color}20 !important;
          border-color: ${upcomingProjects[0]?.color}50 !important;
        }

        .upcoming-cta:hover .arrow-icon {
          transform: translateX(4px);
        }

        .challenge-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }

        button:not(:disabled):hover {
          background: rgba(255, 255, 255, 0.15) !important;
          transform: scale(1.1);
        }

        @media (max-width: 1200px) {
          div[style*="grid-template-columns: repeat(2, 1fr)"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}
