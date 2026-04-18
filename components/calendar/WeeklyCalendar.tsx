'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { CHANNELS, POSTS, getChannelById } from '@/lib/mock-data'
import { getWeekRange } from '@/lib/utils'

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

export default function WeeklyCalendar({ initialWeek, initialYear }: { initialWeek: number; initialYear: number }) {
  const [week, setWeek] = useState(initialWeek)
  const [year, setYear] = useState(initialYear)

  const { start, end } = getWeekRange(week, year)

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const postsThisWeek = POSTS.filter(p => {
    const d = new Date(p.publishedAt)
    return d >= start && d <= end
  })

  function prevWeek() {
    if (week === 1) { setWeek(52); setYear(y => y - 1) }
    else setWeek(w => w - 1)
  }
  function nextWeek() {
    if (week === 52) { setWeek(1); setYear(y => y + 1) }
    else setWeek(w => w + 1)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold text-gray-800">
          {year}년 {week}주차 &nbsp;
          <span className="text-sm font-normal text-gray-400">
            ({start.getMonth() + 1}/{start.getDate()} – {end.getMonth() + 1}/{end.getDate()})
          </span>
        </span>
        <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 divide-x divide-gray-100">
        {DAYS.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 py-2 border-b border-gray-100">
            {day}
          </div>
        ))}
        {days.map((date, i) => {
          const dateStr = date.toISOString().split('T')[0]
          const dayPosts = postsThisWeek.filter(p => p.publishedAt.startsWith(dateStr))
          const isToday = dateStr === new Date().toISOString().split('T')[0]

          return (
            <div key={i} className="min-h-[120px] p-2 space-y-1">
              <div className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                isToday ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}>
                {date.getDate()}
              </div>
              {dayPosts.map(post => {
                const ch = getChannelById(post.channelId)
                if (!ch) return null
                return (
                  <a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={post.title}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs text-white truncate hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: ch.color }}
                  >
                    <span>{ch.icon}</span>
                    <span className="truncate">{post.title}</span>
                    <ExternalLink size={9} className="shrink-0" />
                  </a>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-3">
        {CHANNELS.map(ch => (
          <span key={ch.id} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: ch.color }} />
            {ch.name}
          </span>
        ))}
      </div>
    </div>
  )
}
