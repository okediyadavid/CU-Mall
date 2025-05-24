"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/context/CartContext"
import { Star, ShoppingCart } from "lucide-react"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll(1)
        // Get first 4 products as featured
        setProducts(response.data.slice(0, 4))
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
              <Card key={product.uuid} className="overflow-hidden group transition-all hover:shadow-md">
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
                      <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
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
                    <p className="font-bold text-lg">₦{product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button onClick={() => handleAddToCart(product)} className="w-full group">
                    <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Add to Cart
                  </Button>
                </CardFooter>
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
