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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProfilePhotoUpload } from "@/components/ui/profile-photo-upload"
import Link from "next/link"

export default function ProfilePage() {
  // All hooks must be declared before any conditional returns
  const { user, isLoading, logout, updateProfile } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Password visibility toggles
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar || "",
      });
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage("");
    try {
      const result = await updateProfile({
        fullName: formData.fullName,
        avatar: formData.avatar,
      });
      setMessage(result.message);
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match");
      setIsChangingPassword(false);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters long");
      setIsChangingPassword(false);
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordMessage("New password must be different from current password");
      setIsChangingPassword(false);
      return;
    }
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
    const hasNumbers = /\d/.test(passwordData.newPassword);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordData.newPassword);
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setPasswordMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      setIsChangingPassword(false);
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordMessage("Password changed successfully! You may need to log in again on other devices.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordDialog(false);
        setPasswordMessage("");
      }, 3000);
    } catch (error) {
      setPasswordMessage("Failed to change password. Please check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return;
    }
    setIsDeletingAccount(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      logout();
      router.push("/");
      setTimeout(() => {
        alert("Account has been deleted successfully. You have been logged out.");
      }, 500);
    } catch (error) {
      alert("Failed to delete account. Please try again.");
      setIsDeletingAccount(false);
      setShowDeleteDialog(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (photoUrl: string) => {
    handleInputChange("avatar", photoUrl);
    if (user) {
      try {
        await updateProfile({
          fullName: user.fullName,
          avatar: photoUrl,
        });
      } catch (error) {
        console.error("Failed to update avatar immediately:", error);
      }
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar || "",
      });
    }
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-1">Manage your account information</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 bg-white rounded-lg shadow p-6 flex flex-col items-center mr-4">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={user.avatar || ""} alt={user.fullName} />
              <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user.fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center mb-2">
              <div className="font-semibold text-lg">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <Badge variant="secondary" className="mb-2">
              {user.role.replace("_", " ").charAt(0).toUpperCase() + user.role.replace("_", " ").slice(1)}
            </Badge>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${user.isVerified ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className="text-xs text-muted-foreground">
                {user.isVerified ? "Email verified" : "Email not verified"}
              </span>
            </div>
            <Button className="w-full mb-2" variant="default">Edit Profile</Button>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/my-bookings">All Bookings</Link>
            </Button>
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            <Card className="mb-6">
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
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <ProfilePhotoUpload
                      currentPhoto={formData.avatar}
                      userId={user?.id || ""}
                      onPhotoChange={handleAvatarChange}
                      disabled={isUpdating}
                    />
                  </div>
                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="currentPassword">Old Password</Label>
                    <Input
                      id="currentPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                    />
                    <button type="button" className="absolute right-2 top-8 text-gray-400" onClick={() => setShowOldPassword(v => !v)}>
                      {showOldPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                    />
                    <button type="button" className="absolute right-2 top-8 text-gray-400" onClick={() => setShowNewPassword(v => !v)}>
                      {showNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                  {passwordMessage && (
                    <Alert>
                      <AlertDescription>{passwordMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="outline" onClick={() => setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })}>Reset</Button>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}