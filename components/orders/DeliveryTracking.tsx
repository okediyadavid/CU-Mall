import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { DeliveryStatus, TrackingUpdate, getOrderTracking } from '@/lib/orderStorage'

interface DeliveryTrackingProps {
    orderId: string
}

export function DeliveryTracking({ orderId }: DeliveryTrackingProps) {
    const [updates, setUpdates] = useState<TrackingUpdate[]>([])
    const [currentStatus, setCurrentStatus] = useState<DeliveryStatus>('pending')

    useEffect(() => {
        try {
            const trackingData = getOrderTracking(orderId)
            setUpdates(trackingData)
            if (trackingData.length > 0) {
                setCurrentStatus(trackingData[trackingData.length - 1].status)
            }
        } catch (error) {
            console.error('Failed to load tracking updates:', error)
        }
    }, [orderId])

    const getStatusIcon = (status: DeliveryStatus) => {
        switch (status) {
            case 'processing':
                return <Package className="h-6 w-6 text-blue-500" />
            case 'shipped':
            case 'out_for_delivery':
                return <Truck className="h-6 w-6 text-orange-500" />
            case 'delivered':
                return <CheckCircle className="h-6 w-6 text-green-500" />
            default:
                return <Clock className="h-6 w-6 text-gray-500" />
        }
    }

    const getStatusColor = (status: DeliveryStatus) => {
        switch (status) {
            case 'processing':
                return 'bg-blue-500'
            case 'shipped':
            case 'out_for_delivery':
                return 'bg-orange-500'
            case 'delivered':
                return 'bg-green-500'
            default:
                return 'bg-gray-500'
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Order Tracking
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Status Timeline */}
                <div className="relative pb-12">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
                    {updates.map((update, index) => (
                        <div key={index} className="relative mb-8 ml-8">
                            <div className="absolute -left-10 mt-1.5">
                                <div className={`h-6 w-6 rounded-full ${getStatusColor(update.status)} flex items-center justify-center`}>
                                    {getStatusIcon(update.status)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold capitalize">
                                    {update.status.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(update.timestamp).toLocaleString()}
                                </span>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {update.description}
                                </p>
                                {update.location && (
                                    <span className="mt-1 text-xs text-muted-foreground">
                                        Location: {update.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {updates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No tracking updates available yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 