# OnDevice Scholar RAG — UI Design Review

## 1. 현행 컴포넌트 구성

```
frontend/src/
├── components/
│   ├── Layout.tsx        # 사이드바 + 헬스 배지 + 네비게이션
│   └── MathRenderer.tsx  # KaTeX 인라인/블록 수식 렌더러
└── pages/
    ├── LoginPage.tsx      # 인증 화면
    ├── QueryPage.tsx      # 채팅형 RAG 쿼리 화면
    ├── DocumentsPage.tsx  # 문서 업로드/삭제
    └── AdminPage.tsx      # 인덱스 재빌드
```

---

## 2. 페이지별 현행 디자인 분석

### 2-1. LoginPage

**구조:**

- 전체 화면 중앙 정렬 (`min-h-screen flex items-center justify-center`)
- 배경: `radial-gradient` 퍼플 + 블루 orb + `#0a0a0f` 베이스
- 카드: `backdrop-blur-md` + `bg-white/[0.04]` 글래스모피즘
- 입력 필드: 좌측 아이콘 (`User`, `Lock`) + `focus:ring-purple-500/70`
- 버튼: `bg-gradient-to-r from-purple-600 to-purple-500` + `shadow-purple-500/20`

**CSS 특징:**

```css
배경: radial-gradient(ellipse at 60% 20%, #2d1b6940, transparent 60%)
카드: bg-white/[0.04] border border-white/10 rounded-2xl backdrop-blur-md
버튼: bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/20
```

**아쉬운 점:**

- 로고가 단순 `BookOpen` 아이콘뿐 — 앱 정체성 부족
- 에러 메시지가 텍스트만 (`Invalid credentials`) — UX 개선 여지
- 배경 orb 애니메이션 없음 (정적)
- `"All queries run locally"` 문구가 `text-slate-700` → 거의 안 보임

---

### 2-2. Layout (Sidebar)

**구조:**

- `w-58` 고정 너비 사이드바 (⚠️ Tailwind 비표준 — `w-56`=224px 또는 `w-60`=240px 권장)
- 상단: 로고 + `Scholar RAG` 텍스트 + `HealthBadge`
- 네비: `NavLink` + active 시 `bg-purple-500/15 text-purple-300` + dot indicator
- 하단: `Sign Out` 버튼 (`hover:text-red-400`)

**CSS 특징:**

```css
사이드바 배경: rgba(255,255,255,0.025)
구분선: rgba(255,255,255,0.07)
Active nav: bg-purple-500/15 text-purple-300
Inactive nav: text-slate-500 hover:text-slate-200 hover:bg-white/5
```

**아쉬운 점:**

- `w-58` 비표준 값 → 실제 렌더 너비 불명확
- 현재 로그인된 사용자 이름/role 표시 없음
- 사이드바 하단에 여백만 있고 빈 공간 활용 없음
- 네비 아이템이 3개뿐 → 공백이 너무 많아 밸런스 불균형

---

### 2-3. QueryPage

**구조:**

- 헤더: `Research Query` 타이틀 + 우측 `Top-K` select
- 메시지 영역: `flex-1 overflow-y-auto` 스크롤
- 입력창: `textarea` (2줄) + `Send` 버튼

**CSS 특징:**

```css
헤더: border-b border-slate-800
유저 버블: bg-purple-600 rounded-xl
어시스턴트 버블: bg-slate-800/60 border border-slate-700/40 rounded-xl
Citation 카드: bg rgba(255,255,255,0.03) border rgba(255,255,255,0.07) rounded-xl
Score bar: h-1 rounded-full (보라/인디고/회색 3단계)
```

**아쉬운 점:**

| 항목 | 문제 |
| --- | --- |
| Top-K 위치 | 헤더 우측에 고립 → 맥락 없이 떠 있음 |
| Empty state | 정적 아이콘+텍스트만 → 예시 쿼리 없음 |
| Citation 카드 | 항상 전체 펼침 → 길 경우 스크롤 과부하 |
| 메시지 | 타임스탬프 없음 |
| 대화 초기화 | Clear 버튼 없음 |
| 입력창 | 자동 높이 조절 없음 (fixed 2줄) |
| 텍스트 복사 | 답변 복사 버튼 없음 |

---

### 2-4. DocumentsPage

**구조:**

- 드래그앤드롭 업로드 존 (`border-2 border-dashed rounded-2xl`)
- 삭제: 텍스트 입력 → Delete 버튼

**아쉬운 점:**

