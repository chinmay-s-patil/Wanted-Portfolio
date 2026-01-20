import { useState, useEffect, useRef } from 'react'

function UpcomingCard({ project, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      className="upcoming-card"
    >
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        padding: '6px 12px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        color: project.color,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: `1px solid ${project.color}60`,
        zIndex: 10
      }}>
        {project.status}
      </div>

      {/* Icon/Preview Area */}
      <div style={{
        width: '100%',
        height: '200px',
        background: `linear-gradient(135deg, ${project.color}20, rgba(0, 0, 0, 0.4))`,
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Large Icon */}
        <div style={{
          fontSize: '80px',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          animation: 'float 3s ease-in-out infinite'
        }}>
          {project.icon}
        </div>

        {/* Category Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          padding: '6px 12px',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          color: project.color,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          border: `1px solid ${project.color}60`
        }}>
          {project.category}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ 
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '12px',
          color: '#fff',
          lineHeight: '1.3'
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '16px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project.description}
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.7)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Progress
            </span>
            <span style={{
              fontSize: '14px',
              fontWeight: '700',
              color: project.color,
              fontFamily: 'monospace'
            }}>
              {project.progress}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${project.progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${project.color}, ${project.color}CC)`,
              borderRadius: '3px',
              transition: 'width 0.3s ease',
              boxShadow: `0 0 8px ${project.color}60`
            }} />
          </div>
        </div>

        {/* Solver Badge */}
        <div style={{
          padding: '8px 12px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '4px'
          }}>
            Solver
          </div>
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: project.color,
            fontFamily: 'monospace'
          }}>
            {project.solver}
          </div>
        </div>

        {/* View Details Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: `${project.color}10`,
          borderRadius: '8px',
          border: `1px solid ${project.color}30`,
          transition: 'all 0.2s ease'
        }}
        className="upcoming-cta">
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: project.color
          }}>
            View Details
          </span>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
            style={{ transition: 'transform 0.2s ease' }}
            className="arrow-icon"
          >
            <path 
              d="M5 12h14M12 5l7 7-7 7" 
              stroke={project.color} 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
};

export default UpcomingCard;