'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { CHANNELS } from '@/lib/mock-data'

interface Config {
  apiKey: string
  handle: string
  weeklyTarget: number
}

const defaultConfigs: Record<string, Config> = Object.fromEntries(
  CHANNELS.map(ch => [ch.id, { apiKey: '', handle: '', weeklyTarget: ch.weeklyTarget }])
)

const API_LABELS: Record<string, string> = {
  youtube: 'API Key (YouTube Data v3)',
  instagram: 'Access Token (Graph API)',
  brunch: 'RSS URL',
  blog: 'RSS URL',
  threads: 'Access Token (Threads API)',
  linkedin: 'Access Token (LinkedIn API)',
}

export default function SettingsPage() {
  const [configs, setConfigs] = useState(defaultConfigs)
  const [saved, setSaved] = useState<string | null>(null)

  function handleSave(channelId: string) {
    setSaved(channelId)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">채널 설정</h1>
      <p className="text-sm text-gray-500">각 채널의 API 키와 핸들을 입력하세요. (MVP: 로컬 저장)</p>

      <div className="space-y-4">
        {CHANNELS.map(ch => {
          const cfg = configs[ch.id]
          return (
            <div key={ch.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: ch.color }}
                >
                  {ch.icon}
                </div>
                <h2 className="text-base font-semibold text-gray-800">{ch.name}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{API_LABELS[ch.type]}</label>
                  <input
                    type="password"
                    placeholder="입력하세요"
                    value={cfg.apiKey}
                    onChange={e => setConfigs(prev => ({ ...prev, [ch.id]: { ...prev[ch.id], apiKey: e.target.value } }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">채널 핸들 / URL</label>
                    <input
                      type="text"
                      placeholder="@handle 또는 URL"
                      value={cfg.handle}
                      onChange={e => setConfigs(prev => ({ ...prev, [ch.id]: { ...prev[ch.id], handle: e.target.value } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs text-gray-500 mb-1">주간 목표 (건)</label>
                    <input
                      type="number"
                      min={1}
                      value={cfg.weeklyTarget}
                      onChange={e => setConfigs(prev => ({ ...prev, [ch.id]: { ...prev[ch.id], weeklyTarget: Number(e.target.value) } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleSave(ch.id)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: ch.color }}
                >
                  {saved === ch.id ? <><CheckCircle size={14} /> 저장됨</> : '저장'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* 전체 동기화 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-800">전체 채널 동기화</p>
          <p className="text-xs text-gray-400 mt-0.5">Supabase 연결 후 실제 동기화가 가능합니다</p>
        </div>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
        >
          동기화 (준비 중)
        </button>
      </div>
    </main>
  )
}
