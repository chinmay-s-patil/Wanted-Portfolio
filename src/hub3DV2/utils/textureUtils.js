import * as THREE from 'three'

/**
 * Generates a high-resolution procedurally generated dark mahogany wood texture canvas.
 */
export function generateWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Base dark aged mahogany wood tone for gritty precinct vibe
  ctx.fillStyle = '#4a2d18'
  ctx.fillRect(0, 0, 1024, 1024)

  // Draw horizontal wood grain fibers & tone variations
  for (let y = 0; y < 1024; y += 4) {
    const shade = Math.sin(y * 0.04) * 18 + (Math.random() - 0.5) * 14
    const r = Math.min(255, Math.max(0, 78 + shade))
    const g = Math.min(255, Math.max(0, 46 + shade * 0.7))
    const b = Math.min(255, Math.max(0, 24 + shade * 0.5))
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.fillRect(0, y, 1024, 4)
  }

  // Add dark wood ring swirls & knots
  ctx.strokeStyle = 'rgba(30, 16, 8, 0.55)'
  ctx.lineWidth = 7
  for (let i = 0; i < 32; i++) {
    ctx.beginPath()
    ctx.ellipse(512 + Math.sin(i * 0.5) * 140, i * 36, 420 + i * 16, 65 + i * 6, 0.12, 0, Math.PI * 2)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  return tex
}

/**
 * Generates a gritty retro police precinct wallpaper texture with fine vertical pinstripes and plaster grain.
 */
export function generateWallTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  // Base dark moody charcoal-slate tone
  ctx.fillStyle = '#141a22'
  ctx.fillRect(0, 0, 1024, 1024)

  // Vertical pinstripe wallpaper pattern
  for (let x = 0; x < 1024; x += 16) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
    ctx.fillRect(x, 0, 4, 1024)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
    ctx.fillRect(x + 4, 0, 4, 1024)
  }

  // Gritty plaster noise texture grain
  const imgData = ctx.getImageData(0, 0, 1024, 1024)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 14
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 2)
  return tex
}

/**
 * Generates a high-resolution procedurally generated vintage newspaper canvas texture.
 */
export function generateNewspaperTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 2048
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#e8dec8'
  ctx.fillRect(0, 0, 2048, 2048)

  const drawNewspaperPage = (startX, startY, width, height, title) => {
    const pad = 40
    ctx.strokeStyle = '#2b261f'
    ctx.lineWidth = 4
    ctx.strokeRect(startX + pad, startY + pad, width - pad * 2, height - pad * 2)

    ctx.fillStyle = '#1e1b16'
    ctx.font = 'bold 56px "Times New Roman", serif'
    ctx.textAlign = 'center'
    ctx.fillText(title.toUpperCase(), startX + width / 2, startY + pad + 70)

    ctx.font = 'italic 20px "Times New Roman", serif'
    ctx.fillText('NOIR PRECINCT GAZETTE • SPECIAL EDITION', startX + width / 2, startY + pad + 105)

    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(startX + pad + 20, startY + pad + 120)
    ctx.lineTo(startX + width - pad - 20, startY + pad + 120)
    ctx.stroke()

    ctx.fillStyle = '#3a342c'
    ctx.fillRect(startX + pad + 30, startY + pad + 140, width - pad * 2 - 60, 260)
    ctx.fillStyle = '#e8dec8'
    ctx.font = 'bold 28px sans-serif'
    ctx.fillText('[ CASE FILE ARCHIVE ]', startX + width / 2, startY + pad + 270)

    ctx.font = 'bold 36px "Times New Roman", serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#1e1b16'
    ctx.fillText('MAJOR BREAKTHROUGH IN UNRESOLVED SOLVERS', startX + pad + 30, startY + pad + 440)

    ctx.fillStyle = '#2b261f'
    const colWidth = (width - pad * 2 - 80) / 3
    for (let c = 0; c < 3; c++) {
      const colX = startX + pad + 30 + c * (colWidth + 20)
      let lineY = startY + pad + 480
      ctx.fillRect(colX, lineY, colWidth, 6)
      lineY += 16

      for (let l = 0; l < 24; l++) {
        const lineWidth = (l % 5 === 4) ? colWidth * 0.6 : colWidth
        ctx.fillRect(colX, lineY, lineWidth, 4)
        lineY += 12
      }
    }
  }

  drawNewspaperPage(820, 10, 950, 1750, 'THE DAILY CHRONICLE')
  drawNewspaperPage(60, 440, 750, 950, 'EXTRA EDITION')

  const imgData = ctx.getImageData(0, 0, 2048, 2048)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}
