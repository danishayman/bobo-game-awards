'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { LoadingOverlay } from './loading-overlay'

interface LoadingWrapperProps {
  children: React.ReactNode
}

export function LoadingWrapper({ children }: LoadingWrapperProps) {
  const { signingOut } = useAuth()

  return (
    <>
      {children}
      <LoadingOverlay isVisible={signingOut} message="Signing out..." />
    </>
  )
}
