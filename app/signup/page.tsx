import { SignupFormSimple } from "@/components/auth/signup-form-simple"

export default function SignupPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <img 
              src="/placeholder-logo.png" 
              alt="QuickCourt Logo" 
              className="w-32 h-32 mx-auto mb-6"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Join QuickCourt
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Create your account and start booking premium sports facilities across India
          </p>
          <div className="space-y-2 text-blue-100">
            <p>✓ Instant booking confirmation</p>
            <p>✓ Premium facilities nationwide</p>
            <p>✓ Secure payment processing</p>
          </div>
        </div>
      </div>

      {/* Right side - Signup Form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <SignupFormSimple />
        </div>
      </div>
    </div>
  )
}
