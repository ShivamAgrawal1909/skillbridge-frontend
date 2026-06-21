import Navbar from '@/components/layout/Navbar'
import Hero from '@/components/landing/Hero'
import Categories from '@/components/landing/Categories'
import HowItWorks from '@/components/landing/HowItWorks'
import StatsBar from '@/components/landing/StatsBar'
import CTASection from '@/components/landing/CTASection'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <StatsBar />
      <CTASection />
    </main>
  )
}