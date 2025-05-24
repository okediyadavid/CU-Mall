"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./AuthContext"

interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
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
  checkout: () => Promise<boolean>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user, token } = useAuth()

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart data:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity

        toast({
          title: "Cart Updated",
          description: `${item.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        })

        return updatedItems
      } else {
        // Add new item
        toast({
          title: "Added to Cart",
          description: `${item.name} added to your cart`,
        })

        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)

      if (itemToRemove) {
        toast({
          title: "Removed from Cart",
          description: `${itemToRemove.name} removed from your cart`,
        })
      }

      return prevItems.filter((item) => item.id !== id)
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    })
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const checkout = async (): Promise<boolean> => {
    if (!user || !token) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to complete your order",
      })
      return false
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty Cart",
        description: "Your cart is empty",
      })
      return false
    }

    try {
      const orderData = {
        ordered_by: user.email,
        state: 0,
        room_number: user.roomNumber,
        hall: user.hall,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          category: item.category,
        })),
      }

      const response = await fetch("https://cumall-backend.onrender.com/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        const orderId = data.orderId || `ORD-${Date.now()}`
        clearCart()
        toast({
          title: "Order Placed Successfully",
          description: "Thank you for your purchase!",
        })

        // Redirect to success page with order details
        window.location.href = `/checkout/success?orderId=${orderId}&total=${totalPrice.toFixed(2)}`
        return true
      } else {
        toast({
          variant: "destructive",
          title: "Checkout Failed",
          description: data.message || "Could not complete your order",
        })
        return false
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: "An error occurred during checkout. Please try again.",
      })
      return false
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
