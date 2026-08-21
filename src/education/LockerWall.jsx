// src/education/LockerWall.jsx
// 2-Row School Hallway Locker Bank - Streamlined & High Performance

import { useMemo } from 'react';
import styles from './LockerWall.module.css';
import { FILLER_LOCKERS } from './lockers';

export default function LockerWall({ lockers, onSelect, openLockerId }) {
  // Construct a strict 2-Row x 6-Column grid
  const gridMatrix = useMemo(() => {
    const matrix = [
      [null, null, null, null, null, null], // Row 1 (Top)
      [null, null, null, null, null, null], // Row 2 (Bottom)
    ];

    // Place real lockers
    lockers.forEach((l) => {
      if (l.row && l.col) {
        matrix[l.row - 1][l.col - 1] = { kind: 'real', data: l };
      }
    });

    // Fill remaining slots with filler lockers
    FILLER_LOCKERS.forEach((f) => {
      if (matrix[f.row - 1][f.col - 1] === null) {
        matrix[f.row - 1][f.col - 1] = { kind: 'filler', data: f };
      }
    });

    return matrix;
  }, [lockers]);

  return (
    <div className={styles.hallwayContainer}>
      <div className={styles.hallwayWall}>

        {/* Streamlined Metal Locker Bank Frame */}
        <div className={styles.lockerBankFrame}>
          {/* 3D Frame Side Walls */}
          <div className={styles.frameSideLeft} />
          <div className={styles.frameSideRight} />

          <div className={styles.lockerGrid}>
            {gridMatrix.map((row, rIdx) => (
              <div key={`row-${rIdx}`} className={styles.lockerRow}>
                {row.map((slot, cIdx) => {
                  if (!slot) return <div key={`empty-${rIdx}-${cIdx}`} className={styles.emptySlot} />;

                  if (slot.kind === 'real') {
                    return (
                      <RealLockerDoor
                        key={slot.data.id}
                        locker={slot.data}
                        isOpen={openLockerId === slot.data.id}
                        onSelect={() => onSelect(slot.data.id)}
                      />
                    );
                  }

                  return <FillerLockerDoor key={slot.data.id} locker={slot.data} />;
                })}
              </div>
            ))}
          </div>

          {/* Metal Base Plinth */}
          <div className={styles.bankPlinth} />
        </div>
      </div>
    </div>
  );
}

/* ─── REAL LOCKER DOOR ─── */
function RealLockerDoor({ locker, isOpen, onSelect }) {
  const isLocked = locker.locked;

  return (
    <button
      className={`${styles.lockerDoor} ${styles.realLocker} ${isLocked ? styles.lockedState : ''} ${isOpen ? styles.openState : ''}`}
      onClick={onSelect}
      disabled={isLocked}
      style={{ '--locker-color': locker.color }}
      aria-label={`${locker.number} - ${locker.degree || locker.message}`}
    >
      {/* 3D Metal Door Hinges */}
      <div className={styles.doorHingeTop} />
      <div className={styles.doorHingeBottom} />
      <div className={styles.doorBevelShine} />

      {/* Door Face */}
      <div className={styles.doorFace}>

        {/* Top Silver Riveted Number Plate */}
        <div className={styles.topNumberPlate}>
          <span className={styles.plateRivetLeft} />
          <span className={styles.numberText}>{locker.number}</span>
          <span className={styles.plateRivetRight} />
        </div>

        {/* Top 6-Slot Louvers */}
        <div className={styles.ventClusterTop}>
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <div key={v} className={styles.ventLouver} />
          ))}
        </div>

        {/* Center Recessed Chrome Handle Cup & Lift Latch */}
        <div className={styles.recessedHandleCup}>
          <div className={styles.liftLatchBar} />
          <div className={styles.keyholeDial} />
        </div>

        {/* Academic Label Tag */}
        <div className={styles.academicLabelTag}>
          <span className={styles.tagLabel}>{locker.label}</span>
          <span className={styles.tagShort}>{locker.shortName || 'TBD'}</span>
        </div>

        {/* LED Indicator */}
        <div className={`${styles.statusLed} ${isLocked ? styles.ledLocked : styles.ledActive}`} />

        {/* Bottom 6-Slot Louvers */}
        <div className={styles.ventClusterBottom}>
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <div key={v} className={styles.ventLouver} />
          ))}
        </div>
      </div>

      {/* Hover Chip */}
      <div className={styles.hoverChip}>
        {isLocked ? locker.message : '🔓 OPEN LOCKER'}
      </div>
    </button>
  );
}

/* ─── FILLER LOCKER DOOR ─── */
function FillerLockerDoor({ locker }) {
  return (
    <div
      className={`${styles.lockerDoor} ${styles.fillerLocker}`}
      style={{ '--locker-color': locker.color }}
      aria-hidden="true"
    >
      <div className={styles.doorHingeTop} />
      <div className={styles.doorHingeBottom} />
      <div className={styles.doorBevelShine} />
      <div className={styles.doorFace}>

        <div className={styles.topNumberPlate}>
          <span className={styles.plateRivetLeft} />
          <span className={styles.numberText}>{locker.number}</span>
          <span className={styles.plateRivetRight} />
        </div>

        <div className={styles.ventClusterTop}>
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <div key={v} className={styles.ventLouver} />
          ))}
        </div>

        <div className={styles.recessedHandleCup}>
          <div className={styles.liftLatchBar} />
          <div className={styles.keyholeDial} />
        </div>

        <div className={styles.ventClusterBottom}>
          {[1, 2, 3, 4, 5, 6].map((v) => (
            <div key={v} className={styles.ventLouver} />
          ))}
        </div>
      </div>
    </div>
  );
}