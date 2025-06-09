export const productsApi = {
    async getTrendingProducts() {
        try {
            const response = await fetch(`${API_URL}/products`)
            const products = await response.json()

            // Randomly shuffle the products array
            const shuffled = [...products].sort(() => Math.random() - 0.5)

            // Return first 8 products as trending
            return shuffled.slice(0, 8)
        } catch (error) {
            console.error("Error fetching trending products:", error)
            return []
        }
    },
} 