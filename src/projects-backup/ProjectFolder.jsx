import { useEffect, useState, useRef } from 'react'

export default function ProjectFolder({ project, onClose }) {
  const [currentPage, setCurrentPage] = useState(1) // 1: Media & Summary, 2: Findings & Tools
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const videoRefs = useRef([])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    if (!project.media || project.media.length === 0) return

    const currentMedia = project.media[currentMediaIndex]

    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause()
      }
    })

    const currentVideo = videoRefs.current[currentMediaIndex]
    if (currentVideo && currentMedia?.type === 'video') {
      currentVideo.currentTime = 0
      currentVideo.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log('Autoplay prevented:', err)
          setIsPlaying(false)
        })
    }
  }, [currentMediaIndex, project.media])

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause()
        }
      })
    }
  }, [])

  if (!project) return null

  const hasMultipleMedia = project.media && project.media.length > 1

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % project.media.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + project.media.length) % project.media.length)
  }

  const togglePlayVideo = () => {
    const currentVideo = videoRefs.current[currentMediaIndex]
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play()
        setIsPlaying(true)
      } else {
        currentVideo.pause()
        setIsPlaying(false)
      }
    }
  }

  const handlePageTurn = (targetPage) => {
    if (isFlipping || targetPage === currentPage) return
    setIsFlipping(true)
    setTimeout(() => {
      setCurrentPage(targetPage)
      setIsFlipping(false)
    }, 280)
  }

  const getYouTubeEmbedUrl = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
      /(?:youtube\.com\/embed\/)([^?\s]+)/,
      /(?:youtu\.be\/)([^?\s]+)/,
      /(?:youtube\.com\/v\/)([^?\s]+)/
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        const videoId = match[1]
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&controls=1&playlist=${videoId}`
      }
    }

    return url
  }

  return (
    <div className="project-folder-modal-root" onClick={onClose}>
      {/* Darkened Backdrop */}
      <div className="project-folder-backdrop" />

      {/* Manila Folder Shell */}
      <div className="manila-folder-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Top Folder Tab */}
        <div className="manila-tab">
          <span>CASE FILE #{project.id?.substring(0, 8).toUpperCase()}</span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="folder-close-btn"
          onClick={onClose}
          aria-label="Close folder"
          title="Close case file (ESC)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Paper Document Page */}
        <div className={`paper-document ${isFlipping ? 'flipping' : ''}`} key={currentPage}>
          {/* Metallic Paperclip Clipping the Top-Left Edge */}
          <div className="paperclip-container">
            <svg viewBox="0 0 24 52" fill="none" style={{ width: '100%', height: '100%' }}>
              {/* Back Loop */}
              <path
                d="M8 18V36C8 39.3137 10.6863 42 14 42C17.3137 42 20 39.3137 20 36V12C20 6.47715 15.5228 2 10 2C4.47715 2 0 6.47715 0 12V38"
                stroke="#686662"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Front Loop clipping over paper */}
              <path
                d="M6 18V36C6 38.2091 7.79086 40 10 40C12.2091 40 14 38.2091 14 36V14"
                stroke="#a4a29e"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Typewriter Document Header */}
          <div className="folder-doc-header">
            <div className="folder-doc-sub">
              <span>DEPARTMENT OF ENGINEERING INVESTIGATIONS</span>
              <span>EXHIBIT PAGE {currentPage} OF 2</span>
            </div>

            <h2 className="folder-doc-title">
              {project.title}
            </h2>

            <div className="folder-doc-meta">
              <span><strong>CATEGORY:</strong> {project.category?.toUpperCase() || 'GENERAL'}</span>
              <span>&bull;</span>
              <span><strong>DATE FILED:</strong> {project.period}</span>
            </div>
          </div>

          {/* PAGE 1: MEDIA & EXECUTIVE OVERVIEW */}
          {currentPage === 1 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {/* Media Deck */}
              {project.media && project.media.length > 0 && (
                <div className="evidence-media-deck">
                  {/* Viewport */}
                  <div className="evidence-media-viewport">
                    {/* Top Overlay Badge */}
                    <div className="evidence-media-header">
                      <div className="evidence-media-badge">
                        EXHIBIT {currentMediaIndex + 1} OF {project.media.length} &bull; {(project.media[currentMediaIndex]?.type || 'FILE').toUpperCase()}
                      </div>
                    </div>

                    {/* Media Items */}
                    {project.media.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: idx === currentMediaIndex ? 1 : 0,
                          transition: 'opacity 0.35s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          pointerEvents: idx === currentMediaIndex ? 'auto' : 'none'
                        }}
                      >
                        {item.type === 'link' && (
                          <iframe
                            src={getYouTubeEmbedUrl(item.src)}
                            title={item.caption || project.title}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}

                        {item.type === 'video' && (
                          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <video
                              ref={(el) => (videoRefs.current[idx] = el)}
                              src={item.src}
                              loop
                              muted
                              playsInline
                              onClick={togglePlayVideo}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                            />
                            {!isPlaying && idx === currentMediaIndex && (
                              <button
                                type="button"
                                className="media-play-overlay-btn"
                                onClick={togglePlayVideo}
                                aria-label="Play video"
                              >
                                &#9654;
                              </button>
                            )}
                          </div>
                        )}

                        {item.type === 'image' && (
                          <img
                            src={item.src}
                            alt={item.caption || project.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              background: 'radial-gradient(circle, #1a1612 0%, #080706 100%)'
                            }}
                          />
                        )}
                      </div>
                    ))}

                    {/* Prev/Next Overlay Buttons */}
                    {hasMultipleMedia && (
                      <>
                        <button
                          type="button"
                          className="media-nav-overlay-btn media-nav-prev"
                          onClick={prevMedia}
                          aria-label="Previous exhibit"
                        >
                          &#9664;
                        </button>

                        <button
                          type="button"
                          className="media-nav-overlay-btn media-nav-next"
                          onClick={nextMedia}
                          aria-label="Next exhibit"
                        >
                          &#9654;
                        </button>
                      </>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="evidence-media-caption">
                    <span>{project.media[currentMediaIndex]?.caption || project.title}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.65 }}>PHOTOGRAPHIC EVIDENCE REEL</span>
                  </div>

                  {/* Filmstrip Thumbnails Row */}
                  {hasMultipleMedia && (
                    <div className="evidence-filmstrip">
                      {project.media.map((m, i) => (
                        <div
                          key={i}
                          className={`filmstrip-thumb ${i === currentMediaIndex ? 'active' : ''}`}
                          onClick={() => setCurrentMediaIndex(i)}
                          title={`Exhibit #${i + 1}`}
                        >
                          {m.type === 'image' && (
                            <img src={m.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          {m.type === 'video' && (
                            <span style={{ fontSize: '0.75rem', color: '#c4a574' }}>▶ VID</span>
                          )}
                          {m.type === 'link' && (
                            <span style={{ fontSize: '0.75rem', color: '#c4a574' }}>🎬 YT</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Executive Summary */}
              {project.description && (
                <div>
                  <h3 className="folder-section-title">
                    [1.0] EXECUTIVE SUMMARY
                  </h3>
                  <p className="folder-summary-text">
                    {project.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* PAGE 2: FINDINGS & HIGH-VISIBILITY TECH TAGS */}
          {currentPage === 2 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Findings Section */}
              {project.learnings && project.learnings.length > 0 && (
                <div>
                  <h3 className="folder-section-title">
                    [2.0] INVESTIGATION FINDINGS & RESULTS
                  </h3>
                  <div className="finding-card-list">
                    {project.learnings.map((learning, i) => (
                      <div key={i} className="finding-card">
                        <span className="finding-card-num">
                          #{i + 1}
                        </span>
                        <span className="finding-card-text">
                          {learning}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High-Visibility Technical Equipment Badges */}
              {project.tags && project.tags.length > 0 && (
                <div style={{ marginTop: '0.4rem' }}>
                  <h3 className="folder-section-title">
                    [3.0] TECHNICAL EQUIPMENT & TOOLING
                  </h3>
                  <div className="evidence-tags-row">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="evidence-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC PAGE TURN CORNER CURLS */}
          {/* On Page 1 -> Show Bottom-Right corner curl to flip to Page 2 */}
          {currentPage === 1 && (
            <div
              className="page-turn-curl curl-right"
              onClick={() => handlePageTurn(2)}
              title="Turn to Page 2 (Findings & Tech Stack)"
            >
              <div className="curl-visual" />
              <div className="curl-label">PG 2 ➔</div>
            </div>
          )}

          {/* On Page 2 -> Show Bottom-Left corner curl to flip back to Page 1 */}
          {currentPage === 2 && (
            <div
              className="page-turn-curl curl-left"
              onClick={() => handlePageTurn(1)}
              title="Turn back to Page 1 (Executive Summary)"
            >
              <div className="curl-visual" />
              <div className="curl-label">⬅ PG 1</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}