"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, Plus, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import AdminLoading from "./loading"
import { StatsProvider } from "@/components/admin/StatsProvider"
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent"

// Dynamically import analytics components
const SalesAnalytics = dynamic(() => import('@/components/admin/analytics/SalesAnalytics'), {
  loading: () => <div className="h-[400px] bg-muted rounded animate-pulse" />,
  ssr: false
})

const CustomerAnalytics = dynamic(() => import('@/components/admin/analytics/CustomerAnalytics'), {
  loading: () => <div className="h-[400px] bg-muted rounded animate-pulse" />,
  ssr: false
})

export default function AdminDashboard() {
  const { isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && (!isAuthenticated || !isAdmin)) {
      router.push("/login")
    }
  }, [isClient, isAuthenticated, isAdmin, router])

  if (!isClient) {
    return <AdminLoading />
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <StatsProvider>
      <AdminDashboardContent />
    </StatsProvider>
  )
}
