"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth, type UserRole } from "@/lib/auth-context"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"

export function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "" as UserRole | "",
  })
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string>("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      setError("Profile picture must be less than 1MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setError("")
    setProfilePicture(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfilePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeProfilePicture = () => {
    setProfilePicture(null)
    setProfilePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.role) {
      setError("Please select a role")
      return
    }

    if (!profilePicture) {
      setError("Please upload a profile picture")
      return
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role as UserRole,
      profilePicture: profilePicture,
    })

    if (result.success) {
      setSuccess(result.message)
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`)
      }, 2000)
    } else {
      setError(result.message)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 shadow my-0 px-4 rounded-4xl border-2">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">Q</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Join QuickCourt</CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Create your account to start booking sports facilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 border-0 px-24">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Profile Picture <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-gray-200">
                  <AvatarImage src={profilePreview || "/placeholder.svg"} alt="Profile preview" />
                  <AvatarFallback className="bg-gray-100 text-gray-400 text-lg">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <Upload className="w-8 h-8" />}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    id="profile-picture"
                  />
                  <Label
                    htmlFor="profile-picture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Label>
                  {profilePicture && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeProfilePicture}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 text-center">Upload a profile picture (max 1MB)</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold text-gray-700">
                I am a
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">🏃‍♂️ Sports Player</SelectItem>
                  <SelectItem value="facility_owner">🏢 Facility Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
