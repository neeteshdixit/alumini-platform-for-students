const featureCards = [
  {
    id: 'verified-networking',
    icon: 'verified_user',
    iconWrapperClass:
      'mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-container text-primary',
    title: 'Verified Networking',
    description:
      'Exclusive access to a secure database of confirmed graduates, ensuring high-quality professional leads.',
  },
  {
    id: 'real-time-chat',
    icon: 'chat_bubble',
    iconWrapperClass:
      'mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-container text-on-tertiary-container',
    title: 'Real-time Chat',
    description:
      'Instant, secure communication across our global community with intelligent thread management.',
  },
  {
    id: 'mentorship',
    icon: 'school',
    iconWrapperClass:
      'mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-primary-fixed',
    title: 'Mentorship',
    description:
      'Direct lines between seasoned industry veterans and aspiring students to foster a legacy of success.',
  },
]

function Features() {
  return (
    <section className="bg-surface-container-low py-32">
      <div className="container mx-auto px-8">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-primary">
            Designed for Meaningful Connection
          </h2>
          <p className="text-on-surface-variant">
            We&apos;ve replaced the noise of traditional social media with a curated space
            focused on growth and professional excellence.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              className="rounded-3xl bg-surface-container-lowest p-10 transition-all duration-300 hover:translate-y-[-8px]"
              key={feature.id}
            >
              <div className={feature.iconWrapperClass}>
                <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
              </div>
              <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
