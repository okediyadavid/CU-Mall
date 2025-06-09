import { Card, CardContent } from "@/components/ui/card"

export default function AdminLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="pt-6">
                                <div className="h-20 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6">
                                <div className="h-32 bg-muted rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <div className="h-[400px] bg-muted rounded"></div>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <div className="h-[400px] bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 