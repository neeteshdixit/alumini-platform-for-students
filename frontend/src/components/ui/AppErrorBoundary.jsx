import { Component } from 'react'
import { Link } from 'react-router-dom'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: null,
      hasError: false,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      error,
      hasError: true,
    }
  }

  componentDidCatch(error, info) {
    console.error('App error boundary caught a render error:', error, info)
  }

  handleRetry = () => {
    this.setState({
      error: null,
      hasError: false,
    })

    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-800">
              Something broke
            </p>
            <h1 className="mt-3 text-3xl font-black text-blue-950">
              We hit a routing or render error.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The app caught an unexpected issue instead of showing a blank screen.
              Refresh the page or jump back to the dashboard to continue.
            </p>

            {this.state.error?.message ? (
              <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm text-slate-700">
                {this.state.error.message}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-bold text-white"
                onClick={this.handleRetry}
                type="button"
              >
                Reload app
              </button>
              <Link
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700"
                to="/dashboard"
              >
                Go to dashboard
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
