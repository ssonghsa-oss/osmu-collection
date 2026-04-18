'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Tv, Calendar, Settings, Zap, ClipboardCheck } from 'lucide-react'

const NAV = [
  { href: '/',                   icon: LayoutDashboard, label: 'OSMU 대시보드' },
  { href: '/monitor',            icon: ClipboardCheck,  label: '업로드 모니터' },
  { href: '/channels/instagram', icon: Tv,              label: '채널 게시판' },
  { href: '/calendar',           icon: Calendar,        label: '캘린더' },
  { href: '/settings',           icon: Settings,        label: '설정' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-5 gap-2 z-50"
      style={{ backgroundColor: '#1E1B2E' }}>
      {/* 로고 */}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#7C3AED' }}>
        <Zap size={18} className="text-white" />
      </div>

      {/* 네비게이션 */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const base = href === '/' ? pathname === '/' : pathname.startsWith(href.split('/').slice(0, 2).join('/'))
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group relative"
              style={{ backgroundColor: base ? '#7C3AED' : 'transparent' }}
              onMouseEnter={e => { if (!base) (e.currentTarget as HTMLElement).style.backgroundColor = '#2D2A3E' }}
              onMouseLeave={e => { if (!base) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
            >
              <Icon size={18} className={base ? 'text-white' : 'text-gray-400'} />
              <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* 프로필 */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: '#7C3AED' }}>
        S
      </div>
    </aside>
  )
}
