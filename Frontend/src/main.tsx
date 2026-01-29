import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure light mode is the default
// Check localStorage for saved theme preference, default to light if not set
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  // Default to light mode - remove dark class if present
  document.documentElement.classList.remove('dark')
  // Save light mode preference
  localStorage.setItem('theme', 'light')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
