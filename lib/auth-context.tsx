// DEPRECATED: This file is deprecated and replaced by secure-auth-context.tsx
// This is a temporary redirect to prevent import errors during migration

'use client'

import { useSecureAuth, SecureAuthProvider } from './secure-auth-context'

// Re-export with old names for compatibility
export const useAuth = useSecureAuth
export const AuthProvider = SecureAuthProvider

// Note: All new code should import from '@/lib/secure-auth-context' directly
if (typeof window !== 'undefined') {
  console.warn('⚠️ DEPRECATED: auth-context.tsx is deprecated. Use secure-auth-context.tsx instead.')
}
