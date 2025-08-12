"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/ui/otp-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Clock, Mail, RefreshCw, CheckCircle2 } from "lucide-react"

export function OTPVerification() {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const { verifyOTP, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  // Start countdown when component mounts
  useEffect(() => {
    setCountdown(30) // 30 seconds cooldown
  }, [])

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
      setIsVerified(true)
      // Clean up
      localStorage.removeItem("quickcourt_signup_otp");
      localStorage.removeItem("quickcourt_pending_user");
      
      // Delay navigation to show success state
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500)
    } else {
      setError(result.message);
    }
  };

  const handleOtpComplete = (value: string) => {
    if (value.length === 6) {
      // Auto-submit when OTP is complete
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return
    
    setIsResending(true)
    setError("")
    
    try {
      // Generate new OTP for demo
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
      localStorage.setItem("quickcourt_signup_otp", newOtp)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCountdown(30) // Reset countdown
      setOtp("") // Clear current OTP
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-700">Email Verified!</h3>
              <p className="text-muted-foreground mt-2">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription className="text-base">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="otp" className="text-base font-medium">Enter verification code</Label>
            <div className="flex justify-center">
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleOtpComplete}
                disabled={isLoading}
                error={!!error}
                autoFocus
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full h-11 text-base" 
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Didn't receive the code?
            </p>
            
            {countdown > 0 && (
              <div className="mb-3">
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Please wait {countdown} seconds before requesting a new code
                </p>
              </div>
            )}
            
            <Button 
              type="button"
              variant="outline" 
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              className="h-10"
            >
              {isResending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : countdown > 0 ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Resend in {countdown}s
                </>
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-center border border-dashed">
            <p className="text-sm text-muted-foreground font-medium">
              Demo Mode
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              For testing, enter any 6-digit number
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
