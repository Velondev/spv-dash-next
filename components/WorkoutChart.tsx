import React from 'react'

type Segment = {
  duration?: number
  power?: number
  powerLow?: number
  powerHigh?: number
  onDuration?: number
  offDuration?: number
  onPower?: number
  offPower?: number
  repeat?: number
  type: string
}

type Props = {
  segments: Segment[]
  zwo: string
}

export default function WorkoutChart({ zwo }: Props) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseAttributeValue: true,
  })

function getPowerZoneColor(ftpPercent: number): string {
  if (ftpPercent <= 0.54) return '#666'         // Grau
  if (ftpPercent <= 0.74) return '#1E90FF'      // Blau
  if (ftpPercent <= 0.89) return '#28a745'      // Grün
  if (ftpPercent <= 1.04) return '#f9c74f'      // Gelb
  if (ftpPercent <= 1.20) return '#d63384'      // Magenta
  return '#dc3545'                              // Rot
}

const WorkoutChart: React.FC<Props> = ({ segments }) => {
  const totalDuration = segments.reduce((sum, seg) => {
    const repeat = seg.repeat || 1
    const duration = seg.onDuration && seg.offDuration
      ? (seg.onDuration + seg.offDuration) * repeat
      : (seg.duration || 0)
    return sum + duration
  }, 0)

  return (
    <div className="flex w-full overflow-hidden rounded-md shadow-md bg-[#111] p-2 gap-0.5">
      {segments.map((seg, i) => {
        const repeat = seg.repeat || 1
        const duration = seg.onDuration && seg.offDuration
          ? (seg.onDuration + seg.offDuration) * repeat
          : seg.duration || 0

        const power = seg.power ??
                      (seg.powerLow !== undefined && seg.powerHigh !== undefined
                        ? (seg.powerLow + seg.powerHigh) / 2
                        : seg.onPower ?? 0)

        const widthPercent = (duration / totalDuration) * 100
        const color = getPowerZoneColor(power)

        return (
          <div
            key={i}
            className="relative h-8 rounded-sm"
            style={{
              width: `${widthPercent}%`,
              backgroundColor: color,
              transition: 'all 0.3s ease-in-out'
            }}
            title={`${seg.type} | ${Math.round(duration)}s @ ${Math.round(power * 100)}% FTP`}
          >
          </div>
        )
      })}
    </div>
  )
}

export default WorkoutChart
