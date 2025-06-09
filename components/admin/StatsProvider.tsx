"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { adminProductsApi, type AdminStats } from '@/lib/api'
import { useToast } from "@/components/ui/use-toast"

interface StatsContextType {
  stats: AdminStats
  isLoading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

const StatsContext = createContext<StatsContextType | undefined>(undefined)

const DEFAULT_STATS: AdminStats = {
  totalProducts: 0,
  totalOrders: 0,
  totalUsers: 0,
  revenue: 0,
}

export function StatsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats>(DEFAULT_STATS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const loadStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await adminProductsApi.getStats()

      // Validate the response
      if (typeof response.totalProducts !== 'number' ||
        typeof response.totalOrders !== 'number' ||
        typeof response.totalUsers !== 'number' ||
        typeof response.revenue !== 'number') {
        throw new Error('Invalid stats data received')
      }

      setStats(response)
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error('Error loading stats:', err)
      const errorMessage = err.message || 'Failed to load stats'
      setError(errorMessage)

      // Only show toast for non-network errors or final retry
      if (!err.message?.includes('Network error') || retryCount >= 2) {
        toast({
          variant: "destructive",
          title: "Error loading dashboard stats",
          description: errorMessage,
        })
      }

      // If it's a network error, retry up to 3 times
      if (err.message?.includes('Network error') && retryCount < 3) {
        setRetryCount(prev => prev + 1)
        setTimeout(loadStats, 1000 * (retryCount + 1)) // Exponential backoff
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <StatsContext.Provider
      value={{
        stats,
        isLoading,
        error,
        refreshStats: async () => {
          setRetryCount(0) // Reset retry count on manual refresh
          await loadStats()
        },
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider')
  }
  return context
} 