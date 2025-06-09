const RECENTLY_VIEWED_KEY = 'recently_viewed_products'
const BROWSING_HISTORY_KEY = 'browsing_history'
const MAX_RECENT_ITEMS = 10
const MAX_HISTORY_ITEMS = 50

export interface ViewedProduct {
    id: string
    name: string
    price: number
    image?: string
    category: string
    viewedAt: string
}

export interface BrowsingHistoryItem {
    productId: string
    timestamp: string
    action: 'view' | 'cart' | 'purchase'
}

export const addToRecentlyViewed = (product: ViewedProduct) => {
    try {
        const recentlyViewed = getRecentlyViewed()

        // Remove if already exists
        const filtered = recentlyViewed.filter(item => item.id !== product.id)

        // Add to start of array
        const updated = [
            {
                ...product,
                viewedAt: new Date().toISOString()
            },
            ...filtered
        ].slice(0, MAX_RECENT_ITEMS)

        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated))

        // Also add to browsing history
        addToBrowsingHistory(product.id, 'view')

        return updated
    } catch (error) {
        console.error('Failed to add to recently viewed:', error)
        return []
    }
}

export const getRecentlyViewed = (): ViewedProduct[] => {
    try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Failed to get recently viewed:', error)
        return []
    }
}

export const addToBrowsingHistory = (productId: string, action: BrowsingHistoryItem['action']) => {
    try {
        const history = getBrowsingHistory()

        const updated = [
            {
                productId,
                action,
                timestamp: new Date().toISOString()
            },
            ...history
        ].slice(0, MAX_HISTORY_ITEMS)

        localStorage.setItem(BROWSING_HISTORY_KEY, JSON.stringify(updated))
        return updated
    } catch (error) {
        console.error('Failed to add to browsing history:', error)
        return []
    }
}

export const getBrowsingHistory = (): BrowsingHistoryItem[] => {
    try {
        const stored = localStorage.getItem(BROWSING_HISTORY_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('Failed to get browsing history:', error)
        return []
    }
}

export const clearBrowsingHistory = () => {
    try {
        localStorage.removeItem(BROWSING_HISTORY_KEY)
        localStorage.removeItem(RECENTLY_VIEWED_KEY)
        return true
    } catch (error) {
        console.error('Failed to clear browsing history:', error)
        return false
    }
}

// Simple recommendation engine based on browsing history
export const getRecommendedProducts = (products: any[], currentProductId?: string) => {
    try {
        const history = getBrowsingHistory()
        const recentlyViewed = getRecentlyViewed()

        // Get categories user has shown interest in
        const categoryInterests = recentlyViewed.reduce((acc: { [key: string]: number }, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1
            return acc
        }, {})

        // Sort products by category interest and exclude current product
        return products
            .filter(p => p.uuid !== currentProductId)
            .sort((a, b) => {
                const aScore = categoryInterests[a.category] || 0
                const bScore = categoryInterests[b.category] || 0
                return bScore - aScore
            })
            .slice(0, 4)
    } catch (error) {
        console.error('Failed to get recommendations:', error)
        return []
    }
} 