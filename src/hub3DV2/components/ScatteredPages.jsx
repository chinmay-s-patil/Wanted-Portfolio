import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedurally generates retro detective paper textures on canvas once at load time.
 * Returns an array of THREE.CanvasTexture objects for maximum rendering efficiency.
 */
function createPageTextures() {
  const textures = []
  
  const pageConfigs = [
    // 0. Confidential Case File
    {
      bg: '#f4ecd8',
      title: 'CASE FILE #842',
      stamp: 'CONFIDENTIAL',
      stampColor: '#d90429',
      hasCoffeeRing: true,
      textLines: 12,
      accentColor: '#2b2d42'
    },
    // 1. Wanted Dossier
    {
      bg: '#fdfbf7',
      title: 'WANTED PORTFOLIO',
      stamp: 'CLASSIFIED',
      stampColor: '#0077b6',
      hasPhotoBox: true,
      textLines: 10,
      accentColor: '#1d3557'
    },
    // 2. OpenFOAM CFD Solver Notes
    {
      bg: '#f0efe9',
      title: 'CFD FLOW MATRIX',
      stamp: 'SOLVER READY',
      stampColor: '#2a9d8f',
      hasDiagram: true,
      diagramType: 'mesh',
      textLines: 8,
      accentColor: '#264653'
    },
    // 3. CAD Blueprint Sheet
    {
      bg: '#e1eff6',
      title: 'CAD DRAFT - REV 4',
      stamp: 'APPROVED',
      stampColor: '#3a86ff',
      hasDiagram: true,
      diagramType: 'blueprint',
      textLines: 6,
      accentColor: '#03045e'
    },
    // 4. Evidence Report
    {
      bg: '#eadbb2',
      title: 'EVIDENCE LOG #404',
      stamp: 'TOP SECRET',
      stampColor: '#e63946',
      hasFingerprint: true,
      textLines: 11,
      accentColor: '#4a3b32'
    },
    // 5. Yellow Sticky Note
    {
      bg: '#fff475',
      title: 'NOTE: CHECK SOLVER',
      stamp: 'URGENT',
      stampColor: '#ff0055',
      isSticky: true,
      textLines: 5,
      accentColor: '#d4a373'
    },
    // 6. Newspaper Clipping
    {
      bg: '#e8dfce',
      title: 'THE DAILY PRECINCT',
      stamp: 'VERIFIED',
      stampColor: '#457b9d',
      hasNewsColumns: true,
      textLines: 14,
      accentColor: '#1d3557'
    },
    // 7. Incident Report Log
    {
      bg: '#f9f4e6',
      title: 'INCIDENT REPORT 1987',
      stamp: 'EVIDENCE #12',
      stampColor: '#f77f00',
      hasLedgerGrid: true,
      textLines: 9,
      accentColor: '#3d5a80'
    }
  ]

  pageConfigs.forEach((cfg) => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 680
    const ctx = canvas.getContext('2d')

    // Background paper fill
    ctx.fillStyle = cfg.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle paper grain texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    for (let i = 0; i < 600; i++) {
      const rx = Math.random() * canvas.width
      const ry = Math.random() * canvas.height
      const rw = Math.random() * 3 + 1
      ctx.fillRect(rx, ry, rw, rw)
    }

    // Border line / Margin line
    ctx.strokeStyle = cfg.accentColor
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

    // Ledger Grid / Blueprint grid if requested
    if (cfg.hasLedgerGrid || cfg.diagramType === 'blueprint') {
      ctx.strokeStyle = 'rgba(50, 100, 150, 0.15)'
      ctx.lineWidth = 1
      for (let y = 60; y < canvas.height - 40; y += 30) {
        ctx.beginPath()
        ctx.moveTo(20, y)
        ctx.lineTo(canvas.width - 20, y)
        ctx.stroke()
      }
    }

    // Header Title
    ctx.fillStyle = cfg.accentColor
    ctx.font = 'bold 28px monospace'
    ctx.fillText(cfg.title, 35, 60)

    // Subtitle line
    ctx.beginPath()
    ctx.moveTo(35, 75)
    ctx.lineTo(canvas.width - 35, 75)
    ctx.strokeStyle = cfg.accentColor
    ctx.lineWidth = 3
    ctx.stroke()

    // Photo Box / Diagram / Graphics
    let startY = 110
    if (cfg.hasPhotoBox) {
      ctx.fillStyle = '#e2e8f0'
      ctx.fillRect(35, 95, 120, 140)
      ctx.strokeStyle = '#475569'
      ctx.strokeRect(35, 95, 120, 140)
      // Low poly silhouette head
      ctx.fillStyle = '#64748b'
      ctx.beginPath()
      ctx.arc(95, 140, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(95, 200, 45, Math.PI, 0)
      ctx.fill()
      startY = 255
    } else if (cfg.hasDiagram) {
      ctx.strokeStyle = cfg.accentColor
      ctx.lineWidth = 2
      ctx.strokeRect(35, 95, canvas.width - 70, 130)
      // Low poly mesh diagram
      ctx.beginPath()
      ctx.moveTo(45, 200)
      ctx.lineTo(120, 115)
      ctx.lineTo(240, 190)
      ctx.lineTo(360, 125)
      ctx.lineTo(470, 200)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(120, 115)
      ctx.lineTo(360, 125)
      ctx.moveTo(240, 190)
      ctx.lineTo(470, 200)
      ctx.stroke()

      // Node dots
      ;[[45,200], [120,115], [240,190], [360,125], [470,200]].forEach(([nx, ny]) => {
        ctx.fillStyle = '#e63946'
        ctx.beginPath()
        ctx.arc(nx, ny, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = cfg.accentColor
      ctx.font = 'italic 16px sans-serif'
      ctx.fillText('∇·U = 0  |  Re = 4500  |  OpenFOAM Mesh', 45, 215)
      startY = 250
    }

    // Simulated typed/handwritten text lines
    ctx.fillStyle = 'rgba(30, 30, 30, 0.75)'
    for (let i = 0; i < cfg.textLines; i++) {
      const lineY = startY + i * 28
      if (lineY > canvas.height - 80) break
      
      const lineWidth = Math.random() * (canvas.width - 140) + 80
      ctx.fillRect(35, lineY, lineWidth, 8)

      // Random small bullet or red checkbox
      if (i % 3 === 0) {
        ctx.fillStyle = '#d90429'
        ctx.fillRect(35, lineY - 2, 10, 10)
        ctx.fillStyle = 'rgba(30, 30, 30, 0.75)'
      }
    }

    // Coffee Stain Ring Decal
    if (cfg.hasCoffeeRing) {
      ctx.save()
      ctx.translate(360, 480)
      ctx.beginPath()
      ctx.arc(0, 0, 75, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(110, 60, 20, 0.35)'
      ctx.lineWidth = 14
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, 82, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(90, 45, 10, 0.25)'
      ctx.lineWidth = 4
      ctx.stroke()
      ctx.restore()
    }

    // Fingerprint graphic
    if (cfg.hasFingerprint) {
      ctx.save()
      ctx.translate(400, 380)
      ctx.strokeStyle = 'rgba(180, 40, 40, 0.3)'
      ctx.lineWidth = 2
      for (let r = 8; r < 45; r += 7) {
        ctx.beginPath()
        ctx.ellipse(0, 0, r, r * 1.3, 0.2, 0, Math.PI * 1.8)
        ctx.stroke()
      }
      ctx.restore()
    }

    // Rubber Stamp Mark
    if (cfg.stamp) {
      ctx.save()
      ctx.translate(canvas.width / 2 + (Math.random() * 60 - 30), canvas.height / 2 + (Math.random() * 80 - 40))
      ctx.rotate((-15 * Math.PI) / 180)
      ctx.strokeStyle = cfg.stampColor
      ctx.lineWidth = 5
      ctx.strokeRect(-140, -35, 280, 70)
      ctx.fillStyle = cfg.stampColor
      ctx.font = 'bold 32px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(cfg.stamp, 0, 0)
      ctx.restore()
    }

    // Yellow Sticky Note Tape strip on top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(canvas.width / 2 - 40, 5, 80, 25)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    textures.push(texture)
  })

  return textures
}

/**
 * Creates low-poly paper geometries with subtle vertex curls and dog-eared corners.
 */
function createLowPolyGeometries() {
  // 1. Standard Flat Page
  const flatGeo = new THREE.PlaneGeometry(0.24, 0.32, 2, 2)

  // 2. Curled / Bent Page (Low Poly)
  const curledGeo = new THREE.PlaneGeometry(0.24, 0.32, 3, 3)
  const posAttr = curledGeo.attributes.position
  // Bend top-right and bottom-left corners upwards slightly
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i)
    const y = posAttr.getY(i)
    let z = 0
    if (x > 0.05 && y > 0.05) z = 0.015 // Top right dog ear
    if (x < -0.05 && y < -0.05) z = 0.01 // Bottom left lift
    posAttr.setZ(i, z)
  }
  curledGeo.computeVertexNormals()

  // 3. Small Sticky Note
  const stickyGeo = new THREE.PlaneGeometry(0.12, 0.12, 2, 2)
  const sPos = stickyGeo.attributes.position
  sPos.setZ(0, 0.008) // Slight lift bottom corner
  stickyGeo.computeVertexNormals()

  return { flatGeo, curledGeo, stickyGeo }
}

/**
 * ScatteredPages Component
 * 
 * Non-interactive, pure environmental scattered low-poly paper sheets lying flat on surfaces.
 * 100% grounded (no floating), high performance, 0 latency.
 */
const ScatteredPages = React.memo(function ScatteredPages() {
  // Generate procedural textures once
  const textures = useMemo(() => createPageTextures(), [])

  // Pre-created shared materials for the 8 texture variations
  const materials = useMemo(() => {
    return textures.map((tex) => new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.8,
      metalness: 0.02,
      side: THREE.DoubleSide
    }))
  }, [textures])

  // Geometries
  const { flatGeo, curledGeo, stickyGeo } = useMemo(() => createLowPolyGeometries(), [])

  // Pre-configured list of pages resting flush on surfaces
  const pageLocations = useMemo(() => [
    // --- CENTER TABLE TOP (Y = -0.355) ---
    { pos: [0.15, -0.01, 2.45], rot: [-Math.PI / 2, 0, 0.4], scale: [1, 1, 1], texIdx: 0, geoType: 'curled' },
    { pos: [0.55, -0.01, 2.70], rot: [-Math.PI / 2, 0, -0.75], scale: [0.95, 0.95, 1], texIdx: 1, geoType: 'flat' },
    { pos: [-0.05, -0.01, 2.80], rot: [-Math.PI / 2, 0, 1.15], scale: [1.1, 1.1, 1], texIdx: 4, geoType: 'curled' },
    { pos: [0.35, -0.01, 2.15], rot: [-Math.PI / 2, 0, -0.15], scale: [0.8, 0.8, 1], texIdx: 5, geoType: 'sticky' },

    // --- SOFA SEAT CUSHIONS (Y = -0.31) ---
    { pos: [-1.4, 0.13, 0.25], rot: [-Math.PI / 2, 0, -0.2], scale: [1, 1, 1], texIdx: 2, geoType: 'curled' },
    { pos: [-0.6, -0.585, 0.95], rot: [-Math.PI / 2, 0, 0.8], scale: [0.9, 0.9, 1], texIdx: 6, geoType: 'flat' },

    // --- FLOOR AROUND LOUNGE / RUG (Y = -0.585) ---
    { pos: [-1.8, -0.585, 1.2], rot: [-Math.PI / 2, 0, 2.1], scale: [1, 1, 1], texIdx: 7, geoType: 'curled' },
    { pos: [-0.2, -0.585, 0.4], rot: [-Math.PI / 2, 0, -1.4], scale: [1.05, 1.05, 1], texIdx: 0, geoType: 'flat' },
    { pos: [1.2, -0.585, 2.2], rot: [-Math.PI / 2, 0, 0.95], scale: [1, 1, 1], texIdx: 3, geoType: 'curled' },
    { pos: [1.6, -0.585, 3.1], rot: [-Math.PI / 2, 0, -2.4], scale: [0.85, 0.85, 1], texIdx: 5, geoType: 'sticky' },
    { pos: [-1.1, -0.585, 3.4], rot: [-Math.PI / 2, 0, 0.3], scale: [1, 1, 1], texIdx: 1, geoType: 'curled' },
    { pos: [0.8, -0.585, 1.1], rot: [-Math.PI / 2, 0, -1.8], scale: [1.1, 1.1, 1], texIdx: 4, geoType: 'flat' },

    // --- PRINTER TABLE TOP (Y = 0.41) & FLOOR NEAR PRINTER (Y = -0.585) ---
    { pos: [-5.6, 0.91, 4.7], rot: [-Math.PI / 2, 0, 0.25], scale: [1, 1, 1], texIdx: 3, geoType: 'flat' },
    { pos: [-6.2, 0.91, 5.3], rot: [-Math.PI / 2, 0, -0.85], scale: [0.95, 0.95, 1], texIdx: 2, geoType: 'curled' },
    { pos: [-5.1, 0.911, 5.1], rot: [-Math.PI / 2, 0, 1.4], scale: [0.75, 0.75, 1], texIdx: 5, geoType: 'sticky' },
    { pos: [-6.6, -0.585, 4.4], rot: [-Math.PI / 2, 0, -0.5], scale: [1.05, 1.05, 1], texIdx: 7, geoType: 'curled' },
    { pos: [-4.9, -0.585, 6.1], rot: [-Math.PI / 2, 0, 1.9], scale: [1, 1, 1], texIdx: 0, geoType: 'flat' },

    // --- FILING CABINET & LOCKERS FLOOR (Y = -0.585) ---
    { pos: [4.2, -0.585, 5.5], rot: [-Math.PI / 2, 0, -1.2], scale: [1, 1, 1], texIdx: 6, geoType: 'flat' },
    { pos: [5.8, -0.585, 4.8], rot: [-Math.PI / 2, 0, 2.5], scale: [0.85, 0.85, 1], texIdx: 5, geoType: 'sticky' },

    // --- BACK DESK (Y = 0.18) & FLOOR NEAR DESK (Y = -0.585) ---
    { pos: [-0.4, 0.18, -5.1], rot: [-Math.PI / 2, 0, 0.45], scale: [1, 1, 1], texIdx: 2, geoType: 'curled' },
    { pos: [0.5, 0.18, -4.9], rot: [-Math.PI / 2, 0, -0.6], scale: [0.95, 0.95, 1], texIdx: 3, geoType: 'flat' },
    { pos: [-1.4, 0.181, -5.3], rot: [-Math.PI / 2, 0, 1.0], scale: [0.75, 0.75, 1], texIdx: 5, geoType: 'sticky' },
    { pos: [1.2, -0.585, -4.5], rot: [-Math.PI / 2, 0, -2.1], scale: [1, 1, 1], texIdx: 7, geoType: 'curled' },
    { pos: [-2.1, -0.585, -4.8], rot: [-Math.PI / 2, 0, 0.8], scale: [1.05, 1.05, 1], texIdx: 0, geoType: 'flat' },

    // --- PAYPHONE / PRECINCT DOOR FLOOR (Y = -0.585) ---
    { pos: [-7.8, -0.585, -1.2], rot: [-Math.PI / 2, 0, 1.3], scale: [1, 1, 1], texIdx: 4, geoType: 'curled' },
    { pos: [-6.8, -0.585, -5.8], rot: [-Math.PI / 2, 0, -0.9], scale: [1.1, 1.1, 1], texIdx: 1, geoType: 'flat' },
    { pos: [-5.2, -0.585, -6.0], rot: [-Math.PI / 2, 0, 0.6], scale: [0.8, 0.8, 1], texIdx: 5, geoType: 'sticky' },

    // --- GRANDFATHER CLOCK & CAMERA AREA FLOOR (Y = -0.585) ---
    { pos: [-2.6, -0.585, 5.8], rot: [-Math.PI / 2, 0, -1.6], scale: [1, 1, 1], texIdx: 6, geoType: 'curled' },
    { pos: [-3.8, -0.585, 4.6], rot: [-Math.PI / 2, 0, 0.75], scale: [0.95, 0.95, 1], texIdx: 0, geoType: 'flat' }
  ], [])

  return (
    <group name="scattered-pages-group">
      {pageLocations.map((item, idx) => {
        let geo = flatGeo
        if (item.geoType === 'curled') geo = curledGeo
        if (item.geoType === 'sticky') geo = stickyGeo

        return (
          <mesh
            key={idx}
            geometry={geo}
            material={materials[item.texIdx]}
            position={item.pos}
            rotation={item.rot}
            scale={item.scale}
          />
        )
      })}
    </group>
  )
})

export default ScatteredPages
