// pages/admin/workoutlist.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/router'

type Workout = {
  id: string
  title: string
  description: string
  created_at: string
  is_active: boolean
}

export default function WorkoutList() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, title, description, created_at, is_active')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fehler beim Laden der Workouts:', error.message)
      } else {
        setWorkouts(data || [])
      }

      setLoading(false)
    }

    fetchWorkouts()
  }, [])

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from('workouts')
      .update({ is_active: !current })
      .eq('id', id)

    if (error) {
      alert('Fehler beim Umschalten')
    } else {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? { ...w, is_active: !current } : w))
      )
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-custom-lg">
      <h1 className="text-2xl font-bold mb-6">Workoutliste (Admin)</h1>

      {loading ? (
        <p>Lade Workouts…</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Titel</th>
              <th>Erstellt</th>
              <th>Aktiv</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id} className="border-t">
                <td className="py-2">{w.title}</td>
                <td>{new Date(w.created_at).toLocaleDateString()}</td>
                <td>{w.is_active ? '✅' : '—'}</td>
                <td>
                  <button
                    onClick={() => toggleActive(w.id, w.is_active)}
                    className="btn-sm"
                  >
                    {w.is_active ? 'Deaktivieren' : 'Aktivieren'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
