interface OrderItem {
    id: string
    name: string
    quantity: number
    price: number
    category: string
    image?: string
}

export type DeliveryStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered'

export type TrackingUpdate = {
    status: DeliveryStatus
    timestamp: string
    location?: string
    description: string
}

export interface Order {
    orderId: string
    userId: string
    items: OrderItem[]
    total: number
    status: "pending" | "processing" | "shipped" | "delivered"
    createdAt: string
    estimatedDelivery: string
    deliveryAddress: {
        roomNumber: string
        hall: string
    }
    deliveryInstructions?: string
    trackingUpdates?: TrackingUpdate[]
    currentStatus: DeliveryStatus
}

// Generate a random order ID
export const generateOrderId = () => {
    return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

// Save order to localStorage
export const saveOrder = (order: Order) => {
    try {
        const orders = getOrders()
        orders.push(order)
        localStorage.setItem('orders', JSON.stringify(orders))
        return true
    } catch (error) {
        console.error('Error saving order:', error)
        return false
    }
}

// Get all orders
export const getOrders = (): Order[] => {
    try {
        const orders = localStorage.getItem('orders')
        return orders ? JSON.parse(orders) : []
    } catch (error) {
        console.error('Error getting orders:', error)
        return []
    }
}

// Get order by ID
export const getOrderById = (orderId: string): Order | null => {
    try {
        const orders = getOrders()
        return orders.find(order => order.orderId === orderId) || null
    } catch (error) {
        console.error('Error getting order:', error)
        return null
    }
}

// Update order status
export const updateOrderStatus = (orderId: string, status: Order['status']) => {
    try {
        const orders = getOrders()
        const orderIndex = orders.findIndex(order => order.orderId === orderId)
        if (orderIndex !== -1) {
            orders[orderIndex].status = status
            localStorage.setItem('orders', JSON.stringify(orders))
            return true
        }
        return false
    } catch (error) {
        console.error('Error updating order:', error)
        return false
    }
}

// Calculate estimated delivery date (24-48 hours from now)
export const calculateEstimatedDelivery = () => {
    const deliveryDate = new Date()
    deliveryDate.setHours(deliveryDate.getHours() + Math.floor(Math.random() * 24) + 24)
    return deliveryDate.toISOString()
}

// Get user's orders
export const getUserOrders = (userId: string): Order[] => {
    try {
        const orders = getOrders()
        return orders.filter(order => order.userId === userId)
    } catch (error) {
        console.error('Error getting user orders:', error)
        return []
    }
}

export function updateOrderInstructions(orderId: string, instructions: string): boolean {
    try {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]") as Order[]
        const orderIndex = orders.findIndex(order => order.orderId === orderId)

        if (orderIndex === -1) {
            return false
        }

        orders[orderIndex].deliveryInstructions = instructions
        localStorage.setItem("orders", JSON.stringify(orders))
        return true
    } catch (error) {
        console.error("Error updating order instructions:", error)
        return false
    }
}

export const updateOrderTracking = (orderId: string, update: TrackingUpdate) => {
    const orders = getOrders()
    const order = orders.find(o => o.orderId === orderId)

    if (!order) {
        throw new Error('Order not found')
    }

    order.trackingUpdates = [...(order.trackingUpdates || []), update]
    order.currentStatus = update.status

    localStorage.setItem('orders', JSON.stringify(orders))
    return order
}

export const getOrderTracking = (orderId: string): TrackingUpdate[] => {
    const order = getOrderById(orderId)
    if (!order) {
        throw new Error('Order not found')
    }
    return order.trackingUpdates || []
} 