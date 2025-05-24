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
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, toast])

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
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
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
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center p-4">
            <img
              src={product.productImage || "/placeholder.svg?height=500&width=500"}
              alt={product.title}
              className="max-h-[400px] object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.avgRating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1" disabled={product.quantity === 0} size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Specifications</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Category: {product.category}</li>
                <li>SKU: {product.uuid.substring(0, 8).toUpperCase()}</li>
                <li>Date Added: {new Date(product.dateAdded || "").toLocaleDateString()}</li>
                {/* Add more specifications as needed */}
              </ul>
              <h3 className="font-semibold text-lg">Description</h3>
              <p>{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Customer Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 font-medium">{review.username}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Shipping Information</h3>
              <p>
                We deliver to all campus dorms and halls within 24 hours of order confirmation. Orders placed before 2
                PM are typically delivered the same day.
              </p>
              <h3 className="font-semibold text-lg">Return Policy</h3>
              <p>
                You can return or exchange items within 7 days of delivery. Items must be unused and in their original
                packaging. Contact our customer support to initiate a return or exchange.
              </p>
            </div>
          </TabsContent>
        </Tabs>

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
                            className={`h-4 w-4 ${
                              i < Math.floor(relatedProduct.avgRating || 0)
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
