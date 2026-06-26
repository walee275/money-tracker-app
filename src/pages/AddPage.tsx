import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Toast } from '../components/Toast'
import {
  needsCategory,
  needsPerson,
  TypeToggle,
} from '../components/TypeToggle'
import { addPerson, addTransaction } from '../db/balances'
import {
  useCategories,
  useCurrency,
  usePeople,
} from '../hooks/useBalances'
import { todayISO } from '../lib/formatMoney'
import type { TransactionType } from '../types'

export function AddPage() {
  const navigate = useNavigate()
  const currency = useCurrency()
  const categories = useCategories()
  const people = usePeople()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [personId, setPersonId] = useState('')
  const [newPersonName, setNewPersonName] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const parsedAmount = parseFloat(amount)
    if (!parsedAmount || parsedAmount <= 0) {
      setToast({ message: 'Enter a valid amount greater than 0', type: 'error' })
      return
    }

    if (needsPerson(type) && !personId && !newPersonName.trim()) {
      setToast({ message: 'Select or add a person for this transaction', type: 'error' })
      return
    }

    setSaving(true)
    try {
      let resolvedPersonId = personId || undefined

      if (needsPerson(type) && !resolvedPersonId && newPersonName.trim()) {
        resolvedPersonId = await addPerson(newPersonName.trim())
      }

      await addTransaction({
        type,
        amount: parsedAmount,
        date,
        note: note.trim() || undefined,
        categoryId: needsCategory(type) ? categoryId || undefined : undefined,
        personId: needsPerson(type) ? resolvedPersonId : undefined,
      })

      setToast({ message: 'Transaction saved', type: 'success' })
      setAmount('')
      setNote('')
      setNewPersonName('')
      setTimeout(() => navigate('/'), 600)
    } catch {
      setToast({ message: 'Failed to save transaction', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout title="Add transaction">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Type
          </label>
          <TypeToggle value={type} onChange={setType} />
        </div>

        <div>
          <label htmlFor="amount" className="mb-2 block text-sm font-medium text-slate-700">
            Amount ({currency})
          </label>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-2xl font-bold text-slate-900 outline-none ring-emerald-500 focus:ring-2"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>

        {needsCategory(type) && (
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {needsPerson(type) && (
          <div className="space-y-3">
            <div>
              <label htmlFor="person" className="mb-2 block text-sm font-medium text-slate-700">
                Person
              </label>
              <select
                id="person"
                value={personId}
                onChange={(e) => {
                  setPersonId(e.target.value)
                  if (e.target.value) setNewPersonName('')
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
              >
                <option value="">Select person</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </div>
            {!personId && (
              <div>
                <label htmlFor="newPerson" className="mb-2 block text-sm font-medium text-slate-700">
                  Or add new person
                </label>
                <input
                  id="newPerson"
                  type="text"
                  placeholder="Name"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
                />
              </div>
            )}
          </div>
        )}

        <div>
          <label htmlFor="note" className="mb-2 block text-sm font-medium text-slate-700">
            Note (optional)
          </label>
          <input
            id="note"
            type="text"
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-emerald-600 py-4 text-base font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save transaction'}
        </button>
      </form>
    </Layout>
  )
}
