import React, { useState, useCallback } from 'react';

import simulationsList from './OpenfoamList';



const BookSpine = ({ book, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '80px',
        height: '280px',
        background: `linear-gradient(135deg, ${book.color}dd 0%, ${book.color}88 100%)`,
        border: '2px solid rgba(0, 0, 0, 0.3)',
        borderLeft: '4px solid rgba(0, 0, 0, 0.5)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: 'inset -2px 0 8px rgba(0, 0, 0, 0.3), 2px 4px 12px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 8px',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px)';
        e.currentTarget.style.boxShadow = 'inset -2px 0 8px rgba(0, 0, 0, 0.3), 2px 8px 20px rgba(0, 0, 0, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'inset -2px 0 8px rgba(0, 0, 0, 0.3), 2px 4px 12px rgba(0, 0, 0, 0.4)';
      }}
    >
      {/* Title */}
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: '#fff',
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
        marginBottom: '12px',
        letterSpacing: '0.5px'
      }}>
        {book.title}
      </div>
      
      {/* Year */}
      <div style={{
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 'auto',
        fontWeight: '500'
      }}>
        {book.year}
      </div>
      
      {/* Decorative line */}
      <div style={{
        width: '2px',
        height: '30px',
        background: 'rgba(255, 255, 255, 0.2)',
        margin: '8px 0'
      }} />
    </div>
  );
};

const BlurredShelf = ({ position }) => {
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [position]: 0,
      height: '35vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'blur(8px)',
      opacity: 0.3,
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '0 80px'
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            style={{
              width: '60px',
              height: '220px',
              background: `linear-gradient(135deg, rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 50}, ${Math.random() * 100}, 0.6), rgba(${Math.random() * 80}, ${Math.random() * 80}, ${Math.random() * 80}, 0.4))`,
              border: '1px solid rgba(0, 0, 0, 0.2)',
              boxShadow: 'inset -1px 0 4px rgba(0, 0, 0, 0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function OpenFOAMBookshelf() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [shelfIndex, setShelfIndex] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);

  const solvers = ['all', ...new Set(simulationsList.map(s => s.solver))];
  
  const filteredSimulations = activeFilter === 'all' 
    ? simulationsList 
    : simulationsList.filter(s => s.solver === activeFilter);
  
  const BOOKS_PER_SHELF = 5;
  const totalShelves = Math.ceil(filteredSimulations.length / BOOKS_PER_SHELF);
  
  const currentShelfBooks = filteredSimulations.slice(
    shelfIndex * BOOKS_PER_SHELF,
    (shelfIndex + 1) * BOOKS_PER_SHELF
  );

  const navigateUp = useCallback(() => {
    setShelfIndex((prev) => (prev - 1 + totalShelves) % totalShelves);
  }, [totalShelves]);

  const navigateDown = useCallback(() => {
    setShelfIndex((prev) => (prev + 1) % totalShelves);
  }, [totalShelves]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1410 0%, #0f0d0a 100%)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: "'Crimson Text', serif"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap');
      `}</style>

      {/* Background texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          color: '#f4e8d0',
          margin: '0 0 12px 0',
          textShadow: '0 4px 12px rgba(0, 0, 0, 0.8)',
          letterSpacing: '2px'
        }}>
          OpenFOAM Archive
        </h1>
        <div style={{
          width: '200px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #c4a574, transparent)',
          margin: '0 auto'
        }} />
      </div>

      {/* Solver Filters */}
      <div style={{
        position: 'absolute',
        top: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '12px',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '800px'
      }}>
        {solvers.map((solver) => (
          <button
            key={solver}
            onClick={() => {
              setActiveFilter(solver);
              setShelfIndex(0);
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              background: activeFilter === solver
                ? 'rgba(196, 165, 116, 0.3)'
                : 'rgba(61, 40, 23, 0.3)',
              border: activeFilter === solver
                ? '2px solid #c4a574'
                : '2px solid rgba(196, 165, 116, 0.2)',
              color: activeFilter === solver ? '#f4e8d0' : '#c4a574',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            {solver}
          </button>
        ))}
      </div>

      {/* Blurred top shelf */}
      <BlurredShelf position="top" />

      {/* Main shelf area */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        zIndex: 5
      }}>
        {/* Shelf number indicator */}
        <div style={{
          fontSize: '14px',
          color: '#8b7355',
          fontWeight: '600',
          letterSpacing: '1px'
        }}>
          Shelf {shelfIndex + 1} of {totalShelves}
        </div>

        {/* Books container */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          padding: '20px 40px',
          background: 'linear-gradient(180deg, rgba(61, 40, 23, 0.4) 0%, rgba(30, 20, 10, 0.6) 100%)',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 -4px 8px rgba(0, 0, 0, 0.3)',
          position: 'relative'
        }}>
          {/* Shelf wood texture */}
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            left: '-20px',
            right: '-20px',
            height: '24px',
            background: 'linear-gradient(180deg, #3d2817 0%, #2a1a10 100%)',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(0, 0, 0, 0.4)',
            borderTop: 'none'
          }} />

          {currentShelfBooks.map((book) => (
            <BookSpine
              key={book.id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={navigateUp}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(61, 40, 23, 0.5)',
              border: '2px solid #8b7355',
              color: '#f4e8d0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.8)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.5)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ↑
          </button>

          <button
            onClick={navigateDown}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(61, 40, 23, 0.5)',
              border: '2px solid #8b7355',
              color: '#f4e8d0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.8)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(61, 40, 23, 0.5)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ↓
          </button>
        </div>
      </div>

      {/* Blurred bottom shelf */}
      <BlurredShelf position="bottom" />

      {/* Simple modal for selected book */}
      {selectedBook && (
        <div
          onClick={() => setSelectedBook(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '40px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #f6efe2 0%, #e8dcc8 100%)',
              padding: '40px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '100%',
              border: '8px solid #3d2817',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setSelectedBook(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#3d2817',
                color: '#f6efe2',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            <h2 style={{
              fontSize: '32px',
              color: '#1a1a1a',
              marginBottom: '16px'
            }}>
              {selectedBook.title}
            </h2>
            
            <div style={{
              fontSize: '16px',
              color: '#5d4a2a',
              marginBottom: '8px'
            }}>
              <strong>Solver:</strong> {selectedBook.solver}
            </div>
            
            <div style={{
              fontSize: '16px',
              color: '#5d4a2a',
              marginBottom: '8px'
            }}>
              <strong>Year:</strong> {selectedBook.year}
            </div>
            
            <div style={{
              fontSize: '16px',
              color: '#5d4a2a',
              marginBottom: '8px'
            }}>
              <strong>Turbulence Model:</strong> {selectedBook.specs.turbulence}
            </div>
            
            <p style={{
              fontSize: '16px',
              color: '#2a2a2a',
              lineHeight: '1.6',
              marginTop: '20px'
            }}>
              {selectedBook.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              {selectedBook.tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    padding: '6px 12px',
                    background: `${selectedBook.color}20`,
                    border: `2px solid ${selectedBook.color}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#1a1a1a',
                    fontWeight: '600'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}