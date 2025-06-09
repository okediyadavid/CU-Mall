"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, X, MinusCircle, Maximize2 } from 'lucide-react'
import { cn } from "@/lib/utils"

// Simple chatbot responses - In a real app, this would be more sophisticated
const chatbotResponses: { [key: string]: string } = {
    'hello': 'Hi there! How can I help you today?',
    'hi': 'Hello! What can I assist you with?',
    'help': 'I can help you with: \n- Order tracking\n- Product information\n- Delivery questions\n- Returns\n- Payment issues',
    'order': 'To track your order, please go to your profile and click on "Orders". You can view all order details and tracking information there.',
    'delivery': 'We typically deliver within 24-48 hours to campus dorms. Delivery updates will be sent to your email.',
    'return': 'To return an item, please visit your order details page and click on "Return Item". Make sure to initiate the return within 7 days of delivery.',
    'payment': 'We accept various payment methods including credit cards and bank transfers. For payment issues, please contact our support team.',
    'contact': 'You can reach our support team at support@cumall.com or call us at +234-XXX-XXXX during business hours.',
    'default': "I'm not sure about that. Would you like to:\n1. Contact support\n2. View FAQs\n3. Track your order",
}

interface Message {
    text: string
    isUser: boolean
    timestamp: Date
}

export function Chatbot() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([{
        text: "Hi! I'm your CUMall assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
    }])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (!isMinimized) {
            scrollToBottom()
        }
    }, [messages, isMinimized])

    const getBotResponse = (userInput: string) => {
        const input = userInput.toLowerCase()
        let response = chatbotResponses.default

        // Check for keyword matches
        Object.keys(chatbotResponses).forEach(key => {
            if (input.includes(key)) {
                response = chatbotResponses[key]
            }
        })

        return response
    }

    const handleSend = () => {
        if (!input.trim()) return

        const userMessage: Message = {
            text: input,
            isUser: true,
            timestamp: new Date(),
        }

        setMessages(prev => [...prev, userMessage])
        setInput('')

        // Simulate bot typing delay
        setTimeout(() => {
            const botResponse: Message = {
                text: getBotResponse(input),
                isUser: false,
                timestamp: new Date(),
            }
            setMessages(prev => [...prev, botResponse])
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        setIsMinimized(false)
        // Clear messages when closing
        setMessages([{
            text: "Hi! I'm your CUMall assistant. How can I help you today?",
            isUser: false,
            timestamp: new Date(),
        }])
    }

    const handleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    if (!isVisible) {
        return (
            <Button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-all duration-200"
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        )
    }

    return (
        <Card
            className={cn(
                "fixed bottom-4 right-4 w-[350px] shadow-lg",
                "transition-all duration-300 ease-in-out transform",
                isMinimized ? "h-[60px]" : "h-[500px]",
                "hover:shadow-xl"
            )}
        >
            <CardHeader className="border-b p-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Chat Support
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
                            onClick={handleMinimize}
                        >
                            {isMinimized ? (
                                <Maximize2 className="h-4 w-4" />
                            ) : (
                                <MinusCircle className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                            onClick={handleClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="p-4 h-[360px]">
                        <ScrollArea className="h-full pr-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-lg p-3",
                                            message.isUser
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted",
                                            "transition-all duration-200 ease-in-out",
                                            "animate-in slide-in-from-bottom-2"
                                        )}
                                    >
                                        <p className="whitespace-pre-line text-sm">{message.text}</p>
                                        <span className="text-xs opacity-70 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 pt-2">
                        <div className="flex w-full gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="transition-all duration-200"
                            />
                            <Button
                                onClick={handleSend}
                                size="icon"
                                className="transition-all duration-200 hover:scale-105"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </>
            )}
        </Card>
    )
} 