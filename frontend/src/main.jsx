import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  const root = document.getElementById('root')
  root.innerHTML = `
    <div style="min-height:100svh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;padding:24px;text-align:center;background:#050816;color:#fff">
      <div>
        <h1 style="font-size:1.25rem;margin:0 0 8px">Missing Clerk key</h1>
        <p style="margin:0;opacity:.7;max-width:28rem;line-height:1.5">
          Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your environment
          (Vercel → Project → Settings → Environment Variables), then redeploy.
        </p>
      </div>
    </div>
  `
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
