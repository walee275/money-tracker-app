import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import './index.css'
import App from './App.tsx'

async function initNativeShell() {
  if (!Capacitor.isNativePlatform()) return

  try {
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#059669' })
  } catch {
    // Status bar plugin may be unavailable in some WebView builds
  }
}

initNativeShell()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
