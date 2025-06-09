"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./AuthContext"
import { generateOrderId, saveOrder, calculateEstimatedDelivery } from "@/lib/orderStorage"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  checkout: () => Promise<{ orderId: string } | false>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Load cart from localStorage on mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  if (!mounted) {
    return null
  }

  const addItem = (item: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id)
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...currentItems, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const checkout = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login")
      return false
    }

    try {
      const orderId = generateOrderId()
      const order = {
        orderId,
        userId: user.email,
        items: items,
        total: totalPrice.toFixed(2),
        status: "processing" as const,
        createdAt: new Date().toISOString(),
        estimatedDelivery: calculateEstimatedDelivery(),
        deliveryAddress: {
          roomNumber: user.roomNumber || "",
          hall: user.hall || "",
        },
      }

      const success = saveOrder(order)
      if (success) {
        clearCart()
        router.push(`/checkout/success?orderId=${orderId}`)
        return { orderId }
      }
      return false
    } catch (error) {
      console.error("Checkout error:", error)
      return false
    }
  }

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    checkout,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
