interface Props {
  rate: number
  posted: number
  target: number
  weekNumber: number
  year: number
}

export default function HeroStat({ rate, posted, target, weekNumber, year }: Props) {
  const remaining = 100 - rate
  const progressWidth = Math.min(rate, 100)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full min-h-[160px]">
      <div>
        <p className="text-sm text-gray-400 mb-1">{year}년 {weekNumber}주차</p>
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold" style={{ color: '#1E1B2E' }}>{rate}</span>
          <span className="text-2xl font-semibold text-gray-400 mb-2">%</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">연간 이수율 · {posted}/{target}건 완료</p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">달성 현황</span>
          <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>
            목표까지 {remaining}% 남음
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full progress-gradient transition-all duration-700"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  )
}
