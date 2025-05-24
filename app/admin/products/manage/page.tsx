"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, Trash2, Upload, Loader2, X, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { adminProductsApi, categoriesApi, type Product, type Category } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function AdminProductManagePage() {
  const { isAdmin, isAuthenticated, token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const isSubmitting = useRef(false)

  // State for products and pagination
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // State for categories
  const [categories, setCategories] = useState<Category[]>([])

  // State for form
  const [product, setProduct] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // State for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false)

  // State for search
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    fetchCategories()
    fetchProducts()
  }, [isAuthenticated, isAdmin, router, currentPage])

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await adminProductsApi.getAll(currentPage)
      setProducts(response.data)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting.current) return
    isSubmitting.current = true

    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please login again",
      })
      router.push("/login")
      isSubmitting.current = false
      return
    }

    // Validation
    if (!product.title || !product.description || !product.category || !product.quantity || !product.price) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      })
      isSubmitting.current = false
      return
    }

    if (isNaN(Number(product.price)) || isNaN(Number(product.quantity)) || Number(product.quantity) < 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Price and quantity must be valid numbers",
      })
      isSubmitting.current = false
      return
    }

    if (!file && !editingId) {
      toast({
        variant: "destructive",
        title: "Image Required",
        description: "Please upload an image for new products",
      })
      isSubmitting.current = false
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", product.title)
      formData.append("description", product.description)
      formData.append("category", product.category)
      formData.append("quantity", product.quantity)
      formData.append("price", product.price)
      if (file) {
        formData.append("productImage", file)
      }

      let result
      if (editingId) {
        // Try FormData first, fallback to JSON if needed
        try {
          result = await adminProductsApi.update(editingId, {
            title: product.title,
            description: product.description,
            category: product.category,
            quantity: Number(product.quantity),
            price: Number(product.price),
          })
        } catch (error) {
          // If FormData fails and we have a file, try uploading via direct API call
          if (file) {
            const endpoint = `https://cumall-backend.onrender.com/api/product/update/${editingId}`
            const response = await fetch(endpoint, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            })
            const data = await response.json()
            if (!response.ok || !data.success) {
              throw new Error(data.message || "Update failed")
            }
            result = data.data
          } else {
            throw error
          }
        }
      } else {
        // For new products, use direct API call with FormData
        const endpoint = "https://cumall-backend.onrender.com/api/product/add"
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to add product")
        }
        result = data.data
      }

      toast({
        title: "Success",
        description: editingId ? "Product updated successfully" : "Product added successfully",
      })

      // Reset form
      setProduct({ title: "", price: "", category: "", description: "", quantity: "" })
      setFile(null)
      setEditingId(null)
      setCurrentPage(1)
      fetchProducts()
    } catch (error: any) {
      console.error("Submit error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsUploading(false)
      isSubmitting.current = false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const handleEdit = (prod: Product) => {
    setProduct({
      title: prod.title,
      price: prod.price.toString(),
      quantity: prod.quantity.toString(),
      category: prod.category,
      description: prod.description,
    })
    setEditingId(prod.uuid)
    setFile(null)
  }

  const handleDelete = async (id: string) => {
    try {
      await adminProductsApi.delete(id)
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      setDeleteConfirm(null)
      fetchProducts()
    } catch (error: any) {
      console.error("Delete error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete product",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setFile(files[0])
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const resetForm = () => {
    setProduct({ title: "", price: "", category: "", description: "", quantity: "" })
    setFile(null)
    setEditingId(null)
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <Link href="/admin" className="inline-flex items-center text-primary-foreground hover:underline mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p>Add, edit, and manage your store's products</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {editingId ? "Edit Product" : "Add New Product"}
                {editingId && (
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel Edit
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary"
                  }`}
                >
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {file ? file.name : "Drag & drop an image or click to upload"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Product Name</Label>
                    <Input
                      id="title"
                      name="title"
                      value={product.title}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₦)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={product.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={product.category}
                      onValueChange={(value) => setProduct((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stationeries">Stationeries</SelectItem>
                        <SelectItem value="Personal Care">Personal Care</SelectItem>
                        <SelectItem value="Dorm Essentials">Dorm Essentials</SelectItem>
                        <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update Product" : "Add Product"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Image Preview */}
          {file && (
            <Card>
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain rounded-md"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name, category, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchTerm && (
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? `No products found matching "${searchTerm}"` : "No products found"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((prod) => (
                    <TableRow key={prod.uuid}>
                      <TableCell>
                        <img
                          src={prod.productImage || "/placeholder.svg?height=64&width=64"}
                          alt={prod.title}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{prod.title}</TableCell>
                      <TableCell>₦{prod.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={prod.quantity > 0 ? "default" : "destructive"}>{prod.quantity}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{prod.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(prod)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(prod.uuid)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)

                    if (!showPage) {
                      // Show ellipsis for gaps
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            {/* Page Info */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Showing page {currentPage} of {totalPages}
                {searchTerm && ` (${filteredProducts.length} of ${products.length} products matching "${searchTerm}")`}
                {!searchTerm && ` (${products.length} products)`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
