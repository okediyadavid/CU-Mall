"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
    },
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Orders",
        href: "/admin/orders",
    },
    {
        title: "Users",
        href: "/admin/users",
    },
    {
        title: "Categories",
        href: "/admin/categories",
    },
]

export function AdminNavbar() {
    const pathname = usePathname()
    const { user, logout, isAdmin } = useAuth()

    if (!isAdmin) {
        return null
    }

    const NavLinks = () => (
        <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground/80",
                        pathname === item.href
                            ? "text-foreground font-bold"
                            : "text-foreground/60"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    )

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Admin Dashboard</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col space-y-4 mt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "text-foreground/60 hover:text-foreground transition-colors",
                                            pathname === item.href && "text-foreground font-bold"
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Desktop Menu */}
                <div className="mr-4 hidden md:flex items-center space-x-6">
                    <Link href="/admin" className="font-bold">
                        Admin Dashboard
                    </Link>
                    <NavLinks />
                </div>

                {/* Right Side */}
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        {user?.email}
                    </p>
                    <Button
                        variant="ghost"
                        onClick={logout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
} 