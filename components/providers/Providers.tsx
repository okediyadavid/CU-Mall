"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { CartProvider } from "@/context/CartContext"
import { Toaster } from "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
            storageKey="cumall-theme"
        >
            <AuthProvider>
                <CartProvider>
                    {children}
                    <Toaster />
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
} 