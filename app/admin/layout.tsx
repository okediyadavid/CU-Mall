"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AdminNavbar } from "@/components/admin/AdminNavbar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { isAdmin, isAuthenticated } = useAuth()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (isClient && (!isAuthenticated || !isAdmin)) {
            router.push("/login")
        }
    }, [isClient, isAuthenticated, isAdmin, router])

    if (!isClient || !isAuthenticated || !isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminNavbar />
            <main>
                {children}
            </main>
        </div>
    )
} 