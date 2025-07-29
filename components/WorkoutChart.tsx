// components/WorkoutChart.tsx
import React, { useMemo } from 'react'
import { XMLParser } from 'fast-xml-parser'

type WorkoutSegment = {
  type: string
  duration?: number
  onDuration?: number
  offDuration?: number
  power?: number
  powerLow?: number
  powerHigh?: number
  repeat?: number
}

type Props = {
  zwo: string
}

export default function WorkoutChart({ zwo }: Props) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  })

  const segments = useMemo(() => {
    try {
      const obj = parser.parse(zwo)
      const workout = obj?.workout_file?.workout || {}
      const result: WorkoutSegment[] = []

      for (const [tag, content] of Object.entries(workout)) {
        const items = Array.isArray(content) ? content : [content]

        items.forEach((el: any) => {
          const seg: WorkoutSegment = { type: tag }
          Object.entries(el).forEach(([key, val]) => {
            const lk = key.toLowerCase()
            if (lk === 'duration') seg.duration = Number(val)
            if (lk === 'onduration') seg.onDuration = Number(val)
            if (lk === 'offduration') seg.offDuration = Number(val)
            if (lk === 'power') seg.power = Number(val)
            if (lk === 'powerlow') seg.powerLow = Number(val)
            if (lk === 'powerhigh') seg.powerHigh = Number(val)
            if (lk === 'repeat') seg.repeat = Number(val)
          })
          result.push(seg)
        })
      }

      return result
    } catch (e) {
      console.warn('Fehler beim Parsen:', e)
      return []
    }
  }, [zwo])

  const totalDuration = segments.reduce((sum, seg) => {
    const repeat = seg.repeat || 1
    const duration = seg.onDuration && seg.offDuration
      ? (seg.onDuration + seg.offDuration) * repeat
      : seg.duration || 0
    return sum + duration
  }, 0)

  const getPowerColor = (power: number): string => {
    if (power < 0.55) return '#999999' // Grau
    if (power < 0.75) return '#3498db' // Blau
    if (power < 0.9) return '#2ecc71'  // Grün
    if (power < 1.05) return '#f1c40f' // Gelb
    if (power < 1.2) return '#e91e63'  // Magenta
    return '#e74c3c' // Rot
  }

  return (
    <div className="w-full">
      <div className="flex w-full overflow-hidden rounded-md shadow-md bg-[#111] p-2 gap-0.5">
        {segments.map((seg, i) => {
          const repeat = seg.repeat || 1
          const duration = seg.onDuration && seg.offDuration
            ? (seg.onDuration + seg.offDuration) * repeat
            : seg.duration || 0

          const avgPower =
            seg.power !== undefined ? seg.power :
            seg.powerLow !== undefined && seg.powerHigh !== undefined
              ? (seg.powerLow + seg.powerHigh) / 2
              : seg.onDuration && seg.offDuration && seg.onPower && seg.offPower
                ? ((seg.onPower * seg.onDuration + seg.offPower * seg.offDuration) / (seg.onDuration + seg.offDuration))
                : 0.5

          const width = `${(duration / totalDuration) * 100}%`
          const color = getPowerColor(avgPower)

          return (
            <div
              key={i}
              className="relative rounded-sm"
              style={{
                width,
                height: '40px',
                backgroundColor: color,
                transition: 'all 0.2s ease',
              }}
              title={`Typ: ${seg.type}\nDauer: ${Math.round(duration)}s\nLeistung: ${Math.round(avgPower * 100)}% FTP`}
            />
          )
        })}
      </div>
      <div className="text-muted-foreground text-xs mt-2 text-center">
        Gesamtdauer: {Math.round(totalDuration / 60)} Minuten
      </div>
    </div>
  )
}
