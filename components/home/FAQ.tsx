"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqItems = [
  {
    question: "How fast is delivery to campus dorms?",
    answer:
      "We deliver to all campus dorms within 24-48 hours of order confirmation. Orders are processed and delivered during campus operating hours. You'll receive real-time notifications about your order status.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, mobile money, and campus meal card points. All payments are processed securely through our payment gateway.",
  },
  {
    question: "Can I return or exchange items?",
    answer:
      "No, you can't return certain items such as edibles, provisions, and other perishable goods. Returns or exchanges are only accepted for specific products like faulty electronics, expired items, or clothing that does not fit after purchase. All claims must be made within 7 days of delivery. Please contact our customer support team to initiate a return or exchange request.",
  },
  {
    question: "Do you offer discounts for bulk orders?",
    answer:
      "Yes! We offer special discounts for bulk orders and group purchases. Contact our support team for more information about bulk pricing.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is confirmed, you'll receive a tracking link via your university email. You can also track your order in real-time through your account dashboard. Our system provides detailed updates at every stage of delivery.",
  },
  {
    question: "Are there any delivery fees?",
    answer:
      "No, delivery is completely free for all orders to campus dorms! We believe in making shopping convenient and affordable for all students.",
  },
  {
    question: "What are your delivery hours?",
    answer:
      "We deliver during campus operating hours (8 AM - 6 PM) on weekdays. For urgent deliveries or special timing requests, please contact our support team.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Our customer support team is available via email, WhatsApp, and on-campus office during business hours. You can also use the chat feature in our app for quick assistance.",
  },
]

export default function FAQ() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 font-heading">Frequently Asked Questions</h2>
            <p className="text-muted-foreground font-sans">
              Got questions? We've got answers! Here are some common questions about our service.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center font-heading">
                <HelpCircle className="mr-2 h-5 w-5" />
                Common Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="font-medium">{item.question}</AccordionTrigger>
                    <AccordionContent className="font-sans">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-muted-foreground font-sans">
              Still have questions?{" "}
              <a href="mailto:support@cumall.com" className="text-primary hover:underline font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
