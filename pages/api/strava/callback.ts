import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code

  if (!code || typeof code !== 'string') {
    return res.status(400).send('Code fehlt oder ungültig.')
  }

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    })

    const { access_token, refresh_token, expires_at, athlete } = response.data

    // TODO: Speichern (z. B. in Supabase, Cookie oder Session)
    console.log('Strava verbunden mit:', athlete.username)

    // Optional: Weiterleitung zurück zum Dashboard
    return res.redirect('/dashboard')
  } catch (error: any) {
    console.error('Strava Callback Fehler:', error.response?.data || error.message)
    return res.status(500).send('OAuth fehlgeschlagen.')
  }
}
