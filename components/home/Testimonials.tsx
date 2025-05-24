import TestimonialCard from "./TestimonialCard"

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      text: "CUMall has made campus shopping so convenient! I can get all my stationery and dorm essentials delivered right to my hall. Highly recommend!",
    },
    {
      id: 2,
      name: "Jane Smith",
      text: "The quality of products is excellent and the prices are student-friendly. Their delivery is always on time and the staff is very helpful.",
    },
    {
      id: 3,
      name: "Sam Johnson",
      text: "I love the variety of products available. From personal care to electronics, CUMall has everything a student needs. Great service!",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what students across campus are saying about CUMall.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
