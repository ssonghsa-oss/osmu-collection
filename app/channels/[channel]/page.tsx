'use client'

import { useState, use, useEffect } from 'react'
import Link from 'next/link'
import { CHANNELS, getPostsByChannel, getChannelByType, getCurrentWeek, type Post } from '@/lib/mock-data'
import { loadRegisteredAsPosts, mergeAndSort } from '@/lib/registered-posts'
import PostTable from '@/components/channel/PostTable'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ channel: string }>
}

export default function ChannelPage({ params }: Props) {
  const { channel } = use(params)
  const { weekNumber } = getCurrentWeek()
  const [weekFilter, setWeekFilter] = useState<'recent4' | 'all'>('recent4')
  const [allPosts, setAllPosts] = useState<Post[]>([])

  const currentChannel = getChannelByType(channel) ?? CHANNELS[0]

  useEffect(() => {
    const mockPosts = getPostsByChannel(currentChannel.id)
    const regPosts = loadRegisteredAsPosts().filter(p => p.channelId === currentChannel.id)
    setAllPosts(mergeAndSort(mockPosts, regPosts))
  }, [currentChannel.id])

  const thisWeekPosts = allPosts.filter(p => p.weekNumber === weekNumber)
  const achieved = thisWeekPosts.length >= currentChannel.weeklyTarget

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">채널별 현황 게시판</h1>

      <div className="flex gap-2 flex-wrap">
        {CHANNELS.map(ch => (
          <Link
            key={ch.type}
            href={`/channels/${ch.type}`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors border',
              ch.id === currentChannel.id
                ? 'text-white border-transparent'
                : 'text-gray-600 border-gray-200 hover:border-gray-400 bg-white'
            )}
            style={ch.id === currentChannel.id ? { backgroundColor: ch.color, borderColor: ch.color } : {}}
          >
            {ch.icon} {ch.name}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl text-white font-bold"
              style={{ backgroundColor: currentChannel.color }}
            >
              {currentChannel.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentChannel.name}</h2>
              <p className="text-sm text-gray-500">주간 목표: {currentChannel.weeklyTarget}건</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              achieved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            )}>
              {achieved ? '✅' : '⚠️'} 이번 주 {thisWeekPosts.length}/{currentChannel.weeklyTarget}건
            </span>
            <select
              value={weekFilter}
              onChange={e => setWeekFilter(e.target.value as 'recent4' | 'all')}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white"
            >
              <option value="recent4">최근 4주</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <PostTable
          posts={allPosts}
          channel={currentChannel}
          weekFilter={weekFilter}
          currentWeek={weekNumber}
        />
      </div>
    </main>
  )
}
