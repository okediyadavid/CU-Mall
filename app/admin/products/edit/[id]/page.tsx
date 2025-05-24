"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { adminProductsApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function EditProductPage() {
  const { isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>("")

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    const fetchProduct = async () => {
      try {
        const product = await adminProductsApi.getById(productId)
        setFormData({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
        })
        setCurrentImage(product.productImage || "")
      } catch (error) {
        console.error("Failed to fetch product:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product data",
        })
      } finally {
        setIsLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [isAuthenticated, isAdmin, router, productId, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Product title is required"
    if (!formData.description.trim()) newErrors.description = "Product description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required"
    if (!formData.quantity || Number.parseInt(formData.quantity) < 0) newErrors.quantity = "Valid quantity is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (selectedFile) {
        // Use FormData if a new file is selected
        const formDataObj = new FormData()
        formDataObj.append("title", formData.title)
        formDataObj.append("description", formData.description)
        formDataObj.append("category", formData.category)
        formDataObj.append("price", Number.parseFloat(formData.price).toString())
        formDataObj.append("quantity", Number.parseInt(formData.quantity).toString())
        formDataObj.append("productImage", selectedFile)

        await adminProductsApi.update(productId, formDataObj)
      } else {
        // Use JSON if no new file is selected
        const productData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: Number.parseFloat(formData.price),
          quantity: Number.parseInt(formData.quantity),
        }

        await adminProductsApi.update(productId, productData)
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-primary-foreground hover:underline mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p>Update product information</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isLoading}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  disabled={isLoading}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stationeries">Stationeries</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Dorm Essentials">Dorm Essentials</SelectItem>
                    <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productImage">Product Image</Label>
                <Input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedFile(file)
                    }
                  }}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">Leave empty to keep current image</p>

                {/* Show current image or new image preview */}
                {selectedFile ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium">New image preview:</p>
                    <img
                      src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                      alt="New product preview"
                      className="h-32 w-32 object-cover rounded border"
                    />
                  </div>
                ) : currentImage ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current image:</p>
                    <img
                      src={currentImage || "/placeholder.svg"}
                      alt="Current product image"
                      className="h-32 w-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Product
                </Button>
                <Link href="/admin/products">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
