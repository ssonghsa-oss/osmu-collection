'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/',                  label: '대시보드' },
  { href: '/channels/youtube',  label: '채널별 게시판' },
  { href: '/calendar',          label: '캘린더' },
  { href: '/settings',          label: '설정' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg text-gray-900 mr-4">OSMU Dashboard</span>
      {NAV.map(({ href, label }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href.split('/').slice(0,2).join('/'))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'text-sm font-medium transition-colors',
              active ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
