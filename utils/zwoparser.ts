import { XMLParser } from 'fast-xml-parser'

export type WorkoutSegment = {
  type: string          // z. B. 'Warmup', 'IntervalsT', 'Cooldown', 'FreeRide', 'SteadyState', 'textevent'
  duration?: number     // Seconds
  power?: number        // % FTP
  powerLow?: number
  powerHigh?: number
  cadence?: number
  repeat?: number
  // weitere Attribute je nach Tag ...
}

export function parseZwoToJson(zwo: string): {
  title?: string
  author?: string
  description?: string
  sportType?: string
  segments: WorkoutSegment[]
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true
  })
  const obj = parser.parse(zwo)
  const wf = obj.workout_file || {}
  const meta = {
    title: wf.name,
    author: wf.author,
    description: wf.description,
    sportType: wf.sportType,
  }

  const workout = wf.workout
  const segments: WorkoutSegment[] = []

  if (workout) {
    for (const [tag, content] of Object.entries(workout)) {
      const items = Array.isArray(content) ? content : [content]
      items.forEach((el: any) => {
        const seg: WorkoutSegment = { type: tag }
        Object.entries(el).forEach(([key, val]) => {
          const lk = key.charAt(0).toLowerCase() + key.slice(1)
          if (lk === 'duration' || lk === 'onDuration' || lk === 'offDuration')
            seg.duration = Number(val)
          else if (lk.includes('Power') || lk === 'power')
            seg[lk] = Number(val)
          else if (lk === 'cadence' || lk === 'cadenceResting')
            seg.cadence = Number(val)
          else if (lk === 'repeat')
            seg.repeat = Number(val)
          // weitere Attribute verarbeiten, z. B. textevent...
        })
        segments.push(seg)
      })
    }
  }

  return { ...meta, segments }
}
