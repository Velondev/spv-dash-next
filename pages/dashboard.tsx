import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
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

  if (loading) return <div className="text-center mt-16">Lade Dashboard...</div>
  if (!user) return null

  const navItems = [
    { icon: 'fa-dumbbell', label: 'Training', href: '/training' },
    { icon: 'fa-comments', label: 'Kommunikation', href: '/kommunikation' },
    { icon: 'fa-star', label: 'Feedback', href: '/feedback' },
    { icon: 'fa-chart-line', label: 'Analyse', href: '/analyse' },
  ]
  
  const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const REDIRECT_URI = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI

  const handleStravaLogin = () => {
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=read,activity:read_all`
    window.location.href = stravaAuthUrl
  }
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-lg text-center mb-10">
          <h1 className="text-3xl font-bold text-indigo-500 flex items-center justify-center gap-3">
            <i className="fas fa-bolt"></i> Speedville Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Willkommen in deinem digitalen Coaching-Portal</p>
          <p className="text-sm text-gray-400">Alle Dashboard-Bereiche im Überblick – Klick auf eine Kachel</p>
        </div>

        {/* Statistiken */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 shadow-lg mb-10">
          <h2 className="text-2xl font-semibold text-center mb-6">Aktuelle Statistiken</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: 'fa-running', label: 'Trainings diese Woche', value: '12' },
              { icon: 'fa-clock', label: 'Gesamtzeit', value: '8h 45min' },
              { icon: 'fa-route', label: 'Gesamtdistanz', value: '125.5km' },
              { icon: 'fa-heart', label: 'Ø Wellness-Score', value: '8.2' },
              { icon: 'fa-lungs', label: 'VO₂max', value: '--' },
              { icon: 'fa-bolt', label: 'FTP', value: '--' },
              { icon: 'fa-balance-scale', label: 'W/kg', value: '--' },
              { icon: 'fa-crosshairs', label: 'Trainingsfokus', value: '--' },
            ].map((item, i) => (
              <div key={i} className="bg-indigo-50 rounded-lg py-6 px-4">
                <div className="text-indigo-500 text-2xl mb-2">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="text-xl font-bold text-gray-800">{item.value}</div>
                <div className="text-gray-500 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reaktive Navigationskacheln */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {navItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="cursor-pointer bg-white/80 hover:bg-white/100 backdrop-blur-md border border-indigo-100 rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
                <div className="text-indigo-500 text-3xl mb-2">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
              </div>
            </Link>
            ))}
          </div>

        {/* Strava Connect Button */}
        <div className="text-center">
          <button
            onClick={handleStravaLogin}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded shadow inline-flex items-center gap-2"
          >
            <i className="fab fa-strava text-xl"></i>
            Strava verbinden
          </button>
        </div>
      </div>
    </Layout>
  )
}
