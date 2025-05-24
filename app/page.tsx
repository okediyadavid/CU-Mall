import HeroSection from "@/components/home/HeroSection"
import CategorySection from "@/components/home/CategorySection"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import TrendingProducts from "@/components/home/TrendingProducts"
import NewArrivals from "@/components/home/NewArrivals"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import FAQ from "@/components/home/FAQ"

export default function Home() {
  return (
    <div className="pt-20">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <TrendingProducts />
      <NewArrivals />
      <WhyChooseUs />
      <FAQ />
    </div>
  )
}
