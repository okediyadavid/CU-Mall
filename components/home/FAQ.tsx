"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "How fast is delivery to campus dorms?",
    answer:
      "We deliver to all campus dorms within 24-48 hours of order confirmation. Orders placed before 2 PM are typically delivered the same day. You'll receive a notification when your order is on the way.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, mobile money, and campus meal card points. All payments are processed securely through our payment gateway.",
  },
  {
    question: "Can I return or exchange items?",
    answer:
     " No, you cant return certain items such as edibles, provisions, and other perishable goods. Returns or exchanges are only accepted for specific products like faulty electronics, expired items, or clothing that does not fit after purchase. All claims must be made within 7 days of delivery. Please contact our customer support team to initiate a return or exchange request.",
  },
  {
    question: "Do you offer discounts for bulk orders?",
    answer:
      "NO, we dont offer special discounts.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is confirmed, you'll receive a tracking link via school email. You can also track your order in real-time through your account dashboard.",
  },
  {
    question: "Are there any delivery fees?",
    answer:
      "Delivery is free for all orders",
  },
]

export default function FAQ() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Check out our most commonly asked questions below.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl text-center text-primary">Common Questions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-10">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
