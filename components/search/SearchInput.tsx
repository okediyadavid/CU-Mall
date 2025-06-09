"use client"

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

interface SearchInputProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
    loading?: boolean;
}

export function SearchInput({
    onSearch,
    placeholder = "Search products...",
    className,
    debounceMs = 300,
    loading = false,
}: SearchInputProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs)

    useEffect(() => {
        if (debouncedSearchTerm) {
            onSearch(debouncedSearchTerm)
        }
    }, [debouncedSearchTerm, onSearch])

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                placeholder={placeholder}
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
            )}
        </div>
    )
} 