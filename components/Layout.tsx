import { ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Training', href: '/training' },
  { label: 'Events', href: '/events' },
  { label: 'Analyse', href: '/analyse' },
  { label: 'Kalender', href: '/kalender' },
  { label: 'Inbox', href: '/inbox' },
  { label: 'Community', href: '/community' },
  { label: 'Nutrition', href: '/nutrition' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-700 to-green-300 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-extrabold mb-8">SPVL AI Coaching</h1>
          <nav className="space-y-4">
            {sidebarLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block py-1 px-2 rounded hover:bg-white hover:text-green-700 transition-all cursor-pointer ${
                    router.pathname === link.href ? 'bg-white text-green-700 font-semibold' : ''
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/coach-avatar.jpg"
                alt="Coach Adam"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div>
                <div className="font-bold text-sm">Coach Adam</div>
                <div className="w-2 h-2 bg-green-400 rounded-full mt-1" />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 bg-white text-green-700 px-3 py-1 rounded text-sm hover:bg-green-100 transition-all"
            >
              Logout
            </button>
          </div>
          {/* ASK THE COACH Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-chart-3 hover:bg-chart-3/80 text-white font-extrabold text-lg px-6 py-3 rounded-full shadow-custom-lg transition-all"
          onClick={() => alert('Coach Chat öffnet sich hier später!')}
        >
          ASK THE COACH
        </button>
      </div>
        </div>
      </aside>

{/* Main content with header */}
<div className="flex-1 bg-background text-foreground">
  {/* Top Header */}
  <header className="flex justify-between items-center px-6 py-4 border-b border-border shadow-sm">
    <input
      type="text"
      placeholder="🔍 Search"
      className="w-1/3 px-4 py-2 rounded-lg border border-input bg-muted text-foreground placeholder-gray-500"
    />
    <div className="flex items-center space-x-6">
      <i className="fas fa-bell text-xl text-muted-foreground cursor-pointer"></i>
      <div className="w-10 h-10 bg-muted text-center leading-10 rounded-full font-bold text-lg text-foreground">
        P
      </div>
    </div>
  </header>

  {/* Page Content */}
  <main className="p-6 overflow-auto">{children}</main>
</div>
  )
}
