import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TestimonialProps {
  testimonial: {
    id: number
    name: string
    text: string
    image?: string
  }
}

const TestimonialCard = ({ testimonial }: TestimonialProps) => {
  // Get initials for avatar fallback
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-16 w-16 mb-4">
          <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <blockquote className="mb-4 text-muted-foreground">"{testimonial.text}"</blockquote>
        <footer className="font-medium">{testimonial.name}</footer>
      </CardContent>
    </Card>
  )
}

export default TestimonialCard
