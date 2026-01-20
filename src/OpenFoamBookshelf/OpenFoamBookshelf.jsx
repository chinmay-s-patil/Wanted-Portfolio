// OpenFoamBookshelf.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './OpenFoamBookshelf.module.css';

// Tag filter component
const TagFilter = ({ tags, activeTag, onTagSelect }) => {
  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${!activeTag ? styles.active : ''}`}
        onClick={() => onTagSelect(null)}
      >
        All Cases
      </button>
      {tags.map(tag => (
        <button
          key={tag}
          className={`${styles.filterButton} ${activeTag === tag ? styles.active : ''}`}
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

// Book Spine Component - completely redesigned for realistic look
const BookSpine = React.memo(({ book, onOpen, isActive }) => {
  const spineRef = useRef(null);
  
  const handleClick = useCallback(() => {
    onOpen(book.id);
  }, [book.id, onOpen]);

  // Generate a subtle color based on book title for visual variety
  const bookColor = useMemo(() => {
    const colors = [
      'linear-gradient(180deg, #2a3f5f 0%, #1e2e4a 100%)',
      'linear-gradient(180deg, #3f2a2a 0%, #4a1e1e 100%)',
      'linear-gradient(180deg, #2a3f2a 0%, #1e4a1e 100%)',
      'linear-gradient(180deg, #3f3f2a 0%, #4a4a1e 100%)',
      'linear-gradient(180deg, #2f2a3f 0%, #2e1e4a 100%)',
      'linear-gradient(180deg, #3f2f2a 0%, #4a2e1e 100%)'
    ];
    const hash = book.title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }, [book.title]);

  return (
    <button
      ref={spineRef}
      className={`${styles.bookSpine} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      aria-label={`${book.title} - ${book.year}`}
      style={{ '--book-color': bookColor }}
    >
      <div className={styles.spineInner}>
        <div className={styles.spineTitle}>{book.shortTitle || book.title}</div>
        <div className={styles.spineYear}>{book.year}</div>
        <div className={styles.spineTag}>{book.tags[0]}</div>
      </div>
    </button>
  );
});

// Shelf Component - now shows a realistic shelf
const Shelf = React.memo(({ books, onBookOpen, openBookId }) => {
  return (
    <div className={styles.shelfContainer}>
      <div className={styles.shelfWood}>
        <div className={styles.shelfSurface}></div>
        <div className={styles.shelfFront}></div>
      </div>
      <div className={styles.booksContainer}>
        {books.map((book) => (
          <BookSpine
            key={book.id}
            book={book}
            onOpen={onBookOpen}
            isActive={openBookId === book.id}
          />
        ))}
      </div>
    </div>
  );
});

// Project Card Component (simplified for this example)
const ProjectCard = React.memo(({ book, onClose }) => {
  return (
    <div className={styles.cardOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.projectCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.cardContent}>
          <h1>{book.title}</h1>
          <p>{book.summary}</p>
        </div>
      </div>
    </div>
  );
});

// Main Bookshelf Component
const OpenFoamBookshelf = ({ data }) => {
  const [openBookId, setOpenBookId] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  
  // Extract all unique tags for filtering
  const allTags = useMemo(() => {
    const tagSet = new Set();
    data.books.forEach(book => book.tags?.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [data.books]);

  // Filter books based on active tag
  const filteredBooks = useMemo(() => {
    if (!activeTag) return data.books;
    return data.books.filter(book => book.tags?.includes(activeTag));
  }, [data.books, activeTag]);

  // Just take the first shelf's name for the header since we show all books together now
  const shelfTitle = Object.keys(data.shelves)[0] || "OpenFOAM Cases";

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
        <h1>OpenFOAM Library</h1>
        <p>{shelfTitle} • {filteredBooks.length} Cases</p>
      </header>
      
      <TagFilter tags={allTags} activeTag={activeTag} onTagSelect={setActiveTag} />
      
      <div className={styles.mainContainer}>
        <Shelf
          books={filteredBooks.slice(0, 4)} // Show max 4 books as requested
          onBookOpen={handleBookOpen}
          openBookId={openBookId}
        />
      </div>
      
      {openBook && (
        <ProjectCard book={openBook} onClose={handleBookClose} />
      )}
    </div>
  );
};

export default OpenFoamBookshelf;