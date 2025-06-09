"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
                <p className="text-muted-foreground mb-4">
                    {error.message || "An unexpected error occurred"}
                </p>
                <div className="space-x-4">
                    <Button onClick={() => reset()}>Try again</Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Refresh page
                    </Button>
                </div>
            </div>
        </div>
    )
} 