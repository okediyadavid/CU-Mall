import { Truck, Shield, Clock, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Truck,
    title: "Fast Campus Delivery",
    description: "Quick delivery to all campus dorms and halls within 24 hours",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "All products are verified for quality and authenticity",
  },
  {
    icon: Clock,
    title: "24/7 Shopping",
    description: "Shop anytime, anywhere with our always-open online store",
  },
  {
    icon: Headphones,
    title: "Student Support",
    description: "Dedicated customer support team to help with any questions",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose CUMall?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to making your campus life easier with reliable service and quality products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
