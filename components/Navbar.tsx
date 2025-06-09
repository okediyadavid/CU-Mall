"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingCart, User, Menu, X, LogOut, Package, Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet, SheetContent, SheetTrigger, SheetClose
} from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { categoriesApi } from "@/lib/api"
import type { Category } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4"
  }`

  const navItems = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: "Stationeries", path: "/categories/Stationeries" },
    { name: "Personal Care", path: "/categories/Personal Care" },
    { name: "Dorm Essentials", path: "/categories/Dorm Essentials" },
    { name: "Sports & Fitness", path: "/categories/Sports & Fitness" },
    { name: "Electronics", path: "/categories/Electronics" },
  ]

  const getNavItemClasses = (path: string) => {
    const isActive = pathname === path
    return `
      px-3 py-2 rounded-md text-sm font-medium transition-colors
      ${isActive 
        ? "text-primary font-semibold border-b-2 border-primary" 
        : "text-foreground/80 hover:text-accent-foreground hover:border-b-2 hover:border-muted"}
    `
  }

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary transition-transform hover:scale-105">
            CUMall
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={getNavItemClasses(item.path)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Search, Cart, User */}
        <div className="flex items-center space-x-2">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  variant="destructive"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name || user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="w-full cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-2xl font-bold text-primary">CUMall</span>
                  </Link>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </form>

                {/* Mobile Nav Links */}
                <div className="flex flex-col space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={getNavItemClasses(item.path)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

