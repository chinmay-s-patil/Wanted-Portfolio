'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

export default function HubPage() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const router = useRouter()

  // Memoize hub items to prevent recreation on every render
  const hubItems = useMemo(() => [
    { id: 'landing', label: 'Landing', theme: 'Map Spread on a Table', icon: '🗺️', path: '/' },
    { id: 'education', label: 'Education', theme: 'Lockers', icon: '🔒', path: '/education' },
    { id: 'professionaldiary', label: 'Professional Timeline', theme: 'Diary', icon: '📔', path: '/timeline' },
    { id: 'projects', label: 'Projects', theme: 'Police-like Archive Drawers', icon: '🗄️', path: '/projects' },
    { id: 'openfoam', label: 'OpenFOAM', theme: 'Bookshelf', icon: '📚', path: '/openfoam' },
    { id: 'cad', label: 'CAD', theme: 'CRT', icon: '🖥️', path: '/cad' },
    { id: 'visualization', label: 'Visualization', theme: 'Computer', icon: '💻', path: '/visualization' },
    { id: 'events', label: 'Events', theme: 'Photo Reels', icon: '🎞️', path: '/events' },
    { id: 'upcoming', label: 'Upcoming', theme: 'Robot?', icon: '🤖', path: '/upcoming' },
  ], [])

  const handleClick = (path) => {
    router.push(path)
  }

  return (
    <div className="hub-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .hub-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Special Elite', monospace;
          overflow: auto;
          position: relative;
        }

        .hub-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: #f6efe2;
          margin-bottom: 3rem;
          text-align: center;
          text-shadow: 0 4px 12px rgba(0,0,0,0.8);
          letter-spacing: 2px;
        }

        .hub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1400px;
          width: 100%;
          padding: 1rem;
        }

        .hub-card {
          background: linear-gradient(135deg, rgba(196, 165, 116, 0.15), rgba(61, 40, 23, 0.2));
          border: 3px solid #8b7355;
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          will-change: transform;
        }

        .hub-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(246, 239, 226, 0.1), transparent);
          transition: left 0.5s;
        }

        .hub-card:hover::before {
          left: 100%;
        }

        .hub-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: #c4a574;
          box-shadow: 0 16px 48px rgba(196, 165, 116, 0.3);
          background: linear-gradient(135deg, rgba(196, 165, 116, 0.25), rgba(61, 40, 23, 0.3));
        }

        .hub-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
          text-align: center;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }

        .hub-label {
          font-size: 1.5rem;
          color: #f6efe2;
          text-align: center;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .hub-theme {
          font-size: 0.9rem;
          color: #c4a574;
          text-align: center;
          font-style: italic;
          opacity: 0.8;
        }

        .hub-back {
          position: fixed;
          top: 2rem;
          left: 2rem;
          background: rgba(196, 165, 116, 0.2);
          border: 2px solid #8b7355;
          color: #f6efe2;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: 'Special Elite', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          z-index: 100;
        }

        .hub-back:hover {
          background: rgba(196, 165, 116, 0.3);
          border-color: #c4a574;
          transform: translateX(-4px);
        }

        @media (max-width: 768px) {
          .hub-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .hub-card {
            padding: 1.5rem;
          }

          .hub-icon {
            font-size: 3rem;
          }

          .hub-label {
            font-size: 1.2rem;
          }

          .hub-back {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <button className="hub-back" onClick={() => router.push('/')}>
        ← Back to Landing
      </button>

      <h1 className="hub-title">Investigation Hub</h1>

      <div className="hub-grid">
        {hubItems.map((item) => (
          <div
            key={item.id}
            className="hub-card"
            onClick={() => handleClick(item.path)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="hub-icon">{item.icon}</span>
            <div className="hub-label">{item.label}</div>
            <div className="hub-theme">{item.theme}</div>
          </div>
        ))}
      </div>
    </div>
  )
}