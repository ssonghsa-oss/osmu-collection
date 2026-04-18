import type { Post } from './mock-data'

const STORAGE_KEY = 'osmu-registered-content'

interface RegisteredPost {
  id: string
  channelId: string
  date: string
  url: string
  title: string
  createdAt: string
}

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function loadRegisteredAsPosts(): Post[] {
  if (typeof window === 'undefined') return []
  try {
    const raw: RegisteredPost[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return raw.map(r => {
      const d = new Date(r.date)
      return {
        id: r.id,
        channelId: r.channelId,
        title: r.title,
        url: r.url,
        publishedAt: r.date,
        weekNumber: isoWeek(d),
        year: d.getFullYear(),
      }
    })
  } catch {
    return []
  }
}

export function mergeAndSort(mockPosts: Post[], registeredPosts: Post[]): Post[] {
  const regIds = new Set(registeredPosts.map(p => p.id))
  const merged = [
    ...registeredPosts,
    ...mockPosts.filter(p => !regIds.has(p.id)),
  ]
  return merged.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
