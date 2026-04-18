import { TrendingDown, TrendingUp } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  unit?: string
  trend?: number
  trendLabel?: string
}

export default function MiniStatCard({ label, value, unit, trend, trendLabel }: Props) {
  const up = trend !== undefined && trend >= 0

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold" style={{ color: '#1E1B2E' }}>{value}</span>
        {unit && <span className="text-lg text-gray-400 mb-1">{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {up
            ? <TrendingUp size={14} style={{ color: '#22C55E' }} />
            : <TrendingDown size={14} style={{ color: '#FF4D4D' }} />
          }
          <span className="text-xs font-medium" style={{ color: up ? '#22C55E' : '#FF4D4D' }}>
            {up ? '+' : ''}{trend}%
          </span>
          {trendLabel && <span className="text-xs text-gray-400">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}
