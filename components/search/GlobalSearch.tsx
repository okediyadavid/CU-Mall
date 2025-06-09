"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchInput } from './SearchInput'
import { searchProducts } from '@/lib/api/search'
import { Product } from '@/types'
import { Card } from '@/components/ui/card'
import { useClickOutside } from '@/hooks/useClickOutside'
import Image from 'next/image'

export function GlobalSearch() {
    const router = useRouter()
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const ref = useClickOutside<HTMLDivElement>(() => setShowResults(false))

    const handleSearch = async (query: string) => {
        if (!query) {
            setResults([])
            setShowResults(false)
            return
        }

        try {
            setLoading(true)
            const response = await searchProducts(query)
            setResults(response.data)
            setShowResults(true)
        } catch (error) {
            console.error('Search failed:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleProductClick = (productId: string) => {
        router.push(`/products/${productId}`)
        setShowResults(false)
    }

    return (
        <div className="relative w-full max-w-xl mx-auto" ref={ref}>
            <SearchInput
                onSearch={handleSearch}
                loading={loading}
                placeholder="Search for products..."
                className="w-full"
            />

            {showResults && results.length > 0 && (
                <Card className="absolute top-full mt-2 w-full z-50 max-h-[80vh] overflow-auto p-2">
                    <div className="space-y-2">
                        {results.map((product) => (
                            <div
                                key={product.uuid}
                                className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                                onClick={() => handleProductClick(product.uuid)}
                            >
                                {product.productImage && (
                                    <div className="relative h-12 w-12 rounded overflow-hidden">
                                        <Image
                                            src={product.productImage}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-medium">{product.title}</h4>
                                    <p className="text-sm text-muted-foreground">₦{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    )
} 