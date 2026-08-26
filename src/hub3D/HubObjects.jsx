import React, { useState, useEffect, useMemo } from 'react'
import { Html, Billboard } from '@react-three/drei'
import * as THREE from 'three'

const OUTLINE_COLOR = '#d4a742'

export function ObjectOutline({ size = [1, 1, 1], color = OUTLINE_COLOR }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size[0], size[1], size[2]])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}

export function InteractiveObject({ item, onClick, onHover, onUnhover, isHovered, activeZone, children, outlineSize }) {
  const [localHover, setLocalHover] = useState(false)

  const isActive = !activeZone || item?.zone === activeZone
  const hovered = isActive && (isHovered || localHover)

  useEffect(() => {
    if (!isActive) {
      setLocalHover(false)
    }
  }, [isActive])

  const handlePointerOver = (e) => {
    if (!isActive) return
    e.stopPropagation()
    setLocalHover(true)
    onHover?.(item.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setLocalHover(false)
    onUnhover?.(item.id)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e) => {
    if (!isActive) return
    e.stopPropagation()
    onClick?.(item.path)
  }

  const size = outlineSize || item?.outlineSize || [0.7, 0.7, 0.7]

  return (
    <group position={item.position} name={`hub_${item.id}`}>
      {/* Invisible bounding hit box for smooth, precise hover hit detection */}
      {isActive && (
        <mesh
          visible={false}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <boxGeometry args={size} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}

      {/* Hover Tag label using Drei Html overlay */}
      {hovered && (
        <Billboard position={[0, size[1] / 2 + 0.32, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
          <Html center distanceFactor={7}>
            <div
              style={{
                background: 'rgba(18, 15, 12, 0.94)',
                border: '2px solid #d4a742',
                color: '#fffae6',
                padding: '5px 14px',
                borderRadius: '6px',
                fontFamily: "'Special Elite', monospace",
                fontSize: '13px',
                whiteSpace: 'nowrap',
                boxShadow: '0 6px 18px rgba(0,0,0,0.7)',
                pointerEvents: 'none',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {`${item.icon || ''} ${item.label}`}
            </div>
          </Html>
        </Billboard>
      )}

      {children}
      {hovered && <ObjectOutline size={size} color={OUTLINE_COLOR} />}
      {hovered && <pointLight position={[0, size[1] / 2 + 0.1, 0.2]} intensity={1.2} color='#ffd480' distance={2.2} />}
    </group>
  )
}

export default function HubObjects({ children }) {
  return <group>{children}</group>
}