import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
} 