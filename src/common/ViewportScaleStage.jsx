// src/common/ViewportScaleStage.jsx
// Universal scale stage component that fits a 1920×1080 canvas seamlessly to any resolution or OS DPI scaling.
import React, { useEffect, useState } from 'react';
import styles from './ViewportScaleStage.module.css';

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
  className = '',
}) {
  const [scale, setScale] = useState(() =>
    computeScale(window.innerWidth, window.innerHeight, width, height)
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
    <div className={`${styles.scaleViewport} ${className}`}>
      <div
        className={styles.scaleCanvas}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
