"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, Clock, CheckCircle, Truck, User } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ordersApi, type Order } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchOrder = async () => {
      try {
        const orderData = await ordersApi.getById(orderId)
        setOrder(orderData)
      } catch (error) {
        console.error("Failed to fetch order:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order details",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [isAuthenticated, orderId, router, toast])

  const getOrderStatus = (state: number) => {
    switch (state) {
      case 0:
        return {
          label: "Order Placed",
          description: "Your order has been confirmed and is being prepared",
          icon: Package,
          color: "bg-blue-500",
        }
      case 1:
        return {
          label: "Delivered",
          description: "Your order has been successfully delivered",
          icon: CheckCircle,
          color: "bg-green-500",
        }
      default:
        return {
          label: "Unknown",
          description: "Order status unknown",
          icon: Package,
          color: "bg-gray-500",
        }
    }
  }

  const getTrackingSteps = (state: number) => {
    const steps = [
      {
        title: "Order Confirmed",
        description: "We've received your order",
        icon: Package,
        completed: true,
      },
      {
        title: "Preparing",
        description: "Your items are being prepared",
        icon: Clock,
        completed: true,
      },
      {
        title: "Out for Delivery",
        description: "Your order is on the way",
        icon: Truck,
        completed: state >= 1,
      },
      {
        title: "Delivered",
        description: "Order delivered successfully",
        icon: CheckCircle,
        completed: state >= 1,
      },
    ]

    return steps
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/profile">
              <Button>Back to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const status = getOrderStatus(order.state)
  const trackingSteps = getTrackingSteps(order.state)

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/profile" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">Track your order #{order.uuid.substring(0, 8).toUpperCase()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <status.icon className="mr-2 h-5 w-5" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${status.color} flex items-center justify-center`}>
                      <status.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{status.label}</h3>
                      <p className="text-muted-foreground">{status.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trackingSteps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        {step.completed && (
                          <Badge variant="default" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Details Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-semibold">#{order.uuid.substring(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold">{new Date(order.ordered_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-lg">₦{order.total_price}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user?.name || user?.username}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Room {order.room_number}, {order.hall}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Items ({order.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">₦{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        {index < order.items.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
