import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromotionBanner() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Discount for New Students!</h2>
            <p className="text-lg mb-6">
              Get 15% off on your first order with code <span className="font-bold">NEWSTUDENT15</span>. Stock up on all
              your campus essentials at unbeatable Naira prices.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Shop Now
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="bg-white/10 rounded-lg p-8 max-w-md w-full backdrop-blur-sm scale-in">
              <h3 className="text-2xl font-bold mb-4 text-center">Limited Time Offer</h3>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {["15", "Days", "06", "Hours"].map((item, index) => (
                  <div key={index} className="bg-white/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold">{item}</div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Free delivery to all campus dorms</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Exclusive student discounts</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Easy returns within 7 days</span>
                </li>
              </ul>
              <Link href="/signup">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
