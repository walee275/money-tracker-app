import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { seedDatabase } from './db/balances'
import { AddPage } from './pages/AddPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { PeoplePage } from './pages/PeoplePage'
import { PersonDetailPage } from './pages/PersonDetailPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedDatabase().finally(() => setReady(true))
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:id" element={<PersonDetailPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </HashRouter>
  )
}

export default App
