import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

export function getWeekRange(weekNumber: number, year: number): { start: Date; end: Date } {
  const jan1 = new Date(year, 0, 1)
  const dayOfWeek = jan1.getDay() || 7
  const firstMonday = new Date(jan1)
  firstMonday.setDate(jan1.getDate() + (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek))
  const start = new Date(firstMonday)
  start.setDate(firstMonday.getDate() + (weekNumber - 1) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}
