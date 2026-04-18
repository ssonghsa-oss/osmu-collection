import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { CHANNELS, getPostsByChannel, getCurrentWeek } from '@/lib/mock-data'
import { formatDate, cn } from '@/lib/utils'

export default function ChannelBoard() {
  const { weekNumber } = getCurrentWeek()

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">채널별 게시판</h2>
        <span className="text-xs text-gray-400">최근 4주 기준</span>
      </div>

      <div className="divide-y divide-gray-50">
        {CHANNELS.map(ch => {
          const posts = getPostsByChannel(ch.id).filter(p => p.weekNumber >= weekNumber - 3)
          const thisWeek = posts.filter(p => p.weekNumber === weekNumber)
          const achieved = thisWeek.length >= ch.weeklyTarget

          return (
            <div key={ch.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: ch.color }}
                  >
                    {ch.icon}
                  </a>
                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-800 text-sm hover:underline"
                  >
                    {ch.name}
                  </a>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    achieved ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                  )}>
                    {achieved ? '✅' : '⚠️'} 이번 주 {thisWeek.length}/{ch.weeklyTarget}건
                  </span>
                </div>
                <Link href={`/channels/${ch.type}`} className="text-xs text-blue-500 hover:underline">
                  전체 보기 →
                </Link>
              </div>

              {posts.length === 0 ? (
                <p className="text-xs text-gray-400 pl-9">최근 4주 게시물 없음</p>
              ) : (
                <div className="space-y-1 pl-9">
                  {posts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="shrink-0 text-xs px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: ch.color + 'cc' }}
                        >
                          {post.weekNumber}주
                        </span>
                        <span className="text-sm text-gray-700 truncate">{post.title}</span>
                        <span className="shrink-0 text-xs text-gray-400">{formatDate(post.publishedAt)}</span>
                      </div>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-0.5 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  ))}
                  {posts.length > 3 && (
                    <Link href={`/channels/${ch.type}`} className="text-xs text-gray-400 hover:text-blue-500 pl-0.5">
                      +{posts.length - 3}개 더 보기
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
