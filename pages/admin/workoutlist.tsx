// pages/admin/workoutlist.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/router'
import { XMLParser } from 'fast-xml-parser'

import dynamic from 'next/dynamic'
const WorkoutChart = dynamic(() => import('../../components/WorkoutChart'), { ssr: false })

type Workout = {
  id: string
  title: string
  description: string
  created_at: string
  is_active: boolean
  zwo_content: string
}

type ParsedWorkout = Workout & {
  durationMin: number
  intensityFactor: number
  zwoRaw?: string
}

export default function WorkoutList() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState<ParsedWorkout[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, title, description, created_at, is_active, zwo_content')
        .order('created_at', { ascending: false })

      if (error || !data) {
        console.error('Fehler beim Laden der Workouts:', error?.message)
        setLoading(false)
        return
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        parseAttributeValue: true
      })

      const enriched = data.map((w) => {
        let totalSeconds = 0
        let weightedPower = 0

try {
    const obj = parser.parse(w.zwo_content)
    const segments = obj?.workout_file?.workout || {}

    for (const [tag, segment] of Object.entries(segments)) {
      const items = Array.isArray(segment) ? segment : [segment]

      items.forEach((item: any) => {
        const repeat = Number(item.Repeat) || Number(item.repeat) || 0

        // Normale Blöcke
        const d = Number(item.Duration) || Number(item.duration) || 0
        const p =
          Number(item.Power) ||
          Number(item.power) ||
          Number(item.PowerLow) || 0

        // Intervall-Blöcke
        const onDuration = Number(item.OnDuration) || 0
        const offDuration = Number(item.OffDuration) || 0
        const onPower = Number(item.OnPower) || 0
        const offPower = Number(item.OffPower) || 0

        let blockSeconds = 0
        let blockWeighted = 0

        if (repeat > 0 && (onDuration > 0 || offDuration > 0)) {
          const intervalSeconds = (onDuration + offDuration) * repeat
          const intervalWeighted =
            (onDuration * onPower + offDuration * offPower) * repeat

          blockSeconds += d + intervalSeconds
          blockWeighted += d * p + intervalWeighted
        } else if (d > 0) {
          blockSeconds += d
          blockWeighted += d * p
        }

        totalSeconds += blockSeconds
        weightedPower += blockWeighted
      })
    }
  } catch (e) {
    console.warn('Parsing-Fehler:', e)
  }

  return {
    ...w,
    durationMin: totalSeconds ? Math.round(totalSeconds / 60) : 0,
    intensityFactor: totalSeconds
      ? +(weightedPower / totalSeconds).toFixed(2)
      : 0,
      zwoRaw: w.zwo_content
  }
})

      setWorkouts(enriched)
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
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-custom-lg">
      <h1 className="text-2xl font-bold mb-6">Workoutliste (Admin)</h1>

{loading ? (
  <p>Lade Workouts…</p>
) : (
  <>
  <table className="w-full text-left text-sm">
  <thead>
    <tr>
      <th className="py-2">Titel</th>
      <th>Beschreibung</th>
      <th>Dauer (min)</th>
      <th>IF</th>
      <th>Erstellt</th>
      <th>Aktiv</th>
      <th></th>
      <th>Vorschau</th> {/* Neu */}
    </tr>
  </thead>
  <tbody>
    {workouts.map((w) => (
      <tr key={w.id} className="border-t">
        <td className="py-2">{w.title}</td>
        <td>{w.description}</td>
        <td>{w.durationMin}</td>
        <td>{w.intensityFactor}</td>
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
        <td>
          <button
            onClick={() => setSelectedWorkoutId(w.id)}
            className="btn-sm text-blue-500"
          >
            Anzeigen
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    {/* Workout Vorschau (z.B. Chart) */}
    {selectedWorkoutId && (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Workout Vorschau</h2>
     <WorkoutChart zwo={workouts.find(w => w.id === selectedWorkoutId)?.zwoRaw || ''} />
      )}
    </div>
  </>
  )}
  </div>
)
}
