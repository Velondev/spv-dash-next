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
    <div className="min-h-screen flex">
      {/* Linke Seite – Stil laut Signup-Design */}
      <div className="hidden md:flex w-1/2 bg-[#739d8b] flex-col justify-center items-center text-white px-10 relative overflow-hidden">
        <h1 className="text-4xl font-bold mb-4">spvl <span className="text-sm">AI + COACHING</span></h1>
        <div className="flex space-x-4 mb-6">
          <span className="bg-red-400 w-12 h-12 rounded-full flex items-center justify-center text-2xl">📊</span>
          <span className="bg-yellow-300 w-12 h-12 rounded-full flex items-center justify-center text-2xl">❤️</span>
          <span className="bg-green-400 w-12 h-12 rounded-full flex items-center justify-center text-2xl">⬆️</span>
        </div>
        <h2 className="text-2xl font-semibold text-center">Radsport-Coaching<br />neu gedacht!</h2>
        <p className="text-sm mt-4 text-center max-w-xs">
          Mollit cupidatat consequat ipsum et quis aute sit ipsum culpa exceptur sunt. Commodo ut est consequat reprehenderit.
        </p>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gray-300 rounded-full opacity-20"></div>
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-gray-500 rounded-full opacity-10"></div>
      </div>

      {/* Rechte Seite – Login Box */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-8">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center">Log in</h2>
          <p className="text-sm text-center text-gray-500 mt-1 mb-6">Willkommen zurück bei SPVL</p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm text-gray-700">E-Mail</label>
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Passwort</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded-md font-semibold transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#a86b76] hover:bg-[#8e5660]'
              }`}
            >
              {loading ? 'Einloggen...' : 'Login'}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </form>

          <p className="text-sm text-center text-gray-500 mt-4">
            Neu bei SPVL?{' '}
            <a href="/signup" className="text-[#a86b76] hover:underline">
              Jetzt registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
