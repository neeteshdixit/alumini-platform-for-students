import CTA from '../components/landing/CTA'
import CollegeSelector from '../components/CollegeSelector'
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
        <section className="bg-surface px-6 pb-12 md:px-8" id="college-selector">
          <div className="mx-auto w-full max-w-5xl -translate-y-10 md:-translate-y-14">
            <CollegeSelector />
          </div>
        </section>
        <Features />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default Landing
