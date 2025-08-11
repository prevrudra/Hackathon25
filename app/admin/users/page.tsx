"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { type PlatformUser } from "@/lib/admin-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { format, parseISO } from "date-fns"

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<PlatformUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [usersLoading, setUsersLoading] = useState(true)
  
  // State for user details modal
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  
  // State for ban confirmation
  const [userToBan, setUserToBan] = useState<PlatformUser | null>(null)
  const [banReason, setBanReason] = useState("")
  const [showBanDialog, setShowBanDialog] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        } else {
          console.error('Failed to fetch users')
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setUsersLoading(false)
      }
    }

    if (user && user.role === "admin") {
      fetchUsers()
    }
  }, [user])

  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  // Enhanced ban functionality with confirmation and reason
  const handleBanUser = (user: PlatformUser) => {
    setUserToBan(user)
    setShowBanDialog(true)
    setBanReason("")
  }

  const confirmBanUser = async () => {
    if (!userToBan) return

    setIsProcessing(userToBan.id)
    setShowBanDialog(false)

    try {
      const action = userToBan.isBanned ? 'unban' : 'ban'

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action, 
          userId: userToBan.id,
          reason: banReason
        }),
      })

      if (response.ok) {
        setUsers((prev) => prev.map((u) => 
          u.id === userToBan.id ? { ...u, isBanned: !u.isBanned } : u
        ))
      } else {
        console.error('Failed to toggle user ban status')
        alert('Failed to update user status. Please try again.')
      }
    } catch (error) {
      console.error('Error toggling user ban:', error)
      alert('Error updating user status. Please try again.')
    } finally {
      setIsProcessing(null)
      setUserToBan(null)
      setBanReason("")
    }
  }

  // Show user details modal
  const showUserDetailsModal = (user: PlatformUser) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  // Simple unban for active users (no confirmation needed)
  const handleQuickUnban = async (userId: string) => {
    setIsProcessing(userId)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'unban', userId }),
      })

      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBanned: false } : u)))
      } else {
        console.error('Failed to unban user')
        alert('Failed to unban user. Please try again.')
      }
    } catch (error) {
      console.error('Error unbanning user:', error)
      alert('Error unbanning user. Please try again.')
    } finally {
      setIsProcessing(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !user.isBanned) ||
      (statusFilter === "banned" && user.isBanned) ||
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusBadge = (user: PlatformUser) => {
    if (user.isBanned) {
      return <Badge variant="destructive">Banned</Badge>
    }
    if (!user.isVerified) {
      return <Badge variant="secondary">Unverified</Badge>
    }
    return <Badge variant="default">Active</Badge>
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "facility_owner":
        return <Badge variant="outline">Facility Owner</Badge>
      case "user":
        return <Badge variant="outline">User</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage platform users and facility owners</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">Users</SelectItem>
                      <SelectItem value="facility_owner">Facility Owners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((platformUser) => (
                <Card key={platformUser.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {platformUser.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{platformUser.fullName}</h3>
                            {getStatusBadge(platformUser)}
                            {getRoleBadge(platformUser.role)}
                          </div>
                          <p className="text-sm text-muted-foreground">{platformUser.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {format(parseISO(platformUser.joinedAt), "MMM dd, yyyy")} • Last active{" "}
                            {format(parseISO(platformUser.lastActive), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {platformUser.role === "user" && (
                          <div className="text-right">
                            <div className="text-sm font-medium">{platformUser.totalBookings} bookings</div>
                            <div className="text-xs text-muted-foreground">
                              ₹{platformUser.totalSpent.toLocaleString()} spent
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={platformUser.isBanned ? "default" : "destructive"}
                            onClick={() => 
                              platformUser.isBanned 
                                ? handleQuickUnban(platformUser.id)
                                : handleBanUser(platformUser)
                            }
                            disabled={isProcessing === platformUser.id}
                          >
                            {isProcessing === platformUser.id
                              ? "Processing..."
                              : platformUser.isBanned
                                ? "Unban"
                                : "Ban"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-transparent"
                            onClick={() => showUserDetailsModal(platformUser)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* Ban Confirmation Dialog */}
      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToBan?.isBanned ? 'Unban User' : 'Ban User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToBan?.isBanned 
                ? `Are you sure you want to unban ${userToBan?.fullName}? They will regain access to the platform.`
                : `Are you sure you want to ban ${userToBan?.fullName}? They will lose access to the platform.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {!userToBan?.isBanned && (
            <div className="my-4">
              <Label htmlFor="banReason">Reason for ban (optional)</Label>
              <Textarea
                id="banReason"
                placeholder="Enter reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowBanDialog(false)
              setUserToBan(null)
              setBanReason("")
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmBanUser}>
              {userToBan?.isBanned ? 'Unban' : 'Ban'} User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="mt-1 text-sm">{selectedUser.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="mt-1 text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <Badge variant="secondary" className="mt-1">
                    {selectedUser.role === "facility_owner" ? "Facility Owner" : "User"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                  <p className="mt-1 text-sm font-mono text-xs">{selectedUser.id}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                  <div className="mt-1">
                    <Badge variant={selectedUser.isBanned ? "destructive" : "default"}>
                      {selectedUser.isBanned ? "Banned" : "Active"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email Verified</Label>
                  <div className="mt-1">
                    <Badge variant={selectedUser.isVerified ? "default" : "secondary"}>
                      {selectedUser.isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Joined Date</Label>
                  <p className="mt-1 text-sm">
                    {format(parseISO(selectedUser.joinedAt), 'PPP')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Active</Label>
                  <p className="mt-1 text-sm">
                    {format(parseISO(selectedUser.lastActive), 'PPp')}
                  </p>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">Activity Summary</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedUser.totalBookings || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Bookings</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        ${(selectedUser.totalSpent || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant={selectedUser.isBanned ? "default" : "destructive"}
                  onClick={() => {
                    setShowUserDetails(false)
                    if (selectedUser.isBanned) {
                      handleQuickUnban(selectedUser.id)
                    } else {
                      handleBanUser(selectedUser)
                    }
                  }}
                  className="flex-1"
                >
                  {selectedUser.isBanned ? "Unban User" : "Ban User"}
                </Button>
                <Button variant="outline" className="flex-1">
                  Send Message
                </Button>
                <Button variant="outline" className="flex-1">
                  View Bookings
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
