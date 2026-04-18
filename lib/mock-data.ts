export type ChannelType = 'youtube' | 'instagram' | 'brunch' | 'blog' | 'threads' | 'linkedin'

export interface Channel {
  id: string
  name: string
  type: ChannelType
  icon: string
  color: string
  weeklyTarget: number
}

export interface Post {
  id: string
  channelId: string
  title: string
  url: string
  publishedAt: string
  weekNumber: number
  year: number
}

export const CHANNELS: Channel[] = [
  { id: 'ch1', name: 'YouTube',   type: 'youtube',   icon: '▶',  color: '#FF0000', weeklyTarget: 1 },
  { id: 'ch2', name: 'Instagram', type: 'instagram', icon: '📷', color: '#E1306C', weeklyTarget: 3 },
  { id: 'ch3', name: 'Brunch',    type: 'brunch',    icon: '✍',  color: '#FFCD00', weeklyTarget: 1 },
  { id: 'ch4', name: 'Blog',      type: 'blog',      icon: '📝', color: '#03CF5D', weeklyTarget: 2 },
  { id: 'ch5', name: 'Threads',   type: 'threads',   icon: '🧵', color: '#000000', weeklyTarget: 5 },
  { id: 'ch6', name: 'LinkedIn',  type: 'linkedin',  icon: '💼', color: '#0A66C2', weeklyTarget: 2 },
]

function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function makePost(id: string, channelId: string, title: string, url: string, dateStr: string): Post {
  const d = new Date(dateStr)
  return { id, channelId, title, url, publishedAt: dateStr, weekNumber: isoWeek(d), year: d.getFullYear() }
}

export const POSTS: Post[] = [
  // 16주차 (Apr 14–20, 2026)
  makePost('p1',  'ch1', 'OSMU 전략 완벽 가이드 2026',        'https://youtube.com/watch?v=abc1', '2026-04-14'),
  makePost('p2',  'ch2', '콘텐츠 제작 비하인드 #1',           'https://instagram.com/p/abc1',    '2026-04-14'),
  makePost('p3',  'ch2', '스튜디오 투어 릴스',               'https://instagram.com/p/abc2',    '2026-04-16'),
  makePost('p4',  'ch4', 'OSMU 콘텐츠 전략 완전 정복',        'https://blog.naver.com/abc1',     '2026-04-15'),
  makePost('p5',  'ch5', 'OSMU란 무엇인가?',                 'https://threads.net/@user/abc1',  '2026-04-14'),
  makePost('p6',  'ch5', '오늘의 콘텐츠 인사이트',            'https://threads.net/@user/abc2',  '2026-04-15'),
  makePost('p7',  'ch5', '채널 운영 3년 후기',               'https://threads.net/@user/abc3',  '2026-04-16'),
  makePost('p8',  'ch6', '콘텐츠 마케터의 OSMU 활용법',       'https://linkedin.com/posts/abc1', '2026-04-14'),
  makePost('p9',  'ch6', '2026 콘텐츠 트렌드 분석',          'https://linkedin.com/posts/abc2', '2026-04-17'),

  // 15주차 (Apr 7–13)
  makePost('p10', 'ch1', '유튜브 알고리즘 완벽 분석',          'https://youtube.com/watch?v=abc2', '2026-04-07'),
  makePost('p11', 'ch2', '봄 화보 촬영 현장',                'https://instagram.com/p/abc3',    '2026-04-08'),
  makePost('p12', 'ch2', '일상 브이로그 스틸컷',              'https://instagram.com/p/abc4',    '2026-04-10'),
  makePost('p13', 'ch2', '팔로워 Q&A 답변',                  'https://instagram.com/p/abc5',    '2026-04-12'),
  makePost('p14', 'ch3', '글쓰기가 두려운 당신에게',           'https://brunch.co.kr/@user/12',   '2026-04-09'),
  makePost('p15', 'ch4', '블로그 SEO 최적화 실전 팁',          'https://blog.naver.com/abc2',     '2026-04-08'),
  makePost('p16', 'ch4', '검색 노출 늘리는 키워드 전략',        'https://blog.naver.com/abc3',     '2026-04-11'),
  makePost('p17', 'ch5', '블로거에서 크리에이터로',            'https://threads.net/@user/abc4',  '2026-04-07'),
  makePost('p18', 'ch5', '콘텐츠 캘린더 운영 방법',            'https://threads.net/@user/abc5',  '2026-04-08'),
  makePost('p19', 'ch5', '링크드인 vs 브런치 비교',            'https://threads.net/@user/abc6',  '2026-04-10'),
  makePost('p20', 'ch5', '인스타 피드 구성 전략',              'https://threads.net/@user/abc7',  '2026-04-12'),
  makePost('p21', 'ch6', '퍼스널 브랜딩 시작하는 법',          'https://linkedin.com/posts/abc3', '2026-04-09'),

  // 14주차 (Mar 31 – Apr 6)
  makePost('p22', 'ch1', '쇼츠 vs 롱폼 콘텐츠 전략',          'https://youtube.com/watch?v=abc3', '2026-03-31'),
  makePost('p23', 'ch2', '3월 마지막 주 일상',               'https://instagram.com/p/abc6',    '2026-04-01'),
  makePost('p24', 'ch2', '새벽 루틴 공개',                   'https://instagram.com/p/abc7',    '2026-04-03'),
  makePost('p25', 'ch3', '나의 첫 번째 브런치 글',            'https://brunch.co.kr/@user/11',   '2026-04-02'),
  makePost('p26', 'ch4', '4월 콘텐츠 계획 공유',              'https://blog.naver.com/abc4',     '2026-04-01'),
  makePost('p27', 'ch5', '4월 시작을 맞이하며',               'https://threads.net/@user/abc8',  '2026-03-31'),
  makePost('p28', 'ch5', '콘텐츠 번아웃 극복기',              'https://threads.net/@user/abc9',  '2026-04-02'),
  makePost('p29', 'ch5', '유튜브 1000구독자 달성 후기',        'https://threads.net/@user/abc10', '2026-04-04'),
  makePost('p30', 'ch5', '글쓰기 습관 만들기',               'https://threads.net/@user/abc11', '2026-04-05'),
  makePost('p31', 'ch5', '숏폼 콘텐츠의 미래',               'https://threads.net/@user/abc12', '2026-04-06'),
  makePost('p32', 'ch6', '콘텐츠 크리에이터 커리어 전환기',    'https://linkedin.com/posts/abc4', '2026-04-03'),
  makePost('p33', 'ch6', '미디어 회사 없이 브랜드 만들기',     'https://linkedin.com/posts/abc5', '2026-04-05'),

  // 13주차 (Mar 24–30)
  makePost('p34', 'ch2', '봄맞이 새 장비 개봉기',             'https://instagram.com/p/abc8',    '2026-03-25'),
  makePost('p35', 'ch2', '일주일 콘텐츠 정리',               'https://instagram.com/p/abc9',    '2026-03-28'),
  makePost('p36', 'ch4', '크리에이터 수익화 총정리',           'https://blog.naver.com/abc5',     '2026-03-26'),
  makePost('p37', 'ch5', '주간 회고 13주차',                  'https://threads.net/@user/abc13', '2026-03-24'),
  makePost('p38', 'ch5', '협업 제안 거절하는 기준',            'https://threads.net/@user/abc14', '2026-03-26'),
  makePost('p39', 'ch5', '유튜브 섬네일 제작 팁',              'https://threads.net/@user/abc15', '2026-03-28'),
  makePost('p40', 'ch5', '뉴스레터 시작 후기',               'https://threads.net/@user/abc16', '2026-03-30'),
]

