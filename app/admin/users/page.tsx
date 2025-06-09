"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreVertical, UserPlus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - replace with actual API call
const mockUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Customer", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Customer", status: "Inactive" },
]

export default function UserManagement() {
    const router = useRouter()
    const { isAdmin, isAuthenticated } = useAuth()
    const [isClient, setIsClient] = useState(false)
    const [users, setUsers] = useState(mockUsers)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (isClient && (!isAuthenticated || !isAdmin)) {
            router.push("/login")
        }
    }, [isClient, isAuthenticated, isAdmin, router])

    if (!isClient || !isAuthenticated || !isAdmin) {
        return null
    }

    const handleStatusChange = (userId: number, newStatus: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ))
    }

    const handleRoleChange = (userId: number, newRole: string) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
        ))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/admin" className="inline-flex items-center text-primary hover:underline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New User
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                                                    >
                                                        {user.status === 'Active' ? 'Deactivate' : 'Activate'} User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user.id, user.role === 'Admin' ? 'Customer' : 'Admin')}
                                                    >
                                                        Change Role to {user.role === 'Admin' ? 'Customer' : 'Admin'}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 