import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Toast } from '../components/Toast'
import { db } from '../db/database'
import { useCurrency } from '../hooks/useBalances'
import {
  clearAllData,
  downloadExport,
  importData,
} from '../lib/exportImport'
import type { ExportData } from '../types'

export function SettingsPage() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const savedCurrency = useCurrency()
  const [currency, setCurrency] = useState(savedCurrency)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    setCurrency(savedCurrency)
  }, [savedCurrency])

  async function saveCurrency() {
    const trimmed = currency.trim().toUpperCase()
    if (!trimmed) {
      setToast({ message: 'Currency cannot be empty', type: 'error' })
      return
    }
    await db.settings.put({ key: 'currency', value: trimmed })
    setToast({ message: 'Currency saved', type: 'success' })
  }

  async function handleExport() {
    try {
      await downloadExport()
      setToast({ message: 'Backup downloaded', type: 'success' })
    } catch {
      setToast({ message: 'Export failed', type: 'error' })
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportData
      await importData(data)
      setCurrency(data.settings.currency)
      setToast({ message: 'Backup imported successfully', type: 'success' })
    } catch {
      setToast({ message: 'Invalid backup file', type: 'error' })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleClear() {
    if (
      !confirm(
        'Delete all transactions, people, and categories? This cannot be undone.',
      )
    ) {
      return
    }
    await clearAllData()
    setToast({ message: 'All data cleared', type: 'success' })
  }

  return (
    <Layout
      title="Settings"
      action={
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm font-medium text-emerald-600"
        >
          Done
        </button>
      }
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Currency</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="PKR"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 uppercase outline-none ring-emerald-500 focus:ring-2"
            />
            <button
              type="button"
              onClick={saveCurrency}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Display label only — all amounts use a single currency.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Backup</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleExport}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-red-800">Danger zone</h2>
          <p className="mb-3 text-xs text-red-600">
            Permanently delete all local data from this device.
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            Clear all data
          </button>
        </section>

        <p className="text-center text-xs text-slate-400">
          Data stays on your device. Install via browser menu → Add to Home Screen.
        </p>
      </div>
    </Layout>
  )
}