| 항목 | 문제 |
| --- | --- |
| 삭제 방식 | 파일명을 직접 타이핑해야 함 → UX 취약 |
| 업로드된 문서 목록 | 현재 인덱싱된 문서 목록 조회 기능 없음 |
| 진행 상태 | 파일 하나씩 순차 업로드, 전체 진행률 없음 |
| 파일 유효성 | 잘못된 파일 타입 피드백 약함 |

---

### 2-5. AdminPage

**구조:**

- 단일 `Rebuild Index` 카드 + 결과 stats (Documents / Total Chunks)

**아쉬운 점:**

- 기능이 하나뿐 → 페이지가 너무 단순
- 인덱스 상태 (현재 문서 수, 청크 수) 실시간 표시 없음
- `data/raw/` 경로 노출이 운영 환경에서 부적절할 수 있음

---

## 3. 전체 디자인 시스템 분석

### 색상 체계

| 역할 | 현재 값 | 평가 |
| --- | --- | --- |
| 배경 | `#0a0a0f` | ✅ 매우 딥 다크 |
| 포인트 | `purple-500/600` | ✅ 일관성 있음 |
| 텍스트 주요 | `text-white` / `text-slate-200` | ✅ |
| 텍스트 보조 | `text-slate-400/500` | ✅ |
| 경계선 | `rgba(255,255,255,0.07)` | ⚠️ 너무 미묘 |
| 성공 | `green-500` | ✅ |
| 경고 | `yellow-400` | ✅ |
| 위험 | `red-500/600` | ✅ |

### 타이포그래피

| 요소 | 현재 | 평가 |
| --- | --- | --- |
| 페이지 타이틀 | `font-semibold text-white` | ✅ |
| 섹션 헤더 | `text-sm font-medium text-slate-300` | ⚠️ 작음 |
| 본문 | `text-sm text-slate-200` | ✅ |
| 보조 텍스트 | `text-xs text-slate-400/500` | ✅ |
| 코드 | `bg-slate-700 text-slate-300 rounded` | ✅ |

---

## 4. 개선 방향 (우선순위 순)

### 🔴 High Priority

**① QueryPage — Top-K 위치 이동**

- 현재: 헤더 우측에 고립
- 개선: 입력창 좌측에 배치 (전송 버튼과 같은 행)

**② DocumentsPage — 문서 목록 조회**

- 현재: 업로드/삭제만 있고 현재 인덱스 문서 목록 없음
- 개선: `GET /documents` API 추가 또는 Admin 통계 활용

**③ QueryPage — Empty state 예시 쿼리 칩**

```
[What is attention mechanism?]  [Compare BERT and GPT]  [Explain Transformer complexity]
```

### 🟡 Medium Priority

**④ Citation 카드 접기/펼치기**

- 답변 아래 `Sources (N) ▼` 토글로 기본 접힘 처리

**⑤ 사이드바 — 로그인 사용자 정보 표시**

- 하단에 `username + role badge` 추가

**⑥ QueryPage — 답변 복사 버튼**

- 어시스턴트 버블 우측 상단 `Copy` 아이콘 버튼

**⑦ QueryPage — Clear conversation 버튼**

- 헤더에 휴지통 아이콘

### 🟢 Low Priority

**⑧ `w-58` → `w-60` 수정**

**⑨ 입력창 자동 높이 조절 (`auto-resize textarea`)**

**⑩ 메시지 타임스탬프 (hover 시 표시)**

**⑪ 로그인 배경 orb 부드러운 float 애니메이션 추가**

---

## 5. 구현 난이도 × 효과 매트릭스

```
높은 효과
    │  ③ Empty state 칩      ① Top-K 이동
    │  ⑦ Clear 버튼          ② 문서 목록
    │  ⑥ 복사 버튼           ④ Citation 토글
    │  ⑤ 사용자 정보
    │  ⑨ Auto-resize         ⑩ 타임스탬프
    │  ⑪ 로그인 애니         ⑧ w-58 수정
낮은 효과
    └─────────────────────────────────────
       낮은 난이도          높은 난이도
```

---

## 6. Phase 2.1 — Graphite Lab 리팩터링 설계

### 6-1. 방향 결정

**선택:** Direction A — Graphite Lab  
**핵심 원칙:**
- 퍼플을 "빼는 것"이 아니라 **"뒤로 물리는 것"**
- 강한 색 포인트를 최소화하고, 중립 그레이/슬레이트를 앞으로
- 기능 변경 없이 색·톤·질감만 변경

