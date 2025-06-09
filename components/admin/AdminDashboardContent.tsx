"use client"

import dynamic from 'next/dynamic'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, Plus, Settings, RefreshCw } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useStats } from "./StatsProvider"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import analytics components
const SalesAnalytics = dynamic(
    () => import('@/components/admin/analytics/SalesAnalytics').then(mod => mod.default),
    {
        loading: () => <div className="h-[400px] bg-muted rounded animate-pulse" />,
        ssr: false
    }
)

const CustomerAnalytics = dynamic(
    () => import('@/components/admin/analytics/CustomerAnalytics').then(mod => mod.default),
    {
        loading: () => <div className="h-[400px] bg-muted rounded animate-pulse" />,
        ssr: false
    }
)

function StatCard({
    title,
    value,
    icon: Icon,
    color,
    isLoading
}: {
    title: string
    value: number | string
    icon: any
    color: string
    isLoading: boolean
}) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        {isLoading ? (
                            <Skeleton className="h-8 w-24 mt-1" />
                        ) : (
                            <h3 className="text-2xl font-bold">{value}</h3>
                        )}
                    </div>
                    <Icon className={`h-8 w-8 ${color}`} />
                </div>
            </CardContent>
        </Card>
    )
}

export function AdminDashboardContent() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const { stats, isLoading, error, refreshStats } = useStats()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={refreshStats}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                                Dashboard Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                                User Management
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-red-600">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="text-blue-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="text-green-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-purple-500"
                    isLoading={isLoading}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₦${stats.revenue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="text-orange-500"
                    isLoading={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link href="/admin/products/new">
                    <Card className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1">
                        <CardContent className="flex items-center justify-center p-6">
                            <div className="text-center">
                                <Plus className="h-12 w-12 mx-auto mb-4 text-primary" />
                                <h3 className="font-semibold text-lg">Add New Product</h3>
                                <p className="text-muted-foreground">Create and publish new products</p>
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
                                <p className="text-muted-foreground">View and process all orders</p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="space-y-6">
                <SalesAnalytics />
                <CustomerAnalytics />
            </div>
        </div>
    )
} 