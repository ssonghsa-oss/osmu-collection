import { CHANNELS, getCurrentWeek, getWeeklyStats, getRecentTrend, POSTS } from '@/lib/mock-data'
import StatCard from '@/components/dashboard/StatCard'
import ChannelSummaryChart from '@/components/dashboard/ChannelSummaryChart'
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart'
import ChannelBoard from '@/components/dashboard/ChannelBoard'

const ANNUAL_TARGET = 52

export default function DashboardPage() {
  const { weekNumber, year } = getCurrentWeek()
  const stats = getWeeklyStats(weekNumber, year)
  const trend = getRecentTrend(weekNumber, year)

  const totalPosted = POSTS.filter(p => p.year === year).length
  const annualRate = Math.min(Math.round((totalPosted / ANNUAL_TARGET) * 100), 100)
  const weeklyPosted = stats.reduce((s, v) => s + v.posted, 0)
  const weeklyTarget = stats.reduce((s, v) => s + v.target, 0)
  const unmetCount = stats.filter(s => s.rate < 100).length

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{year}년 {weekNumber}주차 현황</h1>
        <span className="text-sm text-gray-400">목 데이터 (로컬 테스트 모드)</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="연간 이수율"
          value={`${annualRate}%`}
          sub={`${totalPosted}/${ANNUAL_TARGET}건 (연간 목표)`}
          color={annualRate >= 100 ? 'text-green-600' : annualRate >= 50 ? 'text-amber-500' : 'text-red-500'}
        />
        <StatCard label="이번 주 게시" value={`${weeklyPosted}건`} sub={`목표 ${weeklyTarget}건`} />
        <StatCard label="총 게시물" value={`${POSTS.length}개`} sub="전체 누적" />
        <StatCard
          label="미달성 채널"
          value={`${unmetCount}개`}
          sub={`/${CHANNELS.length}개 채널`}
          color={unmetCount === 0 ? 'text-green-600' : 'text-red-500'}
        />
      </div>

      <ChannelSummaryChart stats={stats} />
      <WeeklyTrendChart trend={trend} />
      <ChannelBoard />
    </main>
  )
}
