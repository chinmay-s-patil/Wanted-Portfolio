// src/events/FilmCanister.jsx
// Iconic 35mm Film Cartridge Component based on Kodak/Fujifilm film rolls

import styles from './FilmCanister.module.css';

export default function FilmCanister({ reel, isSelected, isHovered, onHover, onLeave, onClick }) {
  // Brand color presets based on 35mm film stock
  const brandThemes = {
    'drone-vitc': { main: '#eab308', accent: '#ca8a04', text: '#000', brand: 'KODAK GOLD 400' },
    'iisc-do-drone': { main: '#06b6d4', accent: '#0891b2', text: '#fff', brand: 'FUJICOLOR PRO 200' },
    'isawe': { main: '#38bdf8', accent: '#0284c7', text: '#fff', brand: 'ILFORD HP5 PLUS' },
    'ncwe': { main: '#f97316', accent: '#ea580c', text: '#fff', brand: 'AGFA PHOTO 100' },
  };

  const theme = brandThemes[reel.id] || brandThemes['drone-vitc'];

  return (
    <button
      className={`${styles.canisterCard} ${isSelected ? styles.canisterSelected : ''}`}
      onClick={onClick}
      onMouseEnter={() => onHover(reel.id)}
      onMouseLeave={onLeave}
      aria-label={`Open 35mm film roll: ${reel.title}`}
    >
      <div className={styles.canisterAssembly}>
        {/* Top Spindle Knob */}
        <div className={styles.spindleTop}>
          <div className={styles.spindleKnob} />
        </div>

        {/* Canister Body */}
        <div className={styles.canisterBody}>
          {/* Top Metallic Rim */}
          <div className={styles.metalRimTop} />

          {/* Label Wrap */}
          <div
            className={styles.labelWrap}
            style={{
              background: `linear-gradient(135deg, ${theme.main} 0%, ${theme.accent} 100%)`,
              color: theme.text,
            }}
          >
            <span className={styles.brandName}>{theme.brand}</span>
            <h4 className={styles.reelTitle}>{reel.title}</h4>
            <div className={styles.labelFooter}>
              <span className={styles.isoTag}>ISO 400</span>
              <span className={styles.expTag}>{reel.frames?.length || 0} EXP</span>
              <span className={styles.yearTag}>{reel.year}</span>
            </div>
          </div>

          {/* Bottom Metallic Rim */}
          <div className={styles.metalRimBottom} />

          {/* Black Felt Lip Slot (where film exits) */}
          <div className={styles.feltLip}>
            <div className={styles.feltVelvet} />
          </div>

          {/* Extruded Film Leader Tongue sticking out */}
          <div className={styles.filmLeaderTongue}>
            <div className={styles.leaderSprocketTop} />
            <div className={styles.leaderSprocketBottom} />
          </div>
        </div>

        {/* Bottom Spindle Cap */}
        <div className={styles.spindleBottom} />
      </div>

      <div className={styles.canisterShadow} />
    </button>
  );
}
