"use client"

import { CheckCircle, Package, Truck, Home } from "lucide-react"

interface OrderTimelineProps {
    status: "pending" | "processing" | "shipped" | "delivered"
    createdAt: string
    estimatedDelivery: string
}

const steps = [
    {
        title: "Order Placed",
        icon: CheckCircle,
        description: "Your order has been confirmed",
    },
    {
        title: "Processing",
        icon: Package,
        description: "Your order is being prepared",
    },
    {
        title: "Out for Delivery",
        icon: Truck,
        description: "Your order is on its way",
    },
    {
        title: "Delivered",
        icon: Home,
        description: "Your order has been delivered",
    },
]

const statusToStep = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
}

export function OrderTimeline({ status, createdAt, estimatedDelivery }: OrderTimelineProps) {
    const currentStep = statusToStep[status]

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {steps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index <= currentStep
                const isActive = index === currentStep
                const date = index === 0 ? new Date(createdAt) : index === 3 ? new Date(estimatedDelivery) : null

                return (
                    <div key={step.title} className="relative flex items-center">
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-white
                ${isCompleted
                                    ? "border-primary text-primary"
                                    : isActive
                                        ? "border-primary/50 text-primary/50"
                                        : "border-slate-300 text-slate-300"
                                }
              `}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                                <h3
                                    className={`font-semibold ${isCompleted ? "text-slate-900" : isActive ? "text-slate-600" : "text-slate-400"
                                        }`}
                                >
                                    {step.title}
                                </h3>
                                {date && (
                                    <time
                                        className={`text-sm ${isCompleted ? "text-slate-600" : isActive ? "text-slate-500" : "text-slate-400"
                                            }`}
                                    >
                                        {date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </time>
                                )}
                            </div>
                            <p
                                className={`text-sm ${isCompleted ? "text-slate-600" : isActive ? "text-slate-500" : "text-slate-400"
                                    }`}
                            >
                                {step.description}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
} 