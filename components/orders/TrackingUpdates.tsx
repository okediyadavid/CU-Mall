"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrackingUpdate, getOrderTracking } from '@/lib/orderStorage'
import { Package, Truck, CheckCircle } from 'lucide-react'

interface TrackingUpdatesProps {
    orderId: string
}

export function TrackingUpdates({ orderId }: TrackingUpdatesProps) {
    const [updates, setUpdates] = useState<TrackingUpdate[]>([])

    useEffect(() => {
        try {
            const trackingData = getOrderTracking(orderId)
            setUpdates(trackingData)
        } catch (error) {
            console.error('Failed to load tracking updates:', error)
        }
    }, [orderId])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing':
                return <Package className="h-6 w-6 text-blue-500" />
            case 'shipped':
            case 'out_for_delivery':
                return <Truck className="h-6 w-6 text-orange-500" />
            case 'delivered':
                return <CheckCircle className="h-6 w-6 text-green-500" />
            default:
                return <Package className="h-6 w-6 text-gray-500" />
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Updates
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {updates.length > 0 ? (
                        updates.map((update, index) => (
                            <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    {getStatusIcon(update.status)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold capitalize">
                                            {update.status.replace(/_/g, ' ')}
                                        </h4>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(update.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground">{update.description}</p>
                                    {update.location && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Location: {update.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">
                            No tracking updates available yet
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 