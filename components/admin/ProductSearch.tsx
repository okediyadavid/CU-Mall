"use client"

import { useState } from 'react'
import { SearchInput } from '../search/SearchInput'
import { searchProductsAdmin } from '@/lib/api/search'
import { Product } from '@/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import Image from 'next/image'

interface ProductSearchProps {
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
}

export function ProductSearch({ onEdit, onDelete }: ProductSearchProps) {
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (query: string) => {
        if (!query) {
            setResults([])
            return
        }

        try {
            setLoading(true)
            const response = await searchProductsAdmin(query)
            setResults(response.data)
        } catch (error) {
            console.error('Admin search failed:', error)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <SearchInput
                onSearch={handleSearch}
                loading={loading}
                placeholder="Search products by name, category, or ID..."
                className="w-full max-w-2xl"
            />

            {results.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.map((product) => (
                                <TableRow key={product.uuid}>
                                    <TableCell>
                                        {product.productImage && (
                                            <div className="relative h-10 w-10 rounded overflow-hidden">
                                                <Image
                                                    src={product.productImage}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>₦{product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(product)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
} 