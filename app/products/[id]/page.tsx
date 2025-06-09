"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { productsApi, type Product } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Check } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/components/ui/use-toast"
import { RecommendedProducts } from "@/components/products/RecommendedProducts"
import { RecentlyViewed } from "@/components/products/RecentlyViewed"
import { addToRecentlyViewed } from "@/lib/userPreferences"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const data = await productsApi.getById(productId)
        setProduct(data)

        // Fetch related products from the same category
        if (data.category) {
          const relatedResponse = await productsApi.getByCategory(data.category)
          // Filter out the current product and limit to 4 products
          const filtered = relatedResponse.data
            .filter((p) => p.uuid !== productId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
          setRelatedProducts(filtered)
        }

        // Add to recently viewed
        if (data) {
          addToRecentlyViewed({
            id: data.uuid,
            name: data.title,
            price: data.price,
            category: data.category,
            image: data.productImage,
            viewedAt: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
          duration: 3000,
        })
        router.push("/products")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router, toast])

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.quantity || 10)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.uuid,
        name: product.title,
        quantity: quantity,
        price: product.price,
        category: product.category,
        image: product.productImage,
      })
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.title} added to your cart`,
      })
    }
  }

  const handleRelatedProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <img
                src={product.productImage || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.avgRating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">({product.avgRating || 0})</span>
              </div>
              <p className="text-sm text-muted-foreground">Category: {product.category}</p>
            </div>

            <div className="text-3xl font-bold text-primary">₦{product.price.toFixed(2)}</div>

            <div className="border-t border-b py-4">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center">
              {product.quantity > 0 ? (
                <div className="flex items-center text-green-600">
                  <Check className="mr-2 h-5 w-5" />
                  <span>In Stock ({product.quantity} available)</span>
                </div>
              ) : (
                <div className="text-red-500">Out of Stock</div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[2rem] text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Information Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="prose max-w-none">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                  <div>
                    <p className="font-medium">Stock</p>
                    <p className="text-muted-foreground">{product.quantity} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shipping">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    We offer fast delivery to all campus dorms and halls within 24-48 hours.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Delivery Time</p>
                      <p className="text-muted-foreground">24-48 hours</p>
                    </div>
                    <div>
                      <p className="font-medium">Shipping Fee</p>
                      <p className="text-muted-foreground">Free for orders above ₦5,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommended Products */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recommended Products</h2>
          <RecommendedProducts currentProductId={product.uuid} />
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <RecentlyViewed />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.uuid}
                  className="cursor-pointer transition-all hover:shadow-md"
                  onClick={() => handleRelatedProductClick(relatedProduct.uuid)}
                >
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedProduct.productImage || "/placeholder.svg?height=300&width=300"}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{relatedProduct.title}</h3>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(relatedProduct.avgRating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="font-bold">₦{relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
