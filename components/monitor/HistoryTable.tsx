import type { WeekHistory, StatusValue } from '@/lib/monitor-config'
import { MONITOR_CHANNELS } from '@/lib/monitor-config'

function StatusDot({ s }: { s: StatusValue }) {
  if (s === 'checked' || s === 'manual_yes') return <span title="완료">✅</span>
  if (s === 'none' || s === 'manual_no') return <span title="미완료">❌</span>
  if (s === 'error') return <span title="오류">⚠️</span>
  return <span title="미확인" className="text-gray-300">—</span>
}

interface Props { history: WeekHistory[] }

export default function HistoryTable({ history }: Props) {
  if (history.length === 0) return null

  const recent = [...history].reverse().slice(0, 4)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-base font-bold" style={{ color: '#1E1B2E' }}>최근 업로드 히스토리</h2>
        <p className="text-xs text-gray-400 mt-0.5">로컬에 저장된 최근 4주 기록</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-left">
              <th className="px-6 py-3 font-medium text-xs">주차</th>
              <th className="px-4 py-3 font-medium text-xs">기준일</th>
              {MONITOR_CHANNELS.map(ch => (
                <th key={ch.id} className="px-4 py-3 font-medium text-xs text-center">
                  <span className="inline-flex items-center gap-1">
                    {ch.icon} {ch.name}
                  </span>
                </th>
              ))}
              <th className="px-6 py-3 font-medium text-xs text-center">달성률</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recent.map(row => {
              const done = MONITOR_CHANNELS.filter(ch => {
                const s = row.channels[ch.id]
                return s === 'checked' || s === 'manual_yes'
              }).length
              const rate = Math.round((done / MONITOR_CHANNELS.length) * 100)
              return (
                <tr key={row.weekKey} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-semibold text-xs" style={{ color: '#1E1B2E' }}>
                    {row.weekKey}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(row.saturdayDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                  </td>
                  {MONITOR_CHANNELS.map(ch => (
                    <td key={ch.id} className="px-4 py-3 text-center">
                      <StatusDot s={row.channels[ch.id] ?? 'pending'} />
                    </td>
                  ))}
                  <td className="px-6 py-3 text-center">
                    <span
                      className="text-xs font-bold"
                      style={{ color: rate === 100 ? '#16A34A' : rate >= 50 ? '#D97706' : '#DC2626' }}
                    >
                      {done}/{MONITOR_CHANNELS.length} ({rate}%)
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
