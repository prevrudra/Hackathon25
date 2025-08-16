'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to secure login page
    router.replace('/secure-login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">🔒 Redirecting to Secure Login</h2>
        <p className="text-gray-600">You're being redirected to our secure authentication system...</p>
        <p className="text-sm text-green-600 mt-2">✅ Enhanced security with cookie-based authentication</p>
      </div>
    </div>
  )
}
