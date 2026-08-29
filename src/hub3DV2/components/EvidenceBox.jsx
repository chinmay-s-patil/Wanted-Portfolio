import React, { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Shared Module-Level Texture Cache to prevent GPU VRAM memory leaks.
 */
let sharedCardboardTexture = null

function getCardboardTexture() {
  if (sharedCardboardTexture) return sharedCardboardTexture

  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#bc9363'
  ctx.fillRect(0, 0, 128, 128)

  ctx.strokeStyle = '#a87f50'
  ctx.lineWidth = 1
  for (let y = 0; y < 128; y += 4) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(128, y + (Math.random() * 2 - 1))
    ctx.stroke()
  }

  const imgData = ctx.getImageData(0, 0, 128, 128)
  const data = imgData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 10
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  sharedCardboardTexture = new THREE.CanvasTexture(canvas)
  sharedCardboardTexture.wrapS = THREE.RepeatWrapping
  sharedCardboardTexture.wrapT = THREE.RepeatWrapping
  sharedCardboardTexture.colorSpace = THREE.SRGBColorSpace
  return sharedCardboardTexture
}

const labelTextureCache = new Map()

function getLabelTexture(labelType, caseNumber) {
  const key = `${labelType}_${caseNumber}`
  if (labelTextureCache.has(key)) {
    return labelTextureCache.get(key)
  }

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f5f0e6'
  ctx.fillRect(0, 0, 256, 128)

  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 4
  ctx.strokeRect(5, 5, 246, 118)

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(8, 8, 240, 24)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 13px "Courier New", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('PRECINCT EVIDENCE ARCHIVE', 128, 25)

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 10px "Courier New", monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`STATUS: ${labelType}`, 16, 50)
  ctx.fillText(`REF: ${caseNumber}`, 16, 68)
  ctx.fillText('DEPT: INVESTIGATION', 16, 86)

  ctx.save()
  ctx.translate(170, 70)
  ctx.rotate(-0.18)
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.85)'
  ctx.lineWidth = 2
  ctx.strokeRect(-55, -13, 110, 26)
  ctx.fillStyle = 'rgba(220, 38, 38, 0.85)'
  ctx.font = 'bold 12px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('CONFIDENTIAL', 0, 4)
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  labelTextureCache.set(key, texture)
  return texture
}

const boxWidth = 0.46
const boxHeight = 0.30
const boxDepth = 0.36
const lidHeight = 0.07

const mainBoxGeo = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)
const bandGeo = new THREE.BoxGeometry(boxWidth + 0.002, 0.08, boxDepth + 0.002)
const lidGeo = new THREE.BoxGeometry(boxWidth + 0.016, lidHeight, boxDepth + 0.016)
const labelGeo = new THREE.PlaneGeometry(0.26, 0.14)
const slotGeo = new THREE.PlaneGeometry(0.09, 0.035)

/**
 * EvidenceBox Component
 *
 * Performance-optimized Bankers Box component with shared texture caching
 * to eliminate WebGL memory leaks and GPU context loss.
 */
const EvidenceBox = React.memo(function EvidenceBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  labelType = 'EVIDENCE',
  caseNumber = 'CASE #8492-B',
}) {
  const cardboardTexture = useMemo(() => getCardboardTexture(), [])
  const labelTexture = useMemo(() => getLabelTexture(labelType, caseNumber), [labelType, caseNumber])

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Lower Main Box Body */}
      <mesh position={[0, boxHeight / 2, 0]} geometry={mainBoxGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={cardboardTexture}
          color="#c29867"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Bankers Box Dark Blue Bottom Accent Band */}
      <mesh position={[0, 0.04, 0]} geometry={bandGeo} castShadow>
        <meshStandardMaterial color="#1e3a5f" roughness={0.7} />
      </mesh>

      {/* Top Cardboard Lid */}
      <mesh position={[0, boxHeight + lidHeight / 2 - 0.01, 0]} geometry={lidGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={cardboardTexture}
          color="#ca9f6d"
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* Front Evidence Sticker Label */}
      <mesh position={[0, boxHeight * 0.52, boxDepth / 2 + 0.002]} geometry={labelGeo}>
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      {/* Back Evidence Sticker Label */}
      <mesh position={[0, boxHeight * 0.52, -boxDepth / 2 - 0.002]} rotation={[0, Math.PI, 0]} geometry={labelGeo}>
        <meshBasicMaterial map={labelTexture} transparent />
      </mesh>

      {/* Left Handle Cutout Slot */}
      <mesh position={[-boxWidth / 2 - 0.001, boxHeight * 0.68, 0]} rotation={[0, -Math.PI / 2, 0]} geometry={slotGeo}>
        <meshBasicMaterial color="#1f140a" />
      </mesh>

      {/* Right Handle Cutout Slot */}
      <mesh position={[boxWidth / 2 + 0.001, boxHeight * 0.68, 0]} rotation={[0, Math.PI / 2, 0]} geometry={slotGeo}>
        <meshBasicMaterial color="#1f140a" />
      </mesh>
    </group>
  )
})

export default EvidenceBox
