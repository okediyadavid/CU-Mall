"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ShoppingCart, ArrowLeft } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function CategoryPage() {
  const params = useParams()
  const categoryType = decodeURIComponent(params.type as string)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await productsApi.getByCategory(categoryType, currentPage)
        const sortedProducts = [...response.data]

        // Apply sorting
        switch (sortBy) {
          case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price)
            break
          case "price-high":
            sortedProducts.sort((a, b) => b.price - a.price)
            break
          case "rating":
            sortedProducts.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
            break
          case "newest":
            sortedProducts.sort((a, b) => {
              const dateA = new Date(a.dateAdded || "").getTime()
              const dateB = new Date(b.dateAdded || "").getTime()
              return dateB - dateA
            })
            break
          default:
            sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
        }

        setProducts(sortedProducts)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryType) {
      fetchProducts()
    }
  }, [categoryType, currentPage, sortBy])

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
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/categories" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Categories
          </Link>
          <h1 className="text-3xl font-bold mb-4">{categoryType}</h1>
          <p className="text-muted-foreground">Browse our selection of {categoryType.toLowerCase()} products.</p>
        </div>

        {/* Sorting */}
        <div className="mb-8 flex justify-between items-center">
          <p className="text-muted-foreground">
            {isLoading ? "Loading products..." : `${products.length} products found`}
          </p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found in this category</h3>
            <p className="text-muted-foreground mb-4">Try checking out our other categories.</p>
            <Link href="/categories">
              <Button>Browse All Categories</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.uuid} className="group transition-all hover:shadow-md">
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
                              i < Math.floor(product.avgRating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.avgRating || 0})</span>
                      </div>
                      <p className="font-bold text-lg">₦{product.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button onClick={() => handleAddToCart(product)} className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
