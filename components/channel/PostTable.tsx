'use client'

import { ExternalLink } from 'lucide-react'
import type { Post, Channel } from '@/lib/mock-data'
import { formatDate, cn } from '@/lib/utils'

interface Props {
  posts: Post[]
  channel: Channel
  weekFilter: 'recent4' | 'all'
  currentWeek: number
}

export default function PostTable({ posts, channel, weekFilter, currentWeek }: Props) {
  const filtered = weekFilter === 'recent4'
    ? posts.filter(p => p.weekNumber >= currentWeek - 3)
    : posts

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        해당 기간에 게시물이 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 text-left">
            <th className="py-2 pr-4 font-medium w-20">주차</th>
            <th className="py-2 pr-4 font-medium">제목</th>
            <th className="py-2 pr-4 font-medium w-28">날짜</th>
            <th className="py-2 font-medium w-16 text-center">링크</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(post => (
            <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-3 pr-4">
                <span
                  className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: channel.color }}
                >
                  {post.weekNumber}주차
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-800">{post.title}</td>
              <td className="py-3 pr-4 text-gray-500">{formatDate(post.publishedAt)}</td>
              <td className="py-3 text-center">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-white transition-opacity hover:opacity-80'
                  )}
                  style={{ backgroundColor: channel.color }}
                >
                  <ExternalLink size={11} />
                  열기
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
