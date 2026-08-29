'use client';

import { useState, useEffect, useCallback } from 'react';
import diaryEntries from './diaryList';
import ViewportScaleStage from '../common/ViewportScaleStage';

export default function ProfessionalDiary() {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [targetEntryIndex, setTargetEntryIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' | 'prev'
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [modalType, setModalType] = useState(null); // 'future' | 'past' | null

  const currentEntry = diaryEntries[currentEntryIndex];
  const isLastEntry = currentEntryIndex === diaryEntries.length - 1;

  const navigateTo = useCallback((direction) => {
    if (isFlipping) return;

    if (direction === 'next') {
      if (isLastEntry) {
        setModalType('past');
        return;
      }
      const nextIdx = currentEntryIndex + 1;
      setTargetEntryIndex(nextIdx);
      setFlipDirection('next');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentEntryIndex(nextIdx);
        setCurrentPhotoIndex(0);
        setIsFlipping(false);
      }, 580);
    } else {
      if (currentEntryIndex === 0) {
        setModalType('future');
        return;
      }
      const prevIdx = currentEntryIndex - 1;
      setTargetEntryIndex(prevIdx);
      setFlipDirection('prev');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentEntryIndex(prevIdx);
        setCurrentPhotoIndex(0);
        setIsFlipping(false);
      }, 580);
    }
  }, [isFlipping, isLastEntry, currentEntryIndex]);

  useEffect(() => {
    if (!currentEntry?.photos?.length) return;
    const timer = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev + 1) % currentEntry.photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentEntry?.photos]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') navigateTo('prev');
      else if (e.key === 'ArrowRight') navigateTo('next');
      else if (e.key === 'Escape') setModalType(null);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigateTo]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const getStampColor = (type) => {
    switch (type) {
      case 'Full-time': return 'stamp-fulltime';
      case 'Internship': return 'stamp-internship';
      case 'Research': return 'stamp-research';
      default: return 'stamp-default';
    }
  };

  const bookmarkColors = ['#8B4513', '#556B2F', '#4A6741', '#6B4C3B', '#5D4E37'];

  // Helper renderers for Left and Right page content
  const renderLeftPageContent = (entry) => {
    if (!entry) return null;
    return (
      <div className="left-page lined-paper">
        <div className="margin-line" />

        <h1 className="org-name">{entry.organization}</h1>
        <div className="role-title">{entry.role}</div>

        <div className="meta-row">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {entry.location}
        </div>
        <div className="meta-row">
          <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="10"/></svg>
          {entry.dates.start} — {entry.dates.end}
        </div>

        <div className="stamp-container">
          <span className={`stamp ${getStampColor(entry.type)}`}>{entry.type}</span>
        </div>

        <div className="summary-text">{entry.summary}</div>

        {entry.tools && entry.tools.length > 0 && (
          <div className="tools-section">
            <div className="tools-label">Tools & Technologies</div>
            <div className="tools-list">
              {entry.tools.map((tool, i) => (
                <span key={i} className="tool-tag">{tool}</span>
              ))}
            </div>
          </div>
        )}

        <div className="field-notes-header">Field Notes</div>
        <div className="notes-list">
          {entry.notes && entry.notes.map((note, i) => (
            <div key={i} className="note-item">{note}</div>
          ))}
        </div>
      </div>
    );
  };

  const renderRightPageContent = (entry, activePhotoIdx, setPhotoIdx) => {
    if (!entry) return null;
    return (
      <div className="right-page">
        {entry.photos && entry.photos.length > 0 && (
          <>
            <div className="gallery-label">Project Gallery</div>
            <div className="polaroid-container">
              <div className="polaroid-frame">
                <div className="polaroid-img-wrapper">
                  {entry.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt={`${entry.organization} photo ${i + 1}`}
                      className={`polaroid-img ${i === activePhotoIdx ? 'active' : ''}`}
                      loading="lazy"
                    />
                  ))}
                  <div className="photo-counter">{activePhotoIdx + 1} / {entry.photos.length}</div>
                </div>
                <div className="polaroid-caption">{entry.dates.start} — {entry.organization}</div>
              </div>
              <div className="thumb-strip">
                {entry.photos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt=""
                    className={`thumb ${i === activePhotoIdx ? 'active' : ''}`}
                    onClick={() => setPhotoIdx && setPhotoIdx(i)}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>

            {entry.insight && (
              <div className="insight-box">
                <div className="insight-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  Key Insight
                </div>
                <p className="insight-text">{entry.insight}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <ViewportScaleStage>
      <div className="diary-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');

          :root {
            --leather-dark: #1a0f08;
            --leather-mid: #2a1a10;
            --leather-light: #3d2817;
            --paper-base: #f4e8d0;
            --paper-light: #f9f3e9;
            --paper-aged: #e8d9bc;
            --ink-dark: #2a1a10;
            --ink-mid: #5d4a2a;
            --ink-light: #7a6a55;
            --accent-gold: #c4a574;
            --accent-warm: #8b7355;
          }

          .diary-container {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0d0906 0%, #1a0f08 40%, #0d0906 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            font-family: 'Crimson Text', serif;
          }

        .diary-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04 0.008' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23wood)' opacity='0.08'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .diary-container::after {
          content: '';
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 60%;
          background: radial-gradient(ellipse, rgba(196, 165, 116, 0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .back-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          z-index: 50;
          background: linear-gradient(135deg, var(--leather-light) 0%, var(--leather-mid) 100%);
          color: var(--paper-base);
          border: 1px solid var(--accent-warm);
          padding: 0.7rem 1.4rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Courier Prime', monospace;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .back-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15);
          border-color: var(--accent-gold);
        }

        .book-wrapper {
          width: 90%;
          max-width: 1280px;
          height: 82vh;
          max-height: 750px;
          position: relative;
          z-index: 1;
          perspective: 2500px;
        }

        .book-cover {
          position: absolute;
          top: -14px;
          left: -14px;
          right: -14px;
          bottom: -14px;
          background: linear-gradient(145deg, #3d2817 0%, #2a1a10 25%, #1e120a 60%, #2a1a10 100%);
          border-radius: 10px 28px 28px 10px;
          box-shadow:
            inset 0 0 40px rgba(0,0,0,0.8),
            0 20px 60px rgba(0,0,0,0.7),
            0 0 0 1px rgba(74, 48, 32, 0.6);
          z-index: -1;
          overflow: hidden;
        }
        .book-cover::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23leather)' opacity='0.25'/%3E%3C/svg%3E");
          opacity: 0.5;
        }
        .book-cover::after {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px solid rgba(139, 115, 85, 0.3);
          border-radius: 6px 22px 22px 6px;
          pointer-events: none;
        }

        .cover-emboss {
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(139, 115, 85, 0.15);
          border-radius: 4px 18px 18px 4px;
          pointer-events: none;
        }

        .pages-container {
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, #f4e8d0 0%, #f9f3e9 49.5%, #e8d9bc 49.5%, #e8d9bc 50.5%, #f9f3e9 50.5%, #f4e8d0 100%);
          border-radius: 2px 10px 10px 2px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 30px rgba(139, 69, 19, 0.08);
          transform-style: preserve-3d;
        }

        .paper-texture {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.12'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
        }

        .spine-shadow {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 40px;
          transform: translateX(-50%);
          background: linear-gradient(to right,
            transparent 0%,
            rgba(0,0,0,0.06) 20%,
            rgba(0,0,0,0.12) 45%,
            rgba(0,0,0,0.15) 50%,
            rgba(0,0,0,0.12) 55%,
            rgba(0,0,0,0.06) 80%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 5;
        }

        .spine-stitches {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 30px;
          transform: translateX(-50%);
          z-index: 6;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          padding: 30px 0;
        }
        .stitch {
          width: 18px;
          height: 2px;
          background: linear-gradient(to right, #b8a58c, #8b7355, #b8a58c);
          border-radius: 1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .coffee-stain {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.08;
          border: 2px solid #6b4423;
          box-shadow: inset 0 0 10px rgba(107, 68, 35, 0.3), 0 0 5px rgba(107, 68, 35, 0.1);
        }
        .coffee-stain-1 {
          width: 80px;
          height: 75px;
          top: 8%;
          right: 12%;
          transform: rotate(15deg);
        }
        .coffee-stain-2 {
          width: 50px;
          height: 48px;
          bottom: 15%;
          left: 8%;
          transform: rotate(-20deg);
          opacity: 0.06;
        }
        .coffee-stain-3 {
          width: 35px;
          height: 33px;
          top: 60%;
          right: 20%;
          transform: rotate(45deg);
          opacity: 0.05;
        }

        .page-edge-left, .page-edge-right {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 12px;
          pointer-events: none;
          z-index: 2;
        }
        .page-edge-left {
          left: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.06), transparent);
        }
        .page-edge-right {
          right: 0;
          background: linear-gradient(to left, rgba(0,0,0,0.06), transparent);
        }

        .left-page {
          padding: 2.5rem 2rem 2.5rem 2.5rem;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 2;
          height: 100%;
          box-sizing: border-box;
        }
        .left-page::-webkit-scrollbar { width: 4px; }
        .left-page::-webkit-scrollbar-track { background: transparent; }
        .left-page::-webkit-scrollbar-thumb { background: rgba(139, 115, 85, 0.3); border-radius: 2px; }

        .lined-paper {
          background-image: repeating-linear-gradient(
            transparent,
            transparent 27px,
            rgba(139, 115, 85, 0.08) 27px,
            rgba(139, 115, 85, 0.08) 28px
          );
          background-position: 0 0;
        }

        .margin-line {
          position: absolute;
          left: 2.5rem;
          top: 2.5rem;
          bottom: 2.5rem;
          width: 1px;
          background: linear-gradient(to bottom, rgba(200, 80, 60, 0.15), rgba(200, 80, 60, 0.08));
          pointer-events: none;
          z-index: 0;
        }

        .org-name {
          font-family: 'Crimson Text', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--ink-dark);
          margin-bottom: 0.3rem;
          letter-spacing: 0.01em;
          line-height: 1.2;
          position: relative;
          z-index: 1;
        }

        .role-title {
          font-family: 'Crimson Text', serif;
          font-size: 1.25rem;
          color: var(--ink-mid);
          margin-bottom: 1rem;
          font-weight: 600;
          font-style: italic;
          position: relative;
          z-index: 1;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          color: var(--ink-light);
          margin-bottom: 0.4rem;
          position: relative;
          z-index: 1;
        }
        .meta-icon {
          width: 16px;
          height: 16px;
          opacity: 0.6;
          flex-shrink: 0;
        }

        .stamp-container {
          margin: 1rem 0 1.2rem;
          position: relative;
          z-index: 1;
        }
        .stamp {
          display: inline-block;
          padding: 0.35rem 0.9rem;
          border: 2px solid;
          border-radius: 4px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transform: rotate(-2deg);
          position: relative;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .stamp::before {
          content: '';
          position: absolute;
          inset: -1px;
          border: 1px solid;
          border-radius: 3px;
          opacity: 0.5;
        }
        .stamp-fulltime {
          color: #2d5a27;
          border-color: #2d5a27;
          background: rgba(45, 90, 39, 0.06);
        }
        .stamp-internship {
          color: #8b6914;
          border-color: #8b6914;
          background: rgba(139, 105, 20, 0.06);
        }
        .stamp-research {
          color: #4a6741;
          border-color: #4a6741;
          background: rgba(74, 103, 65, 0.06);
        }
        .stamp-default {
          color: var(--ink-mid);
          border-color: var(--ink-mid);
          background: rgba(93, 74, 42, 0.06);
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ink-mid);
          margin-bottom: 1.5rem;
          padding: 0.8rem 1rem;
          background: rgba(196, 165, 116, 0.08);
          border-left: 3px solid var(--accent-gold);
          border-radius: 0 6px 6px 0;
          position: relative;
          z-index: 1;
          font-style: italic;
        }

        .tools-section {
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .tools-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-warm);
          margin-bottom: 0.6rem;
          font-weight: 700;
        }
        .tools-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .tool-tag {
          padding: 0.3rem 0.7rem;
          background: linear-gradient(135deg, var(--leather-light), var(--leather-mid));
          color: var(--paper-base);
          border-radius: 3px;
          font-size: 0.8rem;
          font-family: 'Courier Prime', monospace;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid rgba(0,0,0,0.2);
        }

        .field-notes-header {
          font-family: 'Caveat', cursive;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--ink-dark);
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .field-notes-header::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, var(--accent-warm), transparent);
          margin-left: 0.5rem;
        }

        .notes-list {
          position: relative;
          z-index: 1;
        }
        .note-item {
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ink-dark);
          padding-left: 1.2rem;
          position: relative;
          border-radius: 0 4px 4px 0;
        }
        .note-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55rem;
          width: 5px;
          height: 5px;
          background: var(--accent-warm);
          border-radius: 50%;
          opacity: 0.7;
        }

        .right-page {
          padding: 2.5rem 2.5rem 2.5rem 2rem;
          position: relative;
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 2;
          height: 100%;
          box-sizing: border-box;
        }
        .right-page::-webkit-scrollbar { width: 4px; }
        .right-page::-webkit-scrollbar-track { background: transparent; }
        .right-page::-webkit-scrollbar-thumb { background: rgba(139, 115, 85, 0.3); border-radius: 2px; }

        .gallery-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-warm);
          margin-bottom: 0.8rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .polaroid-container {
          position: relative;
          width: 100%;
          margin-bottom: 1.5rem;
          z-index: 1;
        }
        .polaroid-frame {
          background: #faf6f0;
          padding: 0.6rem 0.6rem 2.2rem 0.6rem;
          border-radius: 3px;
          box-shadow:
            0 4px 15px rgba(0,0,0,0.12),
            0 1px 3px rgba(0,0,0,0.08),
            inset 0 0 20px rgba(139, 115, 85, 0.05);
          position: relative;
          transform: rotate(-0.5deg);
        }
        .polaroid-frame::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 14px;
          background: linear-gradient(135deg, #c9a227, #b8941f);
          border-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 2;
        }
        .polaroid-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: 2px;
          background: #e8e0d4;
        }
        .polaroid-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          filter: sepia(0.1) contrast(1.05);
        }
        .polaroid-img.active {
          opacity: 1;
        }
        .polaroid-caption {
          position: absolute;
          bottom: 0.4rem;
          left: 0;
          right: 0;
          text-align: center;
          font-family: 'Caveat', cursive;
          font-size: 1rem;
          color: var(--ink-light);
        }
        .photo-counter {
          position: absolute;
          bottom: 0.6rem;
          right: 0.6rem;
          background: rgba(0,0,0,0.6);
          color: var(--paper-base);
          padding: 0.25rem 0.6rem;
          border-radius: 3px;
          font-size: 0.7rem;
          font-family: 'Courier Prime', monospace;
          z-index: 2;
        }

        .thumb-strip {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.6rem;
          justify-content: center;
        }
        .thumb {
          width: 44px;
          height: 33px;
          border-radius: 2px;
          object-fit: cover;
          cursor: pointer;
          border: 2px solid transparent;
          opacity: 0.6;
          transition: all 0.2s ease;
          filter: sepia(0.2);
        }
        .thumb:hover, .thumb.active {
          opacity: 1;
          border-color: var(--accent-warm);
          transform: translateY(-2px);
        }

        .insight-box {
          position: relative;
          z-index: 1;
          padding: 1.2rem 1.4rem;
          background: linear-gradient(135deg, rgba(251, 245, 235, 0.9), rgba(245, 238, 225, 0.9));
          border: 1px solid rgba(196, 165, 116, 0.4);
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.06), inset 0 0 20px rgba(196, 165, 116, 0.05);
          margin-top: 1rem;
        }
        .insight-box::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: #e8d9bc;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          z-index: 2;
        }
        .insight-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-warm);
          margin-bottom: 0.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .insight-text {
          font-family: 'Caveat', cursive;
          font-size: 1.15rem;
          line-height: 1.5;
          color: var(--ink-dark);
          margin: 0;
          font-weight: 500;
        }

        /* VERTICAL BOOKMARK TABS (Sticking out from right edge of diary) */
        .bookmark-tabs-vertical {
          position: absolute;
          top: 40px;
          right: -32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 25;
        }
        .bookmark-vtab {
          width: 46px;
          height: 38px;
          border-radius: 0 8px 8px 0;
          cursor: pointer;
          position: relative;
          transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 3px 3px 10px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 8px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.05em;
          text-shadow: 0 1px 3px rgba(0,0,0,0.7);
          border: 1px solid rgba(255,255,255,0.2);
          border-left: none;
        }
        .bookmark-vtab::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: rgba(0,0,0,0.3);
        }
        .bookmark-vtab:hover {
          transform: translateX(6px);
        }
        .bookmark-vtab.active {
          transform: translateX(10px);
          box-shadow: 5px 4px 15px rgba(0,0,0,0.6);
          border-color: var(--accent-gold);
        }
        .vtab-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          margin-right: 5px;
          flex-shrink: 0;
        }
        .bookmark-vtab.active .vtab-dot {
          background: #ffffff;
          box-shadow: 0 0 6px rgba(255,255,255,0.9);
        }

        /* Bottom Book Indicator */
        .bottom-page-indicator {
          position: absolute;
          bottom: -45px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.8rem;
          color: var(--paper-base);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--leather-light), var(--leather-mid));
          padding: 0.45rem 1.2rem;
          border-radius: 20px;
          border: 1px solid var(--accent-warm);
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          z-index: 10;
        }
        .bottom-page-indicator .page-num {
          color: var(--accent-gold);
          font-weight: 700;
        }

        /* CORNER TRIGGER ZONES (Edge approach detection - BOTTOM CORNERS ONLY) */
        .corner-trigger-zone {
          position: absolute;
          width: 140px;
          height: 140px;
          z-index: 35;
          cursor: pointer;
          user-select: none;
        }
        .zone-br {
          bottom: 0;
          right: 0;
        }
        .zone-bl {
          bottom: 0;
          left: 0;
        }

        /* Subtle resting corner tip at edge */
        .resting-corner-fold {
          position: absolute;
          width: 22px;
          height: 22px;
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
          opacity: 0.55;
          z-index: 36;
        }
        .zone-br .resting-corner-fold {
          bottom: 0;
          right: 0;
          border-left: 1px solid rgba(139, 115, 85, 0.5);
          border-top: 1px solid rgba(139, 115, 85, 0.5);
          background: linear-gradient(135deg, transparent 45%, rgba(139, 115, 85, 0.2) 50%, rgba(244, 232, 208, 0.95) 100%);
          border-radius: 3px 0 0 0;
        }
        .zone-bl .resting-corner-fold {
          bottom: 0;
          left: 0;
          border-right: 1px solid rgba(139, 115, 85, 0.5);
          border-top: 1px solid rgba(139, 115, 85, 0.5);
          background: linear-gradient(-135deg, transparent 45%, rgba(139, 115, 85, 0.2) 50%, rgba(244, 232, 208, 0.95) 100%);
          border-radius: 0 3px 0 0;
        }

        .corner-trigger-zone:hover .resting-corner-fold {
          opacity: 0;
          transform: scale(0.5);
        }

        /* DYNAMIC PAGE CURL SYMBOL ON MOUSE APPROACH */
        .active-page-curl {
          position: absolute;
          width: 105px;
          height: 105px;
          pointer-events: none;
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
          z-index: 37;
        }
        .zone-br .active-page-curl {
          bottom: 0;
          right: 0;
          transform: translate(25px, 25px) scale(0.6);
        }
        .zone-bl .active-page-curl {
          bottom: 0;
          left: 0;
          transform: translate(-25px, 25px) scale(0.6);
        }

        .corner-trigger-zone:hover .active-page-curl {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .curl-svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .curl-hint {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ink-dark);
          background: rgba(244, 232, 208, 0.96);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--accent-warm);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          opacity: 0;
          transform: translateY(8px);
          transition: all 0.25s ease;
          pointer-events: none;
          white-space: nowrap;
          z-index: 40;
        }
        .zone-br .curl-hint { bottom: 14px; right: 14px; }
        .zone-bl .curl-hint { bottom: 14px; left: 14px; }

        .corner-trigger-zone:hover .curl-hint {
          opacity: 1;
          transform: translateY(0);
        }

        /* AUTHENTIC 3D PAGE FLIP ANIMATION SHEET */
        .turning-sheet {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          z-index: 30;
          pointer-events: none;
          transform-style: preserve-3d;
        }

        .turning-sheet-next {
          right: 0;
          transform-origin: left center;
          animation: flipSheetNext 0.58s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        .turning-sheet-prev {
          left: 0;
          transform-origin: right center;
          animation: flipSheetPrev 0.58s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        }

        @keyframes flipSheetNext {
          0% {
            transform: perspective(2500px) rotateY(0deg);
          }
          100% {
            transform: perspective(2500px) rotateY(-180deg);
          }
        }

        @keyframes flipSheetPrev {
          0% {
            transform: perspective(2500px) rotateY(0deg);
          }
          100% {
            transform: perspective(2500px) rotateY(180deg);
          }
        }

        .sheet-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background: linear-gradient(to right, #f4e8d0 0%, #f9f3e9 100%);
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(139, 69, 19, 0.08);
        }

        .sheet-face-front {
          z-index: 2;
          transform: rotateY(0deg);
        }

        .sheet-face-back {
          z-index: 1;
          transform: rotateY(180deg);
          background: linear-gradient(to left, #f4e8d0 0%, #f9f3e9 100%);
        }

        /* Dynamic Flip Shadow Overlays */
        .flip-shadow-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
        }

        .shadow-next-front {
          background: linear-gradient(to left, rgba(0,0,0,0.35) 0%, transparent 60%);
          animation: shadowSweepNextFront 0.58s ease forwards;
        }

        .shadow-next-back {
          background: linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 60%);
          animation: shadowSweepNextBack 0.58s ease forwards;
        }

        @keyframes shadowSweepNextFront {
          0% { opacity: 0; }
          40% { opacity: 0.5; }
          100% { opacity: 0; }
        }

        @keyframes shadowSweepNextBack {
          0% { opacity: 0.5; }
          60% { opacity: 0.2; }
          100% { opacity: 0; }
        }

        /* MODALS */
        .locked-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13, 9, 6, 0.88);
          backdrop-filter: blur(5px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .locked-modal {
          background: linear-gradient(135deg, var(--paper-light), var(--paper-base));
          padding: 3rem 3.5rem;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139, 115, 85, 0.3);
          text-align: center;
          max-width: 440px;
          position: relative;
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .locked-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.85;
        }
        .locked-title {
          font-family: 'Caveat', cursive;
          font-size: 2rem;
          color: var(--ink-dark);
          margin-bottom: 0.6rem;
          font-weight: 700;
        }
        .locked-subtitle {
          font-family: 'Crimson Text', serif;
          font-size: 1.1rem;
          color: var(--ink-mid);
          font-style: italic;
          margin-bottom: 1.2rem;
          line-height: 1.5;
        }
        .funny-quip {
          font-family: 'Caveat', cursive;
          font-size: 1.45rem;
          color: #8b2614;
          font-weight: 600;
        }
        .locked-hint {
          font-family: 'Courier Prime', monospace;
          font-size: 0.78rem;
          color: var(--accent-warm);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .locked-actions {
          display: flex;
          gap: 0.8rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        .locked-cta {
          background: linear-gradient(135deg, #2d5a27, #1e3d1a);
          border: 1px solid #4a7a3f;
          color: var(--paper-base);
          padding: 0.6rem 1.6rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Courier Prime', monospace;
          font-size: 0.85rem;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .locked-cta:hover {
          transform: translateY(-2px);
          border-color: #6aaa5a;
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }
        .locked-close {
          background: linear-gradient(135deg, var(--leather-light), var(--leather-mid));
          border: 1px solid var(--accent-warm);
          color: var(--paper-base);
          padding: 0.6rem 1.4rem;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Courier Prime', monospace;
          font-size: 0.85rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        }
        .locked-close:hover {
          transform: translateY(-2px);
          border-color: var(--accent-gold);
        }

        @media (max-width: 900px) {
          .book-wrapper {
            width: 96%;
            height: 88vh;
          }
          .pages-container {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
          .spine-shadow, .spine-stitches {
            display: none;
          }
          .left-page, .right-page {
            padding: 1.5rem;
          }
          .bookmark-tabs-vertical {
            display: none;
          }
          .org-name { font-size: 1.5rem; }
          .role-title { font-size: 1.1rem; }
          .corner-trigger-zone {
            width: 90px;
            height: 90px;
          }
          .active-page-curl {
            width: 75px;
            height: 75px;
          }
        }
      `}</style>

      <a href="/hub" className="back-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </a>

      <div className="book-wrapper">
        <div className="book-cover">
          <div className="cover-emboss" />
        </div>

        {/* VERTICAL DIARY INDEX TABS (Sticking out right edge) */}
        <div className="bookmark-tabs-vertical">
          {diaryEntries.map((entry, i) => {
            const yearTag = entry.dates.start.split(' ')[1] || `'${25 - i}`;
            return (
              <div
                key={entry.id}
                className={`bookmark-vtab ${i === currentEntryIndex ? 'active' : ''}`}
                style={{ backgroundColor: bookmarkColors[i % bookmarkColors.length] }}
                onClick={() => {
                  if (i !== currentEntryIndex && !isFlipping) {
                    const dir = i > currentEntryIndex ? 'next' : 'prev';
                    setTargetEntryIndex(i);
                    setFlipDirection(dir);
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentEntryIndex(i);
                      setCurrentPhotoIndex(0);
                      setIsFlipping(false);
                    }, 580);
                  }
                }}
                title={`${entry.dates.start} - ${entry.dates.end}: ${entry.organization}`}
              >
                <div className="vtab-dot" />
                <span>{yearTag}</span>
              </div>
            );
          })}
        </div>

        {/* BOOK CONTAINER WITH BASE PAGES & OVERLAY 3D FLIP SHEET */}
        <div className="pages-container">
          <div className="paper-texture" />
          <div className="spine-shadow" />
          <div className="spine-stitches">
            {[...Array(7)].map((_, i) => <div key={i} className="stitch" />)}
          </div>
          <div className="page-edge-left" />
          <div className="page-edge-right" />

          <div className="coffee-stain coffee-stain-1" />
          <div className="coffee-stain coffee-stain-2" />
          <div className="coffee-stain coffee-stain-3" />

          {/* BASE UNDERLYING BOOK SPREAD */}
          {!isFlipping ? (
            <>
              {renderLeftPageContent(diaryEntries[currentEntryIndex])}
              {renderRightPageContent(diaryEntries[currentEntryIndex], currentPhotoIndex, setCurrentPhotoIndex)}
            </>
          ) : flipDirection === 'next' ? (
            <>
              {/* When flipping Next: Left stays current, Right reveals next entry */}
              {renderLeftPageContent(diaryEntries[currentEntryIndex])}
              {renderRightPageContent(diaryEntries[targetEntryIndex], 0)}
            </>
          ) : (
            <>
              {/* When flipping Prev: Left reveals prev entry, Right stays current */}
              {renderLeftPageContent(diaryEntries[targetEntryIndex])}
              {renderRightPageContent(diaryEntries[currentEntryIndex], currentPhotoIndex)}
            </>
          )}

          {/* PHYSICAL 3D PAGE TURN SHEET OVERLAY */}
          {isFlipping && (
            <div className={`turning-sheet ${flipDirection === 'next' ? 'turning-sheet-next' : 'turning-sheet-prev'}`}>
              {/* FRONT FACE OF TURNING PAGE */}
              <div className="sheet-face sheet-face-front">
                <div className="paper-texture" />
                <div className="flip-shadow-overlay shadow-next-front" />
                {flipDirection === 'next'
                  ? renderRightPageContent(diaryEntries[currentEntryIndex], currentPhotoIndex)
                  : renderLeftPageContent(diaryEntries[currentEntryIndex])
                }
              </div>
              {/* BACK FACE OF TURNING PAGE */}
              <div className="sheet-face sheet-face-back">
                <div className="paper-texture" />
                <div className="flip-shadow-overlay shadow-next-back" />
                {flipDirection === 'next'
                  ? renderLeftPageContent(diaryEntries[targetEntryIndex])
                  : renderRightPageContent(diaryEntries[targetEntryIndex], 0)
                }
              </div>
            </div>
          )}

          {/* PREV PAGE CORNER TRIGGER ZONE (Bottom Left Edge Approach) */}
          <div
            className="corner-trigger-zone zone-bl"
            onClick={() => navigateTo('prev')}
            title="Previous Chapter"
          >
            <div className="resting-corner-fold" />
            <div className="active-page-curl">
              <svg viewBox="0 0 100 100" className="curl-svg">
                <defs>
                  <filter id="curl-shadow-bl" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="3" dy="-3" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
                  </filter>
                  <linearGradient id="curl-front-bl" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fffdfa" />
                    <stop offset="50%" stopColor="#f4e8d0" />
                    <stop offset="100%" stopColor="#d5c4a1" />
                  </linearGradient>
                  <linearGradient id="curl-back-shadow-bl" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
                    <stop offset="50%" stopColor="rgba(0,0,0,0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polygon points="0,15 0,100 85,100" fill="url(#curl-back-shadow-bl)" />
                <path
                  d="M 0,15 C 25,35 55,45 75,25 C 55,45 65,75 85,100 C 50,85 15,50 0,15 Z"
                  fill="url(#curl-front-bl)"
                  filter="url(#curl-shadow-bl)"
                  stroke="rgba(139, 115, 85, 0.4)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
            <div className="curl-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Prev</span>
            </div>
          </div>

          {/* NEXT PAGE CORNER TRIGGER ZONE (Bottom Right Edge Approach) */}
          <div
            className="corner-trigger-zone zone-br"
            onClick={() => navigateTo('next')}
            title="Next Chapter"
          >
            <div className="resting-corner-fold" />
            <div className="active-page-curl">
              <svg viewBox="0 0 100 100" className="curl-svg">
                <defs>
                  <filter id="curl-shadow-br" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="-3" dy="-3" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
                  </filter>
                  <linearGradient id="curl-front-br" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffdfa" />
                    <stop offset="50%" stopColor="#f4e8d0" />
                    <stop offset="100%" stopColor="#d5c4a1" />
                  </linearGradient>
                  <linearGradient id="curl-back-shadow-br" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.5)" />
                    <stop offset="50%" stopColor="rgba(0,0,0,0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polygon points="100,15 100,100 15,100" fill="url(#curl-back-shadow-br)" />
                <path
                  d="M 100,15 C 75,35 45,45 25,25 C 45,45 35,75 15,100 C 50,85 85,50 100,15 Z"
                  fill="url(#curl-front-br)"
                  filter="url(#curl-shadow-br)"
                  stroke="rgba(139, 115, 85, 0.4)"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
            <div className="curl-hint">
              <span>Next</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>

        {/* ELEGANT VINTAGE PAGE INDICATOR BADGE */}
        <div className="bottom-page-indicator">
          <span>CHAPTER</span>
          <span className="page-num">{currentEntryIndex + 1}</span>
          <span>OF</span>
          <span className="page-num">{diaryEntries.length}</span>
        </div>
      </div>

      {/* PROMPT MODALS */}
      {modalType && (
        <div className="locked-overlay" onClick={() => setModalType(null)}>
          <div className="locked-modal" onClick={e => e.stopPropagation()}>
            {modalType === 'future' ? (
              <>
                <div className="locked-icon">✍️</div>
                <div className="locked-title">Chapter is yet to be written</div>
                <div className="locked-subtitle">
                  This is the latest entry in my professional diary. Want to help write the next chapter?
                </div>
                <div className="locked-hint">I&apos;m open to new opportunities!</div>
                <div className="locked-actions">
                  <a href="/contactme" className="locked-cta">Hire Me</a>
                  <button className="locked-close" onClick={() => setModalType(null)}>Close</button>
                </div>
              </>
            ) : (
              <>
                <div className="locked-icon">👶</div>
                <div className="locked-title">End of Professional Diary</div>
                <div className="locked-subtitle funny-quip">
                  &ldquo;I do not condone child labour and well... I was a child!&rdquo;
                </div>
                <div className="locked-hint">
                  Well... I didn&apos;t work before this! You&apos;ve reached the start of the career archives.
                </div>
                <div className="locked-actions">
                  <a href="/hub" className="locked-cta">Back to Hub</a>
                  <button className="locked-close" onClick={() => setModalType(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </ViewportScaleStage>
  );
}