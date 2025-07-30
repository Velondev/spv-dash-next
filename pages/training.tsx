
// pages/training.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

type StravaActivity = {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  average_power: number
  max_power: number
  weighted_average_watts: number
  kilojoules: number
  average_speed: number
  max_speed: number
  average_cadence: number
  start_date: string
}

export default function Training() {
  const user = useUser()
  const router = useRouter()
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null)
  const [showModal, setShowModal] = useState(false)

  const fetchStravaActivities = async () => {
    try {
      const res = await fetch('/api/strava/activities') // dein API-Router-Endpunkt
      const data = await res.json()
      setActivities(data)
      setShowModal(true)
    } catch (err) {
      console.error('Fehler beim Laden der Aktivitäten', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Trainingseinheiten</h1>
      <button
        onClick={fetchStravaActivities}
        className="btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Strava Sync starten
      </button>

      {selectedActivity && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">{selectedActivity.name}</h2>
          <p><strong>Dauer:</strong> {(selectedActivity.elapsed_time / 60).toFixed(0)} Minuten</p>
          <p><strong>NP:</strong> {selectedActivity.weighted_average_watts} W</p>
          <p><strong>Durchschnittsleistung:</strong> {selectedActivity.average_power} W</p>
          <p><strong>Maximalleistung:</strong> {selectedActivity.max_power} W</p>
          <p><strong>Trittfrequenz:</strong> {selectedActivity.average_cadence}</p>
          <p><strong>Kalorien:</strong> {Math.round(selectedActivity.kilojoules)} kcal</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Letzte Strava-Aktivitäten</h2>
            <ul>
              {activities.map((a) => (
                <li
                  key={a.id}
                  className="py-2 border-b cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setSelectedActivity(a)
                    setShowModal(false)
                  }}
                >
                  {a.name} – {(a.distance / 1000).toFixed(1)} km
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
