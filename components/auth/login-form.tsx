"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">Q</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600 text-base">Sign in to your QuickCourt account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold mb-4 text-blue-900 text-center">🚀 Try Demo Accounts</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="font-medium text-gray-700">Admin:</span>
                <span className="text-blue-600 font-mono">admin@quickcourt.com</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="font-medium text-gray-700">Owner:</span>
                <span className="text-blue-600 font-mono">owner@quickcourt.com</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="font-medium text-gray-700">User:</span>
                <span className="text-blue-600 font-mono">user@quickcourt.com</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded border">
                <span className="font-medium text-gray-700">Password:</span>
                <span className="text-blue-600 font-mono">password123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
