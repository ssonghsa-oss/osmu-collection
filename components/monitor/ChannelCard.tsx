'use client'

import { ExternalLink, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { ChannelConfig, ChannelStatus, StatusValue } from '@/lib/monitor-config'

interface Props {
  channel: ChannelConfig
  status: ChannelStatus
  onToggle: (id: string) => void
}

const STATUS_CONFIG: Record<StatusValue, { label: string; bg: string; text: string; border: string }> = {
  checked:    { label: '✅ 완료',   bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' },
  none:       { label: '❌ 미완료', bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
  manual_yes: { label: '✅ 완료',   bg: '#F0FDF4', text: '#16A34A', border: '#86EFAC' },
  manual_no:  { label: '❌ 미완료', bg: '#FEF2F2', text: '#DC2626', border: '#FCA5A5' },
  pending:    { label: '⏳ 미확인', bg: '#FAFAFA', text: '#6B7280', border: '#E5E7EB' },
  error:      { label: '⚠️ 오류',   bg: '#FFFBEB', text: '#D97706', border: '#FCD34D' },
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export default function ChannelCard({ channel, status, onToggle }: Props) {
  const cfg = STATUS_CONFIG[status.status]
  const isDone = status.status === 'checked' || status.status === 'manual_yes'
  const isManual = !channel.autoCheck

  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-all"
      style={{ border: `1.5px solid ${cfg.border}` }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundColor: channel.color }}
          >
            {channel.icon}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#1E1B2E' }}>{channel.name}</p>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: cfg.bg, color: cfg.text }}
            >
              {cfg.label}
            </span>
          </div>
        </div>
        {/* 자동 체크 표시 */}
        {channel.autoCheck && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <RefreshCw size={10} /> 자동
          </span>
        )}
      </div>

      {/* 자동 체크 결과: 최신 게시물 */}
      {channel.autoCheck && status.latestTitle && (
        <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: '#F9FAFB' }}>
          <p className="font-medium text-gray-700 truncate">{status.latestTitle}</p>
          {status.latestDate && (
            <p className="text-gray-400 mt-0.5">{formatDate(status.latestDate)}</p>
          )}
        </div>
      )}

      {/* 오류 메시지 */}
      {status.status === 'error' && (
        <p className="text-xs text-amber-600">RSS 로드 실패. 수동으로 확인해 주세요.</p>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2 mt-auto">
        {/* 채널 링크 */}
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: channel.color }}
        >
          <ExternalLink size={12} />
          확인하러 가기
        </a>

        {/* 수동 토글 (수동 채널 또는 오류 채널) */}
        {(isManual || status.status === 'error') && (
          <button
            onClick={() => onToggle(channel.id)}
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border transition-colors"
            style={{
              borderColor: cfg.border,
              backgroundColor: isDone ? '#F0FDF4' : '#FEF2F2',
              color: isDone ? '#16A34A' : '#DC2626',
            }}
          >
            {isDone
              ? <><XCircle size={12} /> 취소</>
              : <><CheckCircle size={12} /> 완료</>
            }
          </button>
        )}
      </div>
    </div>
  )
}
