import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import { Toast } from '../components/Toast'
import { addPerson } from '../db/balances'
import { useCurrency, usePersonBalances } from '../hooks/useBalances'
import { formatMoney } from '../lib/formatMoney'

export function PeoplePage() {
  const currency = useCurrency()
  const personBalances = usePersonBalances()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  async function handleAddPerson(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    await addPerson(trimmed)
    setName('')
    setShowAdd(false)
    setToast('Person added')
  }

  return (
    <Layout
      title="People"
      action={
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Add
        </button>
      }
    >
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}

      {showAdd && (
        <form
          onSubmit={handleAddPerson}
          className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
        >
          <label htmlFor="personName" className="mb-2 block text-sm font-medium text-slate-700">
            Name
          </label>
          <div className="flex gap-2">
            <input
              id="personName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none ring-emerald-500 focus:ring-2"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {personBalances.length === 0 ? (
        <EmptyState
          title="No people yet"
          description="Add people to track money you lent or borrowed."
        />
      ) : (
        <div className="space-y-2">
          {personBalances.map(({ person, balance }) => (
            <Link
              key={person.id}
              to={`/people/${person.id}`}
              className="flex items-center justify-between rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100 hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-500">
                  {balance === 0
                    ? 'Settled up'
                    : balance > 0
                      ? 'Owes you'
                      : 'You owe'}
                </p>
              </div>
              <p
                className={`text-lg font-bold ${
                  balance > 0
                    ? 'text-emerald-600'
                    : balance < 0
                      ? 'text-amber-600'
                      : 'text-slate-400'
                }`}
              >
                {formatMoney(Math.abs(balance), currency)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  )
}
