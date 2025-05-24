"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, Users, TrendingUp, Plus, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { adminProductsApi } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  })

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      try {
        const productsResponse = await adminProductsApi.getAll(1)
        setStats((prev) => ({
          ...prev,
          totalProducts: productsResponse.totalItems,
        }))
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [isAuthenticated, isAdmin, router])

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p>Welcome back, {user?.name || user?.username}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="secondary" size="sm">
                View Store
              </Button>
            </Link>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/admin/products/manage" className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/orders" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Manage Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/categories" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products in store</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Orders this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products/new">
            <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Plus className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg">Add New Product</h3>
                  <p className="text-muted-foreground">Create a new product listing</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/products/manage">
            <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg">Manage Products</h3>
                  <p className="text-muted-foreground">Add, edit and delete products</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/orders">
            <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg">Manage Orders</h3>
                  <p className="text-muted-foreground">View and process orders</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Recent activity will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <Link href="/admin/products/manage" className="text-primary hover:underline">
                    Go to Products Management
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <h2 className="text-2xl font-bold">Order Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <Link href="/admin/orders" className="text-primary hover:underline">
                    Go to Orders Management
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4">
            <h2 className="text-2xl font-bold">Category Management</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  <Link href="/admin/categories" className="text-primary hover:underline">
                    Go to Categories Management
                  </Link>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
