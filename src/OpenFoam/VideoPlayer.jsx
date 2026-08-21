// src/OpenFoam/VideoPlayer.jsx
// Video player for the Drive-In movie screen with click-to-pause and HUD playback indicators.

import React, { useState, useRef, useEffect, useCallback } from 'react';

const getYouTubeEmbedUrl = (url) => {
  const patterns = [
    /[?&]v=([^&\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1&playlist=${match[1]}`;
    }
  }
  return url;
};

const VideoPlayer = ({ videoUrl, poster }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [showHud, setShowHud] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay active in drive-in
  
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const hudTimeoutRef = useRef(null);

  const isYouTube =
    videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  // Trigger HUD indicator pulse on state toggle
  const triggerHudPulse = () => {
    setShowHud(true);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setShowHud(false);
    }, 1100);
  };

  // Toggle Pause/Play
  const togglePlayPause = useCallback((e) => {
    e.stopPropagation();
    if (isYouTube) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        const action = isPaused ? 'playVideo' : 'pauseVideo';
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: action, args: [] }),
          '*'
        );
      }
      setIsPaused((prev) => !prev);
      triggerHudPulse();
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
      triggerHudPulse();
    }
  }, [isPaused, isYouTube]);

  useEffect(() => {
    return () => {
      if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    };
  }, []);

  return (
    <div
      onClick={togglePlayPause}
      style={{
        width: '100%',
        height: '100%',
        background: '#04070c',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
      }}
      title="Click screen to pause or play"
    >
      {/* PAUSE / PLAY HUD BADGE OVERLAY */}
      {showHud && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            background: 'rgba(0, 0, 0, 0.25)',
            animation: 'fadeInOut 1.1s ease-out',
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              border: '2px solid #fbbf24',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#fbbf24',
              fontFamily: "'Oswald', sans-serif",
              fontSize: '1.2rem',
              letterSpacing: '0.15em',
              boxShadow: '0 0 25px rgba(251, 191, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>{isPaused ? '⏸ PAUSED' : '▶ PLAYING'}</span>
          </div>
        </div>
      )}

      {isYouTube ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            pointerEvents: 'none', // Direct clicks go to outer container
          }}
        >
          <iframe
            ref={iframeRef}
            src={getYouTubeEmbedUrl(videoUrl)}
            title="Drive-In Video"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;