"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

const slides = [
  {
    title: "Campus Essentials at Your Fingertips",
    description: "Shop for all your campus needs in one place. Fast delivery to your dorm!",
    image: "/bg-3.jpeg?height=600&width=1200",
    cta: "Shop Now",
    link: "/products",
    color: "from-purple-900 to-green-700",
  },
  {
    title: "New Stationery Collection",
    description: "Get ready for the semester with our premium stationery collection.",
    image: "/bg-1.jpeg?height=600&width=1200",
    cta: "Explore Stationery",
    link: "/categories/Stationeries",
    color: "from-purple-800 to-green-600",
  },
  {
    title: "Dorm Room Makeover",
    description: "Transform your dorm with our stylish and affordable essentials.",
    image: "/bg-2.jpeg?height=600&width=1200",
    cta: "Shop Dorm Essentials",
    link: "/categories/Dorm Essentials",
    color: "from-purple-700 to-green-500",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-80`}></div>
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl text-white hero-animation">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8">{slide.description}</p>
              <Link href={slide.link}>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 group">
                  {slide.cta}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
