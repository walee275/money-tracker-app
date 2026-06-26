import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { Layout } from '../components/Layout'
import { SummaryCard } from '../components/SummaryCard'
import { TransactionItem } from '../components/TransactionItem'
import {
  useBalances,
  useCategories,
  useCurrency,
  usePeople,
  useRecentTransactions,
} from '../hooks/useBalances'
import { formatMoney } from '../lib/formatMoney'

export function HomePage() {
  const currency = useCurrency()
  const balances = useBalances()
  const recent = useRecentTransactions(5)
  const people = usePeople()
  const categories = useCategories()

  const peopleMap = new Map(people.map((p) => [p.id, p]))
  const categoriesMap = new Map(categories.map((c) => [c.id, c]))

  return (
    <Layout
      title="Money Tracker"
      action={
        <Link
          to="/settings"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Settings"
        >
          <SettingsIcon />
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3">
          <SummaryCard
            label="Cash balance"
            amount={formatMoney(balances.cash, currency)}
            variant={balances.cash >= 0 ? 'default' : 'negative'}
          />
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              label="Owed to me"
              amount={formatMoney(balances.owedToMe, currency)}
              variant="positive"
            />
            <SummaryCard
              label="I owe"
              amount={formatMoney(balances.iOwe, currency)}
              variant="warning"
            />
          </div>
        </div>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Recent
            </h2>
            {recent.length > 0 && (
              <Link
                to="/history"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                See all
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Add your first expense or income to start tracking."
              action={
                <Link
                  to="/add"
                  className="inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Add transaction
                </Link>
              }
            />
          ) : (
            <div className="space-y-2">
              {recent.map((tx) => (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  currency={currency}
                  person={tx.personId ? peopleMap.get(tx.personId) : undefined}
                  category={
                    tx.categoryId ? categoriesMap.get(tx.categoryId) : undefined
                  }
                  showDate
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}

function SettingsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}
