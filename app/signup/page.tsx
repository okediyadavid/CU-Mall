"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"

// List of valid halls
const VALID_HALLS = [
  "Daniel Hall",
  "Joseph Hall",
  "Paul Hall",
  "Peter Hall",
  "John Hall",
  "Esther Hall",
  "Deborah Hall",
  "Mary Hall",
  "Dorcas Hall",
  "Lydia Hall",
] as const

// Password requirements
const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters long", regex: /.{8,}/ },
  { label: "Contains at least one uppercase letter", regex: /[A-Z]/ },
  { label: "Contains at least one lowercase letter", regex: /[a-z]/ },
  { label: "Contains at least one number", regex: /[0-9]/ },
  { label: "Contains at least one special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
]

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roomNumber: "",
    hall: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState("")
  const { signup, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(covenantuniversity\.edu\.ng|stu\.cu\.edu\.ng)$/
    return emailRegex.test(email)
  }

  const validateRoomNumber = (roomNumber: string) => {
    // Format: Letter followed by 3 digits (e.g., A123, B234)
    const roomRegex = /^[A-Z]\d{3}$/
    return roomRegex.test(roomNumber)
  }

  const validatePassword = (password: string) => {
    const failedRequirements = PASSWORD_REQUIREMENTS.filter(req => !req.regex.test(password))
    return failedRequirements.length === 0 ? "" : failedRequirements.map(req => req.label).join(", ")
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (formData.username.length < 3) newErrors.username = "Username must be at least 3 characters"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please use your university email address (@covenantuniversity.edu.ng or @stu.cu.edu.ng)"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      const passwordError = validatePassword(formData.password)
      if (passwordError) newErrors.password = `Password must meet these requirements: ${passwordError}`
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required"
    } else if (!validateRoomNumber(formData.roomNumber)) {
      newErrors.roomNumber = "Invalid room number format (e.g., A123)"
    }

    if (!formData.hall) newErrors.hall = "Hall name is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const success = await signup(formData)

      if (success) {
        toast({
          title: "Welcome to CUMall!",
          description: "Your account has been created successfully.",
          duration: 3000,
        })
        // Small delay before redirect to show the toast
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } else {
        setApiError("Failed to create account. Please try again.")
      }
    } catch (error: any) {
      console.error("Signup error:", error)

      if (error.message?.includes("email_exists")) {
        setApiError("This email is already registered. Please try logging in instead.")
      } else if (error.message?.includes("invalid_email")) {
        setApiError("Please use a valid university email address.")
      } else {
        setApiError("Failed to create account. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (apiError) {
      setApiError("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 px-4 pt-20 pb-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join CUMall and start shopping for your campus needs</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@covenantuniversity.edu.ng"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  disabled={isLoading}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              {formData.password && !errors.password && (
                <p className="text-sm text-green-600">Password meets all requirements</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="A123"
                  value={formData.roomNumber}
                  onChange={(e) => handleInputChange("roomNumber", e.target.value.toUpperCase())}
                  disabled={isLoading}
                  className="w-full"
                  maxLength={4}
                />
                {errors.roomNumber && <p className="text-sm text-destructive">{errors.roomNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hall">Hall</Label>
                <Select
                  value={formData.hall}
                  onValueChange={(value) => handleInputChange("hall", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="hall" className="w-full">
                    <SelectValue placeholder="Select hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_HALLS.map((hall) => (
                      <SelectItem key={hall} value={hall}>
                        {hall}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hall && <p className="text-sm text-destructive">{errors.hall}</p>}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <li
                    key={index}
                    className={
                      formData.password && req.regex.test(formData.password)
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
