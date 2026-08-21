// src/OpenFoam/TicketDispenser.jsx
import React, { useState } from 'react';
import styles from './DriveInSection.module.css';

export function TicketCard({ specimen, index, total, onEnterDriveIn, isTearing }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleTicketClick = () => {
    setIsFlipped((flipped) => !flipped);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((flipped) => !flipped);
    }
  };

  const rawSerial = specimen.serial || String(index + 1).padStart(7, '0');
  const ticketNumber = rawSerial.replace(/\D/g, '').slice(-7).padStart(7, '0') || '0000001';
  const backNote = specimen.backNote || specimen.summary || 'OpenFOAM simulation case analysis stub.';

  return (
    <div className={`${styles.ticketPerspectiveWrapper} ${isTearing ? styles.ticketTearAnim : ''}`}>
      <div
        tabIndex={0}
        role="button"
        aria-label={`Ticket for ${specimen.title}. Click to ${isFlipped ? 'show front' : 'flip to back'}`}
        className={`${styles.ticketCard3D} ${isFlipped ? styles.ticketFlipped : ''}`}
        onClick={handleTicketClick}
        onKeyDown={handleKeyDown}
      >
        {/* FRONT — Mt. Clemens–style admit-one stub */}
        <div className={styles.ticketFace}>
          <div className={styles.ticketNotch} />
          <div className={`${styles.ticketNotch} ${styles.ticketNotchRight}`} />

          <div className={styles.ticketSideSerial} aria-hidden="true">{ticketNumber}</div>
          <div className={`${styles.ticketSideSerial} ${styles.ticketSideSerialRight}`} aria-hidden="true">
            {ticketNumber}
          </div>

          <div className={styles.ticketInner}>
            <div className={styles.ticketVenue}>STARLIGHT</div>
            <div className={styles.ticketVenueItalic}>Drive-In Theatre</div>
            <div className={styles.ticketLocation}>OPENFOAM CASE ARCHIVE</div>

            <div className={styles.ticketShowTitle}>{specimen.title}</div>

            <div className={styles.ticketMetaLine}>
              <span>MOVIE {index + 1}/{total}</span>
              <span>{specimen.year || 2025}</span>
              <span>{specimen.solver || 'OpenFOAM'}</span>
            </div>

            <div className={styles.ticketAdmitOne}>ADMIT ONE</div>
          </div>

          <div className={styles.ticketFooter}>
            <span className={styles.ticketHint}>CLICK TO FLIP</span>
            <button
              type="button"
              className={styles.enterDriveInBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEnterDriveIn();
              }}
            >
              ENTER DRIVE-IN &rarr;
            </button>
          </div>
        </div>

        {/* BACK — fine-print terms + case notes */}
        <div className={`${styles.ticketFace} ${styles.ticketBack}`}>
          <div className={styles.ticketNotch} />
          <div className={`${styles.ticketNotch} ${styles.ticketNotchRight}`} />

          <div className={styles.ticketSideSerial} aria-hidden="true">{ticketNumber}</div>
          <div className={`${styles.ticketSideSerial} ${styles.ticketSideSerialRight}`} aria-hidden="true">
            {ticketNumber}
          </div>

          <div className={styles.ticketInner}>
            <div className={styles.ticketBackHeader}>- ADMIT ONE -</div>
            <div className={styles.ticketBackSub}>GOOD THIS DATE ONLY</div>
            <p className={styles.ticketFinePrint}>
              The management reserves the right to refuse admission on this ticket
              by refunding purchase price. Also reserves the right to designate where
              the holder of this ticket shall be seated.
            </p>
            <div className={styles.ticketNoteText}>{backNote}</div>
            {specimen.metrics && (
              <div className={styles.ticketMetrics}>
                {specimen.metrics.join(' · ')}
              </div>
            )}
          </div>

          <div className={styles.ticketFooter}>
            <span className={styles.ticketHint}>&larr; FLIP FRONT</span>
            <button
              type="button"
              className={styles.enterDriveInBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEnterDriveIn();
              }}
            >
              WATCH DRIVE-IN &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TicketDispenser({
  specimen,
  index,
  total,
  onEnterDriveIn,
  onPrev,
  onNext,
}) {
  const [isDispensed, setIsDispensed] = useState(true);
  const [isTearing, setIsTearing] = useState(false);
  const [isSpinningRoll, setIsSpinningRoll] = useState(false);

  const handleDispense = () => {
    setIsSpinningRoll(true);
    setIsDispensed(false);
    setIsTearing(false);

    window.setTimeout(() => {
      setIsDispensed(true);
      setIsTearing(true);
      setIsSpinningRoll(false);
    }, 180);
  };

  return (
    <div className={styles.dispenserStage}>
      <div className={styles.boothMachine}>
        {/* Marquee — ribbed cream panel, bold red type, bottom bulbs */}
        <div className={styles.boothRoofSign} aria-hidden="false">
          <span className={styles.boothRoofSignLine}>TICKETS TO</span>
          <span className={styles.boothRoofSignLine}>ALL MOVIES</span>
          <div className={styles.boothMarqueeLights}>
            <span className={`${styles.boothBulb} ${styles.boothBulbRed}`} />
            <span className={`${styles.boothBulb} ${styles.boothBulbTeal}`} />
            <span className={`${styles.boothBulb} ${styles.boothBulbTeal}`} />
            <span className={`${styles.boothBulb} ${styles.boothBulbRed}`} />
          </div>
        </div>

        {/* Window glass + red door */}
        <div className={styles.boothCabinet}>
          <div className={styles.boothWindow}>
            <div className={styles.boothWindowGlass}>
              <div className={styles.boothSignage}>
                <div className={styles.boothPosterSign}>
                  <strong>FREE PASS REWARD</strong>
                  <span>IF YOU DO NOT RECEIVE AN ACCURATE RECEIPT AT TIME OF PURCHASE</span>
                </div>

                <div className={styles.boothKidsSign}>
                  <span className={styles.boothKidsLabel}>CHILDREN</span>
                  <span>11 and under get in <em>FREE!</em></span>
                </div>

                <div className={styles.boothAdmitSign}>
                  <span className={styles.boothAdmitLabel}>DRIVE-IN ADMISSION</span>
                  <span>{total} Simulation Movies on File</span>
                  <span>Always Open Access</span>
                </div>

                <div className={styles.boothCautionSign}>
                  CAUTION — SLOW NARROW ENTRANCE
                </div>

                <div className={styles.boothPhoneSign}>
                  MOVIE {index + 1} OF {total}
                </div>
              </div>

              <div className={styles.rollContainer}>
                <div className={`${styles.ticketRoll} ${isSpinningRoll ? styles.ticketRollSpin : ''}`}>
                  <div className={styles.ticketRollCore} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.boothDoor}>
            <div className={styles.boothDoorPane} />
            <div className={styles.boothDoorPane} />
            <div className={styles.boothDoorHandle} />
          </div>
        </div>

        <div className={styles.dispenseSlot} />

        <div className={styles.boothControls}>
          <button
            type="button"
            className={styles.reelNavBtn}
            onClick={onPrev}
            aria-label="Previous movie ticket"
          >
            &larr; PREV
          </button>

          <button
            type="button"
            className={styles.dispenseBtn}
            onClick={handleDispense}
          >
            PULL TICKET STUB
          </button>

          <button
            type="button"
            className={styles.reelNavBtn}
            onClick={onNext}
            aria-label="Next movie ticket"
          >
            NEXT &rarr;
          </button>
        </div>

        <div className={styles.boothCurb} />
      </div>

      {/* Rural mailbox accent in front of booth */}
      <div className={styles.boothMailbox} aria-hidden="true">
        <div className={styles.mailboxBody} />
        <div className={styles.mailboxFlag} />
        <div className={styles.mailboxPost} />
      </div>

      {isDispensed && (
        <TicketCard
          key={specimen.id || index}
          specimen={specimen}
          index={index}
          total={total}
          onEnterDriveIn={onEnterDriveIn}
          isTearing={isTearing}
        />
      )}
    </div>
  );
}
