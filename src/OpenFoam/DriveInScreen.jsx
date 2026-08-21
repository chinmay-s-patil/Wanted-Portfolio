// src/OpenFoam/DriveInScreen.jsx
import React, { useState, lazy, Suspense } from 'react';
import styles from './DriveInSection.module.css';
import { TicketCard } from './TicketDispenser';

const VideoPlayer = lazy(() => import('./VideoPlayer'));

export default function DriveInScreen({
  specimens,
  currentIndex,
  onPrevIndex,
  onNextIndex,
  onReturnToBooth,
}) {
  const [showReview, setShowReview] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [activeCamIdx, setActiveCamIdx] = useState(0);

  const currentSpecimen = specimens[currentIndex] || specimens[0];
  const total = specimens.length;

  // Handle multi-video camera streams
  const currentVideos = currentSpecimen?.media?.videos || [
    currentSpecimen?.media?.video || { src: null, poster: null },
  ];
  
  const activeVideo = currentVideos[activeCamIdx] || currentVideos[0];
  const videoSrc = activeVideo?.src || null;
  const posterSrc = activeVideo?.poster || null;

  const handlePrevMovie = () => {
    setActiveCamIdx(0);
    onPrevIndex();
  };

  const handleNextMovie = () => {
    setActiveCamIdx(0);
    onNextIndex();
  };

  return (
    <div className={`${styles.driveInTheaterContainer} ${styles.fadeInStage}`}>
      
      {/* STARLIGHT MARQUEE HEADER (TOP CONTROL BAR - CLEANED) */}
      <div className={styles.screenMarquee}>
        
        {/* Left: Return to Booth Button */}
        <div className={styles.marqueeNavControls}>
          <button
            type="button"
            className={styles.marqueeBtn}
            onClick={onReturnToBooth}
            title="Return to Ticket Booth"
          >
            🎟 TICKET BOOTH
          </button>
        </div>

        {/* Center: Title & Movie Status */}
        <div className={styles.marqueeCenterMeta}>
          <div className={styles.nowShowingText}>
            ★ STARLIGHT DRIVE-IN CINEMA ★ MOVIE #{currentIndex + 1} OF {total}
          </div>
          <h2 className={styles.nowShowingTitle}>
            {currentSpecimen.title}
          </h2>
        </div>

        {/* Right: Camera Selector or Clean Spacer */}
        <div className={styles.marqueeNavControls}>
          {/* Note: Marquee ticket button removed per user request */}
        </div>

      </div>

      {/* MULTI-VIDEO CAMERA ANGLE SELECTOR TABS (IF MULTIPLE VIDEOS EXIST) */}
      {currentVideos.length > 1 && (
        <div className={styles.cameraAngleBar}>
          <span className={styles.cameraAngleLabel}>📹 PROJECTION ANGLES:</span>
          {currentVideos.map((vid, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.cameraAngleTab} ${
                activeCamIdx === idx ? styles.cameraAngleTabActive : ''
              }`}
              onClick={() => setActiveCamIdx(idx)}
            >
              {vid.label || `CAM ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* ENLARGED OUTDOOR DRIVE-IN THEATER STAGE */}
      <div className={styles.outdoorTheaterLot}>

        {/* ACCESSIBLE TICKET BADGE BUTTON (TOP RIGHT OF LOT) */}
        <button
          type="button"
          className={styles.lotTicketBadge}
          onClick={() => setShowTicketModal(!showTicketModal)}
          title="Click to view/flip your admission ticket stub"
        >
          <span>🎟 MY TICKET STUB</span>
        </button>

        {/* GTA V STYLE SMARTPHONE TRIGGER BADGE (BOTTOM RIGHT) */}
        {!showReview && (
          <button
            type="button"
            className={styles.gtaPhoneBadge}
            onClick={() => setShowReview(true)}
            title="Open iFruit Simulation Review Phone"
          >
            <span className={styles.gtaPhoneBadgeIcon}>📱</span>
            <span className={styles.gtaPhoneBadgeText}>SIMULATION REVIEW</span>
          </button>
        )}

        {/* SILHOUETTED PINE TREELINE OVERLAYS */}
        <div className={styles.treelineLeft}>
          <svg viewBox="0 0 200 400" preserveAspectRatio="none" className={styles.treeSvg}>
            <polygon points="0,400 60,400 30,220 50,230 25,120 40,130 20,40 0,60" fill="#050a10" />
            <polygon points="40,400 110,400 75,180 95,190 70,90 85,100 65,10 30,400" fill="#080e18" />
            <polygon points="90,400 170,400 130,240 150,250 120,140 138,150 115,50 80,400" fill="#04070c" />
            <polygon points="140,400 200,400 170,280 185,290 160,190 175,200 155,110 130,400" fill="#070c14" />
          </svg>
        </div>

        <div className={styles.treelineRight}>
          <svg viewBox="0 0 200 400" preserveAspectRatio="none" className={styles.treeSvg}>
            <polygon points="200,400 140,400 170,220 150,230 175,120 160,130 180,40 200,60" fill="#050a10" />
            <polygon points="160,400 90,400 125,180 105,190 130,90 115,100 135,10 170,400" fill="#080e18" />
            <polygon points="110,400 30,400 70,240 50,250 80,140 62,150 85,50 120,400" fill="#04070c" />
            <polygon points="60,400 0,400 30,280 15,290 40,190 25,200 45,110 70,400" fill="#070c14" />
          </svg>
        </div>

        {/* GIANT OUTDOOR MOVIE SCREEN TOWER (MAXIMIZED VIEWPORT AREA) */}
        <div className={styles.screenTowerStructure}>
          
          {/* Main Billboard Screen Bezel */}
          <div className={styles.cinemaScreenFrame}>
            <div key={`${currentIndex}-${activeCamIdx}`} className={`${styles.screenViewport} ${styles.movieCrossfade}`}>
              {videoSrc ? (
                <Suspense
                  fallback={(
                    <div className={styles.screenFallback}>
                      LOADING MOVIE STREAM...
                    </div>
                  )}
                >
                  <VideoPlayer key={`${currentIndex}-${activeCamIdx}`} videoUrl={videoSrc} poster={posterSrc} />
                </Suspense>
              ) : (
                <div className={styles.screenFallback}>
                  <div className={styles.screenFallbackTitle}>{currentSpecimen.title}</div>
                  <div className={styles.screenFallbackMeta}>
                    Category: {currentSpecimen.category} | Solver: {currentSpecimen.solver || 'OpenFOAM'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Heavy Wooden / Steel Support Tower Legs */}
          <div className={styles.screenTowerLegs}>
            <div className={styles.towerLeg} />
            <div className={styles.towerCrossBrace} />
            <div className={styles.towerLeg} />
            <div className={styles.towerCrossBraceRight} />
            <div className={styles.towerLeg} />
          </div>
        </div>

        {/* GTA V STYLE SMARTPHONE OVERLAY IN THE BOTTOM-RIGHT CORNER */}
        {showReview && (
          <div className={styles.gtaPhoneContainer}>
            <div className={styles.androidPhoneDevice}>
              
              {/* Physical Side Buttons */}
              <div className={styles.phoneVolumeButtons} />
              <div className={styles.phonePowerButton} />

              {/* Phone Inner Display */}
              <div className={styles.phoneScreen}>

                {/* Top Hole Punch Notch */}
                <div className={styles.phoneCameraPunchHole} />

                {/* Android Status Bar */}
                <div className={styles.phoneStatusBar}>
                  <div className={styles.statusTime}>09:41</div>
                  <div className={styles.statusIcons}>
                    <span>🎬</span>
                    <span>5G 📶</span>
                    <span>87% 🔋</span>
                  </div>
                </div>

                {/* Android App Header */}
                <div className={styles.phoneAppHeader}>
                  <div className={styles.phoneAppTitle}>
                    <span>STARLIGHT REVIEWS</span>
                  </div>
                  <div className={styles.phoneAppActions}>
                    <button
                      type="button"
                      className={styles.phoneCloseBtn}
                      onClick={() => setShowReview(false)}
                      title="Close Phone (GTA V Style)"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Scrollable Phone App Content */}
                <div className={styles.phoneScreenScroll}>
                  
                  {/* Hero Review Header */}
                  <div className={styles.phoneReviewHero}>
                    <div className={styles.phoneGenreBadge}>
                      {currentSpecimen.category || 'CFD SIMULATION'}
                    </div>
                    <h3 className={styles.phoneMovieTitle}>
                      {currentSpecimen.title}
                    </h3>
                    <div className={styles.phoneStarRow}>
                      <span className={styles.phoneStars}>★★★★★</span>
                      <span className={styles.phoneScore}>4.9 / 5.0</span>
                    </div>
                    <div className={styles.phoneReviewerMeta}>
                      Reviewed by <strong>Dr. CFD Critic</strong> • {currentSpecimen.solver || 'OpenFOAM'}
                    </div>
                  </div>

                  {/* Critic's Synopsis */}
                  <div className={styles.phoneReviewCard}>
                    <div className={styles.phoneCardLabel}>CRITIC'S SYNOPSIS &amp; SUMMARY</div>
                    <p className={styles.phoneCardText}>
                      "{currentSpecimen.summary}"
                    </p>
                  </div>

                  {/* Physical Dynamics & Solver */}
                  <div className={styles.phoneReviewCard}>
                    <div className={styles.phoneCardLabel}>PHYSICAL DYNAMICS &amp; SOLVER</div>
                    <p className={styles.phoneCardText}>
                      {currentSpecimen.approach}
                    </p>
                    {currentSpecimen.result && (
                      <p className={`${styles.phoneCardText} ${styles.phoneCardTextHighlight}`}>
                        <strong>Key Result:</strong> {currentSpecimen.result}
                      </p>
                    )}
                  </div>

                  {/* Setup & Mesh */}
                  {currentSpecimen.details && (
                    <div className={styles.phoneReviewCard}>
                      <div className={styles.phoneCardLabel}>SIMULATION SETUP &amp; MESH</div>
                      <ul className={styles.phoneDetailsList}>
                        {currentSpecimen.details.setup && (
                          <li><strong>Setup:</strong> {currentSpecimen.details.setup}</li>
                        )}
                        {currentSpecimen.details.mesh && (
                          <li><strong>Mesh:</strong> {currentSpecimen.details.mesh}</li>
                        )}
                        {currentSpecimen.details.solver && (
                          <li><strong>Solver:</strong> {currentSpecimen.details.solver}</li>
                        )}
                        {currentSpecimen.details.turbulence && (
                          <li><strong>Turbulence:</strong> {currentSpecimen.details.turbulence}</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  <div className={styles.phoneReviewCard}>
                    <div className={styles.phoneCardLabel}>PERFORMANCE METRICS</div>
                    <div className={styles.phoneMetricsGrid}>
                      {currentSpecimen.metrics && currentSpecimen.metrics.map((metric, idx) => (
                        <div key={idx} className={styles.phoneMetricChip}>
                          ⚡ {metric}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* controlDict OpenFOAM Config */}
                  {currentSpecimen.controlDict && (
                    <div className={styles.phoneReviewCard}>
                      <div className={styles.phoneCardLabel}>openfoam controlDict CONFIG</div>
                      <pre className={styles.phoneCodeSnippet}>
                        {currentSpecimen.controlDict}
                      </pre>
                    </div>
                  )}

                  <div className={styles.phoneFooterSpacer} />
                </div>

                {/* Bottom Home Bar */}
                <div className={styles.phoneBottomNav}>
                  <div className={styles.phoneHomeBar} />
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TRANSLUCENT TICKET MODAL OVERLAY (NO HEAVY BLACK BOX) */}
        {showTicketModal && (
          <div className={styles.ticketModalOverlay} onClick={() => setShowTicketModal(false)}>
            <div className={styles.ticketModalFloatingContainer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.floatingTicketHeader}>
                <span className={styles.floatingTicketHint}>🎟 CLICK TICKET TO FLIP NOTE</span>
                <button
                  type="button"
                  className={styles.floatingCloseBtn}
                  onClick={() => setShowTicketModal(false)}
                  aria-label="Close ticket"
                >
                  ✕
                </button>
              </div>
              <TicketCard
                specimen={currentSpecimen}
                index={currentIndex}
                total={total}
                onEnterDriveIn={() => setShowTicketModal(false)}
              />
            </div>
          </div>
        )}

        {/* GRASSY DRIVE-IN FIELD GROUND */}
        <div className={styles.grassyLotGround} />

        {/* INTERACTIVE PARKED CARS FOREGROUND (CLICK CARS FOR PREV / NEXT MOVIE) */}
        <div className={styles.parkedCarsForeground}>
          
          <div className={styles.speakerPoleLeft}>
            <div className={styles.speakerHead} />
            <div className={styles.speakerPole} />
          </div>
          
          <div className={styles.speakerPoleRight}>
            <div className={styles.speakerHead} />
            <div className={styles.speakerPole} />
          </div>

          <div className={styles.carSilhouetteGroup}>
            
            {/* LEFT CAR: PREVIOUS MOVIE CONTROL */}
            <div
              className={`${styles.interactiveCar} ${styles.carPrevMovie}`}
              onClick={handlePrevMovie}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePrevMovie();
                }
              }}
              title="Click car to play Previous Movie (←)"
              aria-label="Previous Movie Car"
            >
              <div className={styles.carNavBadge}>
                <span>◀ PREV MOVIE</span>
              </div>
              <svg viewBox="0 0 200 90" className={styles.carSvgLeft}>
                {/* Underglow */}
                <ellipse cx="100" cy="80" rx="80" ry="8" fill="#38bdf8" opacity="0.3" className={styles.underglowCyan} />
                {/* Wheels */}
                <circle cx="45" cy="70" r="14" fill="#090d16" stroke="#475569" strokeWidth="2" />
                <circle cx="45" cy="70" r="6" fill="#94a3b8" />
                <circle cx="155" cy="70" r="14" fill="#090d16" stroke="#475569" strokeWidth="2" />
                <circle cx="155" cy="70" r="6" fill="#94a3b8" />
                {/* Main Body (Muscle Coupe silhouette) */}
                <path d="M12,68 L15,46 Q22,35 48,32 L75,15 Q95,8 140,8 L168,32 Q188,34 192,46 L192,68 Z" fill="#080e18" stroke="#1e293b" strokeWidth="2" />
                {/* Glass Window */}
                <path d="M78,17 L135,17 L158,32 L70,32 Z" fill="#38bdf8" opacity="0.25" />
                {/* Taillights Glow */}
                <circle cx="20" cy="50" r="5" fill="#ef4444" className={styles.taillightGlow} />
                {/* Headlights Glow */}
                <circle cx="185" cy="50" r="6" fill="#fef08a" opacity="0.9" className={styles.headlightGlow} />
              </svg>
            </div>

            {/* RIGHT CAR: NEXT MOVIE CONTROL */}
            <div
              className={`${styles.interactiveCar} ${styles.carNextMovie}`}
              onClick={handleNextMovie}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNextMovie();
                }
              }}
              title="Click car to play Next Movie (→)"
              aria-label="Next Movie Car"
            >
              <div className={styles.carNavBadge}>
                <span>NEXT MOVIE ▶</span>
              </div>
              <svg viewBox="0 0 220 95" className={styles.carSvgRight}>
                {/* Underglow */}
                <ellipse cx="110" cy="85" rx="90" ry="9" fill="#f59e0b" opacity="0.35" className={styles.underglowAmber} />
                {/* Wheels */}
                <circle cx="48" cy="74" r="15" fill="#090d16" stroke="#475569" strokeWidth="2" />
                <circle cx="48" cy="74" r="7" fill="#fbbf24" />
                <circle cx="170" cy="74" r="15" fill="#090d16" stroke="#475569" strokeWidth="2" />
                <circle cx="170" cy="74" r="7" fill="#fbbf24" />
                {/* GTA V Sports Supercar Body */}
                <path d="M15,72 L18,48 Q26,36 54,34 L80,14 Q105,6 155,6 L185,34 Q208,36 214,48 L214,72 Z" fill="#0a0a10" stroke="#334155" strokeWidth="2" />
                {/* Glass Window */}
                <path d="M83,16 L150,16 L175,34 L75,34 Z" fill="#fbbf24" opacity="0.22" />
                {/* Headlights Glow */}
                <circle cx="28" cy="52" r="6" fill="#fef08a" opacity="0.9" className={styles.headlightGlow} />
                {/* Taillights Glow */}
                <circle cx="204" cy="52" r="5" fill="#ef4444" className={styles.taillightGlow} />
              </svg>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

