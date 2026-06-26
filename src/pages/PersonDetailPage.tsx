import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import { Toast } from '../components/Toast'
import { TransactionItem } from '../components/TransactionItem'
import { addTransaction } from '../db/balances'
import {
  useCategories,
  useCurrency,
  usePerson,
  usePersonBalance,
  usePersonTransactions,
} from '../hooks/useBalances'
import { formatMoney } from '../lib/formatMoney'
import type { SettleDirection } from '../types'

export function PersonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const currency = useCurrency()
  const person = usePerson(id!)
  const balance = usePersonBalance(id!)
  const transactions = usePersonTransactions(id!)
  const categories = useCategories()

  const [showSettle, setShowSettle] = useState(false)
  const [settleAmount, setSettleAmount] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const categoriesMap = new Map(categories.map((c) => [c.id, c]))

  if (!person) {
    return (
      <Layout title="Person">
        <EmptyState
          title="Person not found"
          description="This person may have been removed."
          action={
            <Link
              to="/people"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              Back to people
            </Link>
          }
        />
      </Layout>
    )
  }

  const settleDirection: SettleDirection | null =
    balance > 0 ? 'received' : balance < 0 ? 'paid' : null

  async function handleSettle(e: React.FormEvent) {
    e.preventDefault()
    if (!settleDirection) return

    const parsed = parseFloat(settleAmount)
    if (!parsed || parsed <= 0) {
      setToast({ message: 'Enter a valid amount', type: 'error' })
      return
    }

    if (parsed > Math.abs(balance)) {
      setToast({
        message: `Amount cannot exceed ${formatMoney(Math.abs(balance), currency)}`,
        type: 'error',
      })
      return
    }

    await addTransaction({
      type: 'settle',
      amount: parsed,
      date: new Date().toISOString().slice(0, 10),
      personId: id!,
      settleDirection,
      note:
        settleDirection === 'received'
          ? `Payment from ${person!.name}`
          : `Payment to ${person!.name}`,
    })

    setSettleAmount('')
    setShowSettle(false)
    setToast({ message: 'Settlement recorded', type: 'success' })
  }

  return (
    <Layout
      title={person.name}
      action={
        <button
          type="button"
          onClick={() => navigate('/people')}
          className="text-sm font-medium text-emerald-600"
        >
          Back
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

      <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-medium text-slate-500">
          {balance === 0
            ? 'All settled'
            : balance > 0
              ? `${person.name} owes you`
              : `You owe ${person.name}`}
        </p>
        <p
          className={`mt-1 text-3xl font-bold ${
            balance > 0
              ? 'text-emerald-600'
              : balance < 0
                ? 'text-amber-600'
                : 'text-slate-400'
          }`}
        >
          {formatMoney(Math.abs(balance), currency)}
        </p>

        {balance !== 0 && (
          <button
            type="button"
            onClick={() => {
              setShowSettle(true)
              setSettleAmount(String(Math.abs(balance)))
            }}
            className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Settle up
          </button>
        )}
      </div>

      {showSettle && settleDirection && (
        <form
          onSubmit={handleSettle}
          className="mb-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200"
        >
          <p className="mb-3 text-sm font-medium text-emerald-800">
            {settleDirection === 'received'
              ? `Record payment received from ${person.name}`
              : `Record payment made to ${person.name}`}
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={settleAmount}
              onChange={(e) => setSettleAmount(e.target.value)}
              className="flex-1 rounded-xl border border-emerald-200 bg-white px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowSettle(false)}
              className="rounded-xl px-3 py-2 text-sm text-slate-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Ledger
      </h2>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="Lend or borrow money with this person to see entries here."
        />
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              currency={currency}
              person={person}
              category={tx.categoryId ? categoriesMap.get(tx.categoryId) : undefined}
              showDate
            />
          ))}
        </div>
      )}
    </Layout>
  )
}
