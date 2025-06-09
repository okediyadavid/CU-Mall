"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Clock, MapPin, XCircle, ArrowLeft } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { getOrderById, Order, updateOrderInstructions } from "@/lib/orderStorage"
import { OrderTimeline } from "@/components/orders/OrderTimeline"
import { DeliveryInstructions } from "@/components/orders/DeliveryInstructions"
import { DeliveryTracking } from "@/components/orders/DeliveryTracking"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadOrder = () => {
      try {
        setIsLoading(true)
        setError("")

        const orderId = searchParams.get("orderId")
        if (!orderId) {
          throw new Error("Order ID not found")
        }

        if (!isAuthenticated || !user) {
          throw new Error("Please log in to view your order details")
        }

        const orderData = getOrderById(orderId)
        if (!orderData) {
          throw new Error("Order not found")
        }

        // Verify the order belongs to the current user
        if (orderData.userId !== user?.email) {
          throw new Error("You are not authorized to view this order")
        }

        setOrder(orderData)

        // Show success toast
        toast({
          title: "Order Confirmed!",
          description: "Your order has been successfully placed and will be delivered soon.",
          duration: 5000,
        })
      } catch (err: any) {
        console.error("Error loading order:", err)
        setError(err.message || "Failed to load order details")

        // Show error toast
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to load order details",
          duration: 3000,
        })

        // Redirect to home page after a delay if there's an error
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()
  }, [isAuthenticated, user, searchParams, router, toast])

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto"></div>
                <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-muted rounded"></div>
                <div className="h-40 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-red-600 mb-4">
              <XCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Order</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {!isAuthenticated ? (
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              ) : (
                <>
                  <Link href="/profile">
                    <Button variant="outline">Go to Profile</Button>
                  </Link>
                  <Link href="/products">
                    <Button>Continue Shopping</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/profile" className="inline-flex items-center text-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">#{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-lg">₦{order.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {order.items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <div className="flex items-center space-x-4">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({item.category})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {item.quantity}x ₦{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Order Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                status={order.status}
                createdAt={order.createdAt}
                estimatedDelivery={order.estimatedDelivery}
              />
            </CardContent>
          </Card>

          <DeliveryTracking orderId={order.orderId} />

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Estimated Delivery</p>
                  <p className="text-muted-foreground">
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    (Delivery typically takes 24-48 hours to campus dorms)
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Delivery Address</p>
                  <p className="text-muted-foreground">
                    Room {order.deliveryAddress.roomNumber}, {order.deliveryAddress.hall}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <DeliveryInstructions
            orderId={order.orderId}
            initialInstructions={order.deliveryInstructions}
            onSave={(instructions) => {
              updateOrderInstructions(order.orderId, instructions)
            }}
          />

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>You'll receive an email confirmation shortly</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>Your order will be prepared and packed</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>We'll deliver to your dorm within 24-48 hours</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <p>Track your order status in your profile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/profile/orders/${order.orderId}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
