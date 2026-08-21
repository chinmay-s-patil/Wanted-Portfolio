// src/events/FilmStripUnraveler.jsx
// Interactive 35mm Film Roll Pull-Out & Scroll Unraveler

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './FilmStripUnraveler.module.css';

export default function FilmStripUnraveler({ reel, onClose }) {
  // Stage states: 'closed' | 'pulling' | 'unrolled' | 'rewinding'
  const [stage, setStage] = useState('closed');
  const [scrollPos, setScrollPos] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  // Extract valid image frames
  const imageFrames = useMemo(() => {
    return reel.frames?.filter((f) => f.type === 'image' || f.src || f.image) || [];
  }, [reel]);

  const totalImageFrames = imageFrames.length;
  // Extra frames: Title Leader Frame (0), Photo frames (1..totalImageFrames), Summary Frame (totalImageFrames+1)
  const totalStripFrames = totalImageFrames + 2;
  const frameWidth = 560; // Width of each 35mm film cell in px
  const maxScroll = Math.max(0, (totalStripFrames - 1) * frameWidth);

  /* ─── Canister Pull-Out Trigger ─── */
  const handlePullOpen = useCallback(() => {
    if (stage !== 'closed') return;
    setStage('pulling');
    setTimeout(() => {
      setStage('unrolled');
    }, 700);
  }, [stage]);

  /* ─── Scroll Wheel / Trackpad Mechanics ─── */
  const handleWheel = useCallback(
    (e) => {
      if (stage !== 'unrolled') return;
      e.preventDefault();
      const delta = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      setScrollPos((prev) => {
        const next = Math.min(maxScroll, Math.max(0, prev + delta * 1.5));
        const index = Math.round(next / frameWidth);
        setCurrentFrameIndex(Math.min(totalStripFrames - 1, Math.max(0, index)));
        return next;
      });
    },
    [stage, maxScroll, frameWidth, totalStripFrames]
  );

  /* ─── Keyboard Navigation ─── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (stage === 'closed' && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) {
        e.preventDefault();
        handlePullOpen();
        return;
      }
      if (stage !== 'unrolled') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToFrame(currentFrameIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToFrame(currentFrameIndex - 1);
      } else if (e.key === 'Escape') {
        triggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, currentFrameIndex, handlePullOpen]);

  const scrollToFrame = (index) => {
    const clampedIndex = Math.min(totalStripFrames - 1, Math.max(0, index));
    setCurrentFrameIndex(clampedIndex);
    setScrollPos(clampedIndex * frameWidth);
  };

  /* ─── Mouse Drag ─── */
  const handleMouseDown = (e) => {
    if (stage === 'closed') {
      handlePullOpen();
      return;
    }
    if (stage !== 'unrolled') return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = scrollPos;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || stage !== 'unrolled') return;
    const diff = startXRef.current - e.clientX;
    const next = Math.min(maxScroll, Math.max(0, startScrollRef.current + diff));
    setScrollPos(next);
    setCurrentFrameIndex(Math.min(totalStripFrames - 1, Math.max(0, Math.round(next / frameWidth))));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  /* ─── Rewind & Close ─── */
  const triggerClose = () => {
    if (stage === 'rewinding') return;
    setStage('rewinding');
    setScrollPos(0);
    setTimeout(() => {
      onClose();
    }, 700);
  };

  // Brand styling presets
  const brandThemes = {
    'drone-vitc': { main: '#eab308', brand: 'KODAK GOLD 400', iso: 'ISO 400', lens: '50mm f/1.8' },
    'iisc-do-drone': { main: '#06b6d4', brand: 'FUJICOLOR PRO 200', iso: 'ISO 200', lens: '35mm f/2.0' },
    'isawe': { main: '#38bdf8', brand: 'ILFORD HP5 PLUS', iso: 'ISO 400', lens: '28mm f/2.8' },
    'ncwe': { main: '#f97316', brand: 'AGFA PHOTO 100', iso: 'ISO 100', lens: '50mm f/1.4' },
  };

  const theme = brandThemes[reel.id] || brandThemes['drone-vitc'];

  return (
    <div
      className={`${styles.unravelerOverlay} ${stage === 'rewinding' ? styles.overlayRewinding : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Darkroom Film Grain Overlay */}
      <div className={styles.darkroomGrainOverlay} />

      {/* Top Fixed Control Bar */}
      <div className={styles.topControlBar}>
        <div className={styles.rollBadgeGroup}>
          <span className={styles.rollBrandBadge}>{theme.brand}</span>
          <span className={styles.rollStatusText}>
            {stage === 'closed' && 'CARTRIDGE LOADED • CLICK PULL TAG TO UNROLL'}
            {stage === 'pulling' && 'PULLING FILM LEADER…'}
            {stage === 'unrolled' && `FRAME ${currentFrameIndex + 1} OF ${totalStripFrames}`}
            {stage === 'rewinding' && 'REWINDING FILM ROLL…'}
          </span>
        </div>

        {/* Retro Camera HUD Telemetry */}
        <div className={styles.cameraHudTelemetry}>
          <span className={styles.hudMetaTag}>{theme.lens}</span>
          <span className={styles.hudMetaDivider}>•</span>
          <span className={styles.hudMetaTag}>1/250s</span>
          <span className={styles.hudMetaDivider}>•</span>
          <span className={styles.hudMetaTag}>{theme.iso}</span>
          <span className={styles.hudMetaDivider}>•</span>
          <span className={styles.hudMetaTag}>C-41</span>
        </div>

        <button
          className={styles.closeBtn}
          onClick={triggerClose}
          aria-label="Rewind and close film canister"
        >
          <span className={styles.rewindIcon}>⟲</span> REWIND & CLOSE
        </button>
      </div>

      {/* Interactive Unraveling Stage */}
      <main className={styles.stage}>
        {/* Iconic 35mm Canister on Left */}
        <div
          className={`${styles.canisterAnchor} ${stage === 'closed' ? styles.canisterClosedState : ''}`}
          onClick={stage === 'closed' ? handlePullOpen : undefined}
          style={{ cursor: stage === 'closed' ? 'pointer' : 'default' }}
        >
          <div className={styles.canisterShell}>
            <div className={styles.spindleTop}>
              <div className={styles.spindleKnob} />
            </div>

            <div className={styles.bodyWrap} style={{ background: theme.main }}>
              <span className={styles.canisterBrandTag}>{theme.brand}</span>
              <h3 className={styles.canisterTitleText}>{reel.title}</h3>
              <div className={styles.canisterMetaTag}>{theme.iso} • 36 EXP</div>
            </div>

            <div className={styles.feltLipSlot}>
              <div className={styles.feltLipGlow} />
            </div>

            <div className={styles.spindleBottom} />
          </div>

          {/* Interactive Film Leader Pull Tag sticking out from felt lip */}
          {stage === 'closed' && (
            <div
              className={styles.pullLeaderTag}
              onClick={(e) => {
                e.stopPropagation();
                handlePullOpen();
              }}
              role="button"
              tabIndex={0}
              aria-label="Pull film leader tag to unroll film"
            >
              <div className={styles.tagSprocketTop} />
              <div className={styles.tagContent}>
                <span className={styles.tagLabel}>PULL TO UNROLL</span>
                <span className={styles.tagArrow}>➔</span>
              </div>
              <div className={styles.tagSprocketBottom} />
              <div className={styles.tagGuideHint}>PULL FILM</div>
            </div>
          )}
        </div>

        {/* Floating Instruction Prompt on closed stage */}
        {stage === 'closed' && (
          <div className={styles.pullInstructionPrompt} onClick={handlePullOpen}>
            <span className={styles.promptIcon}>☜</span>
            <span className={styles.promptText}>CLICK OR DRAG LEADER TAG TO UNROLL FILM</span>
          </div>
        )}

        {/* Film Viewport & Pull-Out Track */}
        <div className={styles.filmViewport} ref={containerRef}>
          <div
            className={`${styles.filmPulloutWrapper} ${
              stage === 'closed' ? styles.pulloutClosed : stage === 'pulling' ? styles.pulloutOpening : styles.pulloutUnrolled
            }`}
          >
            <div
              className={styles.filmStripTrack}
              style={{ transform: `translateX(${-scrollPos}px)` }}
            >
              {/* FRAME 0: 35mm Film Leader & Title Cell */}
              <div className={`${styles.filmFrameCell} ${styles.leaderFrame}`}>
                <div className={styles.sprocketTopRow} />
                <div className={styles.frameHeaderBar}>
                  <span className={styles.frameStamp}>KODAK SAFETY FILM 35MM</span>
                  <span className={styles.frameNumber}>00</span>
                </div>

                <div className={styles.leaderContent}>
                  <div className={styles.griddyCrosshairTopLeft}>+</div>
                  <div className={styles.griddyCrosshairTopRight}>+</div>

                  <span className={styles.leaderKicker}>EVENT PROJECTION ARCHIVE</span>
                  <h2 className={styles.leaderTitle}>{reel.title}</h2>
                  <p className={styles.leaderSub}>
                    {reel.year} • {reel.location}
                  </p>
                  <div className={styles.leaderTagGrid}>
                    <span className={styles.leaderTag}>36 EXP</span>
                    <span className={styles.leaderTag}>PROCESS C-41</span>
                    <span className={styles.leaderTag}>{theme.iso}</span>
                  </div>
                  <div className={styles.unravelArrowHint}>
                    {stage === 'unrolled' ? 'Scroll Down / Drag to Pull Out Film →' : 'Pulling Film…'}
                  </div>

                  <div className={styles.griddyCrosshairBottomLeft}>+</div>
                  <div className={styles.griddyCrosshairBottomRight}>+</div>
                </div>

                <div className={styles.frameFooterBar}>
                  <span className={styles.edgeCode}>EASTMAN KODAK 5247</span>
                  <span className={styles.frameMetaText}>ROLL REF: #{reel.id.toUpperCase()}</span>
                </div>
                <div className={styles.sprocketBottomRow} />
              </div>

              {/* FRAMES 1..N: Photo Slides */}
              {imageFrames.map((frame, idx) => {
                const imageUrl = frame.src || frame.image;
                return (
                  <div key={idx} className={styles.filmFrameCell}>
                    <div className={styles.sprocketTopRow} />
                    <div className={styles.frameHeaderBar}>
                      <span className={styles.frameStamp}>35MM NEGATIVE FILM</span>
                      <span className={styles.frameNumber}>
                        {String(idx + 1).padStart(2, '0')}
                        <span className={styles.frameSubNumber}>A</span>
                      </span>
                    </div>

                    <div className={styles.photoContainer}>
                      <div className={styles.griddyReticleBox}>
                        <img
                          src={imageUrl}
                          alt={frame.caption || reel.title}
                          className={styles.photoImg}
                          loading="lazy"
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <div className={styles.reticleCornerTL} />
                        <div className={styles.reticleCornerTR} />
                        <div className={styles.reticleCornerBL} />
                        <div className={styles.reticleCornerBR} />
                      </div>

                      {frame.caption && (
                        <div className={styles.captionBox}>
                          <p className={styles.captionTypewriter}>{frame.caption}</p>
                        </div>
                      )}
                    </div>

                    <div className={styles.frameFooterBar}>
                      <span className={styles.edgeCode}>COLOR NEGATIVE 400</span>
                      <span className={styles.frameMetaText}>{reel.year} • FRAME {idx + 1}</span>
                    </div>
                    <div className={styles.sprocketBottomRow} />
                  </div>
                );
              })}

              {/* FINAL FRAME: Summary Frame */}
              <div className={`${styles.filmFrameCell} ${styles.summaryFrame}`}>
                <div className={styles.sprocketTopRow} />
                <div className={styles.frameHeaderBar}>
                  <span className={styles.frameStamp}>END OF ROLL</span>
                  <span className={styles.frameNumber}>
                    {String(totalStripFrames).padStart(2, '0')}
                  </span>
                </div>

                <div className={styles.summaryContent}>
                  <div className={styles.griddyCrosshairTopLeft}>+</div>
                  <div className={styles.griddyCrosshairTopRight}>+</div>

                  <span className={styles.summaryBadge}>ARCHIVE SUMMARY</span>
                  <h3 className={styles.summaryTitle}>Reel Completed</h3>
                  <p className={styles.summaryText}>{reel.summary}</p>
                  <div className={styles.summaryHighlights}>
                    {reel.highlights?.map((h, i) => (
                      <span key={i} className={styles.summaryTag}>
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                  <button className={styles.rewindActionBtn} onClick={triggerClose}>
                    ⟲ Rewind Film Cartridge
                  </button>

                  <div className={styles.griddyCrosshairBottomLeft}>+</div>
                  <div className={styles.griddyCrosshairBottomRight}>+</div>
                </div>

                <div className={styles.frameFooterBar}>
                  <span className={styles.edgeCode}>WANTED ARCHIVE</span>
                  <span className={styles.frameMetaText}>DEPT: AERO/UAV</span>
                </div>
                <div className={styles.sprocketBottomRow} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Arrow Controls */}
      {stage === 'unrolled' && (
        <>
          <button
            className={`${styles.navBtn} ${styles.navLeft}`}
            onClick={() => scrollToFrame(currentFrameIndex - 1)}
            disabled={currentFrameIndex === 0}
            aria-label="Previous frame"
          >
            ‹
          </button>

          <button
            className={`${styles.navBtn} ${styles.navRight}`}
            onClick={() => scrollToFrame(currentFrameIndex + 1)}
            disabled={currentFrameIndex === totalStripFrames - 1}
            aria-label="Next frame"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

