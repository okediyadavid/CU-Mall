"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Chatbot } from "@/components/chat/Chatbot"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdminPage = pathname.startsWith("/admin")

    return (
        <>
            {!isAdminPage && <Navbar />}
            <main className="min-h-screen">{children}</main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <Chatbot />}
        </>
    )
} 