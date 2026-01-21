'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface MobileContextValue {
  isMobile: boolean
}

const MobileContext = createContext<MobileContextValue | undefined>(undefined)

export function MobileProvider({ children }: { children: ReactNode }) {
  // Start with true on server to avoid blur flash on mobile
  // Will be corrected on client if actually desktop
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    // Single resize listener for the entire app
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Debounce resize events
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  )
}

export function useMobile() {
  const context = useContext(MobileContext)
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider')
  }
  return context
}
