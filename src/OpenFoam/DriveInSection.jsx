// src/OpenFoam/DriveInSection.jsx
// THE DRIVE-IN — Authentic ticket booth, paper admit-one stubs, movie screen
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { specimens } from './openfoamData';
import styles from './DriveInSection.module.css';

import { TicketDispenser } from './TicketDispenser';
import DriveInScreen from './DriveInScreen';

export default function DriveInSection() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('dispenser'); // 'dispenser' | 'driveIn'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  const totalSpecimens = specimens.length;
  const currentSpecimen = specimens[currentIndex] || specimens[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSpecimens);
  }, [totalSpecimens]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSpecimens) % totalSpecimens);
  }, [totalSpecimens]);

  const handleEnterDriveIn = () => {
    setIsZooming(true);
    window.setTimeout(() => {
      setViewMode('driveIn');
      setIsZooming(false);
    }, 600);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape' && viewMode === 'driveIn') {
        setViewMode('dispenser');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  return (
    <div className={styles.container}>
      <div className={styles.starrySky} />

      {/* Prominent Floating "Go Back" Button (No Top Strip) */}
      <button
        type="button"
        className={styles.prominentBackBtn}
        onClick={() => navigate('/hub')}
        title="Return to Main Hub"
        aria-label="Go Back to Hub"
      >
        <span className={styles.backBtnArrow}>&larr;</span>
        <span className={styles.backBtnText}>GO BACK</span>
      </button>

      <main>
        {viewMode === 'dispenser' ? (
          <div className={isZooming ? styles.zoomOutStage : ''}>
            <TicketDispenser
              specimen={currentSpecimen}
              index={currentIndex}
              total={totalSpecimens}
              onEnterDriveIn={handleEnterDriveIn}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        ) : (
          <DriveInScreen
            specimens={specimens}
            currentIndex={currentIndex}
            onPrevIndex={handlePrev}
            onNextIndex={handleNext}
            onReturnToBooth={() => setViewMode('dispenser')}
          />
        )}
      </main>
    </div>
  );
}

