"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"

interface Review {
    id: string
    userId: string
    userName: string
    rating: number
    comment: string
    images?: string[]
    helpful: number
    notHelpful: number
    verifiedPurchase: boolean
    createdAt: string
}

export function ReviewSection({ productId }: { productId: string }) {
    const { user, isAuthenticated } = useAuth()
    const { toast } = useToast()
    const [reviews, setReviews] = useState<Review[]>([])
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: "",
        images: [] as string[],
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRatingClick = (rating: number) => {
        setNewReview(prev => ({ ...prev, rating }))
    }

    const handleSubmitReview = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Required",
                description: "Please login to submit a review",
                variant: "destructive",
            })
            return
        }

        if (newReview.rating === 0) {
            toast({
                title: "Rating Required",
                description: "Please select a rating",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)
        try {
            // API call to submit review would go here
            toast({
                title: "Review Submitted",
                description: "Thank you for your feedback!",
            })
            setNewReview({ rating: 0, comment: "", images: [] })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                                key={star}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRatingClick(star)}
                                className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}
                            >
                                <Star className="h-5 w-5 fill-current" />
                            </Button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your thoughts about this product..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="min-h-[100px]"
                    />
                    <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Add Photos
                        </Button>
                        <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                            Submit Review
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-medium">{review.userName}</span>
                                </div>
                                {review.verifiedPurchase && (
                                    <span className="text-xs text-green-600">Verified Purchase</span>
                                )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm mb-4">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                            <div className="flex space-x-2 mb-4">
                                {review.images.map((image, i) => (
                                    <img
                                        key={i}
                                        src={image}
                                        alt={`Review image ${i + 1}`}
                                        className="h-20 w-20 object-cover rounded"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="flex items-center space-x-4 text-sm">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Helpful ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Not Helpful ({review.notHelpful})
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 