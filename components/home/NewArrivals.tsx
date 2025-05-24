"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll(1)
        // Sort by date added and get the newest 8
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
                <div key={product.uuid} className="flex-none w-[250px] snap-start">
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <Link href={`/products/${product.uuid}`}>
                        <div className="relative h-40 mb-3 overflow-hidden rounded-md">
                          <img
                            src={product.productImage || "/placeholder.svg?height=200&width=200"}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          </div>
                        </div>
                        <h3 className="font-medium mb-1 line-clamp-1">{product.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-1">{product.category}</p>
                        <p className="font-bold">₦{product.price.toFixed(2)}</p>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline">View All New Arrivals</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
