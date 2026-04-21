import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './index.css'
import App from './App.jsx'
import { SocketProvider } from './contexts/SocketContext.jsx'
import ThemeBootstrap from './components/ui/ThemeBootstrap.jsx'
import RealtimeBridge from './components/ui/RealtimeBridge.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <ThemeBootstrap>
            <RealtimeBridge />
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: '16px',
                  padding: '12px 14px',
                  fontWeight: 600,
                },
              }}
            />
          </ThemeBootstrap>
        </SocketProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
