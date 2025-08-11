import { OTPVerification } from "@/components/auth/otp-verification"

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <OTPVerification />
    </div>
  )
}
