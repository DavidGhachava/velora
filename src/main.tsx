import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppDataProvider } from './data/AppDataProvider'
import { AuthProvider } from './auth/AuthProvider'
import { App } from './App'
import { LocaleProvider } from './i18n/LocaleProvider'
import './styles.css'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider><BrowserRouter><AuthProvider><AppDataProvider><App /></AppDataProvider></AuthProvider></BrowserRouter></LocaleProvider>
    </QueryClientProvider>
  </StrictMode>,
)