export function getPostsByWeek(weekNumber: number, year: number): Post[] {
  return POSTS.filter(p => p.weekNumber === weekNumber && p.year === year)
}

export function getPostsByChannel(channelId: string): Post[] {
  return POSTS.filter(p => p.channelId === channelId).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getChannelById(id: string): Channel | undefined {
  return CHANNELS.find(c => c.id === id)
}

export function getChannelByType(type: string): Channel | undefined {
  return CHANNELS.find(c => c.type === type)
}

export function getCurrentWeek(): { weekNumber: number; year: number } {
  const now = new Date()
  return { weekNumber: isoWeek(now), year: now.getFullYear() }
}

export interface WeeklyStats {
  channel: Channel
  posted: number
  target: number
  rate: number
}

export function getWeeklyStats(weekNumber: number, year: number): WeeklyStats[] {
  const posts = getPostsByWeek(weekNumber, year)
  return CHANNELS.map(ch => {
    const posted = posts.filter(p => p.channelId === ch.id).length
    return { channel: ch, posted, target: ch.weeklyTarget, rate: Math.round((posted / ch.weeklyTarget) * 100) }
  })
}

export interface TrendData {
  week: string
  weekNumber: number
  rate: number
  posted: number
  target: number
}

export function getRecentTrend(currentWeek: number, currentYear: number, weeks = 4): TrendData[] {
  const totalTarget = CHANNELS.reduce((sum, ch) => sum + ch.weeklyTarget, 0)
  return Array.from({ length: weeks }, (_, i) => {
    const w = currentWeek - (weeks - 1 - i)
    const posts = getPostsByWeek(w, currentYear)
    const posted = posts.length
    return {
      week: `${w}주차`,
      weekNumber: w,
      posted,
      target: totalTarget,
      rate: Math.round((posted / totalTarget) * 100),
    }
  })
}
