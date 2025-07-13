import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
      } else {
        setUser(session.user)
      }
    }
    getUser()
  }, [])

  if (!user) return null

  return (
    <Layout>
      <h1>Willkommen im Dashboard, {user.email}!</h1>
      <p>Hier wird dein Trainingsfortschritt angezeigt.</p>
    </Layout>
  )
}