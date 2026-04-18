export interface ChannelConfig {
  id: string
  name: string
  icon: string
  color: string
  url: string
  autoCheck: boolean
  rssUrl?: string
}

export const MONITOR_CHANNELS: ChannelConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📷',
    color: '#E1306C',
    url: 'https://www.instagram.com/hhhssa.song/',
    autoCheck: false,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    url: 'https://www.linkedin.com/in/',
    autoCheck: false,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶',
    color: '#FF0000',
    url: 'https://www.youtube.com/channel/UCR5QJe5ZANAPMX0NfAeIqOQ',
    autoCheck: true,
    rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCR5QJe5ZANAPMX0NfAeIqOQ',
  },
  {
    id: 'blog',
    name: 'Blog',
    icon: '📝',
    color: '#03CF5D',
    url: 'https://blog.naver.com/justnopressure',
    autoCheck: true,
    rssUrl: 'https://rss.blog.naver.com/justnopressure.xml',
  },
  {
    id: 'brunch',
    name: 'Brunch',
    icon: '✍',
    color: '#FFCD00',
    url: 'https://brunch.co.kr/@seed-uplifter/',
    autoCheck: false,
  },
  {
    id: 'threads',
    name: 'Threads',
    icon: '🧵',
    color: '#000000',
    url: 'https://www.threads.com/@hhhssa.song',
    autoCheck: false,
  },
]

export type StatusValue = 'checked' | 'none' | 'manual_yes' | 'manual_no' | 'pending' | 'error'

export interface ChannelStatus {
  id: string
  status: StatusValue
  latestTitle?: string
  latestDate?: string
  checkedAt?: string
}

export interface WeekHistory {
  weekKey: string        // e.g. "2026-W16"
  saturdayDate: string   // ISO string
  channels: Record<string, StatusValue>
  savedAt: string
}

/** 가장 최근 토요일 오후 2시 (KST 기준으로 처리) */
export function getLastSaturday2PM(): Date {
  const now = new Date()
  const day = now.getDay() // 0=일, 6=토
  const daysBack = day === 6 ? 0 : day + 1
  const sat = new Date(now)
  sat.setDate(now.getDate() - daysBack)
  sat.setHours(14, 0, 0, 0)
  // 토요일이지만 아직 14시 이전이면 지난 주 토요일
  if (sat > now) sat.setDate(sat.getDate() - 7)
  return sat
}

export function getWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
