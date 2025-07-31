import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cookie from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state } = req.query

  if (!code || typeof code !== 'string') {
    return res.status(400).send('Code fehlt oder ungültig.')
  }

  // Cookies parsen
  const cookies = cookie.parse(req.headers.cookie || '')
  const expectedState = cookies.strava_oauth_state

  if (!expectedState || expectedState !== state) {
    return res.status(400).send('OAuth fehlgeschlagen: Ungültiger State.')
  }

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    })

    const { access_token, refresh_token, expires_at, athlete } = response.data

    // TODO: Tokens speichern (Supabase, Session etc.)
    console.log('Strava verbunden mit:', athlete.username)

    // Optional: Cookie löschen
    res.setHeader('Set-Cookie', cookie.serialize('strava_oauth_state', '', {
      path: '/',
      maxAge: -1,
    }))

    // Weiterleitung nach Erfolg
    return res.redirect('/training?strava_connected=true')
  } catch (error: any) {
    console.error('Strava Callback Fehler:', error.response?.data || error.message)
    return res.status(500).send('OAuth fehlgeschlagen.')
  }
}
