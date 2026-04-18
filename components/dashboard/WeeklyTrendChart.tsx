'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import type { TrendData } from '@/lib/mock-data'

interface Props { trend: TrendData[] }

export default function WeeklyTrendChart({ trend }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">최근 4주 이수율 트렌드</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 120]} tickFormatter={v => `${v}%`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number) => [`${v}%`, '이수율']} />
          <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="4 4" label={{ value: '목표', position: 'right', fontSize: 11 }} />
          <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
