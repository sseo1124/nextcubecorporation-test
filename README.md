# 하루 계획표 타임라인 스케줄러

하루의 계획(Plan)과 실행(Execution)을 타임라인 형태로 비교하여 시각화하는 웹 애플리케이션입니다.

## 📋 목차

- [라이브 데모](#라이브-데모)
- [개요](#개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [PRD 작성 프롬프트](#prd-작성-프롬프트)
- [구현 프롬프트 및 커밋 히스토리](#구현-프롬프트-및-커밋-히스토리)

## 🚀 라이브 데모
<img width="565" height="726" alt="스크린샷 2026-01-19 오후 4 14 36" src="https://github.com/user-attachments/assets/0350ae5e-616c-498b-ac1f-69265abbbf8b" />

프로젝트가 Vercel에 배포되어 있으며, 아래 링크에서 바로 사용해볼 수 있습니다:

**🔗 [https://nextcubecorporation-test.vercel.app/](https://nextcubecorporation-test.vercel.app/)**

라이브 데모에서 다음 기능을 체험할 수 있습니다:
- 24시간 타임라인 시각화
- 계획과 실행 나란히 비교
- 스케줄 추가/수정/삭제
- 시간별 Row 동적 리사이징
- 블록 겹침 처리 및 투명도 시스템
- 현재 시간 인디케이터

## 개요

이 프로젝트는 시간별 격자(Hour Cell) 기반의 상대 위치 방식을 사용하여 타임라인을 구현합니다. 각 시간대(00:00~23:00)를 독립적인 Row로 관리하며, 계획과 실행을 나란히 비교할 수 있는 인터랙티브한 UI를 제공합니다.

### 핵심 특징

- ⏰ **시간별 격자 기반 구조**: 각 시간대를 독립적인 Row로 관리하여 동적 리사이징 지원
- 🎨 **시각적 중첩 시스템**: 블록 겹침 시 투명도와 동적 Z-Index로 가독성 보장
- 📱 **반응형 디자인**: 데스크톱, 태블릿, 모바일 환경 지원
- 🎯 **직관적인 인터랙션**: 클릭, 호버 등 다양한 사용자 인터랙션

## 주요 기능

### 1. 타임라인 시각화
- 24시간 타임라인 (00:00 ~ 23:59)
- 계획(Plan)과 실행(Execution) 나란히 비교
- 시간별 Row 독립 관리 및 동적 높이 조절

### 2. 스케줄 관리
- 스케줄 추가/수정/삭제
- 시간 선택 (5분 단위 드롭다운)
- 8가지 파스텔 색상 팔레트

### 3. 고급 기능
- **시간 겹침 처리**: 동적 Z-Index 계산으로 겹치는 블록 관리
- **텍스트 오버플로우**: 블록 높이에 따른 조건부 텍스트 표시
- **현재 시간 표시**: 실시간 현재 시간 인디케이터
- **Row 동적 리사이징**: 특정 시간대 확대/축소 (30px ~ 300px)

## 기술 스택

### 프레임워크 & 라이브러리
- **Next.js 15.1.0**
- **React 19.0.0**
- **TypeScript 5**

### UI & 스타일링
- **shadcn/ui**: 기본 UI 컴포넌트 (Dialog, Select, Button 등)
- **Tailwind CSS 3.4.1**: 유틸리티 기반 스타일링
- **Radix UI**: 접근성 기반 컴포넌트

### 성능 최적화
- **React Compiler**: 자동 메모이제이션

## 프로젝트 구조

```
nextcube-test/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 타임라인 페이지
│   └── globals.css         # 전역 스타일
├── components/
│   ├── timeline/           # 타임라인 관련 컴포넌트
│   │   ├── TimelineContainer.tsx
│   │   ├── TimelineHeader.tsx
│   │   ├── TimeAxis.tsx
│   │   ├── HourRow.tsx
│   │   ├── ScheduleBlock.tsx
│   │   ├── ScheduleColumn.tsx
│   │   ├── CurrentTimeIndicator.tsx
│   │   └── RowResizeHandle.tsx
│   ├── schedule-form/      # 스케줄 폼 컴포넌트
│   │   ├── ScheduleFormDialog.tsx
│   │   ├── TimeSelector.tsx
│   │   └── ColorSelector.tsx
│   └── ui/                 # shadcn/ui 컴포넌트
├── lib/
│   ├── types.ts            # TypeScript 타입 정의
│   ├── constants.ts        # 상수 (색상 팔레트 등)
│   └── utils/
│       ├── schedule-splitter.ts    # 시간 분할 로직
│       ├── z-index-calculator.ts  # Z-Index 계산
│       ├── text-display.ts        # 텍스트 오버플로우 처리
│       └── time-utils.ts          # 시간 유틸리티
├── hooks/
│   └── useScheduleData.ts  # 스케줄 데이터 관리 훅
└── mock/
    └── schedule-data.ts    # 테스트용 Mock 데이터
```

## 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## PRD 작성 프롬프트

### 주요 프롬프트 및 변경사항

#### 1. PRD 작성 요청 (초기 요구사항 정의)

**프롬프트**:

[Role Definition] 너는 시니어 프론트엔드 개발자야. 내가 업로드한 스크린샷은 스케줄러 앱의 '하루 계획표' 화면이야. 첨부된 스크린샷처럼 하루의 '계획(Plan)'과 '실행(Execution)'을 타임라인 형태로 비교해서 볼 수 있는 화면을 프로그래밍으로 구현하는 역할이야.

[Task] 본격적으로 코딩하기 전에, 이 UI를 구현하기 위한 상세 요구사항 명세(PRD)를 먼저 작성해줘. 특히 다음 사항들을 '모호한 사항들(Unknown)'에서 '구체적인 사항(Known)'으로 명확히 정의해줘.
1. 레이아웃 구조: 좌측 시간축(Timeline)과 우측 컨텐츠 영역(계획 Plan과 실행 Execution)의 비율 및 배치 방식
2. 시간 블록 로직: 시간의 흐름(예: 1시간 = 60px)과 블록의 높이를 어떻게 매핑할 것인지?
3. 스케쥴 입력 로직: 사용자 클릭 했을때 제목(title), 설명(description), 색깔, 시작시간, 끝나는 시간 설정 입력 형식을 어떻게 할 것인지?
4. 데이터 구조: 이 화면을 렌더링하기 위해 필요한 JSON 데이터 스키마 - 계획(plan)과 실행(Execution)을 어떻게 구분할지? 시간 블록안에 들어가는 제목(title)과 설명(description) 구조를 어떻게 할 것인지? 이벤트 설정에 들어가는 제목, 설명, 색깔, 시작시간, 끝나는 시간의 구조를 어떻게 할 것인지?
5. 예외 케이스 - 텍스트가 블록보다 길어질 경우(Overflow), 시간이 겹치는 경우(Overlap)에 대한 처리 방안, 타임라인(예: 1시간 단위)에서 시간블록의 높이가 길어지는 경우

**주요 변경사항**:
- 기본 요구사항 정의 및 레이아웃 구조 설계
- 시간 블록 로직 초기 설계 (1min = 1px 전역 절대 좌표 방식)
- 스케줄 입력 로직 정의
- 데이터 구조 설계
- 예외 케이스 처리 방안

**관련 Commit**: 
- `fbd1f81` - docs: PRD 요구사항 명세서 추가

#### 2. 시간 블록 위치 로직 수정 (핵심 아키텍처 변경)

**프롬프트**:

너가 제안한 1min = 1px 기반의 전역 절대 좌표(Global Absolute Position) 방식을 검토하고 싶어.

1. 문제점: 사용자가 특정 시간(예: 13 ~ 14시)만 자세히 보고 싶어서 드래그로 해당 셀의 높이를 늘리는 동적 리사이징(Dynamic Resizing) 기능을 고려하면, 전역 좌표 방식은 한계가 있어. 13시의 높이가 변하면 14시 이후의 모든 topPosition 값을 다시 계산해야하는 비효율이 발생해.

2. 새로운 접근 방식: 시간별 격자(Hour Cell)기준의 상대위치 방식으로 설계를 제안해. container: 13:00, 14:00 등 시간대는 독립적인 div와 row를 가진다. 이 row 높이는 최소 높이는 60px지만 가변적일 수 있다. item position: 각 일정의 블록은 해당 시간 Row 내부에 CSS percentage(%)를 사용하여 위치한다. 예를 들면, 9:30분에 시작하면 9시 Row에 50%지점에 위치 그리고 15분 지속이면 높이 25% 시간블록 높이를 가지게 된다.

3. 새로운 접근 방식의 해결해야는 과제: 예: 9:40 ~ 10:10 일정이 있다면, 이는 9시 Row와 10시 Row에 걸쳐서 렌더링되어야 해. 데이터를 렌더링 하기 전에 시간을 넘어가는 일정에 시각적을 분할(split)하는 각 Row에 배분되는 전처리과정의 로직 필요할 것 같아.

위 논리를 바탕으로 검토해줘. 내가 제시한 근거가 객관적인 판단하고 좋은 제안이라면 위 논리 바탕으로 계획을 수정해줘. 만약, 근거가 빈약하거나 더 좋은 방식이 있다면 제시해주면 좋겠어.

**주요 변경사항**:
- ❌ **제거**: 전역 절대 좌표 방식 (1min = 1px)
- ✅ **추가**: 시간별 격자 기반 상대 위치 방식
  - 각 시간대를 독립적인 Row로 관리
  - 블록 위치는 각 Row 내부에서 CSS percentage(%) 사용
  - 시간 경계를 넘는 일정은 자동 분할(split) 로직
- 동적 리사이징 지원 (특정 Row만 확대/축소 가능)

**영향받은 파일**:
- `PRD.md` - 섹션 3 전체 재작성
- `lib/utils/schedule-splitter.ts` - 시간 분할 로직 구현

**관련 Commit**: 
- `07891ea` - feat: 하루 계획표 타임라인 기반 구조 구현
- `0ad60fb` - feat(timeline): 타임라인 UI 컴포넌트 구현

#### 3. Data Model & Scope 간소화

**프롬프트**:

[PRD 수정사항: Data Model & Scope] 앞서 작성한 PRD 내용을 바탕으로, 다음 수정 사항들을 반영하여 문서를 간소화하고 스키마를 확정해줘.

1. 불필요한 섹션 제거: 3.6의 '전역 좌표 vs 상대 좌표 비교' 내용은 의사결정이 끝났으므로 문서에서 제외해. 8, 9번 항목(접근성, 추가 고려사항)도 MVP 구현 우선순위를 위해 이번 범위에서 제외해.

2. JSON Schema 최적화 (ScheduleItem): metadata 필드 제거 - 현재 렌더링에 사용되지 않는 데이터이므로 과감히 삭제. status 필드 정의 - status 필드를 사용하고, 값을 'plan' | 'execution' Enum으로 정의해. Logic: 드래그 앤 드롭으로 컬럼 간 이동이 발생할 때, 데이터의 status 값만 업데이트하면 렌더링 위치가 변경되도록 설계해줘.

**주요 변경사항**:
- ❌ **제거**: 
  - `metadata` 필드 (렌더링에 사용되지 않음)
  - 섹션 3.6 (전역 좌표 vs 상대 좌표 비교)
  - 섹션 8 (접근성)
  - 섹션 9 (추가 고려사항)
- ✅ **추가**: 
  - `status: "planned" | "executed"` 필드
  - `plans`/`executions` 배열을 `items` 배열로 통합
- 드래그 앤 드롭으로 컬럼 간 이동 시 `status`만 업데이트하면 렌더링 위치 변경

**영향받은 파일**:
- `PRD.md` - 섹션 5 (데이터 구조) 재작성
- `lib/types.ts` - ScheduleItem 인터페이스 수정

**관련 Commit**: 
- `ea084b0` - feat(hooks): useScheduleData 훅 구현

#### 4. UI 구체사항: Interaction & Rendering Logic

**프롬프트**:

[UI 구체사항: Interaction & Rendering Logic] UI 동작 방식과 엣지 케이스 처리에 대해 구체적인 가이드를 줄게. 이를 PRD의 구현 상세(Spec)에 반영해줘.

1. 입력 방식 (Input Controls): 시간 선택 - 텍스트 입력 대신 Dropdown (Select) 방식을 사용. 시간(Hour)과 분(Minute)은 5분 단위로 선택 가능하게 해줘. 색상 선택 - 커스텀 컬러 피커는 제외. 미리 정의된 Tailwind 기반 '기본 색상 팔레트' 중에서만 선택하도록 제한해.

2. 텍스트 오버플로우 처리: Problem - Row 높이가 가변적이므로 짧은 시간(예: 10분) 블록에서는 텍스트가 잘릴 수 있음. Solution - 픽셀 높이에 따른 조건부 렌더링 적용. 높이 < 30px: 제목만 표시 (truncate), 30px ~ 60px: 제목 + 설명 1줄, 60px 이상: 전체 표시

3. 시간 겹침 처리 (Overlapping Events): Strategy - 같은 시간대(Row)에 일정이 겹칠 경우, 복잡한 재배치 로직 대신 시각적 중첩을 허용해. Style - 겹치는 블록은 opacity(투명도)를 주어 구분하고, zIndex를 활용해 클릭 시 상위로 오게 하거나 명확히 구분되도록 처리해줘.

4. 긴 시간 블록 (Long Duration): 이전에 논의한 '시간 단위 분할(Split by Hour)' 로직을 그대로 유지하면 되므로 별도 추가 로직은 불필요해.

**주요 변경사항**:
- ✅ **시간 선택**: Dropdown (Select) 방식, 5분 단위
  - Hour와 Minute을 분리한 드롭다운
  - 유효성 검사 (시작 < 종료)
- ✅ **색상 선택**: 8가지 파스텔 톤 색상 팔레트만 사용 (커스텀 컬러 피커 제외)
- ✅ **텍스트 오버플로우**: 픽셀 높이 기반 조건부 렌더링
  - < 30px: 제목만 표시 (truncate)
  - 30px ~ 60px: 제목 + 설명 1줄
  - ≥ 60px: 전체 표시
- ✅ **시간 겹침**: 시각적 중첩 방식 (opacity + zIndex)

**영향받은 파일**:
- `components/schedule-form/TimeSelector.tsx` - 시간 선택 드롭다운
- `components/schedule-form/ColorSelector.tsx` - 색상 팔레트
- `lib/utils/text-display.ts` - 텍스트 오버플로우 처리
- `lib/constants.ts` - 파스텔 색상 팔레트 정의

**관련 Commit**: 
- `3dbbba3` - feat(schedule-form): 스케줄 추가/수정 폼 컴포넌트 구현
- `7d5b383` - feat(utils): 텍스트 오버플로우 처리 유틸리티 구현

#### 5. UI/UX 개선: Colors & Overlap

**프롬프트**:

[UI/UX 개선사항: Colors & Overlap] 이전 PRD 내용 중 '색상'과 '시간 겹침(Overlap)' 처리에 대한 로직을 다음과 같이 구체화한다. 이를 구현 로직에 반영해줘.

1. 색상 및 투명도 시스템 (Color & Opacity System): Palette - 커스텀 컬러 피커 없이, 사전에 정의된 8가지 '기본 파스텔 톤 색상' 배열을 사용한다. Default State - 모든 시간 블록은 겹치는 영역이 보이도록 기본적으로 반투명(Opacity ~60%) 상태여야 한다. (예: Tailwind의 bg-color-500/60) 상호작용 방식 - Hover/Click: 사용자가 블록에 마우스를 올리거나 클릭하여 선택했을 때는 불투명(Opacity 100%) 상태로 변경되어, 현재 보고 있는 블록을 명확히 강조한다. Tailwind 예시: className="bg-blue-500/60 hover:bg-blue-500 transition-opacity"

2. 동적 Z-Index 계산 로직: 같은 시간대(Row) 내에서 블록이 겹칠 때, 가독성을 위해 z-index를 다음 규칙에 따라 동적으로 계산하여 인라인 스타일로 적용한다. 완전 포함 관계 (Nested Case) - 상황: 블록 A가 블록 B의 시간 내부에 완전히 포함되는 경우 (예: B 09:00 ~ 09:50, A 09:10 ~ 09:20). 규칙: 내부 블록(A)의 z-index > 외부 블록(B)의 z-index. (사용자가 숨겨진 작은 블록을 클릭할 수 있어야 함) 걸침 관계 (Overlapping Case) - 상황: 블록 A와 B가 일부만 겹치는 경우 (예: B 09:30 ~1 0:00, A 09:40 ~ 10:10). 규칙: 더 늦게 끝나는 블록(A)의 z-index > 먼저 끝나는 블록(B)의 z-index.

구현 제안: 렌더링 전, 해당 Row의 모든 이벤트를 순회하며 위 규칙에 따라 zIndex 값을 계산해주는 유틸리티 함수 calculateZIndex(events)를 작성해줘. 기본적으로 "지속 시간(Duration)이 짧을수록 높은 z-index"를 가지면 포함 관계는 해결되고, 걸침관계(overlap) "종료 시간이 늦을수록 높은 z-index"를 부여하는 가중치 로직을 적용하면 될 것 같아.

**주요 변경사항**:
- ✅ **색상 팔레트**: 8가지 파스텔 톤 색상
  - Lavender, Mint, Peach, Sky, Rose, Butter, Lilac, Sage
- ✅ **투명도 시스템**:
  - 모든 블록 기본 60% 투명도
  - Hover/Click 시 100% 불투명
  - Tailwind 클래스: `bg-{color}/60 hover:bg-{color}`
- ✅ **동적 Z-Index 계산 로직**:
  - **완전 포함 관계**: 내부 블록 > 외부 블록 (지속 시간이 짧을수록 높은 z-index)
  - **걸침 관계**: 더 늦게 끝나는 블록 > 먼저 끝나는 블록
  - 가중치 기반 계산: `durationWeight * 2 + endTimeWeight`
  - 정규화: 10 ~ 100 범위로 정규화

**영향받은 파일**:
- `lib/utils/z-index-calculator.ts` - Z-index 계산 로직
- `components/timeline/ScheduleBlock.tsx` - 투명도 시스템 적용
- `lib/constants.ts` - 8가지 파스텔 색상 팔레트

**관련 Commit**: 
- `6f963fe` - feat(utils): z-index 계산 유틸리티 구현
- `abd8b97` - feat(timeline): 블록 겹침 처리 및 투명도 시스템 구현
- `ed97c06` - feat(constants): Z-Index 계층 구조 상수 정의

#### 6. Tech Stack 확정

**프롬프트**:

[Tech Stack] 구현 기술 전략을 다음과 같이 확정한다.

1. 메모이제이션 (Memoization): useMemo, useCallback 등을 수동으로 작성하지 않는다. React Compiler 설정을 활성화하여 컴파일러 단계에서 자동으로 최적화되도록 구성한다.

2. Framework: Next.js (App Router) - 프로젝트 제출 및 배포(Vercel)의 용이성, 그리고 TypeScript와의 강력한 호환성 때문. 서버 사이드 기능보다는 Client Component 위주의 인터랙션이 많으므로 'use client' 지시어를 적절히 활용한다.

3. UI Component: shadcn/ui - 스타일을 처음부터 짜는 시간을 줄이고 핵심 로직(타임라인 계산)에 집중하기 위함. Card (레이아웃), Select (시간 입력), Button 등의 컴포넌트를 사용하여 기본 UI를 빠르게 구축한다. 스타일 오버라이딩이 자유로운 장점을 활용해 타임라인 커스텀 디자인을 적용한다.

4. Styling: Tailwind CSS - 동적인 값(높이, 위치)을 className이나 style 속성으로 직관적으로 매핑하기 위해 필수적이다.

**주요 변경사항**:
- ✅ **Next.js (App Router)**: Client Component 중심 구조
  - 배포 용이성 (Vercel)
  - TypeScript 호환성
- ✅ **shadcn/ui**: 기본 UI 컴포넌트 (Card, Select, Button, Dialog 등)
  - 개발 속도 향상
  - 스타일 오버라이딩 자유로움
- ✅ **Tailwind CSS**: 동적 값 매핑, 파스텔 색상 팔레트 커스터마이징
- ✅ **React Compiler**: 자동 메모이제이션 (수동 useMemo/useCallback 제거)

**영향받은 파일**:
- `next.config.ts` - React Compiler 설정
- `tailwind.config.ts` - 파스텔 색상 팔레트 정의
- `components.json` - shadcn/ui 설정
- `package.json` - 의존성 추가

**관련 Commit**: 
- `3025d43` - chore(setup): Next.js 프로젝트 초기 설정
- `67e94e3` - feat(ui): shadcn/ui 기본 컴포넌트 추가
- `823c412` - feat: React Compiler 설정 추가
- `83dea25` - refactor: useMemo/useCallback 제거 (React Compiler 자동 최적화)



## 구현 프롬프트 및 커밋 히스토리

PRD 작성 이후, 실제 구현 단계에서 사용된 프롬프트와 각 커밋 매칭을 정리합니다.

#### 1. schedule-splitter 로직 리팩토링

**프롬프트**:

@lib/utils/schedule-splitter.ts:11-86 splitEventsByHour 로직에는 두 가지 치명적인 설계 결함이 있어. 이를 해결하기 위해 로직을 전면 수정해줘.

문제점 분석:
1. 경계값 처리 오류 (Boundary Condition Error) - 문제: 현재 로직이 종료 시간을 포함(Inclusive)하는 방식으로 처리되거나, 59분을 끝으로 가정하고 있어. 증상: 09:00 ~ 10:00 스케줄의 경우, 10:00는 9시 타임라인의 끝일뿐인데 이를 10시 타임라인의 시작으로도 잘못 인식하여 두 개의 Row(9시, 10시) 모두에 렌더링되는 런타임 시각적 오류가 발생함. 요구사항: 종료 시간은 Exclusive(미만) 조건으로 처리되어야 함. (예: 10:00 종료는 10시 Row에 포함되지 않음)
2. 비효율적인 비교 방식 - 문제: 모든 시간을 Total Minutes(분 단위)로 변환해서 뺄셈을 하고, 다시 시간으로 복원하는 과정이 반복됨. 증상: 코드가 불필요하게 복잡해지고, "현재 시간 블록이 몇 시 Row에 들어가는가?"라는 핵심 로직이 숫자 계산 뒤에 숨어버려 가독성이 매우 떨어짐. 요구사항: 분 단위 변환 없이, 시간(Hour) 자체를 기준으로 Row 진입 여부를 먼저 판단하고, 그 안에서 상대 위치(top, height)만 계산하는 구조로 변경할 것.

**결과**:
- 경계 조건 문제 해결 (exclusive end time)
- 분 단위 비교 대신 시간 기반 로직으로 리팩토링

---

#### 2. SplitBlock endMinute 타입 범위 수정

**프롬프트**:

@lib/utils/schedule-splitter.ts:66 SplitBlock에 endMinute을 타입 범위를 0 ~ 59분이 아닌 60분으로 저장을 해야 나중에 시간블록에서 시각적으로 표현할 때 59분에서 자르지 않고 다음넣어가는 시간대로 계산이 되어서 반영이 된다. 위 근거를 검토하여 타입에 값의 범위에 대한 수정이 다른 연결되었는 코드와 고려해서 타당한지 검토 후에 반영해줘.

**결과**:
- `endMinute`이 60까지 저장 가능하도록 수정
- 시각적 표현 시 다음 시간대로 자연스럽게 연결

---

#### 3. 기본 레이아웃 ~ 블록 렌더링

**프롬프트**:

[Task] @.cursor/plans/하루_계획표_타임라인_구현_4ddd9820.plan.md 4. 기본 레이아웃 구조부터 6. 시간 Row 및 블록 렌더링 작업까지 수행한다.

[Practice] Think in React 방법론 적용:
1. Mock 시안으로 시작한다. 헤더에 있는 일주일정도의 날짜와 @lib/types.ts 정의된 타입에 맞게 첨부된 사진처럼 시간블록 안에 있는 데이터는 JSON API로 데이터를 받았다는 가정하에 시작한다. Mock 데이터는 mock 폴더를 별도로 만들어서 관리한다.
2. UI를 컴포넌트 계층으로 나눈다. JSON 데이터 구조에 잘 구조화되게 컴포넌트들을 분리한다.
3. React 정적인 버전: 데이터 모델을 렌더링하는 앱의 정적인 버전을 만들기 위해 다른 컴포넌트를 재사용하고 Props를 이용하여 데이터를 넘겨주는 컴포넌트를 구현할 수 있습니다.
4. 최소한의 데이터만 이용해서 완벽하게 UI State 표현하기 - 시간이 지나도 변하지 않나요? 부모로부터 Props를 통해 전달됩니까? 컴포넌트 안의 다른 State나 Props를 가지고 계산 가능한가요?
5. State가 어디에 있어야 할 지 정하기 - 대개, 공통 부모에 State를 그냥 두면 됩니다.
6. 역 데이터 흐름 추가하기 - 사용자 입력에 따라 State를 변경하려면 반대 방향의 데이터 흐름을 만들어야 합니다.

**결과**:
- `components/timeline/`: TimelineContainer, TimelineHeader, TimeAxis, ScheduleColumn, HourRow, ScheduleBlock 컴포넌트
- `mock/schedule-data.ts`: Mock 데이터 생성
- Think in React 방법론 적용 (컴포넌트 계층, State 식별, 역 데이터 흐름)

**관련 커밋**:
- `67e94e3` - feat(ui): shadcn/ui 기본 컴포넌트 추가
- `0ad60fb` - feat(timeline): 타임라인 UI 컴포넌트 구현
- `e51bab1` - feat(mock): 테스트용 스케줄 Mock 데이터 추가
- `1d9e6ee` - feat(page): 메인 페이지에 타임라인 컴포넌트 연동

---

#### 4. shadcn/ui 리팩토링

**프롬프트**:

use shadcn to refactor all components within @components/timeline based on the rules by think-in-react

**결과**:
- Card, Badge, ScrollArea, Tooltip 등 shadcn/ui 컴포넌트 적용
- 일관된 디자인 시스템 구축

**관련 커밋**: `67e94e3` - feat(ui): shadcn/ui 기본 컴포넌트 추가

---

#### 5. 시간축 전체 렌더링 수정

**프롬프트**:

문제점: @components/timeline/TimelineContainer.tsx에서 startHour와 endHour를 측정하는 방식이 잘못되었다. @PRD.md에서 3. 시간별 격자 기반 구조 부분에서 시간별 격자(Hour Cell) 부분을 다시 참조해서 첨부된 사진처럼 시간 블록에 있는 시간 축만 렌더링이 아닌 @components/timeline/TimeAxis.tsx 시간 축이 00:00 ~ 23:00 전체가 렌더링 되도록 변경을 해줘. 항상 think-in-react 사고과정 방식 순서대로 작업을 해줘.

**결과**:
- `startHour = 0`, `endHour = 23` 고정값으로 변경
- 24시간 전체 시간축 렌더링

---

#### 6. 변수명 명확화

**프롬프트**:

@components/timeline/TimelineContainer.tsx 초기 스케줄 데이터 initialData와 초기 선택 날짜 initialDate는 너무 유사한 명명이라 헷갈리는 가능성이 있어. 좀 더 scheduleData와 같은 명확한 작명으로 작성을 해줘.

**결과**:
- `initialData` → `scheduleData`
- `initialDate` → `defaultDate`

---

#### 7. 연속 블록 시각적 연결

**프롬프트**:

문제점: 위에 같은 사진처럼 시간 블록이 여러 시간대 Row에 걸치는 경우 title과 description 중복해서 나오는 현상이 생긴다.

해결방안: @lib/utils/schedule-splitter.ts 분할하는 과정에서 splitBlock을 생성을 할 때 startTime의 시간대(hour) Row에 title과 description만 렌더링하도록 하고 나머지 중간 분할 블록이나 끝 분할 블록은 title과 description에 렌더링 되지 않는 방식을 채택한다. 14:00 ~ 16:00 스케쥴을 중복되는 title과 description 제거해 같은 블록으로 보일 수 있지만 근본적으로 시각적으로 분리되어있는 블록은 같은 스케쥴임에도 사용자에게 다른 스케쥴로 보이게 되어있어.

위에 대한 overlap 되는 현상에 시각적으로 하나의 시간 블록으로 보이기 위한 여러가지 해결방안: isFirstBlock, isLastBlock 플래그 추가, CSS로 연속 블록 시각적 연결 (border, rounded 조건부), Tooltip에 원본 시간 정보 표시

**결과**:
- `SplitBlock`에 `isFirstBlock`, `isLastBlock`, `originalStartTime`, `originalEndTime` 추가
- 조건부 border/rounded CSS 적용
- Tooltip에 원본 시간 정보 표시

**관련 커밋**: `93d21f5` - fix(timeline): 연속 블록 시각적 연결 및 Tooltip 개선

---

#### 8. 스케줄 데이터 관리 및 폼

**프롬프트**:

@.cursor/plans/하루_계획표_타임라인_구현_4ddd9820.plan.md 7.스케쥴 데이터 관리부터 8. 스케줄 추가/수정 폼까지 수행해줘. use shadcn to make components for the form and making code referring to @Next.js

**결과**:
- `hooks/useScheduleData.ts`: CRUD 상태 관리 훅
- `components/schedule-form/`: ScheduleFormDialog, TimeSelector, ColorSelector
- Dialog, Input, Label, Select, Textarea shadcn/ui 컴포넌트 추가

**관련 커밋**:
- `8ffd144` - feat(ui): 폼 관련 shadcn/ui 컴포넌트 추가
- `ea084b0` - feat(hooks): useScheduleData 훅 구현
- `3dbbba3` - feat(schedule-form): 스케줄 추가/수정 폼 컴포넌트 구현
- `afa8ca5` - feat(timeline): 스케줄 CRUD 기능 연동

---

#### 9. 빈 영역 클릭으로 스케줄 추가 UX 변경

**프롬프트**:

@components/timeline/TimelineContainer.tsx:153-172 계획 추가와 실행 추가하는 스케쥴 추가하는 버튼이 별도로 있는 방법이 아닌 @components/timeline/ScheduleColumn.tsx에서 @components/timeline/ScheduleBlock.tsx 이미 생성된 시간 블록 영역 외에 클릭 이벤트가 발생 했을때 시간 블록 @components/schedule-form/ScheduleFormDialog.tsx 다이얼로그가 나타는 형태로 UX 형태로 변경을 하면 좋을거 같아.

**결과**:
- "Add" 버튼 제거
- `ScheduleColumn` 빈 영역 클릭 시 해당 시간/상태로 폼 자동 설정
- `handleEmptyClick` 콜백 구현

**관련 커밋**: `afa8ca5` - feat(timeline): 스케줄 CRUD 기능 연동

---

#### 10. 시간 겹침 처리

**프롬프트**:

@PRD.md 6.2 시간 겹침 부분에 색상 및 투명도 시스템을 통한 시간적인 겹침 표현과 hover와 클릭 시 동적 index 계산을 통해 겹치는 시간블록을 작동할 수 있게 설계해줘. @.cursor/plans/하루_계획표_타임라인_구현_4ddd9820.plan.md 시간 겹침 처리 작업까지 수행해줘.

**결과**:
- `lib/utils/z-index-calculator.ts`: 동적 z-index 계산 알고리즘
- 60% 기본 투명도, hover/click 시 100% 불투명
- 짧은 블록이 위로, 나중에 끝나는 블록이 위로

**관련 커밋**:
- `6f963fe` - feat(utils): z-index 계산 유틸리티 구현
- `51dafcc` - feat(mock): 겹침 테스트용 스케줄 데이터 추가
- `abd8b97` - feat(timeline): 블록 겹침 처리 및 투명도 시스템 구현

---

#### 11. Dialog z-index 문제 해결

**프롬프트**:

@components/schedule-form/ScheduleFormDialog.tsx 겹칩처리에 대한 동적 index 변화로 인해서 dialog가 z index로 인해서 겹치는 시간블록들이 더 위에 오는 현상으로 인해 시각적인 방해가 발생해. z index를 부여할 때 dialog 가장 최고 위에 올 수 있도록 설계하는 코드변경이 필요해. 예를 들면 현재 블록의 z-index가 hover 시 최대 100 + 100 = 200 정도까지 올라갈 수 있습니다. Dialog가 이보다 높은 z-index를 가질 수 있도록 한다.

**결과**:
- `lib/constants.ts`에 `Z_INDEX` 상수 객체 추가
- `DIALOG_OVERLAY: 1000`, `DIALOG_CONTENT: 1001` 정의

**관련 커밋**: `ed97c06` - feat(constants): Z-Index 계층 구조 상수 정의

---

#### 12. 분할 블록 통합 hover 기능

**프롬프트**:

겹치는 시간 블록에서 hover 했을때 시각적이 통합이 안되는 문제가 있다. 예를 들면 수학문제 풀이 9:00 ~ 11:00인데 이때 9시 Row와 10시 Row에 겹치는데 10시 Row에 있는 블록을 hover하면 9시에 있는 블록과 같이 hover 되지 않는 문제가 발생해. ScheduleBlock이 독립적으로 hover 상태로 관리하고 있어 문제가 발생해. hover 상태를 상위 컴포넌트로 끌어올려 시각적으로 같은 블록으로 나타날 수 있도록 관리가 필요해.

**결과**:
- `hoveredBlockId` 상태를 `TimelineContainer`로 리프팅
- `onBlockHover` 콜백으로 역 데이터 흐름
- 동일 `originalId`를 가진 모든 분할 블록이 함께 hover

**관련 커밋**: `3d38304` - feat(timeline): 분할 블록 통합 hover 기능 구현

---

#### 13. 현재 시간 표시

**프롬프트**:

@PRD.md 6.4 현재 시간 표시에 참고하여 현재 시간의 시각적 표현 기능 수행해줘. 고려사항: 1. 현재 시간을 @components/timeline/TimeAxis.tsx 컴포넌트 안에 빨간줄이 보이도록 만들기 2. UX 경험 향상으로 최초 렌더링 시 자동으로 현재 시간대로 자동 스크롤

**결과**:
- `components/timeline/CurrentTimeIndicator.tsx`: 빨간 선 + 원형 마커
- `ScrollArea`에 `viewportRef` prop 추가
- 최초 렌더링 시 현재 시간대로 자동 스크롤

**관련 커밋**:
- `3ec6dd7` - feat(ui): ScrollArea에 viewportRef prop 추가
- `d85a845` - feat(timeline): 현재 시간 인디케이터 컴포넌트 구현
- `f56703e` - feat(timeline): 최초 렌더링 시 현재 시간대로 자동 스크롤

---

#### 14. 동적 Row 리사이징

**프롬프트**:

@PRD.md 3.4 동적 리사이징에 요구사항을 참조해서 수행해줘. @components/timeline/HourRow.tsx 각각의 row의 Bottom에 hover 시 드래그 할 수 있는 모양이 나타나고 최소 30px에서 300px 최대처럼 범위 명확히 설정한다.

**결과**:
- `components/timeline/RowResizeHandle.tsx`: 드래그 핸들 컴포넌트
- `rowHeights` 상태로 각 Row 독립적 높이 관리
- 30px ~ 300px 범위 제한

**관련 커밋**:
- `731a211` - feat(timeline): RowResizeHandle 컴포넌트 구현
- `3385a24` - feat(timeline): 동적 Row 높이 리사이징 기능 구현

---

#### 15. RowResizeHandle z-index 문제 해결

**프롬프트**:

@components/timeline/RowResizeHandle.tsx 역시 overlay되는 시간대 블록의 높은 z-index를 가지게 되어서 중간에 있는 Row 밑부분의 Resize하는 컴포넌트 인식이 어려운 상황이야. @lib/constants.ts에 별도 z-index를 관리하여 dialog를 제일 상위 z-index를 올려 관리한 것처럼 RowResizeHandle 컴포넌트 역시 겹치는 시간블록보다는 상위 z-index를 가질 수 있도록 처리가 필요해.

**결과**:
- `Z_INDEX.ROW_RESIZE_HANDLE: 300` 추가
- RowResizeHandle에 z-index 적용

**관련 커밋**: `fe034aa` - feat(constants): Row 리사이즈 핸들 z-index 상수 추가

---

#### 16. 텍스트 오버플로우 처리

**프롬프트**:

@PRD.md 6.1 텍스트 오버플로우에 참조해서 수행해줘. 현재 시간대 Row 셀이 동적으로 변경할 수 있는 상황이라 높이에 따라 텍스트 역시 표시되는 영역이 높이에 따라 가변적으로 반영이 필요해. 3가지 케이스로 나뉘어: 1. title만 보이는 경우 2. title과 description 한줄만 보이는 경우 3. title과 description 전체가 보이는 경우

**결과**:
- `lib/utils/text-display.ts`: 높이 기반 텍스트 표시 모드 결정
- `ScheduleBlock`에 `rowHeight` prop 추가
- 3가지 모드: title-only (<30px), title-description-truncate (30~60px), full (≥60px)

**관련 커밋**:
- `7d5b383` - feat(utils): 텍스트 오버플로우 처리 유틸리티 구현
- `e23288b` - feat(timeline): 동적 Row 높이 기반 텍스트 표시 모드 구현

---

#### 17. Dialog z-index 상수 적용

**프롬프트**:

문제 발생 과정: 1. lib/constants.ts에 Z_INDEX.DIALOG_OVERLAY: 1000, Z_INDEX.DIALOG_CONTENT: 1001이 정의되어 있음 2. 하지만 dialog.tsx에서 이 상수를 import하지 않고 Tailwind의 기본 z-50 클래스만 사용 중 3. ScheduleBlock이 hover될 때 z-index가 최대 200까지 올라감 4. Dialog의 z-index(50)보다 ScheduleBlock의 z-index(200)가 더 높아서 블록이 다이얼로그 위에 표시됨

해결 방법: components/ui/dialog.tsx에서 1. Z_INDEX 상수를 import 2. DialogOverlay에 style={{ zIndex: Z_INDEX.DIALOG_OVERLAY }} 적용 3. DialogContent에 style={{ zIndex: Z_INDEX.DIALOG_CONTENT }} 적용

**결과**:
- `components/ui/dialog.tsx`에 `Z_INDEX` import
- DialogOverlay: `style={{ zIndex: Z_INDEX.DIALOG_OVERLAY }}`
- DialogContent: `style={{ zIndex: Z_INDEX.DIALOG_CONTENT }}`

**관련 커밋**: `88622ca` - refactor(ui): Dialog에 Z_INDEX 상수 적용

---

#### 18. Select 드롭다운 z-index 문제 해결

**프롬프트**:

z index로 인해 dialog에 있는 시간 설정 드롭다운과 상태구분하는 드롭다운 메뉴가 뒤에서 보여서 제대로 작동을 안해.

**결과**:
- `Z_INDEX.SELECT_CONTENT: 1100` 추가 (Dialog 1001보다 높게)
- `components/ui/select.tsx`에 z-index 적용

**관련 커밋**: `d6005ba` - fix(ui): Dialog 내 Select 드롭다운 z-index 문제 수정

---

### 커밋 히스토리 요약

| 단계 | 주요 작업 | 관련 커밋 |
|------|----------|----------|
| 초기 설정 | 프로젝트 초기 설정, 타입, 유틸리티 | `3025d43`, `07891ea` |
| UI 구현 | 타임라인 UI 컴포넌트 (Think in React) | `67e94e3`, `0ad60fb`, `e51bab1`, `1d9e6ee` |
| 블록 연결 | 연속 블록 시각적 연결 | `93d21f5` |
| CRUD | 스케줄 CRUD 및 폼 | `8ffd144`, `ea084b0`, `3dbbba3`, `afa8ca5` |
| 겹침 처리 | 겹침 처리 및 z-index | `6f963fe`, `51dafcc`, `abd8b97`, `ed97c06` |
| 통합 hover | 분할 블록 통합 hover | `3d38304` |
| 현재 시간 | 현재 시간 표시 | `3ec6dd7`, `d85a845`, `f56703e` |
| 리사이징 | 동적 Row 리사이징 | `731a211`, `3385a24`, `fe034aa` |
| 텍스트 | 텍스트 오버플로우 | `7d5b383`, `e23288b` |
| z-index | Dialog/Select z-index 수정 | `88622ca`, `d6005ba` |
| 최적화 | React Compiler, 메모이제이션 제거 | `823c412`, `83dea25` |

---

### Z-Index 계층 구조

| 요소 | z-index | 설명 |
|------|---------|------|
| ScheduleBlock (기본) | 10~100 | 겹침 처리용 동적 계산 |
| ScheduleBlock (hover) | 110~200 | 기본 + HOVER_BONUS(100) |
| RowResizeHandle | 300 | 시간 블록 hover보다 위 |
| Dialog Overlay | 1000 | 모달 배경 |
| Dialog Content | 1001 | 모달 콘텐츠 |
| Select Content | 1100 | Dialog 위에 표시 |

---

## 배포

이 프로젝트는 **Vercel**에 배포되어 있습니다.

- **라이브 데모**: [https://nextcubecorporation-test.vercel.app/](https://nextcubecorporation-test.vercel.app/)
- **배포 플랫폼**: Vercel
- **자동 배포**: GitHub push 시 자동으로 배포됩니다

## GitHub Repository

**Repository**: [https://github.com/sseo1124/nextcubecorporation-test](https://github.com/sseo1124/nextcubecorporation-test)

## 문서

- [PRD.md](./PRD.md) - 상세 요구사항 명세서
- [.cursor/plans/하루_계획표_타임라인_구현_4ddd9820.plan.md](.cursor/plans/하루_계획표_타임라인_구현_4ddd9820.plan.md) - 에이전트 구현 계획

