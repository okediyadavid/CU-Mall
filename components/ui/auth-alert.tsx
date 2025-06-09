"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AuthAlertProps {
    type: "login" | "signup" | "checkout"
    message?: string
}

export function AuthAlert({ type, message }: AuthAlertProps) {
    const { toast } = useToast()

    useEffect(() => {
        const alerts = {
            login: {
                title: "Welcome back!",
                description: message || "You have successfully logged in.",
            },
            signup: {
                title: "Welcome to CUMall!",
                description: message || "Your account has been created successfully.",
            },
            checkout: {
                title: "Order Placed!",
                description: message || "Your order has been placed successfully.",
            },
        }

        const alert = alerts[type]

        const timer = setTimeout(() => {
            toast({
                title: alert.title,
                description: alert.description,
                duration: 3000,
            })
        }, 500) // Small delay to ensure the alert shows after navigation

        return () => clearTimeout(timer)
    }, [type, message, toast])

    return null
} 