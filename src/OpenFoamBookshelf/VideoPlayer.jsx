// src/components/OpenFoamBookshelf/VideoPlayer.jsx
import React, { useState, useCallback } from 'react';

const VideoPlayer = ({ videoUrl, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  if (!isPlaying) {
    return (
      <div className={styles.videoContainer}>
        <button 
          className={styles.videoPoster}
          onClick={handlePlay}
          aria-label="Play video"
        >
          {poster ? (
            <img src={poster} alt="Video poster" className={styles.posterImage} />
          ) : (
            <div className={styles.playButton}>▶</div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.videoContainer}>
      <iframe
        src={videoUrl}
        title="Project video"
        className={styles.videoFrame}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;