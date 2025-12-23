import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import { ThemeProvider } from './ThemeContext.tsx'

const client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={client} >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
