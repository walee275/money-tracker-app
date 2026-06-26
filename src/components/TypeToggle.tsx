import type { TransactionType } from '../types'

const TYPES: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'lend', label: 'Lent' },
  { value: 'borrow', label: 'Borrowed' },
]

interface TypeToggleProps {
  value: TransactionType
  onChange: (type: TransactionType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TYPES.map(({ value: type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
            value === type
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function needsPerson(type: TransactionType): boolean {
  return type === 'lend' || type === 'borrow'
}

export function needsCategory(type: TransactionType): boolean {
  return type === 'expense' || type === 'income'
}
