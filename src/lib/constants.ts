import type { TransactionType } from '../types'

export const DEFAULT_CURRENCY = 'PKR'

export const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#f97316' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Bills', color: '#8b5cf6' },
  { name: 'Other', color: '#64748b' },
] as const

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  expense: 'Expense',
  income: 'Income',
  lend: 'Lent',
  borrow: 'Borrowed',
  settle: 'Settled',
}

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  expense: 'text-red-600',
  income: 'text-emerald-600',
  lend: 'text-amber-600',
  borrow: 'text-blue-600',
  settle: 'text-violet-600',
}
