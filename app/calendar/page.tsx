import { getCurrentWeek } from '@/lib/mock-data'
import WeeklyCalendar from '@/components/calendar/WeeklyCalendar'

export default function CalendarPage() {
  const { weekNumber, year } = getCurrentWeek()

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">콘텐츠 캘린더</h1>
      <WeeklyCalendar initialWeek={weekNumber} initialYear={year} />
    </main>
  )
}
