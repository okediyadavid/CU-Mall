"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll(1)
        // Get products with highest ratings as trending
        const trendingProducts = [...response.data].sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0)).slice(0, 6)

        setProducts(trendingProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.uuid,
      name: product.title,
      quantity: 1,
      price: product.price,
      category: product.category,
      image: product.productImage,
    })
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Trending This Week</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover what's popular among students right now. These products are flying off our shelves!
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <Card key={product.uuid} className="group transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link href={`/products/${product.uuid}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.productImage || "/placeholder.svg?height=300&width=300"}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                        #{index + 1} Trending
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/products/${product.uuid}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
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
                      <span className="text-sm text-muted-foreground ml-2">({product.avgRating || 0})</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-xl">₦{product.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                    </div>
                    <Button onClick={() => handleAddToCart(product)} className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/products">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
