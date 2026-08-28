import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const EasterEggContext = createContext()

export function EasterEggProvider({ children }) {
  const [activeEgg, setActiveEgg] = useState(null) // 'piano' | 'violin' | null
  const [isTvPaused, setIsTvPaused] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Use a Ref for currentTime so timestamp updates do NOT trigger React re-renders or iframe reloads
  const currentTimeRef = useRef(0)
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    if (!activeEgg || isTvPaused) return

    lastTickRef.current = Date.now()
    const interval = setInterval(() => {
      const now = Date.now()
      const deltaSec = (now - lastTickRef.current) / 1000
      lastTickRef.current = now
      currentTimeRef.current += deltaSec
    }, 1000)

    return () => clearInterval(interval)
  }, [activeEgg, isTvPaused])

  const triggerEgg = useCallback((eggType) => {
    setActiveEgg(eggType)
    setIsTvPaused(false)
    setIsMinimized(false)
    currentTimeRef.current = 0
  }, [])

  const togglePause = useCallback(() => {
    setIsTvPaused((prev) => !prev)
  }, [])

  const closeEgg = useCallback(() => {
    setActiveEgg(null)
    setIsTvPaused(false)
    setIsMinimized(false)
    currentTimeRef.current = 0
  }, [])

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev)
  }, [])

  return (
    <EasterEggContext.Provider
      value={{
        activeEgg,
        setActiveEgg,
        triggerEgg,
        isTvPaused,
        setIsTvPaused,
        togglePause,
        closeEgg,
        isMinimized,
        setIsMinimized,
        toggleMinimize,
        currentTimeRef
      }}
    >
      {children}
    </EasterEggContext.Provider>
  )
}

export function useEasterEgg() {
  const context = useContext(EasterEggContext)
  if (!context) {
    throw new Error('useEasterEgg must be used within an EasterEggProvider')
  }
  return context
}
