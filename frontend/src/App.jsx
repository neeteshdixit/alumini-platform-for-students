import Auth from './pages/Auth'
import Landing from './pages/Landing'
import Mentorship from './pages/Mentorship'

function App() {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/'

  if (pathname === '/auth' || pathname === '/login' || pathname === '/signup') {
    return <Auth />
  }

  if (pathname === '/mentorship' || pathname.startsWith('/mentorship/')) {
    return <Mentorship />
  }

  return <Landing />
}

export default App
