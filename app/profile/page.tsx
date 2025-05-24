"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Package, Settings, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { userApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Mock orders data for user profile
const mockUserOrders = [
  {
    uuid: "order-1",
    ordered_date: "2024-01-15T10:30:00Z",
    state: 1,
    total_price: "45.99",
    items: [
      { name: "Notebook Set", quantity: 2, price: 15.99 },
      { name: "Pen Pack", quantity: 1, price: 12.99 },
    ],
  },
  {
    uuid: "order-2",
    ordered_date: "2024-01-10T14:20:00Z",
    state: 1,
    total_price: "23.75",
    items: [
      { name: "Shampoo", quantity: 1, price: 8.99 },
      { name: "Body Wash", quantity: 1, price: 14.76 },
    ],
  },
]

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders] = useState(mockUserOrders)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      })
      return
    }

    setIsChangingPassword(true)

    try {
      await userApi.updatePassword(passwordData.oldPassword, passwordData.newPassword)
      toast({
        title: "Success",
        description: "Password updated successfully",
      })
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please check your current password.",
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getOrderStatusBadge = (state: number) => {
    switch (state) {
      case 0:
        return <Badge variant="secondary">Pending</Badge>
      case 1:
        return <Badge variant="default">Delivered</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your orders</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <p className="text-lg font-medium">{user.username}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-lg font-medium">{user.name || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </div>
                  <div>
                    <Label>Room Number</Label>
                    <p className="text-lg font-medium">{user.roomNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Hall</Label>
                    <p className="text-lg font-medium">{user.hall || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.uuid}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold">Order #{order.uuid.substring(0, 8).toUpperCase()}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.ordered_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              {getOrderStatusBadge(order.state)}
                              <p className="font-bold text-lg mt-1">₦{order.total_price}</p>
                              <Link href={`/orders/${order.uuid}`}>
                                <Button variant="outline" size="sm" className="mt-2">
                                  Track Order
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Items:</h5>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, old: !prev.old }))}
                      >
                        {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        disabled={isChangingPassword}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" disabled={isChangingPassword}>
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
