const API_BASE_URL = "https://cumall-backend.onrender.com/api"

export interface Product {
  uuid: string
  title: string
  description: string
  category: string
  quantity: number
  price: number
  avgRating?: number
  dateAdded?: string
  productImage: string
  reviews?: any[]
}

export interface Category {
  type: string
  id: string
}

export interface Order {
  uuid: string
  ordered_by: string
  ordered_date: string
  state: number
  total_price: string
  items: OrderItem[]
  room_number?: string
  hall?: string
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  category: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  currentPage: number
  totalPages: number
  success: boolean
}

// Helper function for API requests
async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("token")

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Products API
export const productsApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Product>> => {
    const data = await fetchApi(`/product?page=${page}`)
    return {
      data: data.productItems || [],
      totalItems: data.totalProductItems || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      success: data.success,
    }
  },

  getById: async (id: string): Promise<Product> => {
    const data = await fetchApi(`/product/${id}`)
    return data.data
  },

  getByCategory: async (category: string, page = 1): Promise<PaginatedResponse<Product>> => {
    const data = await fetchApi(`/product/category/${category}?page=${page}`)
    return {
      data: data.productItems || [],
      totalItems: data.totalProductItems || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      success: data.success,
    }
  },

  create: async (product: Omit<Product, "uuid">): Promise<Product> => {
    const data = await fetchApi("/product/add", {
      method: "POST",
      body: JSON.stringify(product),
    })
    return data.data
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const data = await fetchApi(`/product/update/${id}`, {
      method: "PATCH",
      body: JSON.stringify(product),
    })
    return data.data
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const data = await fetchApi(`/product/delete/${id}`, {
      method: "DELETE",
    })
    return { success: data.success }
  },
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const data = await fetchApi("/product/category/all")
    return data.categories || []
  },

  create: async (type: string): Promise<Category> => {
    const data = await fetchApi("/product/category/add", {
      method: "POST",
      body: JSON.stringify({ type }),
    })
    return data.data
  },
}

// Orders API
export const ordersApi = {
  getById: async (id: string): Promise<Order> => {
    const data = await fetchApi(`/orders/${id}`)
    return data.data
  },

  markAsDelivered: async (id: string): Promise<{ success: boolean }> => {
    const data = await fetchApi(`/orders/deliver/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ state: 1 }),
    })
    return { success: data.success }
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const data = await fetchApi(`/orders/delete/${id}`, {
      method: "DELETE",
    })
    return { success: data.success }
  },
}

// User API
export const userApi = {
  updatePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    const data = await fetchApi("/users/update-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    return { success: data.success }
  },
}

// Admin Products API (requires admin authentication)
export const adminProductsApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Product>> => {
    const data = await fetchApi(`/product?page=${page}`)
    return {
      data: data.productItems || [],
      totalItems: data.totalProductItems || 0,
      currentPage: data.currentPage || 1,
      totalPages: data.totalPages || 1,
      success: data.success,
    }
  },

  getById: async (id: string): Promise<Product> => {
    const data = await fetchApi(`/product/${id}`)
    return data.data
  },

  create: async (productData: FormData | Omit<Product, "uuid">): Promise<Product> => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Authentication required")
    }

    const isFormData = productData instanceof FormData

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    // Don't set Content-Type for FormData, let browser set it with boundary
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    try {
      let bodyToSend: FormData | string

      if (isFormData) {
        // Ensure numeric values are properly formatted in FormData
        const formData = new FormData()
        for (const [key, value] of (productData as FormData).entries()) {
          if (key === "price") {
            formData.append(key, Number.parseFloat(value as string).toString())
          } else if (key === "quantity") {
            formData.append(key, Number.parseInt(value as string).toString())
          } else {
            formData.append(key, value)
          }
        }
        bodyToSend = formData
      } else {
        bodyToSend = JSON.stringify(productData)
      }

      const response = await fetch(`${API_BASE_URL}/product/add`, {
        method: "POST",
        headers,
        body: bodyToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product")
      }

      return data.data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  },

  update: async (id: string, productData: FormData | Partial<Product>): Promise<Product> => {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Authentication required")
    }

    const isFormData = productData instanceof FormData

    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }

    // Don't set Content-Type for FormData, let browser set it with boundary
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    try {
      let response = await fetch(`${API_BASE_URL}/product/update/${id}`, {
        method: "PATCH",
        headers,
        body: isFormData ? productData : JSON.stringify(productData),
      })

      let data = await response.json()

      // Fallback to JSON if FormData fails (for updates without files)
      if (!response.ok && isFormData && response.status === 400) {
        console.warn("FormData request failed, attempting with JSON...")

        const jsonData: any = {}
        if (productData instanceof FormData) {
          for (const [key, value] of productData.entries()) {
            if (key !== "productImage") {
              jsonData[key] = key === "price" || key === "quantity" ? Number(value) : value
            }
          }
        }

        response = await fetch(`${API_BASE_URL}/product/update/${id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })

        data = await response.json()
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product")
      }

      return data.data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const data = await fetchApi(`/product/delete/${id}`, {
      method: "DELETE",
    })
    return { success: data.success }
  },
}

// Admin Orders API - Using mock data until backend endpoint is ready
export const adminOrdersApi = {
  getAll: async (): Promise<Order[]> => {
    // TODO: Replace with actual API call when backend endpoint is ready
    // For now, this will throw an error that we catch in the component
    throw new Error("Admin orders endpoint not implemented yet")
  },

  updateStatus: async (id: string, status: number): Promise<{ success: boolean }> => {
    // TODO: Replace with actual API call when backend endpoint is ready
    console.log(`Would update order ${id} to status ${status}`)
    return { success: true }
  },
}
