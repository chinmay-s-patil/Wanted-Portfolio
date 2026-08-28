import React, { useEffect, useRef } from 'react'

/**
 * PageInspectorModal Component
 *
 * Popup UI overlay allowing the user to examine scattered detective document pages
 * up close when clicked in the 3D lounge.
 */
export default function PageInspectorModal({ inspectedPage, onClose }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!inspectedPage || !canvasRef.current) return

    // Draw texture canvas onto modal preview canvas
    const sourceTexture = inspectedPage.texture
    if (sourceTexture && sourceTexture.image) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(sourceTexture.image, 0, 0, canvas.width, canvas.height)
    }
  }, [inspectedPage])

  if (!inspectedPage) return null

  const { item } = inspectedPage

  return (
    <div className="page-inspector-backdrop" onClick={onClose}>
      <style>{`
        .page-inspector-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(8, 11, 16, 0.85);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pageModalFadeIn 0.25s ease-out;
        }

        @keyframes pageModalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }

        .page-inspector-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          width: 90%;
          max-width: 480px;
          padding: 1.5rem;
          color: #c9d1d9;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .page-inspector-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(48, 54, 61, 0.8);
          padding-bottom: 0.75rem;
        }

        .page-inspector-title {
          font-weight: 700;
          font-size: 1.05rem;
          color: #ffea9f;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .page-inspector-close {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #8b949e;
          font-size: 1.2rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .page-inspector-close:hover {
          background: rgba(255, 85, 85, 0.2);
          color: #ff5555;
        }

        .page-canvas-preview {
          width: 240px;
          height: 320px;
          border-radius: 4px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: #0d1117;
        }

        .page-inspector-meta {
          width: 100%;
          background: rgba(13, 17, 23, 0.6);
          border-radius: 8px;
          padding: 0.85rem;
          font-size: 0.82rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .page-inspector-meta-row {
          display: flex;
          justify-content: space-between;
        }

        .page-inspector-meta-label {
          color: #8b949e;
        }

        .page-inspector-meta-val {
          color: #58a6ff;
          font-weight: 600;
        }
      `}</style>

      <div className="page-inspector-card" onClick={(e) => e.stopPropagation()}>
        <div className="page-inspector-header">
          <div className="page-inspector-title">
            <span>🕵️</span> {item.title || 'Scattered Evidence Page'}
          </div>
          <button className="page-inspector-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <canvas ref={canvasRef} width={512} height={680} className="page-canvas-preview" />

        <div className="page-inspector-meta">
          <div className="page-inspector-meta-row">
            <span className="page-inspector-meta-label">Render Profile:</span>
            <span className="page-inspector-meta-val">Super Low Poly (Procedural Canvas)</span>
          </div>
          <div className="page-inspector-meta-row">
            <span className="page-inspector-meta-label">Geometry:</span>
            <span className="page-inspector-meta-val">{item.geoType.toUpperCase()} (Curved Plane)</span>
          </div>
          <div className="page-inspector-meta-row">
            <span className="page-inspector-meta-label">Performance Impact:</span>
            <span className="page-inspector-meta-val" style={{ color: '#38ef7d' }}>0ms Latency (60 FPS)</span>
          </div>
        </div>

        <button
          className="hub-v2-btn"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={onClose}
        >
          Return to Precinct Lounge
        </button>
      </div>
    </div>
  )
}
