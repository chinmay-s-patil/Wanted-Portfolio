import React from 'react'
import { hubItems } from './hubData'

export default function CaseNotes({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null

  return (
    <div className="case-notes-overlay" onClick={onClose}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        
        .case-notes-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 13, 10, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .case-notes-panel {
          background: linear-gradient(135deg, #2a2018 0%, #1a1410 100%);
          border: 3px solid #8b7355;
          border-radius: 8px;
          padding: 2.5rem;
          max-width: 480px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .case-notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid #8b7355;
          padding-bottom: 1rem;
        }
        
        .case-notes-title {
          font-family: 'Special Elite', monospace;
          color: #f6efe2;
          font-size: 1.5rem;
          margin: 0;
          letter-spacing: 2px;
        }
        
        .case-notes-close {
          background: rgba(196, 165, 116, 0.2);
          border: 2px solid #8b7355;
          color: #f6efe2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-family: 'Special Elite', monospace;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .case-notes-close:hover {
          background: rgba(196, 165, 116, 0.4);
          border-color: #c4a574;
          transform: rotate(90deg);
        }
        
        .case-notes-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .case-notes-item {
          margin-bottom: 0.5rem;
        }
        
        .case-notes-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(196, 165, 116, 0.08);
          border: 1px solid transparent;
          border-radius: 6px;
          color: #f6efe2;
          font-family: 'Special Elite', monospace;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          width: 100%;
          text-align: left;
        }
        
        .case-notes-link:hover {
          background: rgba(196, 165, 116, 0.2);
          border-color: #c4a574;
          transform: translateX(4px);
        }
        
        .case-notes-icon {
          font-size: 1.3rem;
          width: 2rem;
          text-align: center;
        }
        
        .case-notes-label {
          flex: 1;
        }
        
        .case-notes-theme {
          color: #c4a574;
          font-size: 0.8rem;
          font-style: italic;
        }
      `}</style>
      
      <div className="case-notes-panel" onClick={(e) => e.stopPropagation()}>
        <div className="case-notes-header">
          <h2 className="case-notes-title">CASE NOTES</h2>
          <button className="case-notes-close" onClick={onClose}>×</button>
        </div>
        <ul className="case-notes-list">
          {hubItems.map((item) => (
            <li key={item.id} className="case-notes-item">
              <button 
                className="case-notes-link" 
                onClick={() => onNavigate(item.path)}
              >
                <span className="case-notes-icon">{item.icon}</span>
                <span className="case-notes-label">{item.label}</span>
                <span className="case-notes-theme">{item.theme}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
