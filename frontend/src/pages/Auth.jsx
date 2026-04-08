import AuthCard from '../components/auth/AuthCard'
import AuthFooter from '../components/auth/AuthFooter'
import AuthTrustLogos from '../components/auth/AuthTrustLogos'

function Auth() {
  return (
    <div className="bg-background text-on-background transition-colors duration-300 dark:bg-slate-950">
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        <div className="pointer-events-none absolute top-[-10%] right-[-5%] h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] h-96 w-96 rounded-full bg-secondary-container/10 blur-3xl" />

        <div className="z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tighter text-primary dark:text-white">
              AlumniConnect
            </h1>
            <p className="mt-2 text-sm font-medium tracking-wide text-on-surface-variant uppercase dark:text-slate-400">
              The Digital Curator
            </p>
          </div>

          <AuthCard />
          <AuthTrustLogos />
        </div>
      </main>

      <AuthFooter />
    </div>
  )
}

export default Auth
