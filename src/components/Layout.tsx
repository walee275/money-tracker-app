import type { ReactNode } from 'react'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { scrollFocusedInputIntoView } from '../lib/nativeShell'

interface LayoutProps {
  children: ReactNode
  title?: string
  action?: ReactNode
}

export function Layout({ children, title, action }: LayoutProps) {
  const keyboardInset = useKeyboardInset()

  return (
    <div className="layout-root mx-auto flex h-full max-w-lg flex-col">
      {(title || action) && (
        <header className="layout-header sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-slate-50/95 px-4 pb-4 backdrop-blur-sm">
          {title ? (
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          ) : (
            <div />
          )}
          {action}
        </header>
      )}
      <main
        className="layout-main flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{
          paddingBottom:
            keyboardInset > 0
              ? `${keyboardInset + 96}px`
              : undefined,
        }}
        onFocusCapture={scrollFocusedInputIntoView}
      >
        {children}
      </main>
    </div>
  )
}
