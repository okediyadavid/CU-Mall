import { Suspense } from 'react'
import HomeContent from "@/components/home/HomeContent"
import HomeLoading from './loading'
import MainLayout from "@/components/layout/MainLayout"

export default function Home() {
  return (
    <MainLayout>
      <Suspense fallback={<HomeLoading />}>
        <HomeContent />
      </Suspense>
    </MainLayout>
  )
}
