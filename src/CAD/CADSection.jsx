'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CADGLTFList from './CADGLTFList'

export default function CADSection() {
  const [selectedSpool, setSelectedSpool] = useState(null)
  const [printPhase, setPrintPhase] = useState('idle') // 'idle' | 'warming' | 'printing' | 'done'
  const [printProgress, setPrintProgress] = useState(0)
  const navigate = useNavigate()
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 })
  const [isTransparent, setIsTransparent] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [wireframe, setWireframe] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [autoRotate, setAutoRotate] = useState(false)
  const [showAxes, setShowAxes] = useState(false)
  const ITEMS_PER_PAGE = 6

  // Print progress animation
  useEffect(() => {
    if (printPhase !== 'printing') return
    const duration = 3500
    const startTime = Date.now()
    let rafId

    const tick = () => {
      const elapsed = Date.now() - startTime
      const p = Math.min(elapsed / duration, 1)
      setPrintProgress(p * 100)
      if (p < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setPrintPhase('done')
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [printPhase])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSpoolClick = useCallback((project) => {
    setSelectedSpool(project)
    setModelRotation(project.modelRotation || { x: 0, y: 0, z: 0 })
    setIsTransparent(project.transparency > 0)
    setWireframe(false)
    setShowGrid(false)
    setAutoRotate(false)
    setShowAxes(false)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrintPhase('done')
      setPrintProgress(100)
    } else {
      setPrintPhase('warming')
      setPrintProgress(0)
      setTimeout(() => setPrintPhase('printing'), 900)
    }
  }, [])

  const handleClearBed = useCallback(() => {
    setSelectedSpool(null)
    setPrintPhase('idle')
    setPrintProgress(0)
    setCurrentPage(0)
  }, [])

  const totalPages = Math.ceil(CADGLTFList.length / ITEMS_PER_PAGE)
  const currentProjects = CADGLTFList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const nextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(p => p + 1) }
  const prevPage = () => { if (currentPage > 0) setCurrentPage(p => p - 1) }

  const resetView = useCallback(() => {
    if (!selectedSpool) return
    const originalRotation = selectedSpool.modelRotation || { x: 0, y: 0, z: 0 }
    setModelRotation(originalRotation)
  }, [selectedSpool])

  const toggleTransparency = useCallback(() => {
    setIsTransparent(prev => !prev)
  }, [])

  const rotateModelX = useCallback(() => {
    setModelRotation(prev => ({ ...prev, x: prev.x + Math.PI / 2 }))
  }, [])
  const rotateModelY = useCallback(() => {
    setModelRotation(prev => ({ ...prev, y: prev.y + Math.PI / 2 }))
  }, [])
  const rotateModelZ = useCallback(() => {
    setModelRotation(prev => ({ ...prev, z: prev.z + Math.PI / 2 }))
  }, [])

  const getStatusText = () => {
    switch (printPhase) {
      case 'idle': return 'PRINTER IDLE'
      case 'warming': return 'HEATING NOZZLE...'
      case 'printing': return `PRINTING LAYER ${Math.round((printProgress / 100) * 100)} / 100`
      case 'done': return 'PRINT COMPLETE'
      default: return ''
    }
  }

  const getStatusColor = () => {
    switch (printPhase) {
      case 'idle': return '#64748b'
      case 'warming': return '#f59e0b'
      case 'printing': return '#00f0ff'
      case 'done': return '#10b981'
      default: return '#64748b'
    }
  }

  const getTempDisplay = () => {
    switch (printPhase) {
      case 'idle': return '20\u00B0C / 20\u00B0C'
      case 'warming': return '180\u00B0C / 200\u00B0C'
      case 'printing': return '200\u00B0C / 200\u00B0C'
      case 'done': return '20\u00B0C / 20\u00B0C'
      default: return ''
    }
  }

  return (
    <div className="cad-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .cad-root {
          width: 100vw;
          height: 100vh;
          background: 
            radial-gradient(circle at 50% 25%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 50% 50%, #0b1320 0%, #060b14 60%, #03060c 100%);
          overflow: hidden;
          position: fixed;
          top: 0; left: 0;
          font-family: 'Share Tech Mono', 'JetBrains Mono', monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        /* Layer 1: Technical Drafting Blueprint Grid (Griddy aesthetic) */
        .cad-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px),
            linear-gradient(rgba(99, 102, 241, 0.04) 2px, transparent 2px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 2px, transparent 2px);
          background-size: 32px 32px, 32px 32px, 160px 160px, 160px 160px;
          pointer-events: none;
          opacity: 0.85;
          z-index: 0;
        }

        /* Layer 2: CRT Vintage Scanlines & Dust Vignette */
        .cad-root::after {
          content: '';
          position: absolute; inset: 0;
          background: 
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.12) 0px,
              rgba(0, 0, 0, 0.12) 1px,
              transparent 1px,
              transparent 3px
            ),
            radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .cad-back-btn {
          position: fixed;
          top: 1.5rem; left: 1.5rem;
          background: rgba(11, 19, 32, 0.92);
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          color: #e2e8f0;
          padding: 0.6rem 1.25rem;
          border-radius: 4px;
          font-size: 0.82rem;
          cursor: pointer;
          z-index: 1000;
          font-family: 'Share Tech Mono', monospace;
          box-shadow: 0 4px 15px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          letter-spacing: 0.1em;
        }
        .cad-back-btn:hover {
          border-color: #38bdf8;
          color: #fff;
          background: rgba(56, 189, 248, 0.18);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.35);
          transform: translateX(-3px);
        }

        .cad-main {
          display: flex;
          gap: 4.5rem;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 2200px;
          position: relative;
          z-index: 2;
        }

        /* LEFT PANEL - SPEC SHEET */
        .left-panel {
          width: 310px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-shrink: 0;
        }
        .info-card {
          background: rgba(11, 19, 32, 0.94);
          backdrop-filter: blur(12px);
          border-radius: 6px;
          border: 1.5px solid rgba(56, 189, 248, 0.3);
          padding: 1.4rem;
          box-shadow: 0 12px 35px rgba(0,0,0,0.9), inset 0 0 15px rgba(0,0,0,0.5);
          position: relative;
        }
        .info-card::before {
          content: '+';
          position: absolute;
          top: 6px; right: 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          color: rgba(56, 189, 248, 0.5);
        }
        .info-category {
          font-size: 0.68rem;
          font-weight: 800;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          font-family: 'Orbitron', sans-serif;
        }
        .info-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 12px;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.04em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }
        .info-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: #94a3b8;
          margin-bottom: 16px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.4rem 0;
          border-bottom: 1px dashed rgba(56, 189, 248, 0.2);
        }
        .info-row-label {
          font-size: 0.65rem;
          color: rgba(148, 163, 184, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .info-row-value {
          font-size: 0.8rem;
          color: #f1f5f9;
          font-weight: 600;
        }
        .info-rotation {
          font-size: 0.7rem;
          font-family: 'Share Tech Mono', monospace;
          color: #38bdf8;
          display: flex;
          gap: 12px;
          margin-top: 4px;
        }

        /* CENTER - 3D PRINTER CHAMBER */
        .printer-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          flex: 0 1 820px;
          min-width: 0;
        }
        .printer-header {
          text-align: center;
        }
        .printer-header-sub {
          font-size: 0.75rem;
          color: #38bdf8;
          font-weight: 800;
          letter-spacing: 0.3em;
          margin-bottom: 0.3rem;
          text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
          font-family: 'Orbitron', sans-serif;
        }
        .printer-header-title {
          font-size: clamp(1.6rem, 3vw, 2.5rem);
          color: #ffffff;
          margin-bottom: 0.3rem;
          font-family: 'Orbitron', sans-serif;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-shadow: 0 0 30px rgba(56, 189, 248, 0.2), 0 2px 10px rgba(0,0,0,0.9);
        }
        .printer-header-desc {
          font-size: 0.82rem;
          color: #94a3b8;
          letter-spacing: 0.15em;
        }

        .printer-rig {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          background: linear-gradient(145deg, #0f172a 0%, #090e1a 60%, #04070e 100%);
          border-radius: 8px;
          border: 2px solid rgba(56, 189, 248, 0.35);
          box-shadow:
            0 45px 110px rgba(0,0,0,0.95),
            0 0 30px rgba(56, 189, 248, 0.12),
            inset 0 0 80px rgba(0,0,0,0.8);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Gantry frame */
        .gantry-frame {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .gantry-rail-v {
          position: absolute;
          width: 5px;
          height: calc(100% - 3.5rem);
          top: 0;
          background: linear-gradient(to bottom, #334155 0%, #1e293b 50%, #334155 100%);
          border-radius: 2px;
          box-shadow: inset 0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5);
        }
        .gantry-rail-v.left { left: 1.2rem; }
        .gantry-rail-v.right { right: 1.2rem; }
        .gantry-rail-h {
          position: absolute;
          height: 5px;
          left: 1.2rem;
          right: 1.2rem;
          top: 2.2rem;
          background: linear-gradient(to right, #334155 0%, #38bdf8 50%, #334155 100%);
          border-radius: 2px;
          box-shadow: inset 0 0 3px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6);
        }
        .gantry-crossbar {
          position: absolute;
          width: 10px;
          height: 22px;
          background: linear-gradient(135deg, #475569, #1e293b);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 2px;
          top: 1.3rem;
          box-shadow: 0 3px 6px rgba(0,0,0,0.7);
        }
        .gantry-crossbar.left { left: 0.85rem; }
        .gantry-crossbar.right { right: 0.85rem; }

        /* Print head Extruder */
        .print-head {
          position: absolute;
          width: 32px;
          height: 20px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e293b 100%);
          border: 1.5px solid #38bdf8;
          border-radius: 4px;
          top: 1.4rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: left 0.15s linear;
        }
        .print-head::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 6px;
          height: 8px;
          background: linear-gradient(to bottom, #94a3b8, #334155);
          border-radius: 0 0 3px 3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }
        .print-head::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 4px;
          background: #00f0ff;
          border-radius: 1px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .print-head.printing::after {
          opacity: 1;
          box-shadow: 0 0 8px #00f0ff, 0 0 16px rgba(0,240,255,0.7);
        }
        .print-head-led {
          position: absolute;
          top: 3px;
          right: 4px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .print-head-led.off { background: #475569; box-shadow: none; }
        .print-head-led.warming {
          background: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
          animation: ledPulse 1s ease-in-out infinite;
        }
        .print-head-led.printing {
          background: #00f0ff;
          box-shadow: 0 0 10px #00f0ff, 0 0 18px rgba(0,240,255,0.6);
        }
        .print-head-led.done {
          background: #10b981;
          box-shadow: 0 0 10px #10b981, 0 0 18px rgba(16,185,129,0.6);
        }
        @keyframes ledPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes printHeadSweep {
          0% { left: 18%; }
          100% { left: 82%; }
        }
        .print-head.sweeping {
          animation: printHeadSweep 1.2s ease-in-out infinite alternate;
        }

        /* Build plate */
        .build-plate {
          position: absolute;
          top: 3.2rem;
          left: 2rem;
          right: 2rem;
          bottom: 3rem;
          background: linear-gradient(135deg, #060b13 0%, #0f172a 100%);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 4px;
          overflow: hidden;
        }
        .build-plate::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(56,189,248,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56,189,248,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .build-plate::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%);
          pointer-events: none;
        }

        /* Printer status bar */
        .printer-status {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2.8rem;
          background: rgba(8, 14, 24, 0.98);
          border-top: 1.5px solid rgba(56, 189, 248, 0.3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.2rem;
          z-index: 7;
          gap: 1rem;
        }
        .status-led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .status-led.idle { background: #475569; }
        .status-led.warming { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; animation: ledPulse 1s ease-in-out infinite; }
        .status-led.printing { background: #00f0ff; box-shadow: 0 0 8px #00f0ff; }
        .status-led.done { background: #10b981; box-shadow: 0 0 8px #10b981; }
        .status-text {
          font-size: 0.72rem;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.14em;
          font-weight: 700;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .status-temp {
          font-size: 0.68rem;
          font-family: 'Share Tech Mono', monospace;
          color: #94a3b8;
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }
        .status-progress-track {
          width: 85px;
          height: 5px;
          background: rgba(56, 189, 248, 0.15);
          border-radius: 2px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .status-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #38bdf8, #00f0ff);
          border-radius: 2px;
          transition: width 0.1s linear;
          box-shadow: 0 0 8px rgba(56,189,248,0.6);
        }

        /* Idle screen inside build plate */
        .idle-screen {
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem;
          color: #94a3b8;
          font-family: 'Share Tech Mono', monospace;
        }
        .idle-icon {
          font-size: 2.8rem;
          color: #38bdf8;
          opacity: 0.7;
        }
        .idle-text {
          font-size: 0.9rem;
          text-align: center;
          line-height: 1.8;
          letter-spacing: 0.18em;
          color: #f1f5f9;
          text-shadow: 0 1px 4px rgba(0,0,0,0.8);
        }
        .idle-sub {
          font-size: 0.7rem;
          color: #38bdf8;
          letter-spacing: 0.12em;
          font-weight: 700;
        }

        /* RIGHT PANEL - CONTROLS */
        .right-panel {
          width: 290px;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex-shrink: 0;
        }
        .panel-title {
          font-size: 0.75rem;
          color: #38bdf8;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-align: center;
          margin-bottom: 0.2rem;
          font-family: 'Orbitron', sans-serif;
          text-shadow: 0 0 10px rgba(56,189,248,0.3);
        }
        .control-group {
          background: rgba(11, 19, 32, 0.94);
          border-radius: 6px;
          border: 1.5px solid rgba(56, 189, 248, 0.3);
          padding: 0.95rem;
          box-shadow: 0 6px 18px rgba(0,0,0,0.7);
        }
        .control-group-label {
          font-size: 0.6rem;
          color: #94a3b8;
          margin-bottom: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .ctrl-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.55rem;
        }
        .ctrl-btn {
          padding: 0.6rem;
          background: rgba(56, 189, 248, 0.08);
          border: 1.5px solid rgba(56, 189, 248, 0.25);
          border-radius: 4px;
          color: #e2e8f0;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }
        .ctrl-btn:hover {
          background: rgba(56, 189, 248, 0.18);
          border-color: #38bdf8;
          color: #fff;
          transform: translateY(-1px);
          box-shadow: 0 0 10px rgba(56,189,248,0.25);
        }
        .ctrl-btn:active { transform: scale(0.97); }
        .ctrl-btn.active {
          background: rgba(56, 189, 248, 0.25);
          border-color: #38bdf8;
          color: #38bdf8;
          box-shadow: inset 0 0 8px rgba(56,189,248,0.3);
        }
        .ctrl-btn-red { color: #f87171; border-color: rgba(248,113,113,0.3); }
        .ctrl-btn-red:hover { border-color: #ef4444; background: rgba(239,68,68,0.18); }
        .ctrl-btn-green { color: #4ade80; border-color: rgba(74,222,128,0.3); }
        .ctrl-btn-green:hover { border-color: #22c55e; background: rgba(34,197,94,0.18); }
        .ctrl-btn-blue { color: #38bdf8; border-color: rgba(56,189,248,0.3); }
        .ctrl-btn-blue:hover { border-color: #0284c7; background: rgba(2,132,199,0.18); }
        .ctrl-btn-yellow { color: #facc15; border-color: rgba(250,204,21,0.3); }
        .ctrl-btn-yellow:hover { border-color: #eab308; background: rgba(234,179,8,0.18); }
        .ctrl-stack {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .clear-bed-btn {
          padding: 0.7rem;
          background: rgba(220, 38, 38, 0.88);
          border: 1.5px solid #ef4444;
          border-radius: 4px;
          color: #ffffff;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          font-family: 'Share Tech Mono', monospace;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          letter-spacing: 0.08em;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
        }
        .clear-bed-btn:hover {
          background: #dc2626;
          border-color: #f87171;
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
        }
        .instructions-card {
          background: rgba(8, 14, 24, 0.8);
          border-radius: 6px;
          border: 1px dashed rgba(56, 189, 248, 0.3);
          padding: 1rem;
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.7;
        }
        .instructions-card strong {
          color: #38bdf8;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .instructions-card kbd {
          background: rgba(56, 189, 248, 0.15);
          padding: 0.15rem 0.35rem;
          border-radius: 3px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #f1f5f9;
        }

        /* FILAMENT RACK */
        .filament-rack-wrapper {
          width: 290px;
          flex-shrink: 0;
        }
        .filament-rack-title {
          font-size: 0.8rem;
          color: #38bdf8;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-shadow: 0 0 10px rgba(56,189,248,0.4);
          font-family: 'Share Tech Mono', monospace;
          text-align: center;
          margin-bottom: 0.8rem;
        }
        .filament-rack {
          width: 100%;
          max-height: 68vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1.1rem;
          background: rgba(11, 19, 32, 0.94);
          border: 2px solid rgba(56, 189, 248, 0.3);
          border-radius: 8px;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.7), 0 10px 30px rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .filament-rack::-webkit-scrollbar { width: 6px; }
        .filament-rack::-webkit-scrollbar-track { background: rgba(0,0,0,0.4); border-radius: 3px; }
        .filament-rack::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 3px; }
        .filament-rack::-webkit-scrollbar-thumb:hover { background: #38bdf8; }

        .spool {
          width: 100%;
          height: 90px;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          border: 1.5px solid rgba(56, 189, 248, 0.25);
          display: flex;
          overflow: hidden;
          padding: 0;
          text-align: left;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(8, 14, 24, 0.95) 100%);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .spool:hover {
          transform: translateY(-3px) scale(1.02);
          border-color: #38bdf8;
          box-shadow: 0 8px 24px rgba(0,0,0,0.8), 0 0 12px rgba(56,189,248,0.25);
        }
        .spool.selected {
          border-color: #38bdf8;
          box-shadow: 0 0 18px rgba(56,189,248,0.3), inset 0 0 20px rgba(56,189,248,0.1);
        }
        .spool-selected-bar {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 65%;
          background: #38bdf8;
          box-shadow: 0 0 10px #38bdf8;
          border-radius: 0 2px 2px 0;
        }
        .spool-filament {
          width: 18px;
          height: 100%;
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }
        .spool-filament::before {
          content: '';
          position: absolute;
          inset: 4px 2px;
          border-radius: 3px;
          background: var(--spool-color);
          box-shadow: inset 0 0 4px rgba(0,0,0,0.5);
        }
        .spool-filament::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .spool-img-wrap {
          width: 70px; height: 100%;
          overflow: hidden;
          border-right: 1px solid rgba(0,0,0,0.5);
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .spool-img {
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.9;
          filter: sepia(0.1);
        }
        .spool-body {
          flex: 1;
          padding: 0.6rem 0.8rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.2rem;
        }
        .spool-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f8fafc;
          text-shadow: 0 1px 3px rgba(0,0,0,0.9);
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: 'Share Tech Mono', monospace;
        }
        .spool-meta {
          font-size: 0.68rem;
          color: #94a3b8;
          font-weight: 500;
          font-family: 'Share Tech Mono', monospace;
          letter-spacing: 0.02em;
        }
        .spool-tags {
          display: flex;
          gap: 0.3rem;
          flex-wrap: wrap;
          margin-top: 0.15rem;
        }
        .spool-tag {
          font-size: 0.58rem;
          padding: 0.12rem 0.35rem;
          border-radius: 3px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .pagination {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          justify-content: center;
          margin-top: 0.6rem;
        }
        .page-btn {
          width: 32px; height: 32px;
          border-radius: 4px;
          background: rgba(56,189,248,0.1);
          border: 1.5px solid rgba(56,189,248,0.4);
          color: #38bdf8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: all 0.2s ease;
          font-family: 'Share Tech Mono', monospace;
        }
        .page-btn:hover:not(:disabled) {
          background: rgba(56,189,248,0.2);
          border-color: #38bdf8;
          transform: scale(1.08);
        }
        .page-btn:disabled {
          background: rgba(0,0,0,0.3);
          border-color: #334155;
          color: #475569;
          cursor: not-allowed;
        }
        .page-indicator {
          font-size: 0.75rem;
          color: #38bdf8;
          font-family: 'Share Tech Mono', monospace;
          font-weight: 700;
          min-width: 50px;
          text-align: center;
          letter-spacing: 0.1em;
        }

        /* Responsive */
        @media (max-width: 1300px) {
          .cad-main { gap: 3rem; }
          .left-panel { width: 260px; }
          .filament-rack-wrapper { width: 260px; }
          .right-panel { width: 240px; }
        }
        @media (max-width: 1100px) {
          .cad-main {
            flex-direction: column;
            overflow-y: auto;
            height: 100vh;
            padding: 1rem 0;
            align-items: center;
            gap: 1.5rem;
          }
          .left-panel, .right-panel, .filament-rack-wrapper {
            width: 100%;
            max-width: 500px;
          }
          .printer-column {
            width: 100%;
            max-width: 700px;
            flex: none;
          }
          .printer-rig { aspect-ratio: 16/10; }
        }
      `}</style>

      <button className="cad-back-btn" onClick={() => navigate('/hub')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        BACK
      </button>

      <div className="cad-main">
        {/* LEFT PANEL */}
        {selectedSpool && (
          <div className="left-panel">
            <div className="info-card">
              <div className="info-category" style={{ color: selectedSpool.color }}>
                {selectedSpool.category}
              </div>
              <h3 className="info-title">{selectedSpool.title}</h3>
              <p className="info-desc">{selectedSpool.description}</p>
              <div className="info-row">
                <span className="info-row-label">Year</span>
                <span className="info-row-value">{selectedSpool.year}</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Transparency</span>
                <span className="info-row-value">{selectedSpool.transparency}%</span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Filament</span>
                <span className="info-row-value" style={{ fontSize: '0.7rem', color: selectedSpool.spoolColor }}>
                  {selectedSpool.spoolColor}
                </span>
              </div>
              <div className="info-row">
                <span className="info-row-label">Tags</span>
                <span className="info-row-value" style={{ fontSize: '0.7rem' }}>
                  {selectedSpool.tags.join(', ')}
                </span>
              </div>
              <div style={{ marginTop: '0.6rem' }}>
                <span className="info-row-label">Rotation</span>
                <div className="info-rotation">
                  <span>X:{Math.round((modelRotation.x * 180) / Math.PI)}&deg;</span>
                  <span>Y:{Math.round((modelRotation.y * 180) / Math.PI)}&deg;</span>
                  <span>Z:{Math.round((modelRotation.z * 180) / Math.PI)}&deg;</span>
                </div>
              </div>
            </div>
            <div className="instructions-card">
              <strong>CONTROLS</strong>
              <div>
                <div><kbd>LMB Drag</kbd> Rotate view</div>
                <div><kbd>MMB Drag</kbd> Pan camera</div>
                <div><kbd>Scroll</kbd> Zoom in/out</div>
              </div>
            </div>
          </div>
        )}

        {/* CENTER - 3D PRINTER */}
        <div className="printer-column">
          {!selectedSpool && (
            <div className="printer-header">
              <div className="printer-header-sub">Fabrication Lab</div>
              <h1 className="printer-header-title">CAD 3D PRINTER</h1>
              <p className="printer-header-desc">LOAD FILAMENT &middot; SLICE MODEL &middot; PRINT OBJECT</p>
            </div>
          )}

          <div className="printer-rig">
            {/* Gantry frame */}
            <div className="gantry-frame">
              <div className="gantry-rail-v left" />
              <div className="gantry-rail-v right" />
              <div className="gantry-rail-h" />
              <div className="gantry-crossbar left" />
              <div className="gantry-crossbar right" />
            </div>

            {/* Print head */}
            <div className={`print-head ${printPhase === 'printing' ? 'sweeping printing' : ''} ${printPhase === 'warming' ? 'warming' : ''}`}>
              <div className={`print-head-led ${printPhase}`} />
            </div>

            {/* Build plate */}
            <div className="build-plate">
              {!selectedSpool ? (
                <div className="idle-screen">
                  <div className="idle-icon">&#9638;</div>
                  <div className="idle-text">
                    SELECT FILAMENT SPOOL<br/>TO BEGIN PRINT
                  </div>
                  <div className="idle-sub">{CADGLTFList.length} MODELS IN INVENTORY</div>
                </div>
              ) : (
                <PrinterModelViewer
                  project={selectedSpool}
                  wireframe={wireframe}
                  showGrid={showGrid}
                  autoRotate={autoRotate}
                  showAxes={showAxes}
                  modelRotation={modelRotation}
                  isTransparent={isTransparent}
                  printPhase={printPhase}
                  printProgress={printProgress}
                />
              )}
            </div>
            {/* Status bar */}
            <div className="printer-status">
              <div className={`status-led ${printPhase}`} />
              <span className="status-text" style={{ color: getStatusColor() }}>
                {getStatusText()}
              </span>
              {printPhase === 'printing' && (
                <div className="status-progress-track">
                  <div className="status-progress-bar" style={{ width: `${printProgress}%` }} />
                </div>
              )}
              <span className="status-temp">{getTempDisplay()}</span>
            </div>
          </div>

          {!selectedSpool && (
            <div style={{ fontSize: '0.7rem', color: '#444', textAlign: 'center', letterSpacing: '0.12em' }}>
              &#9668; LOAD SPOOL &middot; HEAT NOZZLE &middot; PRINT LAYERS &middot; INSPECT &middot; REPEAT &#9658;
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        {selectedSpool ? (
          <div className="right-panel">
            <div className="panel-title">PRINTER CONTROLS</div>
            <div className="control-group">
              <div className="control-group-label">View Axes</div>
              <div className="ctrl-grid-2">
                <button onClick={rotateModelX} className="ctrl-btn ctrl-btn-red">X-AXIS &#8635;</button>
                <button onClick={rotateModelY} className="ctrl-btn ctrl-btn-green">Y-AXIS &#8635;</button>
                <button onClick={rotateModelZ} className="ctrl-btn ctrl-btn-blue">Z-AXIS &#8635;</button>
                <button onClick={resetView} className="ctrl-btn ctrl-btn-yellow">RESET</button>
              </div>
            </div>
            <div className="control-group">
              <div className="control-group-label">Display Options</div>
              <div className="ctrl-grid-2">
                <button onClick={() => setWireframe(p => !p)} className={`ctrl-btn ${wireframe ? 'active' : ''}`}>WIREFRAME</button>
                <button onClick={() => setShowGrid(p => !p)} className={`ctrl-btn ${showGrid ? 'active' : ''}`}>GRID</button>
                <button onClick={() => setAutoRotate(p => !p)} className={`ctrl-btn ${autoRotate ? 'active' : ''}`}>AUTO-ROT</button>
                <button onClick={() => setShowAxes(p => !p)} className={`ctrl-btn ${showAxes ? 'active' : ''}`}>AXES</button>
              </div>
            </div>
            <div className="control-group">
              <div className="control-group-label">Material</div>
              <div className="ctrl-stack">
                <button onClick={toggleTransparency} className="ctrl-btn">
                  {isTransparent ? 'SOLID MODE' : 'TRANSPARENT'}
                </button>
              </div>
            </div>
            <button onClick={handleClearBed} className="clear-bed-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              CLEAR BED
            </button>
          </div>
        ) : (
          <div className="filament-rack-wrapper">
            <div className="filament-rack-title">FILAMENT RACK</div>
            <div className="filament-rack">
              {currentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleSpoolClick(project)}
                  className={`spool ${selectedSpool?.id === project.id ? 'selected' : ''}`}
                  aria-label={`Load ${project.title}`}
                >
                  {selectedSpool?.id === project.id && <div className="spool-selected-bar" />}
                  <div className="spool-filament" style={{ '--spool-color': project.spoolColor }} />
                  <div className="spool-img-wrap">
                    <img src={project.coverPhoto} alt={project.title} className="spool-img" loading="lazy" />
                  </div>
                  <div className="spool-body">
                    <div className="spool-title">{project.title}</div>
                    <div className="spool-meta">{project.year} &middot; {project.category}</div>
                    <div className="spool-tags">
                      {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="spool-tag" style={{ background: `${project.color}20`, color: project.color }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 0} className="page-btn">&#8249;</button>
                <div className="page-indicator">{String(currentPage + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}</div>
                <button onClick={nextPage} disabled={currentPage === totalPages - 1} className="page-btn">&#8250;</button>
              </div>
            )}
            <div style={{ fontSize: '0.65rem', color: '#555', textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.08em', marginTop: '0.3rem' }}>
              {currentProjects.length} SPOOLS ON PAGE
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// ==================== PRINTER MODEL VIEWER ====================
function PrinterModelViewer({ project, wireframe, showGrid, autoRotate, showAxes, modelRotation, isTransparent, printPhase, printProgress }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelGroupRef = useRef(null)
  const gridRef = useRef(null)
  const axesRef = useRef(null)
  const clipPlaneRef = useRef(null)
  const animationRef = useRef(null)
  const autoRotateRef = useRef(false)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadError, setLoadError] = useState(null)
  const modelBoundsRef = useRef({ minY: 0, maxY: 1 })

  const ctrlRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    panStartX: 0,
    panStartY: 0,
    spherical: null,
    target: null,
    panOffset: null,
  })

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return
    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => loadGLTFLoader()
        script.onerror = () => setLoadError('Failed to load Three.js')
        document.head.appendChild(script)
      } else {
        loadGLTFLoader()
      }
    }
    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.onload = () => setThreeReady(true)
        loaderScript.onerror = () => setLoadError('Failed to load GLTFLoader')
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
      }
    }
    loadThreeJS()
  }, [])

  // Scene setup
  useEffect(() => {
    if (!threeReady || !containerRef.current) return
    const THREE = window.THREE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060b14)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.01,
      1000
    )
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.localClippingEnabled = true
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333344, 0.55)
    hemiLight.position.set(0, 20, 0)
    scene.add(hemiLight)
    const d1 = new THREE.DirectionalLight(0xffffff, 1.0)
    d1.position.set(5, 8, 5)
    d1.castShadow = true
    d1.shadow.mapSize.width = 1024
    d1.shadow.mapSize.height = 1024
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xaaccff, 0.45)
    d2.position.set(-5, 3, -5)
    scene.add(d2)
    const d3 = new THREE.DirectionalLight(0xffccaa, 0.25)
    d3.position.set(0, -3, 8)
    scene.add(d3)
    const pointLight = new THREE.PointLight(0xffffff, 0.35, 20)
    pointLight.position.set(2, 2, 4)
    scene.add(pointLight)

    if (showGrid) {
      const grid = new THREE.GridHelper(4, 40, 0x38bdf8, 0x1e293b)
      gridRef.current = grid
      scene.add(grid)
    }
    if (showAxes) {
      const axes = new THREE.AxesHelper(1.5)
      axesRef.current = axes
      scene.add(axes)
    }

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(3.5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.panOffset = new THREE.Vector3()

    loadModel(project.gltfFile)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      if (autoRotateRef.current) {
        ctrlRef.current.spherical.theta += 0.003
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      const w = containerRef.current.clientWidth
      const h = containerRef.current.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      disposeScene()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, threeReady])

  useEffect(() => {
    if (!sceneRef.current || !window.THREE) return
    const THREE = window.THREE
    if (showGrid && !gridRef.current) {
      const grid = new THREE.GridHelper(4, 40, 0x38bdf8, 0x1e293b)
      gridRef.current = grid
      sceneRef.current.add(grid)
    } else if (!showGrid && gridRef.current) {
      sceneRef.current.remove(gridRef.current)
      gridRef.current = null
    }
  }, [showGrid])

  useEffect(() => {
    if (!sceneRef.current || !window.THREE) return
    const THREE = window.THREE
    if (showAxes && !axesRef.current) {
      const axes = new THREE.AxesHelper(1.5)
      axesRef.current = axes
      sceneRef.current.add(axes)
    } else if (!showAxes && axesRef.current) {
      sceneRef.current.remove(axesRef.current)
      axesRef.current = null
    }
  }, [showAxes])

  useEffect(() => { autoRotateRef.current = autoRotate }, [autoRotate])

  useEffect(() => {
    if (!modelGroupRef.current) return
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => { m.wireframe = wireframe; m.needsUpdate = true })
        } else {
          child.material.wireframe = wireframe
          child.material.needsUpdate = true
        }
      }
    })
  }, [wireframe])

  // Clip-plane reveal animation
  useEffect(() => {
    if (!modelGroupRef.current || !clipPlaneRef.current) return
    const { minY, maxY } = modelBoundsRef.current
    const totalHeight = maxY - minY
    const currentHeight = minY + (totalHeight * (printProgress / 100))
    clipPlaneRef.current.constant = currentHeight
  }, [printProgress])

  // Disable clipping when fully printed
  useEffect(() => {
    if (!modelGroupRef.current || printPhase !== 'done') return
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach(m => {
          m.clippingPlanes = []
          m.needsUpdate = true
        })
      }
    })
  }, [printPhase])

  function disposeScene() {
    if (!sceneRef.current) return
    sceneRef.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => { m?.dispose(); if (m.map) m.map.dispose() })
        } else {
          obj.material?.dispose()
          if (obj.material?.map) obj.material.map.dispose()
        }
      }
    })
    rendererRef.current?.dispose()
    if (rendererRef.current?.domElement && containerRef.current?.contains(rendererRef.current.domElement)) {
      containerRef.current.removeChild(rendererRef.current.domElement)
    }
  }

    function loadModel(url) {
    const THREE = window.THREE
    setLoadingProgress(10)
    setIsLoading(true)
    setLoadError(null)
    if (!THREE.GLTFLoader) {
      setLoadError('GLTFLoader not available')
      setIsLoading(false)
      return
    }
    const loader = new THREE.GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        setLoadingProgress(60)
        const model = gltf.scene
        if (project.modelRotation) {
          model.rotation.set(project.modelRotation.x, project.modelRotation.y, project.modelRotation.z)
        }
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 0.5 / maxDim
        model.scale.setScalar(scale)

        // Compute world-space bounds AFTER centering and scaling
        const scaledBox = new THREE.Box3().setFromObject(model)
        modelBoundsRef.current = { minY: scaledBox.min.y, maxY: scaledBox.max.y }

        // Create clipping plane at the bottom of the scaled model
        const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), modelBoundsRef.current.minY)
        clipPlaneRef.current = clipPlane

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (project.modelColor) {
              const baseColor = new THREE.Color(project.modelColor)
              if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                  m.color = baseColor.clone()
                  m.metalness = Math.min(m.metalness || 0, 0.3)
                  m.roughness = Math.max(m.roughness || 0.5, 0.3)
                  m.transparent = project.transparency > 0
                  m.opacity = 1 - (project.transparency || 0) / 100
                  m.wireframe = wireframe
                  m.clippingPlanes = [clipPlane]
                  m.needsUpdate = true
                })
              } else {
                child.material.color = baseColor.clone()
                child.material.metalness = Math.min(child.material.metalness || 0, 0.3)
                child.material.roughness = Math.max(child.material.roughness || 0.5, 0.3)
                child.material.transparent = project.transparency > 0
                child.material.opacity = 1 - (project.transparency || 0) / 100
                child.material.wireframe = wireframe
                child.material.clippingPlanes = [clipPlane]
                child.material.needsUpdate = true
              }
            } else {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                  m.transparent = project.transparency > 0
                  m.opacity = 1 - (project.transparency || 0) / 100
                  m.wireframe = wireframe
                  m.clippingPlanes = [clipPlane]
                  m.needsUpdate = true
                })
              } else {
                child.material.transparent = isTransparent
                child.material.opacity = isTransparent ? (project.transparency > 0 ? 1 - project.transparency / 100 : 0.5) : 1
                child.material.wireframe = wireframe
                child.material.clippingPlanes = [clipPlane]
                child.material.needsUpdate = true
              }
            }
          }
        })
        sceneRef.current.add(model)
        modelGroupRef.current = model
        setLoadingProgress(100)
        setTimeout(() => setIsLoading(false), 200)
      },
      (xhr) => {
        if (xhr.total > 0) {
          const progress = (xhr.loaded / xhr.total) * 100
          setLoadingProgress(Math.min(10 + progress * 0.5, 95))
        } else {
          setLoadingProgress(prev => Math.min(prev + 2, 95))
        }
      },
      (error) => {
        console.error('Error loading model:', error)
        setLoadError('Failed to load model')
        setIsLoading(false)
      }
    )
  }

  const updateCamera = () => {
    if (!cameraRef.current || !ctrlRef.current.spherical || !ctrlRef.current.target) return
    const { spherical, target, panOffset } = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos).add(panOffset)
    cameraRef.current.lookAt(target.clone().add(panOffset))
  }

  useEffect(() => {
    if (!modelGroupRef.current) return
    modelGroupRef.current.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z)
  }, [modelRotation])

  useEffect(() => {
    if (!modelGroupRef.current) return
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => {
          if (isTransparent) {
            m.transparent = isTransparent
            m.opacity = isTransparent ? (project.transparency > 0 ? 1 - project.transparency / 100 : 0.5) : 1
          } else {
            m.transparent = false
            m.opacity = 1
          }
          m.needsUpdate = true
        })
      }
    })
  }, [isTransparent, project])

  // ===== MOUSE HANDLING =====
  const handleMouseDown = (e) => {
    if (e.button === 2) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (e.button === 1) {
      e.preventDefault()
      ctrlRef.current.isPanning = true
      ctrlRef.current.panStartX = e.clientX
      ctrlRef.current.panStartY = e.clientY
    } else if (e.button === 0) {
      ctrlRef.current.isRotating = true
      ctrlRef.current.lastX = e.clientX
      ctrlRef.current.lastY = e.clientY
    }
  }

  const handleMouseMove = (e) => {
    if (ctrlRef.current.isRotating) {
      const dx = e.clientX - ctrlRef.current.lastX
      const dy = e.clientY - ctrlRef.current.lastY
      ctrlRef.current.spherical.theta -= dx * 0.008
      ctrlRef.current.spherical.phi += dy * 0.008
      ctrlRef.current.spherical.phi = window.THREE.MathUtils.clamp(
        ctrlRef.current.spherical.phi,
        0.05,
        Math.PI - 0.05
      )
      ctrlRef.current.lastX = e.clientX
      ctrlRef.current.lastY = e.clientY
    } else if (ctrlRef.current.isPanning) {
      const dx = e.clientX - ctrlRef.current.panStartX
      const dy = e.clientY - ctrlRef.current.panStartY
      const camera = cameraRef.current
      const panSpeed = ctrlRef.current.spherical.radius * 0.002
      const right = new window.THREE.Vector3()
      const up = new window.THREE.Vector3()
      right.setFromMatrixColumn(camera.matrixWorld, 0)
      up.setFromMatrixColumn(camera.matrixWorld, 1)
      ctrlRef.current.panOffset.add(right.multiplyScalar(-dx * panSpeed))
      ctrlRef.current.panOffset.add(up.multiplyScalar(dy * panSpeed))
      ctrlRef.current.panStartX = e.clientX
      ctrlRef.current.panStartY = e.clientY
    }
  }

  const handleMouseUp = (e) => {
    if (e.button === 2) {
      e.preventDefault()
      e.stopPropagation()
    }
    ctrlRef.current.isRotating = false
    ctrlRef.current.isPanning = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * 0.002
    const newRadius = ctrlRef.current.spherical.radius + delta
    ctrlRef.current.spherical.radius = Math.max(0.05, Math.min(15, newRadius))
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
      style={{
        width: '100%',
        height: '100%',
        cursor: ctrlRef.current?.isPanning ? 'grabbing' : ctrlRef.current?.isRotating ? 'grabbing' : 'grab',
        position: 'relative',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,8,0.95)', color: '#ff7b00', fontSize: '0.85rem',
          gap: '1rem', zIndex: 20, fontFamily: "'Share Tech Mono', monospace",
        }}>
          <div style={{
            width: '36px', height: '36px',
            border: '2px solid rgba(255,123,0,0.15)',
            borderTop: '2px solid #ff7b00',
            borderRadius: '50%',
            animation: 'printerSpin 0.8s linear infinite',
          }} />
          <div style={{ letterSpacing: '0.15em', fontWeight: 700 }}>LOADING MODEL...</div>
          <div style={{ width: '180px', height: '3px', background: 'rgba(255,123,0,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${loadingProgress}%`, height: '100%', background: '#ff7b00', transition: 'width 0.2s ease', boxShadow: '0 0 8px #ff7b00' }} />
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{Math.round(loadingProgress)}%</div>
        </div>
      )}

      {loadError && !isLoading && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,8,0.95)', color: '#ff4444', fontSize: '0.85rem',
          gap: '0.5rem', zIndex: 20, fontFamily: "'Share Tech Mono', monospace",
        }}>
          <div style={{ fontSize: '1.5rem' }}>&#9888;</div>
          <div>{loadError}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes printerSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}