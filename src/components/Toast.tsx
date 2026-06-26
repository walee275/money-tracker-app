interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div
      className={`fixed left-4 right-4 z-[100] mx-auto max-w-lg rounded-xl px-4 py-3 text-sm font-medium shadow-lg top-[calc(env(safe-area-inset-top,0px)+1rem)] ${
        type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-red-600 text-white'
      }`}
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 opacity-80 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
