"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface DeliveryInstructionsProps {
    orderId: string
    initialInstructions?: string
    onSave: (instructions: string) => void
}

export function DeliveryInstructions({ orderId, initialInstructions = "", onSave }: DeliveryInstructionsProps) {
    const [instructions, setInstructions] = useState(initialInstructions)
    const [isEditing, setIsEditing] = useState(false)
    const { toast } = useToast()

    const handleSave = () => {
        onSave(instructions)
        setIsEditing(false)
        toast({
            title: "Instructions Updated",
            description: "Your delivery instructions have been saved.",
            duration: 3000,
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Delivery Instructions
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Add any specific delivery instructions here (e.g., 'Please deliver to the hall reception', 'Call when arriving', etc.)"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Instructions</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {instructions || "No delivery instructions provided."}
                        </p>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                            {instructions ? "Edit Instructions" : "Add Instructions"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 