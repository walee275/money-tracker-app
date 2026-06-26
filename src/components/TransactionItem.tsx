import type { Category, Person, Transaction } from '../types'
import { TRANSACTION_TYPE_COLORS, TRANSACTION_TYPE_LABELS } from '../lib/constants'
import { formatDate, formatSignedMoney } from '../lib/formatMoney'

interface TransactionItemProps {
  transaction: Transaction
  currency: string
  person?: Person
  category?: Category
  showDate?: boolean
}

export function TransactionItem({
  transaction,
  currency,
  person,
  category,
  showDate = false,
}: TransactionItemProps) {
  const signedAmount = getSignedAmount(transaction)

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: category?.color ?? '#64748b' }}
      >
        {category?.name.charAt(0) ?? typeInitial(transaction.type)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-slate-900">
          {transaction.note ||
            person?.name ||
            TRANSACTION_TYPE_LABELS[transaction.type]}
        </p>
        <p className="truncate text-sm text-slate-500">
          {showDate && `${formatDate(transaction.date)} · `}
          {TRANSACTION_TYPE_LABELS[transaction.type]}
          {person && transaction.note ? ` · ${person.name}` : ''}
          {category ? ` · ${category.name}` : ''}
        </p>
      </div>
      <p
        className={`shrink-0 text-sm font-semibold ${TRANSACTION_TYPE_COLORS[transaction.type]}`}
      >
        {formatSignedMoney(signedAmount, currency)}
      </p>
    </div>
  )
}

function getSignedAmount(transaction: Transaction): number {
  switch (transaction.type) {
    case 'income':
    case 'borrow':
      return transaction.amount
    case 'expense':
    case 'lend':
      return -transaction.amount
    case 'settle':
      return transaction.settleDirection === 'received'
        ? transaction.amount
        : -transaction.amount
    default:
      return transaction.amount
  }
}

function typeInitial(type: Transaction['type']): string {
  return TRANSACTION_TYPE_LABELS[type].charAt(0)
}
