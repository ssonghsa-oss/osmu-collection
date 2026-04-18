'use client'

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { CHANNELS, getCurrentWeek, getPostsByChannel } from '@/lib/mock-data'

export default function ChannelRadarChart() {
  const { weekNumber } = getCurrentWeek()

  const data = CHANNELS.map(ch => {
    const posts = getPostsByChannel(ch.id)
    const thisWeek = posts.filter(p => p.weekNumber === weekNumber)
    const rate = Math.min(Math.round((thisWeek.length / ch.weeklyTarget) * 100), 100)
    return { subject: ch.name, value: rate, fullMark: 100, color: ch.color }
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col" style={{ minWidth: 280 }}>
      <div className="mb-4">
        <h2 className="text-base font-bold" style={{ color: '#1E1B2E' }}>채널 달성 현황</h2>
        <p className="text-xs text-gray-400 mt-0.5">이번 주 채널별 목표 달성률</p>
      </div>

      <div className="flex-1" style={{ minHeight: 260 }}>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#F3F4F6" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: '#6B7280' }}
            />
            <Radar
              name="달성률"
              dataKey="value"
              stroke="#7C3AED"
              fill="#7C3AED"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip formatter={(v: number) => [`${v}%`, '달성률']} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 채널별 퍼센트 범례 */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map(d => (
          <div key={d.subject} className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{d.subject}</span>
            <span className="font-semibold"
              style={{ color: d.value >= 100 ? '#22C55E' : d.value >= 50 ? '#F59E0B' : '#FF4D4D' }}>
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
