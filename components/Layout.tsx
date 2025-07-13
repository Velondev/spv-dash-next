import Link from 'next/link'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div>
      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.link}>Dashboard</Link>
        <Link href="/training" style={styles.link}>Training</Link>
        <Link href="/feedback" style={styles.link}>Feedback</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </nav>
      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  )
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between',
    padding: '1rem 2rem', background: '#333', color: '#fff'
  },
  link: {
    color: '#fff', marginRight: '1rem', textDecoration: 'none'
  },
  logout: {
    background: '#e53e3e', color: '#fff', border: 'none',
    padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer'
  }
}