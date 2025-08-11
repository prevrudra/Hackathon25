"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
<<<<<<< HEAD
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
=======
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState("")
<<<<<<< HEAD
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState("")
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  
  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
=======
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar || "",
      })
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

<<<<<<< HEAD
    const handleSubmit = async (e: React.FormEvent) => {
=======
  const handleSubmit = async (e: React.FormEvent) => {
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
    e.preventDefault()
    setIsUpdating(true)
    setMessage("")

<<<<<<< HEAD
    try {
      // Simulate API call - In real app, this would update the user profile
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordMessage("")

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match")
      setIsChangingPassword(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters long")
      setIsChangingPassword(false)
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordMessage("New password must be different from current password")
      setIsChangingPassword(false)
      return
    }

    // Basic password strength check
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword)
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword)
    const hasNumbers = /\d/.test(passwordData.newPassword)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setPasswordMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
      setIsChangingPassword(false)
      return
    }

    try {
      // Simulate API call for password change
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setPasswordMessage("Password changed successfully! You may need to log in again on other devices.")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        setShowPasswordDialog(false)
        setPasswordMessage("")
      }, 3000)
    } catch (error) {
      setPasswordMessage("Failed to change password. Please check your current password.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return
    }

    setIsDeletingAccount(true)

    try {
      // Simulate API call for account deletion
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // In a real app, this would call an API to delete the account
      // For demo purposes, we'll logout the user and redirect
      logout()
      router.push("/")
      
      // Show success message
      setTimeout(() => {
        alert("Account has been deleted successfully. You have been logged out.")
      }, 500)
    } catch (error) {
      alert("Failed to delete account. Please try again.")
      setIsDeletingAccount(false)
      setShowDeleteDialog(false)
    }
=======
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would update the user in the database
    // For demo, we'll just show a success message
    setMessage("Profile updated successfully!")
    setIsUpdating(false)
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-primary">{user.fullName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.fullName}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {user.role.replace("_", " ").charAt(0).toUpperCase() + user.role.replace("_", " ").slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${user.isVerified ? "bg-green-500" : "bg-yellow-500"}`}></div>
                <span className="text-sm text-muted-foreground">
                  {user.isVerified ? "Email verified" : "Email not verified"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange("avatar", e.target.value)}
                  />
                </div>

                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
<<<<<<< HEAD
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-transparent">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                          {passwordData.newPassword && (
                            <div className="text-xs text-muted-foreground">
                              Password requirements:
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li className={passwordData.newPassword.length >= 8 ? "text-green-600" : "text-red-500"}>
                                  At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(passwordData.newPassword) ? "text-green-600" : "text-red-500"}>
                                  One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(passwordData.newPassword) ? "text-green-600" : "text-red-500"}>
                                  One lowercase letter
                                </li>
                                <li className={/\d/.test(passwordData.newPassword) ? "text-green-600" : "text-red-500"}>
                                  One number
                                </li>
                                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword) ? "text-green-600" : "text-red-500"}>
                                  One special character (!@#$%^&*)
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            required
                            minLength={6}
                          />
                        </div>
                        {passwordMessage && (
                          <Alert className={passwordMessage.includes("successfully") ? "border-green-200 bg-green-50" : ""}>
                            <AlertDescription className={passwordMessage.includes("successfully") ? "text-green-700" : ""}>
                              {passwordMessage}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isChangingPassword}>
                          {isChangingPassword ? "Changing..." : "Change Password"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
=======
                <Button variant="outline" className="bg-transparent">
                  Change Password
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  Enable 2FA
                </Button>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
<<<<<<< HEAD
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="deleteConfirmation">
                          Type <strong>DELETE</strong> to confirm:
                        </Label>
                        <Input
                          id="deleteConfirmation"
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE to confirm"
                        />
                      </div>
                      <Alert variant="destructive">
                        <AlertDescription>
                          <strong>Warning:</strong> This will permanently delete your account, all bookings, and personal data. This action cannot be undone.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => {
                        setShowDeleteDialog(false)
                        setDeleteConfirmation("")
                      }}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmation !== "DELETE" || isDeletingAccount}
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
=======
                  <p className="text-sm text-muted-foreground">Permanently delete your account</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
>>>>>>> 2402ed90cdac1bdac3c4fabc71334b5e1b780877
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
