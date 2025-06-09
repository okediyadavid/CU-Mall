"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function AdminSettings() {
    const router = useRouter()
    const { isAdmin, isAuthenticated } = useAuth()
    const [isClient, setIsClient] = useState(false)

    // Settings state
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [orderAlerts, setOrderAlerts] = useState(true)
    const [stockAlerts, setStockAlerts] = useState(true)

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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>Dashboard Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive email notifications for important updates
                                    </p>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="order-alerts">Order Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Get notified when new orders are placed
                                    </p>
                                </div>
                                <Switch
                                    id="order-alerts"
                                    checked={orderAlerts}
                                    onCheckedChange={setOrderAlerts}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="stock-alerts">Low Stock Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive alerts when products are running low on stock
                                    </p>
                                </div>
                                <Switch
                                    id="stock-alerts"
                                    checked={stockAlerts}
                                    onCheckedChange={setStockAlerts}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button onClick={() => {
                                // TODO: Implement settings save functionality
                                alert("Settings saved successfully!")
                            }}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 