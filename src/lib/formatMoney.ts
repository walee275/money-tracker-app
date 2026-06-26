export function formatMoney(amount: number, currency: string): string {
  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const sign = amount < 0 ? '−' : ''
  return `${sign}${currency} ${formatted}`
}

export function formatSignedMoney(
  amount: number,
  currency: string,
  positivePrefix = '+',
): string {
  if (amount === 0) return formatMoney(0, currency)
  const prefix = amount > 0 ? positivePrefix : '−'
  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  return `${prefix}${currency} ${formatted}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const today = todayISO()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (dateStr === today) return 'Today'
  if (dateStr === yesterdayStr) return 'Yesterday'

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonthYear(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function currentMonthFilter(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
