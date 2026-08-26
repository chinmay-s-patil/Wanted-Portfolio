import React, { useMemo } from 'react'
import { InteractiveObject } from '../HubObjects'
import { hubItems } from '../hubData'
import Cad3DPrinterMesh from './objects/Industrial3DPrinter'
import VisualizationOldComputerMesh from './objects/VintageComputer'
import EventsCameraRollMesh from './objects/CameraFilmRoll'

export default function RightScene({ onNavigate, hoveredItem, onHoverItem, onUnhoverItem, activeZone }) {
  const rightItems = useMemo(() => hubItems.filter((item) => item.zone === 'right'), [])

  const getItem = (id) => rightItems.find((it) => it.id === id)

  const cadItem = getItem('cad')
  const visItem = getItem('visualization')
  const eventsItem = getItem('events')

  return (
    <group>
      {cadItem && (
        <InteractiveObject
          item={cadItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'cad'}
          activeZone={activeZone}
        >
          <Cad3DPrinterMesh />
        </InteractiveObject>
      )}

      {visItem && (
        <InteractiveObject
          item={visItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'visualization'}
          activeZone={activeZone}
        >
          <VisualizationOldComputerMesh />
        </InteractiveObject>
      )}

      {eventsItem && (
        <InteractiveObject
          item={eventsItem}
          onClick={onNavigate}
          onHover={onHoverItem}
          onUnhover={onUnhoverItem}
          isHovered={hoveredItem === 'events'}
          activeZone={activeZone}
        >
          <EventsCameraRollMesh />
        </InteractiveObject>
      )}
    </group>
  )
}