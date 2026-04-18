import { CHANNELS, getCurrentWeek, getWeeklyStats, POSTS } from '@/lib/mock-data'
import HeroStat from '@/components/dashboard/HeroStat'
import MiniStatCard from '@/components/dashboard/MiniStatCard'
import ChannelTable from '@/components/dashboard/ChannelTable'
import ChannelRadarChart from '@/components/dashboard/ChannelRadarChart'

const ANNUAL_TARGET = 52

export default function DashboardPage() {
  const { weekNumber, year } = getCurrentWeek()
  const stats = getWeeklyStats(weekNumber, year)

  const totalPosted = POSTS.filter(p => p.year === year).length
  const annualRate = Math.min(Math.round((totalPosted / ANNUAL_TARGET) * 100), 100)
  const weeklyPosted = stats.reduce((s, v) => s + v.posted, 0)
  const weeklyTarget = stats.reduce((s, v) => s + v.target, 0)
  const unmetCount = stats.filter(s => s.rate < 100).length
  const metCount = CHANNELS.length - unmetCount

  return (
    <div className="space-y-5 max-w-6xl">
      {/* 상단: 히어로 + 미니 카드 3개 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <HeroStat
            rate={annualRate}
            posted={totalPosted}
            target={ANNUAL_TARGET}
            weekNumber={weekNumber}
            year={year}
          />
        </div>
        <MiniStatCard
          label="이번 주 게시"
          value={weeklyPosted}
          unit="건"
          trend={-8}
          trendLabel="지난 주 대비"
        />
        <MiniStatCard
          label="총 게시물"
          value={POSTS.length}
          unit="개"
          trend={12}
          trendLabel="지난 달 대비"
        />
        <MiniStatCard
          label="달성 채널"
          value={metCount}
          unit={`/${CHANNELS.length}`}
          trend={metCount >= CHANNELS.length ? 8 : -5}
          trendLabel="이번 주"
        />
      </div>

      {/* 하단: 채널 테이블 + 레이더 차트 */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <ChannelTable />
        </div>
        <div className="shrink-0 w-72">
          <ChannelRadarChart />
        </div>
      </div>
    </div>
  )
}
