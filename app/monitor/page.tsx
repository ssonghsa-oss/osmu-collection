'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Bell } from 'lucide-react'
import {
  MONITOR_CHANNELS,
  type ChannelStatus,
  type StatusValue,
  type WeekHistory,
  getLastSaturday2PM,
  getWeekKey,
} from '@/lib/monitor-config'
import CutoffDateDisplay from '@/components/CutoffDateDisplay'
import ChannelCard from '@/components/monitor/ChannelCard'
import HistoryTable from '@/components/monitor/HistoryTable'

const STORAGE_KEY = 'osmu-monitor-history'

function loadHistory(): WeekHistory[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveHistory(history: WeekHistory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

function initStatuses(): ChannelStatus[] {
  return MONITOR_CHANNELS.map(ch => ({ id: ch.id, status: 'pending' as StatusValue }))
}

export default function MonitorPage() {
  const [statuses, setStatuses] = useState<ChannelStatus[]>(initStatuses)
  const [loading, setLoading] = useState(false)
  const [checkedAt, setCheckedAt] = useState<string>('')
  const [cutoff, setCutoff] = useState<string>('')
  const [history, setHistory] = useState<WeekHistory[]>([])
  const [notifGranted, setNotifGranted] = useState(false)

  // ── RSS 자동 체크 ──────────────────────────────────────────
  const checkFeeds = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/check-feeds', { cache: 'no-store' })
      const data = await res.json()

      setCutoff(data.cutoff)
      setCheckedAt(data.checkedAt)

      setStatuses(prev => prev.map(s => {
        const ch = MONITOR_CHANNELS.find(c => c.id === s.id)
        if (!ch?.autoCheck) return s
        const result = data.results[s.id]
        if (!result) return s
        return {
          ...s,
          status: result.status,
          latestTitle: result.latestTitle,
          latestDate: result.latestDate,
          checkedAt: data.checkedAt,
        }
      }))
    } catch {
      // API 오류 시 자동 채널만 error 표시
      setStatuses(prev => prev.map(s => {
        const ch = MONITOR_CHANNELS.find(c => c.id === s.id)
        return ch?.autoCheck ? { ...s, status: 'error' } : s
      }))
    } finally {
      setLoading(false)
    }
  }, [])

  // ── 수동 토글 ──────────────────────────────────────────────
  function toggleManual(id: string) {
    setStatuses(prev => prev.map(s => {
      if (s.id !== id) return s
      const next: StatusValue =
        s.status === 'manual_yes' ? 'manual_no' :
        s.status === 'checked'    ? 'none' :
        'manual_yes'
      return { ...s, status: next }
    }))
  }

  // ── localStorage 히스토리 저장 ─────────────────────────────
  useEffect(() => {
    const hist = loadHistory()
    setHistory(hist)
  }, [])

  useEffect(() => {
    if (statuses.every(s => s.status === 'pending')) return
    const sat = getLastSaturday2PM()
    const weekKey = getWeekKey(sat)
    const channels: Record<string, StatusValue> = {}
    statuses.forEach(s => { channels[s.id] = s.status })

    const hist = loadHistory()
    const idx = hist.findIndex(h => h.weekKey === weekKey)
    const entry: WeekHistory = { weekKey, saturdayDate: sat.toISOString(), channels, savedAt: new Date().toISOString() }
    if (idx >= 0) hist[idx] = entry
    else hist.push(entry)
    saveHistory(hist)
    setHistory([...hist])
  }, [statuses])

  // ── 브라우저 Notification 알림 ─────────────────────────────
  async function requestNotif() {
    if (!('Notification' in window)) return alert('이 브라우저는 알림을 지원하지 않습니다.')
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setNotifGranted(true)
      scheduleNotif()
    }
  }

  function scheduleNotif() {
    const now = new Date()
    const day = now.getDay()
    const daysUntilSat = day === 6 ? 7 : 6 - day
    const nextSat = new Date(now)
    nextSat.setDate(now.getDate() + daysUntilSat)
    nextSat.setHours(14, 0, 0, 0)
    const ms = nextSat.getTime() - now.getTime()
    setTimeout(() => {
      new Notification('OSMU 콘텐츠 체크 📋', {
        body: '이번 주 콘텐츠 업로드 확인할 시간이에요 📋',
        icon: '/favicon.ico',
      })
    }, ms)
  }

  // ── 최초 로딩 시 RSS 체크 ──────────────────────────────────
  useEffect(() => { checkFeeds() }, [checkFeeds])

  // ── 파생 값 ──────────────────────────────────────────────
  const doneCount = statuses.filter(s => s.status === 'checked' || s.status === 'manual_yes').length
  const cutoffDate = cutoff ? new Date(cutoff) : getLastSaturday2PM()

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 요약 헤더 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">
            기준: <CutoffDateDisplay cutoffDate={cutoffDate} /> 이후
          </p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold" style={{ color: '#1E1B2E' }}>{doneCount}</span>
            <span className="text-2xl text-gray-400 mb-1">/ {MONITOR_CHANNELS.length}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            채널 완료 &nbsp;·&nbsp;
            <span style={{ color: doneCount === MONITOR_CHANNELS.length ? '#16A34A' : '#D97706' }}>
              {doneCount === MONITOR_CHANNELS.length ? '🎉 이번 주 모두 완료!' : `${MONITOR_CHANNELS.length - doneCount}개 채널 남음`}
            </span>
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* 알림 설정 */}
          <button
            onClick={requestNotif}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <Bell size={14} className={notifGranted ? 'text-yellow-500' : 'text-gray-400'} />
            {notifGranted ? '알림 설정됨' : '토요일 알림 설정'}
          </button>

          {/* 새로고침 */}
          <button
            onClick={checkFeeds}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: '#7C3AED' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? '확인 중...' : 'RSS 새로고침'}
          </button>
        </div>

        {checkedAt && (
          <p className="w-full text-xs text-gray-400">
            마지막 자동 체크: {new Date(checkedAt).toLocaleTimeString('ko-KR')}
          </p>
        )}
      </div>

      {/* 채널 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {MONITOR_CHANNELS.map(ch => (
          <ChannelCard
            key={ch.id}
            channel={ch}
            status={statuses.find(s => s.id === ch.id) ?? { id: ch.id, status: 'pending' }}
            onToggle={toggleManual}
          />
        ))}
      </div>

      {/* 히스토리 */}
      <HistoryTable history={history} />
    </div>
  )
}
