"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ShoppingCart, X } from 'lucide-react'
import { getRecentlyViewed, clearBrowsingHistory } from '@/lib/userPreferences'
import { useCart } from '@/context/CartContext'
import { useToast } from "@/components/ui/use-toast"

export function RecentlyViewed() {
    const [products, setProducts] = useState<any[]>([])
    const { addItem } = useCart()
    const { toast } = useToast()

    useEffect(() => {
        const loadRecentlyViewed = () => {
            const recentProducts = getRecentlyViewed()
            setProducts(recentProducts)
        }

        loadRecentlyViewed()

        // Update when storage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'recently_viewed_products') {
                loadRecentlyViewed()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const handleClearHistory = () => {
        clearBrowsingHistory()
        setProducts([])
        toast({
            title: "History Cleared",
            description: "Your browsing history has been cleared.",
            duration: 3000,
        })
    }

    if (products.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recently Viewed
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearHistory}
                        className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                    <div className="grid grid-cols-1 gap-4">
                        {products.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                <CardContent className="p-3">
                                    <div className="flex gap-3">
                                        <Link href={`/products/${product.id}`} className="flex-shrink-0">
                                            <div className="relative h-16 w-16 overflow-hidden rounded">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/products/${product.id}`}>
                                                <h3 className="font-medium text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {product.category}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm text-primary">
                                                    ₦{product.price.toFixed(2)}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => addItem({
                                                        id: product.id,
                                                        name: product.name,
                                                        price: product.price,
                                                        quantity: 1,
                                                        category: product.category,
                                                        image: product.image,
                                                    })}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
} 