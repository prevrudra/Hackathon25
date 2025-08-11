"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { Eye, EyeOff, User, Camera, Upload } from "lucide-react"
import Link from "next/link"

export function SignupFormSimple() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "" as UserRole | "",
    profilePicture: null as File | null,
  })
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signup, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (!formData.role) {
      setError("Please select a role")
      return
    }

    // Convert profile picture to base64 if exists
    let avatarData = ""
    if (formData.profilePicture) {
      const reader = new FileReader()
      avatarData = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(formData.profilePicture!)
      })
    }

    const result = await signup({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role as UserRole,
      avatar: avatarData,
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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setFormData((prev) => ({ ...prev, profilePicture: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError("") // Clear any previous errors
    }
  }

  const triggerFileInput = () => {
    document.getElementById('profile-picture-input')?.click()
  }

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="text-center space-y-2 pb-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">Q</span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">QUICKCOURT</CardTitle>
        <p className="text-lg font-semibold text-gray-700">SIGN UP</p>
      </CardHeader>
      
      <CardContent className="space-y-3 px-8 pb-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-4">
            <Label className="text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </Label>
            <div className="relative">
              <div 
                className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden"
                onClick={triggerFileInput}
              >
                {profilePreview ? (
                  <img 
                    src={profilePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={triggerFileInput}
              >
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            {formData.profilePicture && (
              <p className="text-xs text-gray-500 mt-1">{formData.profilePicture.name}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-1">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Sign up as
            </Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="h-10 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              required
            >
              <option value="">Player / Facility Owner</option>
              <option value="user">Player</option>
              <option value="facility_owner">Facility Owner</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder=""
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="h-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder=""
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="h-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=""
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="h-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder=""
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="h-10 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800 text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {/* Sign Up Button */}
          <Button
            type="submit"
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>

          {/* Already have account link */}
          <div className="text-center text-sm mt-3">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
