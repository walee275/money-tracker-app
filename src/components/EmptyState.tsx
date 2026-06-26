interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
        💰
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
