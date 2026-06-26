import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import { TransactionItem } from '../components/TransactionItem'
import {
  useAllTransactions,
  useCategories,
  useCurrency,
  usePeople,
} from '../hooks/useBalances'
import { formatDate, formatMonthYear } from '../lib/formatMoney'
import type { TransactionType } from '../types'

const TYPE_FILTERS: { value: '' | TransactionType; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'lend', label: 'Lent' },
  { value: 'borrow', label: 'Borrowed' },
  { value: 'settle', label: 'Settled' },
]

export function HistoryPage() {
  const currency = useCurrency()
  const transactions = useAllTransactions()
  const people = usePeople()
  const categories = useCategories()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'' | TransactionType>('')
  const [monthFilter, setMonthFilter] = useState('')

  const peopleMap = new Map(people.map((p) => [p.id, p]))
  const categoriesMap = new Map(categories.map((c) => [c.id, c]))

  const months = useMemo(() => {
    const set = new Set(transactions.map((tx) => tx.date.slice(0, 7)))
    return Array.from(set).sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim()
    return transactions.filter((tx) => {
      if (typeFilter && tx.type !== typeFilter) return false
      if (monthFilter && !tx.date.startsWith(monthFilter)) return false
      if (!query) return true

      const person = tx.personId ? peopleMap.get(tx.personId) : undefined
      const category = tx.categoryId ? categoriesMap.get(tx.categoryId) : undefined
      const haystack = [
        tx.note,
        person?.name,
        category?.name,
        tx.type,
        tx.date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [transactions, typeFilter, monthFilter, search, peopleMap, categoriesMap])

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof filtered>()
    for (const tx of filtered) {
      const key = tx.date
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(tx)
    }
    return Array.from(groups.entries())
  }, [filtered])

  return (
    <Layout title="History">
      <div className="mb-4 space-y-3">
        <input
          type="search"
          placeholder="Search notes, people, categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-emerald-500 focus:ring-2"
        />

        <div className="flex gap-2 overflow-x-auto pb-1">
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value || 'all'}
              type="button"
              onClick={() => setTypeFilter(value)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${
                typeFilter === value
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {months.length > 0 && (
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none"
          >
            <option value="">All months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonthYear(month)}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching transactions"
          description="Try changing your filters or add a new transaction."
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, items]) => (
            <section key={date}>
              <h2 className="mb-2 text-sm font-semibold text-slate-500">
                {formatDate(date)}
              </h2>
              <div className="space-y-2">
                {items.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    currency={currency}
                    person={tx.personId ? peopleMap.get(tx.personId) : undefined}
                    category={
                      tx.categoryId ? categoriesMap.get(tx.categoryId) : undefined
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Layout>
  )
}
