import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { getLastSaturday2PM } from '@/lib/monitor-config'

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })

async function fetchRSS(url: string) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OSMUBot/1.0)' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function parseDate(str: string): Date {
  return new Date(str)
}

export async function GET() {
  const cutoff = getLastSaturday2PM()
  const results: Record<string, {
    status: 'checked' | 'none' | 'error'
    latestTitle?: string
    latestDate?: string
    error?: string
  }> = {}

  // ── YouTube RSS ──────────────────────────────────────────
  try {
    const xml = await fetchRSS(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCR5QJe5ZANAPMX0NfAeIqOQ'
    )
    const parsed = parser.parse(xml)
    const entries = parsed?.feed?.entry
    const latest = Array.isArray(entries) ? entries[0] : entries

    if (!latest) throw new Error('no entries')

    const pubDate = parseDate(latest.published)
    results.youtube = {
      status: pubDate >= cutoff ? 'checked' : 'none',
      latestTitle: String(latest.title ?? ''),
      latestDate: latest.published,
    }
  } catch (e: unknown) {
    results.youtube = { status: 'error', error: e instanceof Error ? e.message : 'unknown' }
  }

  // ── Naver Blog RSS ───────────────────────────────────────
  try {
    const xml = await fetchRSS('https://rss.blog.naver.com/justnopressure.xml')
    const parsed = parser.parse(xml)
    const items = parsed?.rss?.channel?.item
    const latest = Array.isArray(items) ? items[0] : items

    if (!latest) throw new Error('no items')

    const pubDate = parseDate(latest.pubDate)
    results.blog = {
      status: pubDate >= cutoff ? 'checked' : 'none',
      latestTitle: String(latest.title ?? ''),
      latestDate: latest.pubDate,
    }
  } catch (e: unknown) {
    results.blog = { status: 'error', error: e instanceof Error ? e.message : 'unknown' }
  }

  return NextResponse.json({
    cutoff: cutoff.toISOString(),
    checkedAt: new Date().toISOString(),
    results,
  })
}
