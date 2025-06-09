"use client"

import dynamic from 'next/dynamic'
import { HeroSectionLoading, CategorySectionLoading, ProductSectionLoading } from './LoadingStates'

// Dynamically import components with loading states
const HeroSection = dynamic(() => import("./HeroSection"), {
    loading: () => <HeroSectionLoading />,
    ssr: false
})

const CategorySection = dynamic(() => import("./CategorySection"), {
    loading: () => <CategorySectionLoading />,
    ssr: false
})

const FeaturedProducts = dynamic(() => import("./FeaturedProducts"), {
    loading: () => <ProductSectionLoading />,
    ssr: false
})

const TrendingProducts = dynamic(() => import("./TrendingProducts"), {
    loading: () => <ProductSectionLoading />,
    ssr: false
})

const NewArrivals = dynamic(() => import("./NewArrivals"), {
    loading: () => <ProductSectionLoading />,
    ssr: false
})

const WhyChooseUs = dynamic(() => import("./WhyChooseUs"), {
    loading: () => <ProductSectionLoading />,
    ssr: false
})

const FAQ = dynamic(() => import("./FAQ"), {
    loading: () => <ProductSectionLoading />,
    ssr: false
})

export default function HomeContent() {
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