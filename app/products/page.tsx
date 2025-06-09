"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { productsApi, categoriesApi, type Product, type Category } from "@/lib/api"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [removingFromCart, setRemovingFromCart] = useState<{ [key: string]: boolean }>({})

  const searchParams = useSearchParams()
  const { addItem, updateQuantity, removeItem, items } = useCart()

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
    const urlSearch = searchParams.get("search")
    if (urlSearch) {
      setSearchQuery(urlSearch)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let response
        if (selectedCategory === "all") {
          response = await productsApi.getAll(currentPage)
        } else {
          response = await productsApi.getByCategory(selectedCategory, currentPage)
        }

        let filteredProducts = response.data

        if (searchQuery.trim()) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              product.category.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }

        switch (sortBy) {
          case "price-low":
            filteredProducts.sort((a, b) => a.price - b.price)
            break
          case "price-high":
            filteredProducts.sort((a, b) => b.price - a.price)
            break
          case "rating":
            filteredProducts.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
            break
          case "newest":
            filteredProducts.sort((a, b) => {
              const dateA = new Date(a.dateAdded || "").getTime()
              const dateB = new Date(b.dateAdded || "").getTime()
              return dateB - dateA
            })
            break
          default:
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
        }

        setProducts(filteredProducts)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, selectedCategory, searchQuery, sortBy])

  const handleAddToCart = (product: Product) => {
    const quantity = getQuantity(product.uuid)
    addItem({
      id: product.uuid,
      name: product.title,
      quantity: quantity,
      price: product.price,
      category: product.category,
      image: product.productImage,
    })
  }

  const handleRemoveFromCart = async (productId: string) => {
    setRemovingFromCart((prev) => ({ ...prev, [productId]: true }))

    try {
      removeItem(productId)
      setQuantities((prev) => ({ ...prev, [productId]: 1 }))
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    } finally {
      setRemovingFromCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">Discover our complete range of campus essentials and more.</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Search
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.type}>
                    {category.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
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

          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery("")}>
                Search: {searchQuery} ×
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                Category: {selectedCategory} ×
              </Badge>
            )}
          </div>
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
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or browse all products.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
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
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
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
                  <CardFooter className="p-4 pt-0 space-y-3">
                    {/* Quantity Selector */}
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
                      <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {getQuantity(product.uuid)}
                      </span>
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

                    {/* Add to Cart / Remove Buttons */}
                    {!isInCart(product.uuid) ? (
                      <Button onClick={() => handleAddToCart(product)} className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="space-y-2 w-full">
                        <Button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Update Cart
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRemoveFromCart(product.uuid)}
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                          disabled={removingFromCart[product.uuid]}
                        >
                          {removingFromCart[product.uuid] ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              <span>Removing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <Trash2 className="h-3 w-3" />
                              <span>Remove from Cart</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
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
