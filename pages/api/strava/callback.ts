// pages/api/strava/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import cookie from 'cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query

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

    // Zugriffstoken als Cookie speichern (optional)
    res.setHeader('Set-Cookie', cookie.serialize('strava_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
    }))

    console.log('✅ Strava verbunden mit:', athlete?.username || 'Unbekannt')

    // Weiterleitung nach erfolgreicher Verbindung
    return res.redirect('/training?strava_connected=true')
  } catch (error: any) {
    console.error('❌ Strava Callback Fehler:', error.response?.data || error.message)
    return res.status(500).send('OAuth fehlgeschlagen.')
  }
}
