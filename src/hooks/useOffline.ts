import { useState, useEffect } from 'react'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isOfflineMode, setIsOfflineMode] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const enableOfflineMode = () => {
    setIsOfflineMode(true)
    // Store offline mode preference
    localStorage.setItem('offlineMode', 'true')
  }

  const disableOfflineMode = () => {
    setIsOfflineMode(false)
    localStorage.removeItem('offlineMode')
  }

  useEffect(() => {
    // Check for stored offline mode preference
    const storedOfflineMode = localStorage.getItem('offlineMode')
    if (storedOfflineMode === 'true') {
      setIsOfflineMode(true)
    }
  }, [])

  return {
    isOnline,
    isOfflineMode,
    enableOfflineMode,
    disableOfflineMode,
    isOffline: !isOnline || isOfflineMode,
  }
}
