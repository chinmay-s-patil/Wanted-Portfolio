// src/education/LockerDoorPanel.jsx
// Physical 3D Open Locker Stage — Reference Photo Accurate Interior & Door Organizers

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './LockerDoorPanel.module.css';

export default function LockerDoorPanel({
  locker,
  lockers,
  currentImageIndex,
  onImageChange,
  onOpenViewer,
  onClose,
  onPrev,
  onNext
}) {
  const panelRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [doorSwungOpen, setDoorSwungOpen] = useState(false);

  useEffect(() => {
    setDoorSwungOpen(false);
    const t = setTimeout(() => setDoorSwungOpen(true), 60);
    return () => clearTimeout(t);
  }, [locker.id]);

  useEffect(() => {
    const t = setTimeout(() => panelRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [locker.id]);

  const currentIndex = lockers.findIndex((l) => l.id === locker.id);
  const prevLocker = lockers[currentIndex - 1];
  const nextLocker = lockers[currentIndex + 1];
  const canGoPrev = prevLocker && !prevLocker.locked;
  const canGoNext = nextLocker && !nextLocker.locked;

  const handlePrev = useCallback(() => { if (canGoPrev) onPrev(); }, [canGoPrev, onPrev]);
  const handleNext = useCallback(() => { if (canGoNext) onNext(); }, [canGoNext, onNext]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); handleNext(); }
      else if (e.key === 'Escape') { onClose(); }
    },
    [handlePrev, handleNext, onClose]
  );

  const currentImg = locker.images?.[currentImageIndex];

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={styles.modalOverlay}
    >
      {/* Top-Right Fixed Close Button */}
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close physical locker"
      >
        ✕ CLOSE LOCKER
      </button>

      <div className={styles.lockerContainer}>

        {/* 📦 Centered Single 3D Physical Locker Stage */}
        <div className={styles.singleLockerUnit}>

          {/* 3D Frame Heavy Iron Hinges */}
          <div className={styles.frameHingeTop}>
            <div className={styles.hingePin} />
          </div>
          <div className={styles.frameHingeBottom}>
            <div className={styles.hingePin} />
          </div>

          {/* 1. Deep Metallic 3D Inner Locker Cavity */}
          <div className={styles.innerCavity}>

            {/* 3D Cavity Perspective Light Cone & Side Walls */}
            <div className={styles.cavityLightCone} />
            <div className={styles.cavityWallLeft} />
            <div className={styles.cavityWallRight} />

            {/* Top Storage Shelf — Slanted Colorful Textbooks & Binders (Photos 1 & 3) */}
            <div className={styles.topShelf}>
              <div className={styles.shelfSurface}>
                <div className={styles.slantedBooksRack}>
                  <div className={`${styles.slantedBook} ${styles.book1}`}>
                    <span>CFD VOL 1</span>
                  </div>
                  <div className={`${styles.slantedBook} ${styles.book2}`}>
                    <span>TURBULENCE</span>
                  </div>
                  <div className={`${styles.slantedBook} ${styles.book3}`}>
                    <span>AERO</span>
                  </div>
                  <div className={`${styles.slantedBook} ${styles.book4}`}>
                    <span>METHODS</span>
                  </div>
                </div>
                <div className={styles.campusLanyard}>
                  <span className={styles.lanyardBadge}>🎓 {locker.shortName} ID</span>
                </div>
              </div>
            </div>

            {/* Main Compartment Interior */}
            <div className={styles.mainCompartment}>

              {/* Pinned Academic Poster / Diploma */}
              <div
                className={styles.diplomaPoster}
                onClick={() => onOpenViewer('poster', { locker })}
                role="button"
                tabIndex={0}
              >
                <div className={styles.posterPinTop} />
                <span className={styles.recordHeader}>OFFICIAL ACADEMIC RECORD</span>
                <h2 className={styles.degreeTitle}>{locker.degree}</h2>
                <h3 className={styles.institutionName}>{locker.institution}</h3>
                <p className={styles.periodLocation}>{locker.period} • {locker.location}</p>

                <p className={styles.descriptionText}>{locker.description}</p>

                {locker.highlights?.length > 0 && (
                  <ul className={styles.highlightsList}>
                    {locker.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}

                <div className={styles.skillsTagRow}>
                  {locker.skills?.map((skill, i) => (
                    <span key={i} className={styles.skillBadge} style={{ background: locker.color }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <div className={styles.officialStamp}>VERIFIED ARCHIVE</div>
              </div>

              {/* Academic PDF Documents */}
              {locker.documents?.length > 0 && (
                <div className={styles.documentsSection}>
                  <span className={styles.docHeaderTitle}>ACADEMIC DOCUMENTS & DOSSIERS</span>
                  <div className={styles.envelopeList}>
                    {locker.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className={styles.vintageEnvelopeCard}
                        onClick={() => onOpenViewer('pdf', doc)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.envelopeBodyContent}>
                          <div className={styles.envelopeIcon}>📄</div>
                          <div className={styles.envelopeTextGroup}>
                            <h4 className={styles.envelopeTitle}>{doc.title}</h4>
                            {doc.subtitle && <p className={styles.envelopeSub}>{doc.subtitle}</p>}
                            <span className={styles.envelopeTag}>PDF DOCUMENT • {doc.size}</span>
                          </div>
                          <div className={styles.unsealActionBadge}>
                            <span>VIEW PDF ↗</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locker Bottom Floor Items (Backpack, Water Bottle, Pencil Pouch - Photos 1 & 2) */}
              <div className={styles.lockerBottomFloor}>
                <div className={styles.floorBackpack}>
                  <span className={styles.itemIcon}>🎒</span>
                  <span className={styles.itemLabel}>Campus Pack</span>
                </div>
                <div className={styles.floorWaterBottle}>
                  <span className={styles.itemIcon}>🍾</span>
                  <span className={styles.itemLabel}>Hydro Flask</span>
                </div>
                <div className={styles.floorPencilCase}>
                  <span className={styles.itemIcon}>✏️</span>
                  <span className={styles.itemLabel}>Lab Kit</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. 🚪 Metal Swung 3D Door — Overlapped on Top of Cavity */}
          <div
            className={`${styles.hingedDoorWrapper} ${doorSwungOpen ? styles.doorSwungOpen : ''}`}
            style={{ '--door-color': locker.color }}
          >
            {/* 3D Metal Edge Rim */}
            <div className={styles.doorThicknessEdge} />

            {/* Inner Face of Swung Door (White Magnetic Board, Pencil Cup Organizers - Photos 1 & 3) */}
            <div className={styles.innerDoorFace}>

              {/* Door Top Louvers */}
              <div className={styles.doorVentsTop}>
                {[1, 2, 3, 4, 5, 6].map((v) => (
                  <div key={v} className={styles.ventLine} />
                ))}
              </div>

              {/* 📋 White Magnetic Memo Whiteboard (Photo 1) */}
              <div className={styles.magneticMemoBoard}>
                {/* Round Colored Magnets */}
                <div className={`${styles.magnetDot} ${styles.magnetRed}`} />
                <div className={`${styles.magnetDot} ${styles.magnetYellow}`} />
                <div className={`${styles.magnetDot} ${styles.magnetBlue}`} />

                <span className={styles.memoBoardHeader}>SCHEDULE / CHECKLIST</span>
                <ul className={styles.memoList}>
                  <li>1. Binders & Labs</li>
                  <li>2. Notebook / Folder</li>
                  <li>3. Thesis Dossier</li>
                  <li>4. Study Hall</li>
                </ul>
              </div>

              {/* ✏️ Magnetic Pencil Holder Cup (Photos 1 & 3) */}
              <div className={styles.magneticPencilCup}>
                <div className={styles.cupMagnetPin} />
                <div className={styles.pencilCupBody}>
                  <div className={styles.pensCluster}>
                    <span className={styles.penItem}>✏️</span>
                    <span className={styles.penItem}>🖋️</span>
                    <span className={styles.penItem}>🖍️</span>
                  </div>
                  <span className={styles.cupLabel}>Stationery Cup</span>
                </div>
              </div>

              {/* Taped Photo Polaroid Gallery */}
              {locker.images?.length > 0 && (
                <div className={styles.doorPhotoPolaroid}>
                  <div className={styles.tapeStripTop} />
                  <div
                    className={styles.polaroidFrame}
                    onClick={() => onOpenViewer('photo', { src: currentImg, alt: locker.institution })}
                  >
                    <img
                      src={currentImg}
                      alt={locker.institution}
                      className={styles.polaroidImg}
                      onLoad={() => setImageLoaded((prev) => ({ ...prev, [currentImg]: true }))}
                    />
                    <div className={styles.polaroidCaption}>
                      <span>{locker.shortName} Photo {currentImageIndex + 1}/{locker.images.length}</span>
                    </div>
                  </div>

                  {locker.images.length > 1 && (
                    <div className={styles.photoNavMini}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onImageChange((prev) => (prev === 0 ? locker.images.length - 1 : prev - 1)); }}
                      >
                        ‹
                      </button>
                      <span>Click to Enlarge</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onImageChange((prev) => (prev + 1) % locker.images.length); }}
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Handwritten Sticky Note / Quote */}
              {locker.note && (
                <div className={styles.stickyNote}>
                  <span className={styles.notePin}>📌</span>
                  <p className={styles.noteText}>“{locker.note}”</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className={styles.lockerNavFooter}>
          <button
            className={styles.navBtn}
            onClick={handlePrev}
            disabled={!canGoPrev}
          >
            ‹ Previous Locker
          </button>

          <button
            className={styles.navBtn}
            onClick={handleNext}
            disabled={!canGoNext}
          >
            Next Locker ›
          </button>
        </div>
      </div>
    </div>
  );
}