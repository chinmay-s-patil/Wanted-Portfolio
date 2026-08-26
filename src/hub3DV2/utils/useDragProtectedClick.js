import { useRef } from 'react'

/**
 * useDragProtectedClick Hook
 *
 * Prevents interactive 3D model click navigation from triggering when the user is left-click dragging / rotating the camera view.
 *
 * @param {Function} onClickCallback - Action to perform if click is stationary
 * @param {number} maxDragDistance - Pixel threshold beyond which a click is considered a drag (default 6px)
 */
export function useDragProtectedClick(onClickCallback, maxDragDistance = 6) {
  const pointerDownPos = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    pointerDownPos.current = {
      x: e.clientX ?? e.nativeEvent?.clientX ?? 0,
      y: e.clientY ?? e.nativeEvent?.clientY ?? 0
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()

    const currentX = e.clientX ?? e.nativeEvent?.clientX ?? 0
    const currentY = e.clientY ?? e.nativeEvent?.clientY ?? 0
    const dx = currentX - pointerDownPos.current.x
    const dy = currentY - pointerDownPos.current.y
    const distance = Math.hypot(dx, dy)

    const delta = e.delta ?? distance

    if (distance > maxDragDistance || delta > maxDragDistance) {
      return // User was dragging / rotating camera view, ignore click navigation!
    }

    if (onClickCallback) {
      onClickCallback(e)
    }
  }

  return { handlePointerDown, handleClick }
}

export default useDragProtectedClick
