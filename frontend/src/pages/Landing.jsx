import CTA from '../components/landing/CTA'
import Features from '../components/landing/Features'
import Footer from '../components/landing/Footer'
import Hero from '../components/landing/Hero'
import Navbar from '../components/landing/Navbar'
import Testimonials from '../components/landing/Testimonials'

function Landing() {
  return (
    <div className="bg-surface text-on-surface transition-colors duration-300 selection:bg-primary-fixed-dim">
      <Navbar />

      <main className="pt-16">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default Landing
