import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Mentorship from './pages/Mentorship'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Search from './pages/Search'

function App() {
  const pathname =
    typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '/'

  if (
    pathname === '/auth' ||
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    pathname === '/signin' ||
    pathname.startsWith('/signin/') ||
    pathname === '/signup' ||
    pathname.startsWith('/signup/')
  ) {
    return <Auth />
  }

  if (pathname === '/dashboard') {
    return <Dashboard />
  }

  if (pathname === '/profile' || pathname.startsWith('/profile/')) {
    return <Profile />
  }

  if (pathname === '/search' || pathname === '/directory') {
    return <Search />
  }

  if (pathname === '/messages' || pathname.startsWith('/messages/')) {
    return <Messages />
  }

  if (pathname === '/mentorship' || pathname.startsWith('/mentorship/')) {
    return <Mentorship />
  }

  return <Landing />
}

export default App
