
// pages/training.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

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
  // ✅ Auto-Fetch, wenn access_token bereits als Cookie existiert
 useEffect(() => {
  const token = Cookies.get('strava_access_token')
  if (token) {
    fetchStravaActivities()
  }
}, [])


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
  <div className="mt-6 bg-white border border-gray-200 rounded-md shadow-md p-6">
    <h2 className="text-xl font-bold mb-4 text-center">{selectedActivity.name}</h2>

    <div className="grid grid-cols-2 gap-6 text-center mb-6">
      <div>
        <p className="text-sm text-gray-500">NP</p>
        <p className="text-xl font-semibold">{selectedActivity.weighted_average_watts} W</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">IF</p>
        <p className="text-xl font-semibold">–</p> {/* optional später berechenbar */}
      </div>
      <div>
        <p className="text-sm text-gray-500">TSS</p>
        <p className="text-xl font-semibold">–</p> {/* optional später berechenbar */}
      </div>
      <div>
        <p className="text-sm text-gray-500">Verstrichene Zeit</p>
        <p className="text-xl font-semibold">
          {Math.floor(selectedActivity.elapsed_time / 60)}:{(selectedActivity.elapsed_time % 60).toString().padStart(2, '0')}
        </p>
      </div>
    </div>

    <table className="table-auto w-full text-sm text-left border-t pt-4">
      <thead className="text-gray-500">
        <tr>
          <th className="py-2">Metrik</th>
          <th className="py-2">Schnitt</th>
          <th className="py-2">Max</th>
        </tr>
      </thead>
      <tbody className="font-medium">
        <tr className="border-t">
          <td className="py-2">Geschwindigkeit</td>
          <td>{(selectedActivity.average_speed * 3.6).toFixed(1)} km/h</td>
          <td>{(selectedActivity.max_speed * 3.6).toFixed(1)} km/h</td>
        </tr>
        <tr className="border-t">
          <td className="py-2">Trittfrequenz</td>
          <td>{selectedActivity.average_cadence || '–'}</td>
          <td>–</td>
        </tr>
        <tr className="border-t">
          <td className="py-2">Leistung</td>
          <td>{selectedActivity.average_power || '–'} W</td>
          <td>{selectedActivity.max_power || '–'} W</td>
        </tr>
        <tr className="border-t">
          <td className="py-2">Kalorien</td>
          <td>{Math.round(selectedActivity.kilojoules)} kcal</td>
          <td>–</td>
        </tr>
      </tbody>
    </table>
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
