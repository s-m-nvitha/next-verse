import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function useAuthGuard({ children, requireAuth = true, redirectTo = '/login' }: AuthGuardProps) {
  const { user } = useAuthStore()
  const { isOfflineMode } = useUIStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (requireAuth && !user && !isOfflineMode) {
      navigate(redirectTo, { state: { from: location.pathname } })
    }
  }, [user, requireAuth, isOfflineMode, navigate, redirectTo, location.pathname])

  // Allow offline mode to bypass auth for certain pages
  if (isOfflineMode && !user) {
    return <>{children}</>
  }

  if (requireAuth && !user) {
    return null
  }

  return <>{children}</>
}

export function AuthGuard({ children, requireAuth = true, redirectTo = '/login' }: AuthGuardProps) {
  return useAuthGuard({ children, requireAuth, redirectTo })
}
