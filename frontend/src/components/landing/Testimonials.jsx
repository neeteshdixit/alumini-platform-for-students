function Testimonials() {
  return (
    <section className="bg-surface py-32">
      <div className="container mx-auto px-8">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-xl">
            <h2 className="mb-4 text-5xl font-black tracking-tighter text-primary">
              Voices of the Legacy
            </h2>
            <p className="text-on-surface-variant">
              Join thousands of members who have transformed their careers through the
              AlumniConnect portal.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              aria-label="Previous testimonials"
              className="rounded-full border border-outline-variant/10 bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              aria-label="Next testimonials"
              className="rounded-full bg-primary p-4 text-on-primary transition-colors hover:bg-primary-container"
              type="button"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="grid h-auto gap-6 md:h-[600px] md:grid-cols-4 md:grid-rows-2">
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-primary p-12 text-on-primary md:col-span-2 md:row-span-2">
            <img
              alt="Senior professional portrait backdrop"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 transition-transform duration-1000 group-hover:scale-100"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4pq-6P25nO_8WP0iDWcR3LfE3Je0JHQ0uS4dand8239DDSpHPjnAO-bZv208JeYHSXw-PuDgkGQhrGRSbM1I1EF5owLJ62U-HgPyWJmMcHbnQujQqCpDpMb80BNtZAGlNVprqRZ_VUuz5uu0si9tf06JpYAIZzVZfwi29EmzN717k1-bM8YN5QC1Axu3ZRtZT4tC-7h32SkBAkVkumy0K0_R1Sb9vq-DYdDIVtg1byMcNRv64Q805cemtarNO5UKGKT1uhTeSAVw"
            />

            <div className="relative z-10">
              <span className="material-symbols-outlined mb-8 text-6xl opacity-30">
                format_quote
              </span>
              <p className="text-xl leading-tight font-medium md:text-3xl">
                &quot;AlumniConnect isn&apos;t just a directory; it&apos;s a bridge between
                generations. I&apos;ve found three of my key hires directly through the
                mentorship portal.&quot;
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-primary-container">
                <img
                  alt="Marcus Chen headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1mNebgImc2D8xAwGdGdKrwTM0ZAJhb21-bPHA51DaiAh_EWRhiykzOwVKB1049yHFx_O4WiNqSVPHAy7YILfbL_dKa9aV7isKu9j0nCtaZo_hVJqDGJJdkHv9bjN0Q8EgU0oVAZsegz2PpaDX-GmVn_c4xOouO0xildWwfHHqAc4WnFmqhpH-BmHcKYy264BXmzwUgA6yZ_YMYbH014DboeKZ45cg7wDd9oq4khoLQ1ljDN5blwkuqElcvi3PKZak3AYj-1Ib3Ow"
                />
              </div>
              <div>
                <p className="font-bold">Marcus Chen</p>
                <p className="text-sm opacity-70">Class of &apos;04 | Founder, Nexus Tech</p>
              </div>
            </div>
          </article>

          <article className="flex flex-col justify-between rounded-[2.5rem] bg-secondary-container p-8 md:col-span-2">
            <p className="text-xl font-medium text-on-secondary-container">
              &quot;As a graduating senior, the real-time chat gave me direct access to
              alumni in my dream field. I secured my internship in weeks.&quot;
            </p>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <img
                  alt="Sarah Jenkins headshot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKX_INOEHQ5XzTtKev_xdzkwx8E1zT5T55gifXIQWIFtxTuySSHmyvcYy14TsNLAW4hDYxs7zMVY_-AdLj49lPLWFl9wnOw-pJwLOC5ioB6D2nBSzDRVUe0S_nUpeZg75ehioh5uyzskhM4qzo4NZKMF16DjDIIrxfCSEs83AxYX5UAw7c4RvE59HnNe0LF_EcXkyFoQprOaeOMzANwnnmWomJ1o4at4oAJJXBdoTBRqOGZD7kf8Lx-FFa3nq8JNkHruEirlIF1PQ"
                />
              </div>
              <div>
                <p className="font-bold text-on-secondary-container">Sarah Jenkins</p>
                <p className="text-xs opacity-70 text-on-secondary-container">
                  Class of &apos;24 | Marketing Intern
                </p>
              </div>
            </div>
          </article>

          <article className="flex flex-col items-center justify-center rounded-[2.5rem] bg-surface-container p-8 text-center md:col-span-1">
            <div className="mb-2 text-4xl font-black text-primary">12k+</div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Verified Alumni
            </p>
          </article>

          <article className="flex flex-col items-center justify-center rounded-[2.5rem] bg-surface-container p-8 text-center md:col-span-1">
            <div className="mb-2 text-4xl font-black text-primary">98%</div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Match Rate
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
