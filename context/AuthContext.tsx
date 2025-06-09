"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface User {
  username: string
  email: string
  name?: string
  roomNumber?: string
  hall?: string
  role: "Customer" | "Admin"
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: SignupData) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

interface SignupData {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  roomNumber: string
  hall: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    // Check if user is logged in on initial load
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    }
    setIsLoading(false)
  }, [])

  if (!mounted) {
    return null
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("https://cumall-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        const userData: User = {
          username: data.username,
          email: data.email,
          name: data.name,
          roomNumber: data.roomNumber,
          hall: data.hall,
          role: data.role,
        }

        setUser(userData)
        setToken(data.token)

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Login Successful",
          description: "Welcome back to CUMall!",
        })

        return true
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: data.message || "Invalid credentials",
        })
        return false
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch("https://cumall-backend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created. Please login.",
        })
        return true
      } else {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: data.message || "Could not create account",
        })
        return false
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Error",
        description: "An error occurred during signup. Please try again.",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("https://cumall-backend.onrender.com/api/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Clear local storage and state regardless of API response
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setToken(null)

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })

    router.push("/")
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "Admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
