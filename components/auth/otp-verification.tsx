"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"

export function OTPVerification() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const { verifyOTP, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP");
      return;
    }

    // Check OTP from localStorage (demo only)
    const storedOtp = localStorage.getItem("quickcourt_signup_otp");
    if (otp !== storedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // Get pending user data
    const pendingUser = localStorage.getItem("quickcourt_pending_user");
    if (!pendingUser) {
      setError("No pending signup found. Please sign up again.");
      return;
    }
    const userData = JSON.parse(pendingUser);

    // Create account using signup (calls backend if implemented)
    const result = await verifyOTP(email, otp);
    if (result.success) {
      // Clean up
      localStorage.removeItem("quickcourt_signup_otp");
      localStorage.removeItem("quickcourt_pending_user");
      router.push("/dashboard");
    } else {
      setError(result.message);
    }
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setOtp(numericValue)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>We've sent a 6-digit code to {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="link" className="text-sm">
            Resend OTP
          </Button>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-center">
          <p className="text-muted-foreground">For demo purposes, enter any 6-digit number</p>
        </div>
      </CardContent>
    </Card>
  )
}
