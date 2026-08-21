import React from 'react'
import HubObjects from '../HubObjects'
import TableModel from './TableModel'

export default function CenterScene({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem }) {
  return (
    <group>
      <TableModel />
      <HubObjects
        onNavigate={onNavigate}
        hoveredItem={hoveredItem}
        onHoverItem={onHoverItem}
        onUnhoverItem={onUnhoverItem}
      />
    </group>
  )
}