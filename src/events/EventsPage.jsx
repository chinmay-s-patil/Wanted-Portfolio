// src/events/EventsPage.jsx
// Event Projection Archive — 35mm Film Cartridge Shelf & Scroll Unraveling

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import eventsData from './eventsData';
import styles from './EventsPage.module.css';
import FilmCanister from './FilmCanister';
import FilmStripUnraveler from './FilmStripUnraveler';

export default function EventsPage() {
  const navigate = useNavigate();
  const [selectedReel, setSelectedReel] = useState(null);
  const [hoveredReel, setHoveredReel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleCanisterClick = useCallback((reel) => {
    setSelectedReel(reel);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedReel(null);
  }, []);

  return (
    <div className={styles.screeningRoom}>
      {/* Navigation Header */}
      <header className={styles.topNav}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/hub')}
          aria-label="Back to Office Hub"
        >
          ← Back to Hub
        </button>

        <div className={styles.headerTitleGroup}>
          <span className={styles.topBadge}>35MM FILM ROLLS</span>
          <h1 className={styles.mainHeading}>Event Projection Archive</h1>
        </div>

        <div style={{ width: '120px' }} aria-hidden="true" />
      </header>

      {/* Main 35mm Canister Shelf Stage */}
      <main className={styles.centerStage}>
        <div className={styles.shelfHeader}>
          <p className={styles.shelfInstruction}>
            Select a 35mm film cartridge from the rack to unroll its photo sequence
          </p>
        </div>

        {/* Canister Rack */}
        <div className={styles.shelfContainer}>
          <div className={styles.cartridgeRack}>
            {eventsData.map((reel) => (
              <FilmCanister
                key={reel.id}
                reel={reel}
                isSelected={selectedReel?.id === reel.id}
                isHovered={hoveredReel === reel.id}
                onHover={setHoveredReel}
                onLeave={() => setHoveredReel(null)}
                onClick={() => handleCanisterClick(reel)}
              />
            ))}
          </div>

          {/* Wooden Rack Shelf Base */}
          <div className={styles.woodenRackBase} />
        </div>
      </main>

      {/* 35mm Film Strip Scroll Unraveler Overlay */}
      {isOpen && selectedReel && (
        <FilmStripUnraveler reel={selectedReel} onClose={handleClose} />
      )}
    </div>
  );
}