import Hero from '@/sections/hero/Hero'
import Categories from '@/sections/categories/Categories'
import Offers from '@/sections/offers/Offers'
import FeaturedMenu from '@/sections/featured/FeaturedMenu'
import Testimonials from '@/sections/testimonials/Testimonials'
import About from '@/sections/about/About'
import Features from '@/sections/features/Features'
import InstagramGrid from '@/sections/instagram/InstagramGrid'

// Footer is rendered globally in MainLayout — not needed here

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Offers />
      <FeaturedMenu />
      <Testimonials />
      <About />
      <Features />
      <InstagramGrid />
    </>
  )
}
