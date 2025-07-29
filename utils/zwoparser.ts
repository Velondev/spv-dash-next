import { XMLParser } from 'fast-xml-parser'

export type WorkoutSegment = {
  type: string          // z. B. 'Warmup', 'IntervalsT', 'Cooldown', 'FreeRide', 'SteadyState', 'textevent'
  duration?: number     // Sekunden
  onDuration?: number   // für IntervalsT
  offDuration?: number  // für IntervalsT
  power?: number        // % FTP
  powerLow?: number
  powerHigh?: number

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
  // deine Logik hier...

  return {
    title: 'Beispiel',
    author: 'Autor',
    description: 'Beschreibung',
    sportType: 'bike',
    segments: [],
    duration: 0,
    intensityFactor: 0,
  }
}

  const obj = parser.parse(zwo)
  const wf = obj.workout_file || {}
  const meta = {
  export function parseZwoToJson(zwo: string): {
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
          if (lk === 'duration') seg.duration = Number(val)
          else if (lk === 'onduration') seg.onDuration = Number(val)
          else if (lk === 'offduration') seg.offDuration = Number(val)
          else if (lk === 'power') seg.power = Number(val)
          else if (lk === 'powerlow') seg.powerLow = Number(val)
          else if (lk === 'powerhigh') seg.powerHigh = Number(val)
          else if (lk === 'cadence' || lk === 'cadenceresting') seg.cadence = Number(val)
          else if (lk === 'repeat') seg.repeat = Number(val)
        })
        segments.push(seg)
      })
    }
  }

  return { ...meta, segments }
  // Berechnung von Dauer und Intensitätsfaktor
  let totalDuration = 0
  let weightedPowerSum = 0

  for (const seg of segments) {
    let duration = seg.duration || 0

    // Sonderfall für IntervalsT
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
    intensityFactor
  }
}
