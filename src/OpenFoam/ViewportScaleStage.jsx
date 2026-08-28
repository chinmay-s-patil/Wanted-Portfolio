// src/OpenFoam/ViewportScaleStage.jsx
// Scales a fixed 1920×1080 design canvas to fit any viewport (1280×720, 125% OS scaling, etc.)
import { useEffect, useState } from 'react';
import styles from './DriveInSection.module.css';

export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;

function computeScale(viewportWidth, viewportHeight, designWidth, designHeight) {
  if (!viewportWidth || !viewportHeight) return 1;
  return Math.min(viewportWidth / designWidth, viewportHeight / designHeight);
}

export default function ViewportScaleStage({
  children,
  width = DESIGN_WIDTH,
  height = DESIGN_HEIGHT,
}) {
  const [scale, setScale] = useState(() =>
    computeScale(window.innerWidth, window.innerHeight, width, height),
  );

  useEffect(() => {
    const updateScale = () => {
      setScale(computeScale(window.innerWidth, window.innerHeight, width, height));
    };

    updateScale();
    window.addEventListener('resize', updateScale);

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      visualViewport?.removeEventListener('resize', updateScale);
    };
  }, [width, height]);

  return (
    <div className={styles.scaleViewport}>
      <div
        className={styles.scaleCanvas}
        style={{
          width,
          height,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
