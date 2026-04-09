import { useMemo, useState } from 'react'

const testimonials = [
  {
    id: 'marcus',
    quote:
      "AlumniConnect isn't just a directory. It's a bridge between generations, and we've hired directly through it.",
    name: 'Marcus Chen',
    subtitle: "Class of '04 | Founder, Nexus Tech",
  },
  {
    id: 'sarah',
    quote:
      'As a graduating senior, real-time alumni chat gave me direct career guidance and internship referrals.',
    name: 'Sarah Jenkins',
    subtitle: "Class of '24 | Marketing Intern",
  },
  {
    id: 'anika',
    quote:
      'Mentorship matching helped me connect with leaders from my own college and build confidence quickly.',
    name: 'Anika Verma',
    subtitle: "Class of '23 | Software Engineer",
  },
]

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const current = testimonials[activeIndex]
  const next = useMemo(() => {
    return testimonials[(activeIndex + 1) % testimonials.length]
  }, [activeIndex])

  const goPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="bg-surface py-24">
      <div className="container mx-auto px-8">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-5xl font-black tracking-tighter text-primary">
              Voices of the Legacy
            </h2>
            <p className="text-on-surface-variant">
              Real feedback from students and alumni using the platform.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              aria-label="Previous testimonials"
              className="rounded-full border border-outline-variant/10 bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
              onClick={goPrevious}
              type="button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              aria-label="Next testimonials"
              className="rounded-full bg-primary p-4 text-on-primary transition-colors hover:bg-primary-container"
              onClick={goNext}
              type="button"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-3xl bg-primary p-10 text-on-primary md:col-span-2">
            <p className="mb-8 text-2xl leading-tight font-medium">&quot;{current.quote}&quot;</p>
            <div>
              <p className="font-bold">{current.name}</p>
              <p className="text-sm opacity-70">{current.subtitle}</p>
            </div>
          </article>

          <article className="rounded-3xl bg-secondary-container p-8">
            <p className="mb-6 text-lg font-medium text-on-secondary-container">
              &quot;{next.quote}&quot;
            </p>
            <p className="font-bold text-on-secondary-container">{next.name}</p>
            <p className="text-xs text-on-secondary-container/70">{next.subtitle}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
