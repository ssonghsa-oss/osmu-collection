'use client'

import { Search, Bell, Settings } from 'lucide-react'

export default function Header({ title = 'Dashboard' }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: '#EDE9F5' }}>
      <h1 className="text-xl font-bold" style={{ color: '#1E1B2E' }}>{title}</h1>

      <div className="flex items-center gap-3">
        {/* 검색 */}
        <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="검색"
            className="text-sm outline-none w-32 text-gray-600 placeholder-gray-400"
          />
        </div>

        {/* 아이콘 버튼 */}
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
          <Bell size={16} className="text-gray-500" />
        </button>
        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
          <Settings size={16} className="text-gray-500" />
        </button>

        {/* Upgrade 버튼 */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#1E1B2E' }}>
          ✦ 업그레이드
        </button>

        {/* 프로필 */}
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
          style={{ backgroundColor: '#7C3AED' }}>
          S
        </div>
      </div>
    </header>
  )
}
