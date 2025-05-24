"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { categoriesApi, type Category } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const categoryIcons: Record<string, string> = {
  Stationery: "/placeholder.svg?height=200&width=200",
  "Personal Care": "/placeholder.svg?height=200&width=200",
  "Dorm Essentials": "/placeholder.svg?height=200&width=200",
  "Sports & Fitness": "/placeholder.svg?height=200&width=200",
  Electronics: "/placeholder.svg?height=200&width=200",
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">All Categories</h1>
          <p className="text-muted-foreground">
            Browse our wide selection of products organized by categories to find exactly what you need for your campus
            life.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-6" />
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${encodeURIComponent(category.type)}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <img
                          src={categoryIcons[category.type] || "/placeholder.svg?height=200&width=200"}
                          alt={category.type}
                          className="h-20 w-20 object-contain"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.type}</h3>
                      <p className="text-muted-foreground">Explore all {category.type.toLowerCase()} products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
