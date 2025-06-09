"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ShoppingCart } from 'lucide-react'
import { productsApi } from '@/lib/api'
import { getRecommendedProducts } from '@/lib/userPreferences'
import { useCart } from '@/context/CartContext'

interface RecommendedProductsProps {
    currentProductId?: string
}

export function RecommendedProducts({ currentProductId }: RecommendedProductsProps) {
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { addItem } = useCart()

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setIsLoading(true)
                const response = await productsApi.getAll(1)
                const recommendations = getRecommendedProducts(response.data, currentProductId)
                setProducts(recommendations)
            } catch (error) {
                console.error('Failed to load recommendations:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadRecommendations()
    }, [currentProductId])

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-0">
                            <Skeleton className="h-40 w-full" />
                            <div className="p-4">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (products.length === 0) {
        return null
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
                <Card key={product.uuid} className="overflow-hidden group transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                        <Link href={`/products/${product.uuid}`}>
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={product.productImage || "/placeholder.svg"}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link href={`/products/${product.uuid}`}>
                                <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                                    {product.title}
                                </h3>
                            </Link>
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < Math.floor(product.avgRating || 0)
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-sm text-primary">₦{product.price.toFixed(2)}</p>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() =>
                                        addItem({
                                            id: product.uuid,
                                            name: product.title,
                                            price: product.price,
                                            quantity: 1,
                                            category: product.category,
                                            image: product.productImage,
                                        })
                                    }
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
} 