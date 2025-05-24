"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { adminOrdersApi } from "@/lib/api"
import type { Order } from "@/types"

// Mock orders data since we don't have an orders endpoint that returns all orders
const mockOrders: Order[] = [
  {
    uuid: "order-1",
    ordered_by: "john@university.edu",
    ordered_date: "2024-01-15T10:30:00Z",
    state: 0,
    total_price: "45.99",
    room_number: "A210",
    hall: "Main Hall",
    items: [
      { id: "1", name: "Notebook Set", quantity: 2, price: 15.99, category: "Stationery" },
      { id: "2", name: "Pen Pack", quantity: 1, price: 12.99, category: "Stationery" },
    ],
  },
  {
    uuid: "order-2",
    ordered_by: "jane@university.edu",
    ordered_date: "2024-01-14T14:20:00Z",
    state: 1,
    total_price: "89.50",
    room_number: "B105",
    hall: "North Hall",
    items: [{ id: "3", name: "Desk Lamp", quantity: 1, price: 89.5, category: "Dorm Essentials" }],
  },
  {
    uuid: "order-3",
    ordered_by: "mike@university.edu",
    ordered_date: "2024-01-13T09:15:00Z",
    state: 0,
    total_price: "23.75",
    room_number: "C301",
    hall: "South Hall",
    items: [
      { id: "4", name: "Shampoo", quantity: 1, price: 8.99, category: "Personal Care" },
      { id: "5", name: "Body Wash", quantity: 1, price: 14.76, category: "Personal Care" },
    ],
  },
  {
    uuid: "order-4",
    ordered_by: "sarah@university.edu",
    ordered_date: "2024-01-12T16:45:00Z",
    state: 1,
    total_price: "156.25",
    room_number: "D402",
    hall: "East Hall",
    items: [
      { id: "6", name: "Bluetooth Headphones", quantity: 1, price: 99.99, category: "Electronics" },
      { id: "7", name: "Phone Charger", quantity: 2, price: 28.13, category: "Electronics" },
    ],
  },
  {
    uuid: "order-5",
    ordered_by: "alex@university.edu",
    ordered_date: "2024-01-11T11:20:00Z",
    state: 0,
    total_price: "67.80",
    room_number: "F203",
    hall: "West Hall",
    items: [
      { id: "8", name: "Yoga Mat", quantity: 1, price: 35.99, category: "Sports & Fitness" },
      { id: "9", name: "Water Bottle", quantity: 1, price: 19.99, category: "Sports & Fitness" },
      { id: "10", name: "Protein Bar Pack", quantity: 1, price: 11.82, category: "Sports & Fitness" },
    ],
  },
]

export default function AdminOrdersPage() {
  const { isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await adminOrdersApi.getAll()
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        setError("Failed to load orders. Using sample data.")
        // Fallback to mock data even on error
        setOrders(mockOrders)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      fetchOrders()
    } else if (isAuthenticated && !isAdmin) {
      router.push("/")
    }
  }, [isAuthenticated, isAdmin, router])

  const getOrderStatusBadge = (state: number) => {
    switch (state) {
      case 0:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case 1:
        return (
          <Badge variant="default">
            <CheckCircle className="mr-1 h-3 w-3" />
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await adminOrdersApi.updateStatus(orderId, 1)
      setOrders(orders.map((order) => (order.uuid === orderId ? { ...order, state: 1 } : order)))
    } catch (error) {
      console.error("Failed to update order status:", error)
      setError("Failed to update order status")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">Please log in to access the admin panel.</p>
            <Button onClick={() => router.push("/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
            <Button onClick={() => router.push("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <Link href="/admin" className="inline-flex items-center text-primary-foreground hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order Management</h1>
              <p>View and manage customer orders</p>
              {error && <p className="text-yellow-200 text-sm mt-1">⚠️ {error}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-6 bg-muted animate-pulse rounded w-48" />
                      <div className="h-4 bg-muted animate-pulse rounded w-64" />
                    </div>
                    <div className="h-6 bg-muted animate-pulse rounded w-20" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-32" />
                      <div className="h-4 bg-muted animate-pulse rounded w-48" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse rounded w-24" />
                      <div className="h-6 bg-muted animate-pulse rounded w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.uuid}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.uuid.substring(0, 8).toUpperCase()}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ordered by {order.ordered_by} • {new Date(order.ordered_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getOrderStatusBadge(order.state)}
                      {order.state === 0 && (
                        <Button size="sm" onClick={() => handleMarkAsDelivered(order.uuid)}>
                          Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Address</h4>
                      <p className="text-sm text-muted-foreground">
                        Room {order.room_number}, {order.hall}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Total</h4>
                      <p className="text-lg font-bold">₦{order.total_price}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Items ({order.items.length})</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">({item.category})</span>
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
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {orders.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">There are no orders to display at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
