interface SummaryCardProps {
  label: string
  amount: string
  variant?: 'default' | 'positive' | 'negative' | 'warning'
}

const variantStyles = {
  default: 'bg-white border-slate-200',
  positive: 'bg-emerald-50 border-emerald-200',
  negative: 'bg-red-50 border-red-200',
  warning: 'bg-amber-50 border-amber-200',
}

const amountStyles = {
  default: 'text-slate-900',
  positive: 'text-emerald-700',
  negative: 'text-red-600',
  warning: 'text-amber-700',
}

export function SummaryCard({
  label,
  amount,
  variant = 'default',
}: SummaryCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${variantStyles[variant]}`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${amountStyles[variant]}`}>
        {amount}
      </p>
    </div>
  )
}
