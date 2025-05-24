"use client"

import type React from "react"

import Link from "next/link"
import { PenTool, Heart, Home, Dumbbell, Smartphone } from "lucide-react"

const categories = [
  {
    name: "Stationeries",
    icon: PenTool,
    image: "/images/categories/stationeries.png",
    href: "/categories/Stationery",
  },
  {
    name: "Personal Care",
    icon: Heart,
    image: "/images/categories/personal-care.png",
    href: "/categories/Personal Care",
  },
  {
    name: "Dorm Essentials",
    icon: Home,
    image: "/images/categories/dorm-essentials.png",
    href: "/categories/Dorm Essentials",
  },
  {
    name: "Sports & Fitness",
    icon: Dumbbell,
    image: "/images/categories/sports-fitness.png",
    href: "/categories/Sports & Fitness",
  },
  {
    name: "Electronics",
    icon: Smartphone,
    image: "/images/categories/electronics.png",
    href: "/categories/Electronics",
  },
]

export default function CategorySection() {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, categoryName: string) => {
    const target = e.target as HTMLImageElement
    target.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(categoryName)}`
  }

  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Categories</h2>
          <p className="mt-2 text-lg leading-8 text-muted-foreground">
            Shop by category to find exactly what you're looking for.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8">
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="group">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted/50 group-hover:opacity-75 transition-opacity">
                  <img
                    src={
                      category.image ||
                      `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(category.name)}`
                    }
                    alt={category.name}
                    className="h-full w-full object-cover object-center"
                    onError={(e) => handleImageError(e, category.name)}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{category.name}</h3>
                  <category.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
