// pages/api/strava/activities.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Zugriff auf das access_token im Cookie
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.strava_access_token

  if (!token) {
    return res.status(401).json({ error: 'Nicht authentifiziert mit Strava.' })
  }

  try {
    // 2. Abruf der Aktivitäten von Strava
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        per_page: 10,
      },
    })

    // 3. Filter nur auf Radfahren
    const rides = response.data.filter((act: any) => act.type === 'Ride')

    // 4. Nur relevante Felder extrahieren
    const simplified = rides.map((act: any) => ({
      id: act.id,
      name: act.name,
      distance: act.distance,
      moving_time: act.moving_time,
      elapsed_time: act.elapsed_time,
      total_elevation_gain: act.total_elevation_gain,
      average_power: act.average_watts,
      max_power: act.max_watts,
      weighted_average_watts: act.weighted_average_watts,
      kilojoules: act.kilojoules,
      average_speed: act.average_speed,
      max_speed: act.max_speed,
      average_cadence: act.average_cadence,
      start_date: act.start_date,
    }))

    return res.status(200).json(simplified)
  } catch (err: any) {
    console.error('Strava API Fehler:', err.response?.data || err.message)
    return res.status(500).json({ error: 'Fehler beim Abrufen der Aktivitäten.' })
  }
}
