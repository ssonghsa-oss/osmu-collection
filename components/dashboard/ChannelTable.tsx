'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Plus } from 'lucide-react'
import { CHANNELS, getPostsByChannel, getCurrentWeek } from '@/lib/mock-data'
import { loadRegisteredAsPosts, mergeAndSort } from '@/lib/registered-posts'
import { formatDate } from '@/lib/utils'
import ContentModal, { type RegistrationData } from './ContentModal'
import Toast from './Toast'

const STORAGE_KEY = 'osmu-registered-content'

interface RegisteredPost {
  id: string
  channelId: string
  date: string
  url: string
  title: string
  createdAt: string
}

function loadRegistered(): RegisteredPost[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

function CircleProgress({ pct, color }: { pct: number; color: string }) {
  const r = 16
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#F3F4F6" strokeWidth="3" />
      <circle cx="20" cy="20" r={r} fill="none"
        stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`}
        className="circle-progress"
      />
      <text x="20" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>
        {pct}%
      </text>
    </svg>
  )
}

export default function ChannelTable() {
  const { weekNumber } = getCurrentWeek()
  const [modalOpen, setModalOpen] = useState(false)
  const [registered, setRegistered] = useState<RegisteredPost[]>([])
  const [toast, setToast] = useState(false)

  useEffect(() => { setRegistered(loadRegistered()) }, [])

  function handleComplete(data: RegistrationData) {
    const newPost: RegisteredPost = {
      id: `reg-${Date.now()}`,
      channelId: data.channelId,
      date: data.date,
      url: data.url,
      title: data.title,
      createdAt: new Date().toISOString(),
    }
    const updated = [...registered, newPost]
    setRegistered(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setToast(true)
  }

  const rows = CHANNELS.map(ch => {
    const mockPosts = getPostsByChannel(ch.id)
    const regPostsConverted = loadRegisteredAsPosts().filter(p => p.channelId === ch.id)
    const merged = mergeAndSort(mockPosts, regPostsConverted)

    const thisWeekCount = merged.filter(p => p.weekNumber === weekNumber).length
    const rate = Math.round((thisWeekCount / ch.weeklyTarget) * 100)

    const hasReg = regPostsConverted.length > 0
    const lastPost = merged[0]
      ? { title: merged[0].title, url: merged[0].url, publishedAt: merged[0].publishedAt }
      : null

    return { ch, thisWeekCount, rate, lastPost, hasReg }
  })

  const total = rows.reduce((s, r) => s + r.thisWeekCount, 0)

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1">
        {/* 헤더 */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-50">
          <div>
            <h2 className="text-base font-bold" style={{ color: '#1E1B2E' }}>채널별 현황</h2>
            <p className="text-xs text-gray-400 mt-0.5">이번 주 총 {total}건 게시 · 달성 현황 확인</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-gray-100 rounded-full p-1">
              <button className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: '#1E1B2E' }}>이번 주</button>
              <button className="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700">이번 달</button>
            </div>
            {/* 콘텐츠 등록하기 버튼 */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#1E1B2E' }}
            >
              <Plus size={14} />
              콘텐츠 등록하기
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="divide-y divide-gray-50">
          {rows.map(({ ch, thisWeekCount, rate, lastPost, hasReg }) => (
            <div key={ch.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
              {/* 채널 아이콘 + 이름 */}
              <a href={ch.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 w-40 shrink-0 group">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base shrink-0 group-hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: ch.color }}>
                  {ch.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold group-hover:underline" style={{ color: '#1E1B2E' }}>{ch.name}</p>
                  <p className="text-xs text-gray-400">주간 목표 {ch.weeklyTarget}건</p>
                </div>
              </a>

              {/* 주차 정보 + 게시글 제목 */}
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span
                  className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#EDE9F5', color: '#7C3AED' }}
                >
                  {weekNumber}주차
                </span>
                <p className="text-sm truncate" style={{ color: '#1a1a1a' }}>
                  {lastPost?.title ?? '-'}
                </p>
                {hasReg && (
                  <span className="shrink-0 text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                    직접 등록
                  </span>
                )}
              </div>

              {/* 최근 게시일 + 링크 */}
              <div className="w-24 shrink-0 text-xs text-gray-400 text-right">
                {lastPost ? (
                  <a href={lastPost.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-end gap-1 hover:text-blue-500 transition-colors">
                    {formatDate(lastPost.publishedAt)}
                    <ExternalLink size={10} />
                  </a>
                ) : '—'}
              </div>

              {/* 원형 진행률 */}
              <div className="shrink-0">
                <CircleProgress
                  pct={Math.min(rate, 100)}
                  color={rate >= 100 ? '#22C55E' : rate >= 50 ? '#F59E0B' : '#FF4D4D'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <ContentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={handleComplete}
      />

      <Toast
        message="등록되었습니다 🎉"
        show={toast}
        onHide={() => setToast(false)}
      />
    </>
  )
}
