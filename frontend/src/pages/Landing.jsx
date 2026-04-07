import CTA from '../components/CTA'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Testimonials from '../components/Testimonials'

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
