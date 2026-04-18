'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import type { WeeklyStats } from '@/lib/mock-data'

interface Props { stats: WeeklyStats[] }

export default function ChannelSummaryChart({ stats }: Props) {
  const data = stats.map(s => ({
    name: s.channel.name,
    달성률: s.rate,
    color: s.channel.color,
    posted: s.posted,
    target: s.target,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">채널별 이번 주 달성률</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" domain={[0, 120]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 13 }} />
          <Tooltip
            formatter={(value: number, _: string, props) =>
              [`${props.payload.posted}/${props.payload.target}건 (${value}%)`, '달성률']
            }
          />
          <ReferenceLine x={100} stroke="#e5e7eb" strokeDasharray="4 4" />
          <Bar dataKey="달성률" radius={[0, 4, 4, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.달성률 >= 100 ? '#22c55e' : d.달성률 >= 50 ? '#f59e0b' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