**색 역할 분류 (역할 기반 색 설계):**

| 역할 | 설명 | 허용 색 |
| --- | --- | --- |
| Primary | 주 액션 (Send, Login, Rebuild) | `indigo-600` solid 한 곳만 |
| Focus | 인풋 포커스 링 | `indigo-500/60` |
| Info | Health badge, role badge | `cyan-400` / `teal-400` |
| Semantic | 성공/경고/오류 | `green-400`, `yellow-400`, `red-400` 유지 |
| Decorative | orb, glow, 배경 효과 | **제거 또는 무채색 처리** |
| Brand | 로고, 로그인 로고만 | `purple-500` 1~2개 최대 |

---

### 6-2. 색 토큰 매핑

#### 배경 계열

| 토큰 | 현재 | 변경 후 | 비고 |
| --- | --- | --- | --- |
| `bg-base` | `#0a0a0f` | `#080b10` | 약간 네이비 틴트 |
| `bg-surface` | `rgba(255,255,255,0.025)` | `#0f1117` | 명시적 다크 슬레이트 |
| `bg-card` | `rgba(255,255,255,0.03)` | `#111827` (gray-900) | |
| `bg-input` | `bg-slate-800` | `#0d1117` | 더 어둡고 차분하게 |
| `border-subtle` | `rgba(255,255,255,0.07)` | `rgba(255,255,255,0.08)` | 미세 조정 |

#### 퍼플 → 인디고/슬레이트 전환

| 요소 | 현재 | 변경 후 |
| --- | --- | --- |
| Login 버튼 | `from-purple-600 to-purple-500 gradient` | `bg-indigo-600` solid + `hover:bg-indigo-500` |
| Login 버튼 그림자 | `shadow-purple-500/20` | 제거 |
| 로고 glow blur | `bg-purple-500/40 blur-md` | `bg-indigo-500/20 blur-sm` (약화) |
| Active nav | `bg-purple-500/15 text-purple-300` | `bg-slate-700/60 text-slate-100` |
| Active nav dot | `bg-purple-400` | `bg-cyan-400` |
| Send 버튼 | `bg-purple-600 hover:bg-purple-500` | `bg-indigo-600 hover:bg-indigo-500` |
| Citation 제목 | `text-purple-300` | `text-slate-100` |
| arXiv 링크 | `text-purple-400/70` | `text-cyan-400/70` |
| Focus ring | `focus:ring-purple-500` | `focus:ring-indigo-500/60` |
| Score bar (high) | `#a855f7` | `#6366f1` (인디고) |
| Score bar (mid) | `#6366f1` | `#4b5563` (gray) |
| Login orb | `bg-purple-700/10 blur-3xl` | 제거 |
| Sidebar logo glow | `bg-purple-500/40 blur-md` | `bg-slate-600/30 blur-sm` |

#### 유지하는 것

| 요소 | 이유 |
| --- | --- |
| 로고 아이콘 배경 `from-purple-500 to-purple-700` | 브랜드 포인트 1개 허용 |
| `text-emerald-400` Health Online | 시맨틱 색상 유지 |
| `text-red-400` Health Offline | 시맨틱 색상 유지 |
| `bg-yellow-500/10` Warning 배너 | 시맨틱 색상 유지 |
| `bg-green-500/10` 성공 피드백 | 시맨틱 색상 유지 |

---

### 6-3. 화면별 퍼플 허용 개수 룰

| 화면 | 최대 강한 색 요소 수 | 허용 위치 |
| --- | --- | --- |
| LoginPage | 2개 | 로고 배경, Login 버튼 (indigo로 전환) |
| Layout (Sidebar) | 1개 | 로고 아이콘 그라디언트만 |
| QueryPage | 1개 | Send 버튼 (indigo로 전환) |
| DocumentsPage | 0개 | 업로드/삭제는 neutral |
| AdminPage | 1개 | Rebuild 버튼 (indigo로 전환) |

---

### 6-4. 구현 순서 (다음 세션)

1. `Layout.tsx` — Active nav 색, sidebar glow, `w-58` → `w-60`
2. `LoginPage.tsx` — 버튼 gradient 제거, orb 제거, focus ring 변경
3. `QueryPage.tsx` — Send 버튼, citation 카드 제목, arXiv 링크, score bar
4. `DocumentsPage.tsx` + `AdminPage.tsx` — 버튼 색 통일
5. 전체 빌드 확인 + 테스트

---

*Phase 2.1 설계 작성: 2026-03-26 / Edwin Cho*
