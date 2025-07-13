import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (!session || !session.user) {
        router.push('/login')
      } else {
        setUser(session.user)
      }

      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Lade Dashboard...</div>
  if (!user) return null

  return (
    <Layout>
      <h1>Willkommen im Dashboard, {user.email}!</h1>
      <p>Hier wird dein Trainingsfortschritt angezeigt.</p>
    </Layout>
  )
}
