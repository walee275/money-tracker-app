import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/add', label: 'Add', icon: AddIcon },
  { to: '/people', label: 'People', icon: PeopleIcon },
  { to: '/history', label: 'History', icon: HistoryIcon },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />
    </svg>
  )
}

function AddIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M12 8v8M8 12h8" />
    </svg>
  )
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-4-4" />
    </svg>
  )
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
