"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Loader2, Trash2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { categoriesApi, type Category } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminCategoriesPage() {
  const { isAdmin, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login")
      return
    }

    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        // Filter out any invalid categories
        const validCategories = data.filter((cat) => cat && cat.id && cat.type)
        setCategories(validCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [isAuthenticated, isAdmin, router, toast])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newCategoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name is required",
      })
      return
    }

    setIsAdding(true)

    try {
      const newCategory = await categoriesApi.create(newCategoryName.trim())
      if (newCategory && newCategory.id && newCategory.type) {
        setCategories([...categories, newCategory])
        setNewCategoryName("")
        toast({
          title: "Success",
          description: "Category added successfully",
        })
      }
    } catch (error) {
      console.error("Failed to add category:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!categoryId) return

    setDeletingId(categoryId)

    try {
      await categoriesApi.delete(categoryId)
      setCategories(categories.filter((cat) => cat.id !== categoryId))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete category",
      })
    } finally {
      setDeletingId(null)
    }
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
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p>Manage product categories for your store</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Add New Category */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="categoryName" className="sr-only">
                  Category Name
                </Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={isAdding}
                />
              </div>
              <Button type="submit" disabled={isAdding}>
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="text-muted-foreground mt-2">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No categories found</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first category above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <Card key={category.id || Math.random()} className="relative">
                    <CardContent className="p-4 text-center">
                      <Badge variant="secondary" className="mb-2">
                        {category.type || "Unknown Category"}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-3">
                        ID: {category.id ? category.id.substring(0, 8) : "N/A"}
                      </p>

                      {category.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              disabled={deletingId === category.id}
                            >
                              {deletingId === category.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the category "{category.type || "this category"}". This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
