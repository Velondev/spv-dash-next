import { useState } from 'react'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/login')
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
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Registrieren</h2>
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
          onClick={handleSignup}
          disabled={loading}
          style={{
            width: '100%', padding: '0.5rem',
            background: loading ? '#ccc' : '#38a169',
            color: 'white', border: 'none', borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Registrieren...' : 'Registrieren'}
        </button>
        {error && <div style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Bereits registriert? <a href="/login">Hier einloggen</a>
        </p>
      </div>
    </div>
  )
}