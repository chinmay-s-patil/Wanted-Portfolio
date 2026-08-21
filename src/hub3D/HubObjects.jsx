import React, { useState, useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { hubItems } from './hubData'
import { LandingNewspaperMesh } from './components/LandingScene'

const OUTLINE_COLOR = '#c4a574'

function ObjectOutline({ size = [1, 1, 1], color = '#c4a574' }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size[0], size[1], size[2]])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  )
}

function InteractiveObject({ item, onClick, onHover, onUnhover, isHovered, children, outlineSize = [0.7, 0.7, 0.7] }) {
  const [localHover, setLocalHover] = useState(false)
  const hovered = isHovered || localHover

  const handlePointerOver = (e) => {
    setLocalHover(true)
    onHover?.(item.id)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e) => {
    setLocalHover(false)
    onUnhover?.(item.id)
    document.body.style.cursor = 'auto'
  }

  const handleClick = (e) => {
    e.stopPropagation()
    onClick?.(item.path)
  }

  return (
    <group
      position={item.position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      name={`hub_${item.id}`}
    >
      {hovered && (
        <Text
          position={[0, outlineSize[1] / 2 + 0.2, 0]}
          fontSize={0.14}
          color='#f6efe2'
          anchorX='center'
          anchorY='bottom'
        >
          {item.label}
        </Text>
      )}
      {children}
      {hovered && <ObjectOutline size={outlineSize} color={OUTLINE_COLOR} />}
    </group>
  )
}

function Newspaper({ item, ...props }) {
  return (
    <InteractiveObject item={item} {...props} outlineSize={[0.68, 0.025, 0.47]}>
      <LandingNewspaperMesh />
    </InteractiveObject>
  )
}

const objectComponents = {
  landing: Newspaper,
}

export default function HubObjects({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem }) {
  const handleClick = (path) => {
    onNavigate(path)
  }

  return (
    <group>
      {hubItems.map((item) => {
        const Component = objectComponents[item.id]
        if (!Component) return null
        return (
          <Component
            key={item.id}
            item={item}
            onClick={handleClick}
            onHover={onHoverItem}
            onUnhover={onUnhoverItem}
            isHovered={hoveredItem === item.id}
          />
        )
      })}
    </group>
  )
}