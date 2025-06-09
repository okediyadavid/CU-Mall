"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ShoppingCart, Minus, Plus, Check } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem, updateQuantity, removeItem, items } = useCart()

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({})
  const [justAdded, setJustAdded] = useState<{ [key: string]: boolean }>({})

  const getQuantity = (productId: string) => {
    const cartItem = items.find((item) => item.id === productId)
    return cartItem ? cartItem.quantity : quantities[productId] || 1
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    const newQuantity = Math.max(1, Math.min(quantity, 10))

    const cartItem = items.find((item) => item.id === productId)
    if (cartItem) {
      updateQuantity(productId, newQuantity)
    } else {
      setQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }))
    }
  }

  const isInCart = (productId: string) => {
    return items.some((item) => item.id === productId)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll(1)
        const sortedProducts = [...response.data]
          .sort((a, b) => {
            const dateA = new Date(a.dateAdded || "").getTime()
            const dateB = new Date(b.dateAdded || "").getTime()
            return dateB - dateA
          })
          .slice(0, 8)

        setProducts(sortedProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 300

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const handleAddToCart = async (product: Product) => {
    const productId = product.uuid
    setAddingToCart((prev) => ({ ...prev, [productId]: true }))

    try {
      const quantity = getQuantity(productId)
      addItem({
        id: product.uuid,
        name: product.title,
        quantity: quantity,
        price: product.price,
        category: product.category,
        image: product.productImage,
      })

      setJustAdded((prev) => ({ ...prev, [productId]: true }))
      setTimeout(() => {
        setJustAdded((prev) => ({ ...prev, [productId]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground">Check out our latest products</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} aria-label="Scroll left">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} aria-label="Scroll right">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {products.map((product) => (
                <div key={product.uuid} className="flex-none w-[280px] snap-start">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Link href={`/products/${product.uuid}`}>
                        <div className="relative h-40 mb-3 overflow-hidden rounded-md">
                          <img
                            src={product.productImage || "/placeholder.svg?height=200&width=200"}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                              New
                            </span>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-1">{product.category}</p>
                        <p className="font-bold text-primary">₦{product.price.toFixed(2)}</p>
                      </Link>

                      <div className="mt-4 space-y-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => handleQuantityChange(product.uuid, getQuantity(product.uuid) - 1)}
                            disabled={getQuantity(product.uuid) <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-semibold min-w-[1.5rem] text-center">{getQuantity(product.uuid)}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => handleQuantityChange(product.uuid, getQuantity(product.uuid) + 1)}
                            disabled={getQuantity(product.uuid) >= 10}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full h-9 text-sm font-semibold transition-all ${
                            isInCart(product.uuid) ? "bg-green-600 hover:bg-green-700" : "hover:scale-105"
                          }`}
                          disabled={addingToCart[product.uuid]}
                        >
                          {addingToCart[product.uuid] ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Adding...</span>
                            </div>
                          ) : justAdded[product.uuid] ? (
                            <div className="flex items-center space-x-1">
                              <Check className="h-3 w-3" />
                              <span>Added!</span>
                            </div>
                          ) : isInCart(product.uuid) ? (
                            <div className="flex items-center space-x-1">
                              <Check className="h-3 w-3" />
                              <span>In Cart</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <ShoppingCart className="h-3 w-3" />
                              <span>Add to Cart</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline" className="hover:scale-105 transition-transform">
              View All New Arrivals
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
