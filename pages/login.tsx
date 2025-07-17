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
    <div className="login-container animate-fade-in">
      {/* Left Side – Brand Section */}
      <div className="login-brand-section">
        <h1 className="text-4xl font-bold mb-4 animate-slide-down">
          spvl <span className="text-sm opacity-90">AI + COACHING</span>
        </h1>
        
        <div className="flex space-x-4 mb-6 animate-slide-up">
          <span className="icon-container chart-1 will-change-transform hover:scale-110 transition-transform duration-200">
            📊
          </span>
          <span className="icon-container chart-4 will-change-transform hover:scale-110 transition-transform duration-200">
            ❤️
          </span>
          <span className="icon-container chart-2 will-change-transform hover:scale-110 transition-transform duration-200">
            ⬆️
          </span>
        </div>
        
        <h2 className="text-2xl font-semibold text-center animate-slide-up">
          Radsport-Coaching<br />neu gedacht!
        </h2>
        
        <p className="text-sm mt-4 text-center max-w-xs text-primary-foreground/80 animate-slide-up">
          Mollit cupidatat consequat ipsum et quis aute sit ipsum culpa exceptur sunt. 
          Commodo ut est consequat reprehenderit.
        </p>
        
        {/* Background Decorations */}
        <div className="bg-decoration-1 animate-pulse-gentle"></div>
        <div className="bg-decoration-2 animate-bounce-gentle"></div>
      </div>

      {/* Right Side – Login Form */}
      <div className="login-form-section">
        <div className="login-card animate-slide-left">
          <h2 className="text-2xl font-bold text-center">Log in</h2>
          <p className="text-sm text-center text-muted-foreground mt-1 mb-6">
            Willkommen zurück bei SPVL
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label className="block text-sm text-muted-foreground mb-1">
                E-Mail
              </label>
              <input
                type="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input focus-ring"
                required
                autoComplete="email"
                aria-label="E-Mail Adresse"
              />
            </div>
            
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm text-muted-foreground mb-1">
                Passwort
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input focus-ring"
                required
                autoComplete="current-password"
                aria-label="Passwort"
              />
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary w-full ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label={loading ? 'Einloggen läuft...' : 'Einloggen'}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg 
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Einloggen...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
            
            {error && (
              <div 
                className="text-destructive text-sm text-center mt-2 p-2 bg-destructive/10 rounded-md animate-slide-down"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
          </form>

          <p className="text-sm text-center text-muted-foreground mt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Neu bei SPVL?{' '}
            <a 
              href="/signup" 
              className="text-primary hover:underline focus-ring rounded transition-colors duration-200"
            >
              Jetzt registrieren
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

