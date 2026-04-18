'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { CHANNELS } from '@/lib/mock-data'

export interface RegistrationData {
  channelId: string
  date: string
  url: string
  title: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onComplete: (data: RegistrationData) => void
}

const STEPS = ['채널 선택', '날짜 입력', 'URL 입력', '주제 입력']

export default function ContentModal({ isOpen, onClose, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [channelId, setChannelId] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [title, setTitle] = useState('')
  const [visible, setVisible] = useState(false)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10)
    } else {
      setVisible(false)
    }
  }, [isOpen])

  function resetAndClose() {
    setVisible(false)
    setTimeout(() => {
      setStep(0); setChannelId(''); setDate(new Date().toISOString().split('T')[0])
      setUrl(''); setUrlError(''); setTitle('')
      onClose()
    }, 200)
  }

  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === backdropRef.current) resetAndClose()
  }

  function validateUrl(val: string) {
    if (!val.startsWith('http://') && !val.startsWith('https://')) {
      setUrlError('올바른 URL을 입력해주세요 (http:// 또는 https://)')
      return false
    }
    setUrlError('')
    return true
  }

  function canNext() {
    if (step === 0) return !!channelId
    if (step === 1) return !!date
    if (step === 2) return !!url && !urlError
    if (step === 3) return title.trim().length > 0
    return false
  }

  function handleNext() {
    if (step === 2 && !validateUrl(url)) return
    if (step < 3) { setStep(s => s + 1); return }
    onComplete({ channelId, date, url, title })
    resetAndClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transition-all duration-200"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base font-bold" style={{ color: '#1E1B2E' }}>콘텐츠 등록하기</h2>
          <button onClick={resetAndClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-2 px-6 py-4">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0"
                  style={{
                    backgroundColor: i < step ? '#7C3AED' : i === step ? '#1E1B2E' : '#F3F4F6',
                    color: i <= step ? 'white' : '#9CA3AF',
                  }}
                >
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className="text-xs hidden sm:block"
                  style={{ color: i === step ? '#1E1B2E' : '#9CA3AF', fontWeight: i === step ? 600 : 400 }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px" style={{ backgroundColor: i < step ? '#7C3AED' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="px-6 pb-6">
          {/* Step 1: 채널 선택 */}
          {step === 0 && (
            <div className="grid grid-cols-3 gap-3">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setChannelId(ch.id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: channelId === ch.id ? ch.color : '#E5E7EB',
                    backgroundColor: channelId === ch.id ? ch.color + '15' : 'white',
                  }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: ch.color }}>
                    {ch.icon}
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#1E1B2E' }}>{ch.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: 날짜 입력 */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: '#1E1B2E' }}>게시 날짜</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-purple-500"
                style={{ color: '#1E1B2E' }}
              />
            </div>
          )}

          {/* Step 3: URL 입력 */}
          {step === 2 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: '#1E1B2E' }}>게시물 URL</label>
              <input
                type="text"
                value={url}
                onChange={e => { setUrl(e.target.value); if (urlError) validateUrl(e.target.value) }}
                onBlur={() => url && validateUrl(url)}
                placeholder="게시물 URL을 입력하세요"
                className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  borderColor: urlError ? '#EF4444' : '#E5E7EB',
                  color: '#1E1B2E',
                }}
              />
              {urlError && <p className="text-xs" style={{ color: '#EF4444' }}>{urlError}</p>}
              {url && !urlError && (
                <p className="text-xs" style={{ color: '#22C55E' }}>✓ 유효한 URL입니다</p>
              )}
            </div>
          )}

          {/* Step 4: 주제 입력 */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium" style={{ color: '#1E1B2E' }}>게시물 주제</label>
              <textarea
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 100))}
                placeholder="게시물 주제를 입력하세요 (예: 프리랜서 전환 후기)"
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-purple-500 resize-none"
                style={{ color: '#1E1B2E' }}
              />
              <div className="flex justify-end">
                <span className="text-xs" style={{ color: title.length >= 90 ? '#EF4444' : '#9CA3AF' }}>
                  {title.length}/100
                </span>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ color: '#1E1B2E' }}
              >
                <ChevronLeft size={15} /> 이전
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: '#1E1B2E' }}
            >
              {step < 3 ? (<>다음 <ChevronRight size={15} /></>) : (<><Check size={15} /> 등록 완료</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
