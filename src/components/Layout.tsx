import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  title?: string
  action?: ReactNode
}

export function Layout({ children, title, action }: LayoutProps) {
  return (
    <div className="mx-auto min-h-full max-w-lg pb-24">
      {(title || action) && (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/95 px-4 py-4 backdrop-blur-sm">
          {title ? (
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          ) : (
            <div />
          )}
          {action}
        </header>
      )}
      <main className="px-4 py-4">{children}</main>
    </div>
  )
}
