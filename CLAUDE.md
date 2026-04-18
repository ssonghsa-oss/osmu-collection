# OSMU Collection Dashboard — MVP Plan

## Context
채널별 One Source Multi Use 현황을 한눈에 파악하는 내부 대시보드.  
6개 채널(YouTube, Instagram, Brunch, Blog, Threads, LinkedIn)의 게시물을 주 1회 API로 자동 수집하여,  
이수율·게시판·캘린더 3가지 핵심 기능을 제공하는 MVP를 구축한다.

---

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **DB**: Supabase (PostgreSQL)
- **UI**: Tailwind CSS + shadcn/ui
- **Chart**: Recharts
- **Cron**: Vercel Cron Jobs (주 1회 자동 sync)
- **배포**: Vercel

---

## 프로젝트 구조

```
osmu-collection/
├── app/
│   ├── page.tsx                  # 전체 현황 대시보드 (메인)
│   ├── channels/
│   │   └── [channel]/page.tsx    # 채널별 현황 게시판
│   ├── calendar/page.tsx         # 콘텐츠 캘린더
│   ├── settings/page.tsx         # API 키 및 채널 설정
│   └── api/
│       ├── sync/route.ts         # POST: 전체 채널 동기화
│       ├── sync/[channel]/route.ts  # POST: 특정 채널 동기화
│       └── posts/route.ts        # GET: 게시물 목록
├── components/
│   ├── dashboard/
│   │   ├── CompletionRateCard.tsx   # 이수율 카드
│   │   ├── ChannelSummaryChart.tsx  # 채널별 막대 그래프
│   │   └── WeeklyTrendChart.tsx     # 주간 트렌드 라인 차트
│   ├── channel/
│   │   ├── PostList.tsx             # 게시물 목록 테이블
│   │   └── PostCard.tsx             # 게시물 카드 (링크 포함)
│   ├── calendar/
│   │   └── WeeklyCalendar.tsx       # 주간 캘린더 뷰
│   └── ui/                          # shadcn/ui 컴포넌트
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── sync/
│   │   ├── youtube.ts            # YouTube Data API v3
│   │   ├── instagram.ts          # Instagram Graph API
│   │   ├── brunch.ts             # RSS 파싱 (브런치 RSS 지원)
│   │   ├── blog.ts               # RSS 파싱 (네이버/티스토리 등)
│   │   ├── threads.ts            # Meta Threads API
│   │   └── linkedin.ts           # LinkedIn API
│   └── utils.ts                  # 주차 계산, 날짜 유틸
├── vercel.json                   # Cron Job 설정 (매주 월요일 09:00 KST)
└── .env.local                    # API 키 환경변수
```

---

## DB 스키마 (Supabase)

```sql
-- 채널 정보
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,          -- 'YouTube', 'Instagram', ...
  type TEXT NOT NULL,          -- 'youtube' | 'instagram' | 'brunch' | 'blog' | 'threads' | 'linkedin'
  icon TEXT,                   -- emoji or icon key
  color TEXT,                  -- hex color for charts
  weekly_target INT DEFAULT 1, -- 주간 목표 게시 수
  api_config JSONB,            -- channel URL, RSS URL, handle 등
  is_active BOOL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 게시물
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  title TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  week_number INT NOT NULL,    -- ISO week number
  year INT NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT now()
);

-- 동기화 로그
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id),
  synced_at TIMESTAMPTZ DEFAULT now(),
  posts_fetched INT DEFAULT 0,
  status TEXT,                 -- 'success' | 'error'
  error_msg TEXT
);
```

---

## 핵심 기능 상세

### 1. 현황 이수율 (메인 대시보드 `/`)
- 전체 이수율 = 이번 주 실제 게시 수 / (채널 수 × 주간 목표) × 100
- 채널별 이수율 도넛/막대 그래프 (Recharts)
- 최근 4주 트렌드 라인 차트
- 상단 요약 카드: 전체 게시물 수, 이번 주 달성률, 미달성 채널 수

### 2. 채널별 현황 게시판 (`/channels/[channel]`)
- 채널 선택 탭 (6개 채널)
- 게시물 목록: 제목, 날짜, 링크(클릭 시 새 탭), 주차 표시
- 주차별 필터 (최근 4주 / 전체)
- 채널별 달성률 배지

### 3. 콘텐츠 캘린더 (`/calendar`)
- 주간 캘린더 뷰 (7열)
- 각 날짜 셀에 해당 채널 게시물 표시 (채널 색상 뱃지)
- 이전/다음 주 이동
- 게시물 클릭 시 원본 링크로 이동

---

## API 자동 수집 전략

| 채널 | 방식 | 비고 |
|------|------|------|
| YouTube | YouTube Data API v3 | API 키 필요 |
| Instagram | Instagram Graph API | Business 계정 + Access Token 필요 |
| Brunch | RSS 파싱 (`https://brunch.co.kr/rss/@{id}`) | API 키 불필요 |
| Blog | RSS 파싱 (네이버/티스토리 RSS URL) | API 키 불필요 |
| Threads | Meta Threads API | Access Token 필요 (2024 공개) |
| LinkedIn | LinkedIn API (UGC Posts) | OAuth Access Token 필요 |

- 주 1회 자동 sync: `vercel.json`의 Cron Job → `/api/sync` 호출
- 수동 sync 버튼: Settings 페이지에서 즉시 실행 가능
- API 키는 Supabase DB의 `channels.api_config`(암호화) 또는 Vercel 환경변수로 관리

---

## 구현 순서

1. **프로젝트 초기화** — `npx create-next-app`, Supabase 연결, Tailwind + shadcn/ui 설치
2. **DB 스키마 생성** — Supabase에 테이블 3개 생성, 초기 채널 데이터 시딩
3. **Sync 로직** — 채널별 API/RSS 파싱 함수 (`lib/sync/`)
4. **API Routes** — `/api/sync`, `/api/posts`
5. **메인 대시보드** — 이수율 카드 + 차트 (`app/page.tsx`)
6. **채널별 게시판** — 게시물 목록 테이블 (`app/channels/[channel]/page.tsx`)
7. **캘린더** — 주간 뷰 (`app/calendar/page.tsx`)
8. **Settings** — API 키 입력, 수동 sync 버튼 (`app/settings/page.tsx`)
9. **Vercel Cron** — `vercel.json` 주간 자동 sync 설정

---

## 검증 방법
1. `npm run dev` 후 로컬에서 전체 3개 페이지 확인
2. Settings에서 수동 sync 실행 → DB에 posts 저장 확인 (Supabase Table Editor)
3. 메인 대시보드 이수율/그래프 렌더링 확인
4. 채널별 게시판 링크 클릭 시 원본 URL 이동 확인
5. 캘린더에서 날짜별 게시물 표시 확인
