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

export interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  revenue: number
}

// Helper function for API requests
async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("token")
  console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);

  if (!token) {
    console.error('No authentication token found');
    throw new Error('Authentication required - Please log in again');
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  headers["Authorization"] = `Bearer ${token}`
  console.log('Using auth token:', token.substring(0, 10) + '...');

  try {
    console.log('Request headers:', headers);
    console.log('Full request URL:', `${API_BASE_URL}${endpoint}`);
    console.log('Request options:', {
      ...options,
      headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    const contentType = response.headers.get("content-type");
    console.log('Response content type:', contentType);

    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      console.log('Raw response text:', text);
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Invalid response format from server');
    }

    console.log('API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Session expired - Please log in again');
      } else if (response.status === 403) {
        throw new Error('Access denied - Insufficient permissions');
      } else if (response.status === 500) {
        throw new Error('Server error - Please try again later');
      }
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }

    if (!data) {
      throw new Error('Empty response from server');
    }

    return data;
  } catch (error) {
    console.error("API Error Details:", {
      endpoint,
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });

    // Check if it's a network error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error - Please check your connection');
    }

    throw error;
  }
}

// Helper function to get stats from localStorage
async function getLocalStats(): Promise<AdminStats> {
  try {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    let productCount = 0

    try {
      const response = await fetchApi('/product?page=1')
      productCount = response.totalProductItems || 0
    } catch (error) {
      console.error('Error getting product count:', error)
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      productCount = products.length
    }

    const totalRevenue = orders.reduce((sum: number, order: any) =>
      sum + (parseFloat(order.total_price) || 0), 0)

    return {
      totalProducts: productCount,
      totalOrders: orders.length,
      totalUsers: users.length,
      revenue: totalRevenue,
    }
  } catch (error) {
    console.error('Error getting local stats:', error)
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      revenue: 0,
    }
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
  getStats: async (): Promise<AdminStats> => {
    try {
      console.log('Fetching admin stats from available endpoints...');

      // Get product stats since we have access to the products endpoint
      const productsResponse = await fetchApi('/product?page=1');
      console.log('Products response:', productsResponse);

      // Validate the response has the expected structure
      if (!productsResponse || !productsResponse.success || typeof productsResponse.totalProductItems !== 'number') {
        console.error('Invalid products response:', productsResponse);
        throw new Error('Invalid response format from products endpoint');
      }

      // Get orders from localStorage as fallback
      let orders = [];
      try {
        const ordersStr = localStorage.getItem('orders');
        orders = ordersStr ? JSON.parse(ordersStr) : [];
        if (!Array.isArray(orders)) {
          console.warn('Orders in localStorage is not an array, resetting to empty array');
          orders = [];
        }
      } catch (error) {
        console.error('Error parsing orders from localStorage:', error);
        orders = [];
      }

      // Get users from localStorage as fallback
      let users = [];
      try {
        const usersStr = localStorage.getItem('users');
        users = usersStr ? JSON.parse(usersStr) : [];
        if (!Array.isArray(users)) {
          console.warn('Users in localStorage is not an array, resetting to empty array');
          users = [];
        }
      } catch (error) {
        console.error('Error parsing users from localStorage:', error);
        users = [];
      }

      // Calculate total revenue from orders
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        const price = parseFloat(order.total_price);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      const result = {
        totalProducts: productsResponse.totalProductItems,
        totalOrders: orders.length,
        totalUsers: users.length,
        revenue: totalRevenue,
      };

      console.log('Final stats result:', result);
      return result;
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);

      // Return zeros if everything fails
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        revenue: 0,
      };
    }
  },

  getAll: async (page = 1): Promise<PaginatedResponse<Product>> => {
    const data = await fetchApi(`/product?page=${page}`)
    return {
      data: data.productItems || [],
      totalItems: data.totalProductItems || 0,
      currentPage: page,
      totalPages: data.totalPages || 1,
      success: true,
    }
  },

  getById: async (id: string): Promise<Product> => {
    const data = await fetchApi(`/product/${id}`)
    return data.data
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
