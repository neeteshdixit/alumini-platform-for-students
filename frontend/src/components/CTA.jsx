function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-8">
        <div className="editorial-gradient relative overflow-hidden rounded-[3rem] p-16 text-center text-on-primary">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <span
              className="material-symbols-outlined text-[12rem]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-8 text-5xl leading-tight font-black tracking-tighter">
              Ready to re-connect with your legacy?
            </h2>
            <p className="font-body mb-12 text-xl opacity-80">
              Join the most prestigious network in higher education. Available exclusively
              for your institution&apos;s family.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button
                className="rounded-2xl bg-white px-10 py-5 text-lg font-bold text-primary transition-all hover:-translate-y-1 hover:shadow-2xl"
                type="button"
              >
                Start Your Application
              </button>
              <button
                className="rounded-2xl bg-primary-container px-10 py-5 text-lg font-bold text-white transition-all hover:bg-blue-800"
                type="button"
              >
                Explore University List
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
