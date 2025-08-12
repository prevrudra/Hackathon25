
"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otp-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Send, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email: string, otp: string) => {
  // Calls API route to send OTP
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.ok;
};

const OTPOne: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    
    setStatus("sending");
    setError("");
    
    const newOtp = generateOTP();
    setOtp(newOtp);
    
    const ok = await sendOtpEmail(email, newOtp);
    if (ok) {
      setStatus("sent");
      setCountdown(30); // Start 30-second cooldown
    } else {
      setError("Failed to send OTP. Try again.");
      setStatus("error");
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResending) return;
    
    setIsResending(true);
    setError("");
    
    try {
      const newOtp = generateOTP();
      setOtp(newOtp);
      
      const ok = await sendOtpEmail(email, newOtp);
      if (ok) {
        setCountdown(30); // Reset 30-second cooldown
        setInput(""); // Clear current OTP input
      } else {
        setError("Failed to resend OTP. Try again.");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    setStatus("verifying");
    setError("");
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (input === otp) {
      setStatus("success");
    } else {
      setStatus("error");
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleOtpComplete = (value: string) => {
    setInput(value);
    if (value.length === 6) {
      handleVerify();
    }
  };

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setInput("");
    setStatus("idle");
    setError("");
    setCountdown(0);
    setIsResending(false);
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700">OTP Verified Successfully!</h3>
                <p className="text-muted-foreground mt-2">
                  Your email has been verified.
                </p>
              </div>
              <Button onClick={resetForm} variant="outline" className="mt-4">
                Verify Another Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
          <CardDescription className="text-base">
            {status === "idle" || status === "sending" || status === "error" 
              ? "Enter your email to receive a verification code"
              : "Enter the 6-digit code sent to your email"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {(status === "idle" || status === "sending" || (status === "error" && !otp)) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === "sending"}
                  className="h-11"
                />
              </div>
              
              <Button 
                onClick={handleSendOtp} 
                className="w-full h-11" 
                disabled={status === "sending" || !email}
              >
                {status === "sending" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          )}

          {(status === "sent" || status === "verifying" || (status === "error" && otp)) && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  Code sent to: <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <Label className="text-base font-medium">Enter verification code</Label>
                <div className="flex justify-center">
                  <OTPInput
                    length={6}
                    value={input}
                    onChange={setInput}
                    onComplete={handleOtpComplete}
                    disabled={status === "verifying"}
                    error={status === "error"}
                    autoFocus
                  />
                </div>
              </div>

              <Button 
                onClick={handleVerify} 
                className="w-full h-11" 
                disabled={status === "verifying" || input.length !== 6}
              >
                {status === "verifying" ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="text-center space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  
                  {countdown > 0 && (
                    <div className="space-y-2">
                      <div className="w-full bg-muted rounded-full h-2">
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
                </div>
                
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
                
                <div>
                  <Button variant="link" onClick={() => setStatus("idle")} className="text-sm">
                    Change Email
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-muted/50 rounded-lg text-center border border-dashed">
            <p className="text-sm text-muted-foreground font-medium">
              Demo Mode - Gmail Integration
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Check your email for the verification code
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPOne;
