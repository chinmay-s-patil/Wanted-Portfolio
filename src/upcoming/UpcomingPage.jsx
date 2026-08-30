// src/upcoming/UpcomingPage.jsx
'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import upcomingProjects from './upcomingData'
import ViewportScaleStage from '../common/ViewportScaleStage'

// ─── CONFIG ──────────────────────────────────────────────────────────
const BASE_SWEEP_DURATION_S = 8

const TIMELINE_RADIUS = {
	'Early Dev': 0.22,
	'2025': 0.38,
	'2025+': 0.46,
	'2025-2026': 0.60,
	'2026+': 0.78,
	'TBD': 0.92,
}

const RANGE_BANDS = [
	{ r: 0.22, label: 'NEAR' },
	{ r: 0.46, label: '2025' },
	{ r: 0.60, label: '2025–26' },
	{ r: 0.78, label: '2026+' },
	{ r: 0.92, label: 'UNCONFIRMED' },
]

const CATEGORY_COLORS = {
	Academic: '#00E0FF',
	Software: '#FF3CA6',
	Visualization: '#FF8C3C',
	Research: '#00FF66',
	Experimental: '#C046FF',
	Community: '#FFD166', // Warm Solar Gold (distinct from Academic cyan!)
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function getRadius(timeline) {
	return TIMELINE_RADIUS[timeline] ?? 0.55
}

function hashString(str) {
	let h = 0
	for (let i = 0; i < str.length; i++) {
		h = ((h << 5) - h) + str.charCodeAt(i)
		h |= 0
	}
	return Math.abs(h)
}

/** 0° = straight up (12 o'clock), clockwise */
function polarToPercent(radiusFraction, angleDeg) {
	const rad = (angleDeg - 90) * (Math.PI / 180)
	return {
		x: 50 + radiusFraction * 50 * Math.cos(rad),
		y: 50 + radiusFraction * 50 * Math.sin(rad),
	}
}

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function UpcomingPage() {
	const navigate = useNavigate()
	const [selectedId, setSelectedId] = useState(null)
	const [showList, setShowList] = useState(false)
	const [reducedMotion, setReducedMotion] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	// Tactical Controls & HUD State
	const [selectedCategory, setSelectedCategory] = useState('ALL')
	const [sweepSpeed, setSweepSpeed] = useState(1) // 0.5, 1, 2, 0 (paused)
	const [currentAzimuth, setCurrentAzimuth] = useState(0)

	const scopeRef = useRef(null)
	const animationFrameRef = useRef(null)
	const startTimeRef = useRef(Date.now())

	// Detect reduced motion & viewport
	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
		setReducedMotion(mq.matches)
		const onChange = (e) => setReducedMotion(e.matches)
		mq.addEventListener?.('change', onChange)

		const checkMobile = () => setIsMobile(window.innerWidth < 768)
		checkMobile()
		window.addEventListener('resize', checkMobile)

		return () => {
			mq.removeEventListener?.('change', onChange)
			window.removeEventListener('resize', checkMobile)
		}
	}, [])

	// Track live radar azimuth angle (0° to 360°)
	useEffect(() => {
		if (reducedMotion || sweepSpeed === 0) return

		const updateAzimuth = () => {
			const elapsedSec = (Date.now() - startTimeRef.current) / 1000
			const durationSec = BASE_SWEEP_DURATION_S / sweepSpeed
			const angle = ((elapsedSec % durationSec) / durationSec) * 360
			setCurrentAzimuth(Math.round(angle))
			animationFrameRef.current = requestAnimationFrame(updateAzimuth)
		}

		animationFrameRef.current = requestAnimationFrame(updateAzimuth)
		return () => {
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
		}
	}, [sweepSpeed, reducedMotion])

	// Global Escape key
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape' && selectedId) {
				setSelectedId(null)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [selectedId])

	// Derive categories in first-seen order
	const categories = useMemo(() => {
		const cats = []
		const seen = new Set()
		for (const p of upcomingProjects) {
			if (!seen.has(p.category)) {
				seen.add(p.category)
				cats.push(p.category)
			}
		}
		return cats
	}, [])

	const sectorWidth = 360 / categories.length
	const sectorBoundaries = Array.from({ length: categories.length }, (_, i) => i * sectorWidth)

	// Compass Ticks every 30°
	const compassTicks = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const deg = i * 30
			const rad = (deg - 90) * (Math.PI / 180)
			const R_INNER = 230
			const R_OUTER = 236
			const x1 = 300 + R_INNER * Math.cos(rad)
			const y1 = 300 + R_INNER * Math.sin(rad)
			const x2 = 300 + R_OUTER * Math.cos(rad)
			const y2 = 300 + R_OUTER * Math.sin(rad)
			const labelPos = {
				x: 300 + (R_INNER - 11) * Math.cos(rad),
				y: 300 + (R_INNER - 11) * Math.sin(rad)
			}
			return { deg, x1, y1, x2, y2, labelPos }
		})
	}, [])

	// Compute geometry for every project
	const projectsWithGeo = useMemo(() => {
		return upcomingProjects.map((p) => {
			const catIdx = categories.indexOf(p.category)
			const baseAngle = catIdx * sectorWidth + sectorWidth / 2
			const jitter = ((hashString(p.id) % 9) - 4) // ±4° deterministic spread
			const angle = baseAngle + jitter
			const radius = getRadius(p.timeline)
			const pos = polarToPercent(radius, angle)
			const sweepDuration = BASE_SWEEP_DURATION_S / (sweepSpeed || 1)
			const delay = (angle / 360) * sweepDuration
			return { ...p, angle, radius, pos, delay }
		})
	}, [categories, sectorWidth, sweepSpeed])

	const selectedProject = useMemo(
		() => projectsWithGeo.find((p) => p.id === selectedId) || null,
		[projectsWithGeo, selectedId]
	)

	const handleSelect = useCallback((id) => {
		setSelectedId((prev) => (prev === id ? null : id))
	}, [])

	const handleClose = useCallback(() => setSelectedId(null), [])

	// Arrow-key cycling between blips
	const handleBlipKeyDown = useCallback(
		(e, id) => {
			const sorted = [...projectsWithGeo].sort((a, b) => a.angle - b.angle)
			const idx = sorted.findIndex((p) => p.id === id)

			if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
				e.preventDefault()
				const next = sorted[(idx + 1) % sorted.length]
				document.getElementById(`blip-${next.id}`)?.focus()
			} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
				e.preventDefault()
				const prev = sorted[(idx - 1 + sorted.length) % sorted.length]
				document.getElementById(`blip-${prev.id}`)?.focus()
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				handleSelect(id)
			}
		},
		[projectsWithGeo, handleSelect]
	)

	const sweepDurationCss = `${BASE_SWEEP_DURATION_S / (sweepSpeed || 1)}s`

	return (
		<div
			className={reducedMotion ? 'reduced-motion' : ''}
			style={{
				width: '100vw',
				height: '100vh',
				minHeight: '100vh',
					background: 'radial-gradient(circle at 50% 50%, #12161f 0%, #0a0c12 60%, #050609 100%)',
					overflow: 'hidden',
					position: 'relative',
				fontFamily: "'Orbitron', 'Inter', sans-serif",
				color: '#fff',
				userSelect: 'none',
				WebkitUserSelect: 'none'
			}}
		>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

				:root {
					--sweep-duration: ${sweepDurationCss};
					--cyan: #00E0FF;
					--scope-container-size: min(80vw, 80vh);
				}

				@keyframes sweep-rotate {
					from { transform: rotate(0deg); }
					to   { transform: rotate(360deg); }
				}

				@keyframes blip-ping {
					0%, 100% { opacity: 0.35; transform: scale(1); }
					3%       { opacity: 1; transform: scale(1.6); }
					8%       { opacity: 0.85; transform: scale(1); }
					25%      { opacity: 0.5; }
					40%      { opacity: 0.35; }
				}

				@keyframes ring-pulse {
					0%   { transform: scale(1); opacity: 0.7; }
					8%   { transform: scale(3.2); opacity: 0; }
					100% { transform: scale(3.2); opacity: 0; }
				}

				@keyframes bracket-in {
					from { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
					to   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
				}

				@keyframes panel-slide-in-right {
					from { transform: translateX(100%); opacity: 0; }
					to   { transform: translateX(0); opacity: 1; }
				}

				@keyframes panel-slide-in-bottom {
					from { transform: translateY(100%); opacity: 0; }
					to   { transform: translateY(0); opacity: 1; }
				}

				@keyframes dashOffset {
					from { stroke-dashoffset: 20; }
					to   { stroke-dashoffset: 0; }
				}

				@keyframes eqBar {
					0%   { height: 15%; opacity: 0.4; }
					100% { height: 100%; opacity: 1; }
				}

				.scope-container {
					width: var(--scope-container-size);
					height: var(--scope-container-size);
					max-width: 660px;
					max-height: 660px;
					position: relative;
					flex-shrink: 0;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				/* Metallic Console Bezel framing the inner radar tube */
				.scope-bezel {
					width: 78.5%;
					height: 78.5%;
					position: absolute;
					border-radius: 50%;
					background: radial-gradient(circle at 50% 50%, #070911 0%, #04050a 75%, #020306 100%);
					box-shadow:
						inset 0 0 80px rgba(0, 224, 255, 0.08),
						0 0 50px rgba(0, 0, 0, 0.95),
						0 0 0 4px #1b202c,
						0 0 0 10px #0c0e14;
					border: 2px solid rgba(0, 224, 255, 0.3);
					padding: 4px;
					box-sizing: border-box;
					z-index: 2;
				}

				.scope-inner {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					position: relative;
					overflow: hidden;
					border: 1px solid rgba(0, 224, 255, 0.25);
				}

				.annulus-segment {
					cursor: pointer;
					transition: all 0.2s ease;
				}
				.annulus-segment:hover {
					filter: brightness(1.4) drop-shadow(0 0 8px var(--segment-color));
				}

				.range-ring {
					position: absolute;
					border-radius: 50%;
					border: 1px dashed rgba(0, 224, 255, 0.16);
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					pointer-events: none;
				}

				.sector-line {
					position: absolute;
					left: 50%;
					top: 0;
					width: 1px;
					height: 50%;
					background: linear-gradient(180deg, rgba(0, 224, 255, 0.2), transparent);
					transform-origin: center bottom;
					pointer-events: none;
				}

				.sweep-line {
					position: absolute;
					inset: 0;
					border-radius: 50%;
					background: conic-gradient(
						from 0deg,
						transparent 0deg,
						transparent 340deg,
						rgba(0, 224, 255, 0.04) 346deg,
						rgba(0, 224, 255, 0.2) 354deg,
						rgba(0, 224, 255, 0.6) 359deg,
						rgba(0, 224, 255, 0.9) 360deg
					);
					animation: sweep-rotate var(--sweep-duration) linear infinite;
					animation-play-state: ${sweepSpeed === 0 ? 'paused' : 'running'};
					pointer-events: none;
				}

				.blip {
					position: absolute;
					width: 44px;
					height: 44px;
					transform: translate(-50%, -50%);
					background: none;
					border: none;
					cursor: pointer;
					padding: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 10;
					outline: none;
					transition: opacity 0.3s ease;
				}

				.blip-dot {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background: var(--blip-color);
					opacity: 0.4;
					transition: opacity 0.25s, transform 0.25s;
					animation: blip-ping var(--sweep-duration) linear infinite;
					animation-play-state: ${sweepSpeed === 0 ? 'paused' : 'running'};
					animation-delay: var(--blip-delay);
					box-shadow: 0 0 10px var(--blip-color);
				}

				.blip:hover .blip-dot,
				.blip:focus .blip-dot {
					opacity: 1;
					transform: scale(1.5);
					box-shadow: 0 0 16px var(--blip-color);
				}

				.blip-ring {
					position: absolute;
					width: 10px;
					height: 10px;
					border-radius: 50%;
					border: 1.5px solid var(--blip-color);
					opacity: 0;
					animation: ring-pulse var(--sweep-duration) linear infinite;
					animation-play-state: ${sweepSpeed === 0 ? 'paused' : 'running'};
					animation-delay: var(--blip-delay);
					pointer-events: none;
				}

				.target-bracket {
					position: absolute;
					width: 32px;
					height: 32px;
					transform: translate(-50%, -50%);
					pointer-events: none;
					z-index: 12;
					animation: bracket-in 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
				}
				.bracket-corner {
					position: absolute;
					width: 10px;
					height: 10px;
					border-color: var(--bracket-color, #00E0FF);
					border-style: solid;
				}
				.bracket-tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
				.bracket-tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
				.bracket-bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
				.bracket-br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

				.readout-panel {
					background: rgba(10, 13, 20, 0.97);
					backdrop-filter: blur(20px);
					border-left: 2px solid var(--readout-accent, #00E0FF);
					box-shadow: -10px 0 40px rgba(0, 0, 0, 0.85);
					display: flex;
					flex-direction: column;
					overflow-y: auto;
					animation: panel-slide-in-right 0.35s cubic-bezier(0.4, 0, 0.2, 1);
					user-select: text;
					WebkitUserSelect: text;
				}

				@media (max-width: 767px) {
					.readout-panel {
						border-left: none;
						border-top: 2px solid var(--readout-accent, #00E0FF);
						animation: panel-slide-in-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1);
					}
				}
			`}</style>

			{/* Background subtle console grid */}
			<div
				aria-hidden="true"
				style={{
					position: 'fixed', inset: 0,
					backgroundImage: `
						linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
						linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
					`,
					backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0,
					maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
					WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
				}}
			/>

			{/* Back Button */}
			<button
				onClick={() => navigate('/hub')}
				style={{
					position: 'fixed', top: '1.5rem', left: '1.5rem',
					background: 'rgba(0, 224, 255, 0.08)', backdropFilter: 'blur(10px)',
					border: '1.5px solid rgba(0, 224, 255, 0.35)', color: '#00E0FF',
					padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem',
					cursor: 'pointer', zIndex: 1000, fontFamily: "'Orbitron', sans-serif",
					fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.25s ease'
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = 'rgba(0, 224, 255, 0.22)'
					e.currentTarget.style.borderColor = 'rgba(0, 224, 255, 0.65)'
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = 'rgba(0, 224, 255, 0.08)'
					e.currentTarget.style.borderColor = 'rgba(0, 224, 255, 0.35)'
				}}
			>
				← BACK TO OFFICE
			</button>

			{/* Header Title */}
			<div style={{
				position: 'absolute', top: '1.2rem', left: '50%', transform: 'translateX(-50%)',
				textAlign: 'center', zIndex: 10, pointerEvents: 'none'
			}}>
				<h1 style={{
					fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 900,
					background: 'linear-gradient(135deg, #00E0FF 0%, #FF3CA6 50%, #FF8C3C 100%)',
					WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
					margin: 0, letterSpacing: '0.12em'
				}}>
					UPCOMING RADAR
				</h1>
				<div style={{
					fontSize: '0.68rem', color: '#00E0FF', letterSpacing: '0.28em',
					textTransform: 'uppercase', opacity: 0.8, marginTop: '0.2rem',
					fontFamily: "'JetBrains Mono', monospace"
				}}>
					RADAR CONSOLE TELEMETRY &bull; AZIMUTH: {String(currentAzimuth).padStart(3, '0')}°
				</div>
			</div>

			{/* Top Right HUD Controls */}
			<div style={{
				position: 'fixed', top: '1.5rem', right: '1.5rem',
				display: 'flex', alignItems: 'center', gap: '0.6rem', zIndex: 1000
			}}>
				{/* List View Toggle */}
				<button
					onClick={() => setShowList((s) => !s)}
					style={{
						background: 'rgba(255, 60, 166, 0.1)', border: '1.5px solid rgba(255, 60, 166, 0.35)',
						color: '#FF3CA6', padding: '0.5rem 1rem', borderRadius: '10px',
						fontSize: '0.8rem', cursor: 'pointer', fontFamily: "'Orbitron', sans-serif",
						fontWeight: 700, letterSpacing: '0.05em', transition: 'all 0.25s ease'
					}}
				>
					{showList ? 'HIDE LIST' : 'VIEW AS LIST'}
				</button>
			</div>

			{/* MAIN RADAR VIEWPORT */}
			<div style={{
				width: '100%', height: '100%', display: 'flex', alignItems: 'center',
				justifyContent: 'center', padding: isMobile ? '5.5rem 1rem 1rem' : '5.5rem 2rem 3rem',
				gap: '2rem', flexDirection: isMobile ? 'column' : 'row'
			}}>
				{/* SCOPE & ANNULUS CONTAINER */}
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>

					{/* MAIN SCOPE CONTAINER (WITH SLEEK SLEEK OUTER SEGMENTED ANNULUS) */}
					<div className="scope-container" ref={scopeRef}>

						{/* OUTER SLEEK SEGMENTED ANNULUS RING SVG */}
						<svg viewBox="0 0 600 600" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
							<defs>
								{categories.map((cat, i) => {
									const startA = i * sectorWidth + 1.5
									const endA = (i + 1) * sectorWidth - 1.5
									const centerA = i * sectorWidth + sectorWidth / 2
									const R_TEXT = 252
									const isBottom = centerA > 90 && centerA < 270

									const ta1Rad = ((isBottom ? endA - 2 : startA + 2) - 90) * Math.PI / 180
									const ta2Rad = ((isBottom ? startA + 2 : endA - 2) - 90) * Math.PI / 180

									const tx1 = 300 + R_TEXT * Math.cos(ta1Rad)
									const ty1 = 300 + R_TEXT * Math.sin(ta1Rad)
									const tx2 = 300 + R_TEXT * Math.cos(ta2Rad)
									const ty2 = 300 + R_TEXT * Math.sin(ta2Rad)

									const sweepFlag = isBottom ? 0 : 1

									return (
										<path
											key={`annulus-text-path-${cat}`}
											id={`annulus-text-path-${i}`}
											d={`M ${tx1} ${ty1} A ${R_TEXT} ${R_TEXT} 0 0 ${sweepFlag} ${tx2} ${ty2}`}
										/>
									)
								})}
							</defs>

							{/* Render Sleek Donut Segment Arcs (Width reduced to 29px) */}
							{categories.map((cat, i) => {
								const catColor = CATEGORY_COLORS[cat] || '#00E0FF'
								const isCatActive = selectedCategory === 'ALL' || selectedCategory === cat
								const startA = i * sectorWidth + 1.5
								const endA = (i + 1) * sectorWidth - 1.5

								const R_OUTER = 266
								const R_INNER = 237

								const a1Rad = (startA - 90) * Math.PI / 180
								const a2Rad = (endA - 90) * Math.PI / 180

								const ox1 = 300 + R_OUTER * Math.cos(a1Rad)
								const oy1 = 300 + R_OUTER * Math.sin(a1Rad)
								const ox2 = 300 + R_OUTER * Math.cos(a2Rad)
								const oy2 = 300 + R_OUTER * Math.sin(a2Rad)

								const ix1 = 300 + R_INNER * Math.cos(a1Rad)
								const iy1 = 300 + R_INNER * Math.sin(a1Rad)
								const ix2 = 300 + R_INNER * Math.cos(a2Rad)
								const iy2 = 300 + R_INNER * Math.sin(a2Rad)

								const pathD = `M ${ox1} ${oy1} A ${R_OUTER} ${R_OUTER} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${R_INNER} ${R_INNER} 0 0 0 ${ix1} ${iy1} Z`

								return (
									<g key={`annulus-seg-${cat}`}>
										<path
											d={pathD}
											className="annulus-segment"
											fill={isCatActive ? `${catColor}30` : 'rgba(12, 16, 24, 0.5)'}
											stroke={isCatActive ? catColor : `${catColor}40`}
											strokeWidth={isCatActive ? '2' : '1'}
											style={{ '--segment-color': catColor }}
											onClick={() => setSelectedCategory((prev) => (prev === cat ? 'ALL' : cat))}
										/>
									</g>
								)
							})}

							{/* Render Compass Degree Ticks around the Bezel Rim */}
							{compassTicks.map((tick) => (
								<g key={`tick-${tick.deg}`}>
									<line
										x1={tick.x1} y1={tick.y1}
										x2={tick.x2} y2={tick.y2}
										stroke="rgba(0, 224, 255, 0.4)" strokeWidth="1.2"
									/>
									<text
										x={tick.labelPos.x} y={tick.labelPos.y}
										fill="rgba(0, 224, 255, 0.45)" fontSize="7"
										fontFamily="'JetBrains Mono', monospace"
										textAnchor="middle" dominantBaseline="middle"
									>
										{String(tick.deg).padStart(3, '0')}°
									</text>
								</g>
							))}

							{/* Render Sector Category Curved Text inside Sleek Annulus Segments */}
							{categories.map((cat, i) => {
								const catColor = CATEGORY_COLORS[cat] || '#00E0FF'
								const isCatActive = selectedCategory === 'ALL' || selectedCategory === cat
								return (
									<text
										key={`annulus-text-${cat}`}
										fill={isCatActive ? catColor : `${catColor}70`}
										fontSize="10.5"
										fontWeight="800"
										fontFamily="'Orbitron', sans-serif"
										letterSpacing="0.14em"
										style={{
											pointerEvents: 'none',
											textShadow: isCatActive ? `0 0 8px ${catColor}A0` : 'none',
											transition: 'all 0.3s ease'
										}}
									>
										<textPath href={`#annulus-text-path-${i}`} startOffset="50%" textAnchor="middle">
											{cat.toUpperCase()}
										</textPath>
									</text>
								)
							})}
						</svg>

						{/* CENTRAL RADAR SCOPE CIRCLE */}
						<div className="scope-bezel">
							<div className="scope-inner">

								{/* Range Rings */}
								{RANGE_BANDS.map((band) => {
									const size = band.r * 100
									return (
										<div
											key={band.label}
											className="range-ring"
											style={{ width: `${size}%`, height: `${size}%` }}
										/>
									)
								})}

								{/* Sector Divider Lines */}
								{sectorBoundaries.map((angle, i) => (
									<div
										key={i}
										className="sector-line"
										style={{ transform: `rotate(${angle}deg)` }}
									/>
								))}

								{/* Center Crosshair Marker */}
								<div style={{
									position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
									width: '16px', height: '16px', pointerEvents: 'none'
								}}>
									<div style={{ position: 'absolute', left: '50%', top: 0, width: '1px', height: '100%', background: 'rgba(0, 224, 255, 0.7)' }} />
									<div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(0, 224, 255, 0.7)' }} />
								</div>

								{/* Rotating Radar Sweep Line */}
								{!reducedMotion && <div className="sweep-line" aria-hidden="true" />}

								{/* VECTOR LOCK LINE SVG */}
								{selectedProject && (
									<svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 8 }}>
										<line
											x1="50%"
											y1="50%"
											x2={`${selectedProject.pos.x}%`}
											y2={`${selectedProject.pos.y}%`}
											stroke={selectedProject.color}
											strokeWidth="1.5"
											strokeDasharray="4 4"
											style={{ animation: 'dashOffset 1s linear infinite' }}
										/>
									</svg>
								)}

								{/* Project Blips */}
								{projectsWithGeo.map((p) => {
									const isFiltered = selectedCategory === 'ALL' || p.category === selectedCategory
									return (
										<button
											key={p.id}
											id={`blip-${p.id}`}
											className="blip"
											style={{
												left: `${p.pos.x}%`,
												top: `${p.pos.y}%`,
												'--blip-color': p.color,
												'--blip-delay': `${p.delay}s`,
												opacity: isFiltered ? 1 : 0.15,
												pointerEvents: isFiltered ? 'auto' : 'none'
											}}
											onClick={() => handleSelect(p.id)}
											onKeyDown={(e) => handleBlipKeyDown(e, p.id)}
											aria-label={`${p.title}. ${p.category}. Timeline ${p.timeline}. Press Enter to view details.`}
											tabIndex={isFiltered ? 0 : -1}
										>
											<div className="blip-ring" aria-hidden="true" />
											<div className="blip-dot" aria-hidden="true" />
										</button>
									)
								})}

								{/* Target Lock Reticle */}
								{selectedProject && (
									<div
										className="target-bracket"
										style={{
											left: `${selectedProject.pos.x}%`,
											top: `${selectedProject.pos.y}%`,
											'--bracket-color': selectedProject.color,
										}}
									>
										<div className="bracket-corner bracket-tl" />
										<div className="bracket-corner bracket-tr" />
										<div className="bracket-corner bracket-bl" />
										<div className="bracket-corner bracket-br" />
									</div>
								)}

								{/* Range Labels */}
								{RANGE_BANDS.map((band) => {
									const pos = polarToPercent(band.r, 0)
									return (
										<div
											key={band.label}
											style={{
												position: 'absolute', left: `${pos.x}%`, top: `${pos.y - 2}%`,
												transform: 'translateX(-50%)', fontSize: '0.55rem',
												color: 'rgba(0, 224, 255, 0.45)', fontFamily: "'JetBrains Mono', monospace",
												letterSpacing: '0.08em', pointerEvents: 'none',
												textShadow: '0 0 4px rgba(0,0,0,0.9)'
											}}
										>
											{band.label}
										</div>
									)
								})}

							</div>
						</div>

					</div>

					{/* Console Controls Desk Shelf */}
					<div style={{
						display: 'flex', alignItems: 'center', gap: '1rem',
						padding: '0.5rem 1rem', background: 'rgba(15, 20, 30, 0.6)',
						border: '1px solid rgba(0, 224, 255, 0.2)', borderRadius: '12px',
						boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
					}}>
						{/* Active Category Readout / Reset */}
						<button
							onClick={() => setSelectedCategory('ALL')}
							style={{
								background: selectedCategory === 'ALL' ? 'rgba(0, 224, 255, 0.2)' : 'rgba(0,0,0,0.3)',
								border: `1px solid ${selectedCategory === 'ALL' ? '#00E0FF' : 'rgba(0, 224, 255, 0.2)'}`,
								color: selectedCategory === 'ALL' ? '#fff' : 'rgba(0, 224, 255, 0.7)',
								padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.62rem',
								cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700
							}}
						>
							FILTER: {selectedCategory.toUpperCase()} {selectedCategory !== 'ALL' && '(RESET)'}
						</button>

						{/* Speed Controls */}
						<div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
							<span style={{ fontSize: '0.6rem', color: 'rgba(0, 224, 255, 0.55)', fontFamily: "'JetBrains Mono', monospace" }}>SWEEP:</span>
							{[
								{ label: '0.5X', val: 0.5 },
								{ label: '1X', val: 1 },
								{ label: '2X', val: 2 },
								{ label: 'PAUSE', val: 0 },
							].map((sp) => (
								<button
									key={sp.label}
									onClick={() => setSweepSpeed(sp.val)}
									style={{
										background: sweepSpeed === sp.val ? 'rgba(0, 224, 255, 0.25)' : 'rgba(0,0,0,0.4)',
										border: `1px solid ${sweepSpeed === sp.val ? '#00E0FF' : 'rgba(0, 224, 255, 0.2)'}`,
										color: sweepSpeed === sp.val ? '#fff' : 'rgba(0, 224, 255, 0.65)',
										padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.6rem',
										cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace"
									}}
								>
									{sp.label}
								</button>
							))}
						</div>
					</div>
				</div>

				{/* TARGET READOUT PANEL */}
				{selectedProject && (
					<div
						className="readout-panel"
						role="dialog"
						aria-label={`Details for ${selectedProject.title}`}
						style={{
							width: isMobile ? '100%' : '380px',
							maxWidth: isMobile ? '100%' : '380px',
							minWidth: isMobile ? 'auto' : '320px',
							height: isMobile ? 'auto' : 'min(70vh, 630px)',
							maxHeight: isMobile ? '50vh' : '630px',
							borderRadius: isMobile ? '20px 20px 0 0' : '16px',
							border: `1.5px solid ${selectedProject.color}50`,
							position: isMobile ? 'fixed' : 'relative',
							bottom: isMobile ? 0 : 'auto',
							right: isMobile ? 0 : 'auto',
							zIndex: isMobile ? 2000 : 10,
							padding: '1.75rem',
						}}
					>
						{/* Close Button */}
						<button
							onClick={handleClose}
							style={{
								position: 'absolute', top: '1rem', right: '1rem',
								width: '36px', height: '36px', borderRadius: '50%',
								background: 'transparent', border: `1.5px solid ${selectedProject.color}40`,
								color: selectedProject.color, cursor: 'pointer',
								display: 'flex', alignItems: 'center', justifyContent: 'center',
								fontSize: '1rem', transition: 'all 0.2s ease', zIndex: 10
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = `${selectedProject.color}20`
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'transparent'
								e.currentTarget.style.transform = 'scale(1)'
							}}
						>
							✕
						</button>

						{/* Contact Header */}
						<div style={{
							fontSize: '0.68rem', fontFamily: "'JetBrains Mono', monospace",
							letterSpacing: '0.15em', color: selectedProject.color, marginBottom: '0.8rem'
						}}>
							CONTACT // {selectedProject.id.toUpperCase().replace(/-/g, '_')}
						</div>

						{/* Equalizer Spectrum Bar Visualizer */}
						<div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '20px', marginBottom: '1.2rem' }}>
							{[...Array(18)].map((_, i) => (
								<div
									key={i}
									style={{
										flex: 1,
										background: selectedProject.color,
										borderRadius: '1px',
										animation: 'eqBar 0.7s ease-in-out infinite alternate',
										animationDelay: `${(i % 6) * 0.08}s`
									}}
								/>
							))}
						</div>

						{/* Icon & Title */}
						<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
							<div style={{
								fontSize: '2.5rem', filter: `drop-shadow(0 4px 16px ${selectedProject.color}70)`
							}}>
								{selectedProject.icon}
							</div>
							<div>
								<div style={{
									display: 'inline-flex', padding: '0.2rem 0.6rem',
									background: `${selectedProject.color}20`, border: `1px solid ${selectedProject.color}`,
									borderRadius: '12px', fontSize: '0.62rem', fontWeight: 700,
									color: selectedProject.color, letterSpacing: '0.1em',
									textTransform: 'uppercase', marginBottom: '0.3rem'
								}}>
									{selectedProject.status}
								</div>
								<h2 style={{
									fontSize: '1.3rem', fontWeight: 900, color: '#fff', margin: 0,
									lineHeight: 1.2, fontFamily: "'Orbitron', sans-serif"
								}}>
									{selectedProject.title}
								</h2>
							</div>
						</div>

						{/* Category & Timeline */}
						<div style={{
							display: 'flex', gap: '1.25rem', marginBottom: '1.25rem',
							fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace"
						}}>
							<span style={{ color: selectedProject.color, fontWeight: 600 }}>
								{selectedProject.category}
							</span>
							<span style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
								🕒 {selectedProject.timeline}
							</span>
						</div>

						{/* Description */}
						<p style={{
							fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.8)',
							marginBottom: '1.25rem'
						}}>
							{selectedProject.details}
						</p>

						{/* Tags */}
						<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
							{selectedProject.tags.map((tag, i) => (
								<span
									key={i}
									style={{
										padding: '0.3rem 0.65rem', background: `${selectedProject.color}15`,
										border: `1px solid ${selectedProject.color}35`, borderRadius: '10px',
										fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.9)',
										fontFamily: "'JetBrains Mono', monospace"
									}}
								>
									#{tag}
								</span>
							))}
						</div>

						{/* Bearing & Range Footer Readout */}
						<div style={{
							marginTop: 'auto', padding: '0.65rem 0.9rem', background: 'rgba(0, 0, 0, 0.4)',
							borderRadius: '8px', border: '1px solid rgba(0, 224, 255, 0.15)',
							fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem',
							color: 'rgba(0, 224, 255, 0.7)', display: 'flex', justifyContent: 'space-between'
						}}>
							<span>BEARING: {String(Math.round(selectedProject.angle)).padStart(3, '0')}°</span>
							<span>RANGE: {(selectedProject.radius * 100).toFixed(0)}%</span>
						</div>
					</div>
				)}
			</div>

			{/* ACCESSIBLE OVERLAY LIST */}
			{showList && (
				<div style={{
					position: 'fixed', inset: 0, background: 'rgba(8, 10, 16, 0.97)',
					backdropFilter: 'blur(20px)', zIndex: 1500, padding: '5rem 2rem 2rem',
					overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center'
				}}>
					<button
						onClick={() => setShowList(false)}
						style={{
							position: 'fixed', top: '1.5rem', right: '1.5rem',
							width: '40px', height: '40px', borderRadius: '50%',
							background: 'rgba(255, 60, 166, 0.1)', border: '1.5px solid rgba(255, 60, 166, 0.4)',
							color: '#FF3CA6', cursor: 'pointer', display: 'flex',
							alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', zIndex: 1600
						}}
					>
						✕
					</button>

					<h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '1.4rem', color: '#00E0FF', marginBottom: '1.5rem' }}>
						TARGETS ON SCOPE ({upcomingProjects.length})
					</h2>

					<ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
						{projectsWithGeo.map((p) => (
							<li key={p.id}>
								<button
									onClick={() => {
										handleSelect(p.id)
										setShowList(false)
									}}
									style={{
										width: '100%', textAlign: 'left', background: 'rgba(255, 255, 255, 0.03)',
										border: `1.5px solid ${p.color}35`, borderRadius: '12px',
										padding: '0.85rem 1.1rem', color: '#fff', cursor: 'pointer',
										display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease'
									}}
								>
									<span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
									<div style={{ flex: 1 }}>
										<div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '0.9rem' }}>
											{p.title}
										</div>
										<div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
											{p.category} &bull; {p.timeline} &bull; {p.status}
										</div>
									</div>
									<span style={{ color: p.color, fontSize: '0.8rem' }}>→</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* BOTTOM STATUS BAR */}
			<div style={{
				position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px',
				background: 'rgba(8, 10, 14, 0.96)', borderTop: '1px solid rgba(0, 224, 255, 0.15)',
				display: 'flex', alignItems: 'center', justifyContent: 'space-between',
				padding: '0 1.5rem', fontFamily: "'JetBrains Mono', monospace",
				fontSize: '0.62rem', color: 'rgba(0, 224, 255, 0.55)', zIndex: 1000
			}}>
				<span>SYS.RADAR.ONLINE</span>
				<span>AZIMUTH: {String(currentAzimuth).padStart(3, '0')}°</span>
				<span>CONTACTS: {upcomingProjects.length}</span>
				<span>{new Date().toISOString().slice(0, 19).replace('T', ' ')} UTC</span>
			</div>
		</div>
	)
}