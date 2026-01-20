// src/components/OpenFoamBookshelf/OpenFoamBookshelf.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './OpenFoamBookshelf.module.css';

// Individual Book Spine Component
const BookSpine = React.memo(({ book, onOpen, isActive, style }) => {
  const spineRef = useRef(null);
  
  const handleClick = useCallback(() => {
    onOpen(book.id);
  }, [book.id, onOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(book.id);
    }
  }, [book.id, onOpen]);

  // Prefetch hero image on hover
  const handleMouseEnter = useCallback(() => {
    if (book.media?.hero) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = book.media.hero;
      document.head.appendChild(link);
    }
  }, [book.media?.hero]);

  return (
    <button
      ref={spineRef}
      className={`${styles.bookSpine} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      aria-expanded={isActive}
      aria-label={`${book.title} - ${book.year}`}
      style={style}
    >
      <div className={styles.spineContent}>
        <div className={styles.spineTitle}>{book.shortTitle || book.title}</div>
        <div className={styles.spineYear}>{book.year}</div>
        {book.tags && book.tags[0] && (
          <div className={styles.spineTag}>{book.tags[0]}</div>
        )}
      </div>
    </button>
  );
});

// Virtual Shelf Component
const Shelf = React.memo(({ shelfId, books, onBookOpen, openBookId }) => {
  const [scrollIndex, setScrollIndex] = useState(0);
  const booksPerView = 4; // Configurable based on screen width
  
  // Calculate visible books
  const visibleBooks = books.slice(scrollIndex, scrollIndex + booksPerView);
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex < books.length - booksPerView;

  const scrollLeft = useCallback(() => {
    if (canScrollLeft) {
      setScrollIndex(prev => Math.max(0, prev - 1));
    }
  }, [canScrollLeft]);

  const scrollRight = useCallback(() => {
    if (canScrollRight) {
      setScrollIndex(prev => Math.min(books.length - booksPerView, prev + 1));
    }
  }, [canScrollRight, books.length]);

  // Keyboard navigation within shelf
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') scrollLeft();
      if (e.key === 'ArrowRight') scrollRight();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollLeft, scrollRight]);

  return (
    <div className={styles.shelfContainer}>
      <div className={styles.shelfLabel}>{shelfId}</div>
      <div className={styles.shelf}>
        <button
          className={`${styles.shelfArrow} ${styles.left} ${!canScrollLeft ? styles.disabled : ''}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          ‹
        </button>
        
        <div className={styles.booksRow}>
          {visibleBooks.map((book, index) => (
            <BookSpine
              key={book.id}
              book={book}
              onOpen={onBookOpen}
              isActive={openBookId === book.id}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
        
        <button
          className={`${styles.shelfArrow} ${styles.right} ${!canScrollRight ? styles.disabled : ''}`}
          onClick={scrollRight}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          ›
        </button>
      </div>
    </div>
  );
});

// Lazy-loaded Media Components
const ModelViewer = React.lazy(() => import('./ModelViewer'));
const VideoPlayer = React.lazy(() => import('./VideoPlayer'));

// Project Card Component
const ProjectCard = React.memo(({ book, onClose }) => {
  const cardRef = useRef(null);
  const [activeMedia, setActiveMedia] = useState(null); // 'image', 'video', 'model'
  
  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Focus management
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus();
    }
  }, []);

  const handleImageClick = useCallback(() => {
    setActiveMedia('image');
  }, []);

  const handleVideoClick = useCallback(() => {
    setActiveMedia('video');
  }, []);

  const handleModelClick = useCallback(() => {
    setActiveMedia('model');
  }, []);

  const [isExpanded, setIsExpanded] = useState({});

  const toggleSection = useCallback((section) => {
    setIsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  return (
    <div 
      className={styles.cardOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div 
        className={styles.projectCard}
        onClick={(e) => e.stopPropagation()}
        ref={cardRef}
        tabIndex={-1}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close project details"
        >
          ×
        </button>
        
        <div className={styles.cardContent}>
          <div className={styles.leftColumn}>
            {/* Hero Image */}
            {book.media?.hero && activeMedia !== 'video' && activeMedia !== 'model' && (
              <img 
                src={book.media.hero} 
                alt={book.title}
                className={styles.heroImage}
                onClick={handleImageClick}
              />
            )}
            
            {/* Media Strip */}
            <div className={styles.mediaStrip}>
              {book.media?.images && (
                <button 
                  className={styles.mediaThumb}
                  onClick={handleImageClick}
                  aria-label="View images"
                >
                  <img src={book.media.images[0]} alt="Gallery" />
                  <span>Images</span>
                </button>
              )}
              
              {book.media?.videoUrl && (
                <button 
                  className={styles.mediaThumb}
                  onClick={handleVideoClick}
                  aria-label="Play video"
                >
                  {book.media.videoPoster ? (
                    <img src={book.media.videoPoster} alt="Video preview" />
                  ) : (
                    <div className={styles.videoPlaceholder}>▶</div>
                  )}
                  <span>Video</span>
                </button>
              )}
              
              {book.media?.model3d && (
                <button 
                  className={styles.mediaThumb}
                  onClick={handleModelClick}
                  aria-label="Open 3D model"
                >
                  <div className={styles.modelBadge}>3D</div>
                  <span>Model</span>
                </button>
              )}
            </div>
            
            {/* Lazy-loaded Media Components */}
            <React.Suspense fallback={<div className={styles.mediaLoading}>Loading...</div>}>
              {activeMedia === 'video' && book.media?.videoUrl && (
                <VideoPlayer 
                  videoUrl={book.media.videoUrl}
                  poster={book.media.videoPoster}
                />
              )}
              
              {activeMedia === 'model' && book.media?.model3d && (
                <ModelViewer 
                  modelPath={book.media.model3d}
                  onDispose={onClose}
                />
              )}
            </React.Suspense>
          </div>
          
          <div className={styles.rightColumn}>
            <h1 id="project-title" className={styles.projectTitle}>
              {book.title}
            </h1>
            
            <div className={styles.projectMeta}>
              <span className={styles.year}>{book.year}</span>
              <div className={styles.tags}>
                {book.tags && book.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>
            
            <div className={styles.tldr}>
              <h3>TL;DR</h3>
              <div className={styles.tldrGrid}>
                <div>
                  <strong>Problem →</strong>
                  <p>{book.summary}</p>
                </div>
                <div>
                  <strong>Approach →</strong>
                  <p>{book.approach}</p>
                </div>
                <div>
                  <strong>Result →</strong>
                  <p>{book.result}</p>
                </div>
              </div>
            </div>
            
            {book.metrics && (
              <div className={styles.metrics}>
                {book.metrics.map((metric, idx) => (
                  <div key={idx} className={styles.metricBadge}>{metric}</div>
                ))}
              </div>
            )}
            
            <div className={styles.actions}>
              {book.artifacts?.map((artifact, idx) => (
                <a 
                  key={idx}
                  href={artifact.url}
                  className={styles.actionButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artifact.label}
                </a>
              ))}
            </div>
            
            {/* Expandable Sections */}
            {book.details && Object.entries(book.details).map(([key, content]) => (
              <div key={key} className={styles.detailSection}>
                <button
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(key)}
                  aria-expanded={isExpanded[key]}
                >
                  <h4>{key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                  <span className={`${styles.chevron} ${isExpanded[key] ? styles.expanded : ''}`}>▼</span>
                </button>
                {isExpanded[key] && (
                  <div className={styles.sectionContent}>
                    <p>{content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

// Main Bookshelf Component
const OpenFoamBookshelf = ({ data }) => {
  const [openBookId, setOpenBookId] = useState(null);
  
  const handleBookOpen = useCallback((bookId) => {
    setOpenBookId(bookId);
  }, []);
  
  const handleBookClose = useCallback(() => {
    setOpenBookId(null);
  }, []);
  
  const openBook = openBookId ? data.books.find(b => b.id === openBookId) : null;

  return (
    <div className={styles.bookshelf}>
      <header className={styles.header}>
        <h1>OpenFOAM Cases</h1>
        <p>A tactile archive of computational fluid dynamics projects</p>
      </header>
      
      <div className={styles.shelvesContainer}>
        {Object.entries(data.shelves).map(([shelfId, shelfData]) => (
          <Shelf
            key={shelfId}
            shelfId={shelfId}
            books={shelfData.books.map(id => data.books.find(b => b.id === id)).filter(Boolean)}
            onBookOpen={handleBookOpen}
            openBookId={openBookId}
          />
        ))}
      </div>
      
      {openBook && (
        <ProjectCard 
          book={openBook} 
          onClose={handleBookClose}
        />
      )}
    </div>
  );
};

export default OpenFoamBookshelf;