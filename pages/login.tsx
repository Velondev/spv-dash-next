import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
)

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({
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
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      height: '100vh', background: '#f0f0f0'
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)', width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '0.5rem',
            background: loading ? '#ccc' : '#667eea',
            color: 'white', border: 'none', borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Einloggen...' : 'Einloggen'}
        </button>
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Noch keinen Account? <a href="/signup">Registrieren</a>
        </p>
      </div>
    </div>
  )
}
