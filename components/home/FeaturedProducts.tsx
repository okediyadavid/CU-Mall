"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/context/CartContext"
import { Star, ShoppingCart, Minus, Plus, Check } from "lucide-react"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
      // Update cart quantity
      updateQuantity(productId, newQuantity)
    } else {
      // Update local state for non-cart items
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
        setProducts(response.data.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

      // Show success state
      setJustAdded((prev) => ({ ...prev, [productId]: true }))

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustAdded((prev) => ({ ...prev, [productId]: false }))
      }, 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleRemoveFromCart = (productId: string) => {
    removeItem(productId)
    setQuantities((prev) => ({ ...prev, [productId]: 1 }))
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular items that students love. Quality products at affordable prices.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.uuid} className="overflow-hidden group transition-all hover:shadow-lg">
                <CardContent className="p-0">
                  <Link href={`/products/${product.uuid}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.productImage || "/placeholder.svg?height=300&width=300"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${product.uuid}`}>
                      <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.avgRating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({product.avgRating || 0})</span>
                    </div>
                    <p className="font-bold text-lg text-primary">₦{product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 space-y-3">
                  {/* Quantity Selector - Always Visible */}
                  <div className="flex items-center justify-center space-x-3 w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(product.uuid, getQuantity(product.uuid) - 1)}
                      disabled={getQuantity(product.uuid) <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-lg min-w-[2rem] text-center">{getQuantity(product.uuid)}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(product.uuid, getQuantity(product.uuid) + 1)}
                      disabled={getQuantity(product.uuid) >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Add to Cart Button */}
                  {!isInCart(product.uuid) ? (
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full h-11 font-semibold transition-all duration-200 hover:scale-105"
                      disabled={addingToCart[product.uuid]}
                    >
                      {addingToCart[product.uuid] ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Adding...</span>
                        </div>
                      ) : justAdded[product.uuid] ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span>Added!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-2 w-full">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full h-11 font-semibold bg-green-600 hover:bg-green-700"
                        disabled={addingToCart[product.uuid]}
                      >
                        {addingToCart[product.uuid] ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4" />
                            <span>Update Cart</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemoveFromCart(product.uuid)}
                        className="w-full h-9 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove from Cart
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg" className="hover:scale-105 transition-transform">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
