import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Linke Seite – Stil laut Signup-Design */}
      <div className="hidden md:flex w-1/2 bg-primary text-primary-foreground flex-col justify-center items-center px-10 relative overflow-hidden">
        <h1 className="text-4xl font-bold mb-4">spvl <span className="text-sm">AI + COACHING</span></h1>
        <div className="flex space-x-4 mb-6">
          <span className="bg-[hsl(var(--chart-1))] w-12 h-12 rounded-full flex items-center justify-center text-2xl">📊</span>
          <span className="bg-[hsl(var(--chart-4))] w-12 h-12 rounded-full flex items-center justify-center text-2xl">❤️</span>
          <span className="bg-[hsl(var(--chart-2))] w-12 h-12 rounded-full flex items-center justify-center text-2xl">⬆️</span>
        </div>
        <h2 className="text-2xl font-semibold text-center">Radsport-Coaching<br />neu gedacht!</h2>
        <p className="text-sm mt-4 text-center max-w-xs text-primary-foreground/80">
          Mollit cupidatat consequat ipsum et quis aute sit ipsum culpa exceptur sunt. Commodo ut est consequat reprehenderit.
        </p>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-border rounded-full opacity-20"></div>
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-muted rounded-full opacity-10"></div>
      </div>

      {/* Rechte Seite – Login Box */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-8">
        <div className="bg-card text-card-foreground w-full max-w-md p-8 rounded-2xl shadow-xl border border-border">
          <h2 className="text-2xl font-bold text-center">Log in</h2>
          <p className="text-sm text-center text-muted-foreground mt-1 mb-6">Willkommen zurück bei SPVL</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-muted-foreground">E-Mail</label>
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-ring focus:border-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground">Passwort</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:ring-ring focus:border-ring"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded-md font-semibold transition ${
                loading ? 'bg-muted cursor-not-allowed' : 'bg-primary hover:bg-[hsl(var(--chart-3))]'
              }`}
            >
              {loading ? 'Einloggen...' : 'Login'}
            </button>
            {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4">
            Neu bei SPVL?{' '}
            <a href="/signup" className="text-primary hover:underline">
              Jetzt registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
