import { XMLParser } from 'fast-xml-parser'

export type WorkoutSegment = {
  type: string          // z. B. 'Warmup', 'IntervalsT', 'Cooldown', etc.
  duration?: number     // Sekunden
  onDuration?: number
  offDuration?: number
  power?: number
  powerLow?: number
  powerHigh?: number
  cadence?: number
  repeat?: number
}

export function parseZwoToJson(zwo: string): {
  title?: string
  author?: string
  description?: string
  sportType?: string
  segments: WorkoutSegment[]
  duration: number
  intensityFactor: number
} {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  })

  const obj = parser.parse(zwo)
  const wf = obj.workout_file || {}

  const meta = {
    title: wf.name,
    author: wf.author,
    description: wf.description,
    sportType: wf.sportType,
  }

  const segments: WorkoutSegment[] = []
  const workout = wf.workout

  if (workout) {
    for (const [tag, content] of Object.entries(workout)) {
      const items = Array.isArray(content) ? content : [content]

      items.forEach((el: any) => {
        const seg: WorkoutSegment = { type: tag }

        Object.entries(el).forEach(([key, val]) => {
          const lk = key.toLowerCase()
          const numVal = Number(val)

          if (lk === 'duration') seg.duration = numVal
          else if (lk === 'onduration') seg.onDuration = numVal
          else if (lk === 'offduration') seg.offDuration = numVal
          else if (lk === 'power') seg.power = numVal
          else if (lk === 'powerlow') seg.powerLow = numVal
          else if (lk === 'powerhigh') seg.powerHigh = numVal
          else if (lk === 'cadence' || lk === 'cadenceresting') seg.cadence = numVal
          else if (lk === 'repeat') seg.repeat = numVal
        })

        segments.push(seg)
      })
    }
  }

  // Berechnung von Dauer und Intensitätsfaktor (zeitgewichteter Durchschnitt)
  let totalDuration = 0
  let weightedPowerSum = 0

  for (const seg of segments) {
    let duration = seg.duration || 0

    if (
      seg.type === 'IntervalsT' &&
      seg.repeat &&
      seg.onDuration &&
      seg.offDuration
    ) {
      duration = (seg.onDuration + seg.offDuration) * seg.repeat
    }

    const avgPower =
      seg.power !== undefined
        ? seg.power
        : seg.powerLow !== undefined && seg.powerHigh !== undefined
          ? (seg.powerLow + seg.powerHigh) / 2
          : 0

    totalDuration += duration
    weightedPowerSum += avgPower * duration
  }

  const averageIntensity = totalDuration > 0 ? weightedPowerSum / totalDuration : 0
  const intensityFactor = parseFloat(averageIntensity.toFixed(3))

  return {
    ...meta,
    segments,
    duration: totalDuration,
    intensityFactor,
  }
}
