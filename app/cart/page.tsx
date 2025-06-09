"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, checkout } = useCart()
  const { isAuthenticated } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      return
    }

    setIsCheckingOut(true)
    try {
      const success = await checkout()
      if (success) {
        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully. Redirecting to confirmation page...",
          duration: 3000,
        })
        // Checkout success is handled by the cart context
        // Small delay before redirect to show the toast
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${success.orderId}`)
        }, 1000)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: "There was an error processing your order. Please try again.",
        duration: 3000,
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="font-bold text-lg">₦{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 0)}
                          className="w-16 text-center h-8"
                          min="0"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₦{(item.price * item.quantity).toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive mt-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{totalPrice.toFixed(2)}</span>
                </div>

                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground text-center">Please sign in to complete your order</p>
                    <Link href="/login">
                      <Button className="w-full">Sign In to Checkout</Button>
                    </Link>
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                  </Button>
                )}

                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p className="text-green-600 font-medium">Free delivery on all orders!</p>
                  <p>Delivery within 24-48 hours to campus dorms</p>
                  <p>Secure payment processing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
