import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function AdminWorkouts() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [zwoFile, setZwoFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
      } else {
        setUser(session.user)
        // Optional: Admin-E-Mail check
        // const isAdmin = ['admin@example.com'].includes(session.user.email)
        // if (!isAdmin) router.push('/dashboard')
      }
    }

    checkUser()
  }, [router])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!title || !zwoFile) {
      setMessage('Titel und .zwo-Datei sind erforderlich.')
      return

      
    }

  if (!user) {
    alert('Du musst eingeloggt sein.')
    return
  }

  const reader = new FileReader()

  reader.onload = async (e) => {
    const content = e.target?.result as string

    const { data, error } = await supabase.from('workouts').insert([
      {
    title: title,
    description: description,
    zwo_content: content,
    created_by: user.id,
      },
    ])

    if (error) {
      console.error('Fehler beim Hochladen:', error.message)
      alert('Upload fehlgeschlagen')
    } else {
      alert('Upload erfolgreich!')
      setFile(null)
      setTitle('')
      setDescription('')
    }
  }

  reader.readAsText(file)
}

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-custom-lg">
      <h1 className="text-2xl font-bold mb-6">Neues Workout hochladen</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block mb-1">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="z. B. Sweet Spot Intervals"
          />
        </div>

        <div>
          <label className="block mb-1">Beschreibung</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            rows={3}
            placeholder="Kurze Beschreibung oder Ziel des Workouts"
          />
        </div>

        <div>
          <label className="block mb-1">ZWO-Datei</label>
          <input
            type="file"
            accept=".zwo"
            onChange={(e) => setZwoFile(e.target.files?.[0] || null)}
            className="input"
          />
        </div>

        <button type="submit" className="btn">Workout hochladen</button>

        {message && <div className="mt-4 text-muted-foreground">{message}</div>}
      </form>
    </div>
  )
}
