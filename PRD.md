# 하루 계획표 화면 상세 요구사항 명세서 (PRD)

## 1. 개요

### 1.1 목적

하루의 계획(Plan)과 실행(Execution)을 타임라인 형태로 비교하여 시각화하는 화면을 구현한다.

### 1.2 기술 스택

#### 1.2.1 프레임워크: Next.js (App Router)

- **선택 이유**:

  - **배포 용이성**: Vercel과의 네이티브 통합으로 원클릭 배포 가능
  - **TypeScript 호환성**: 강력한 타입 안정성과 개발 경험
  - **Client Component 중심**: 타임라인 인터랙션이 많으므로 `use client` 지시어를 적절히 활용
  - **성능**: 자동 코드 스플리팅 및 최적화

- **구현 전략**:
  - App Router 구조 사용
  - 대부분의 컴포넌트는 Client Component (`'use client'`)
  - 서버 사이드 기능은 최소화 (필요시에만 사용)

#### 1.2.2 UI 컴포넌트 라이브러리: shadcn/ui

- **선택 이유**:

  - **개발 속도**: 스타일을 처음부터 작성하는 시간 절약
  - **핵심 로직 집중**: 타임라인 계산 로직에 집중 가능
  - **스타일 오버라이딩**: 자유로운 커스터마이징으로 타임라인 커스텀 디자인 적용 용이
  - **컴포넌트 기반**: `Card`, `Select`, `Button` 등 기본 UI 빠른 구축

- **사용할 주요 컴포넌트**:
  - `Card`: 레이아웃 구조
  - `Select`: 시간 입력 드롭다운
  - `Button`: 액션 버튼
  - `Dialog`: 모달/폼
  - `Popover`: 툴팁 및 추가 정보

#### 1.2.3 스타일링: Tailwind CSS

- **선택 이유**:

  - **동적 값 매핑**: 높이, 위치 등 동적 값을 `className`이나 `style` 속성으로 직관적으로 매핑
  - **유틸리티 기반**: 빠른 스타일링과 반응형 디자인
  - **커스터마이징**: `tailwind.config.js`에서 색상 팔레트, 브레이크포인트 등 커스터마이징 가능
  - **성능**: 프로덕션 빌드 시 사용하지 않는 스타일 자동 제거

- **특별 고려사항**:
  - 파스텔 색상 팔레트를 `tailwind.config.js`에 정의
  - 동적 opacity 클래스 (`bg-{color}/60`) 활용
  - 반응형 유틸리티 클래스 활용

#### 1.2.4 성능 최적화: React Compiler

- **선택 이유**:

  - **자동 메모이제이션**: `useMemo`, `useCallback` 등을 수동으로 작성하지 않아도 컴파일러가 자동 최적화
  - **코드 간소화**: 최적화 로직에 집중하지 않고 비즈니스 로직에 집중 가능
  - **성능 향상**: 컴파일러 단계에서 최적의 메모이제이션 전략 적용

- **구현 전략**:
  - React Compiler 설정 활성화
  - 수동 메모이제이션 코드 제거 (컴파일러가 자동 처리)
  - 타임라인 계산 로직에 집중

#### 1.2.5 플랫폼 및 비교 방식

- **플랫폼**: 웹 애플리케이션 (반응형 디자인)
- **비교 방식**: 계획과 실행을 나란히 배치 (좌: 계획, 우: 실행)

#### 1.2.6 기술 스택 선택 검토

**전체 평가**: 모든 기술 스택 선택이 합리적이며 프로젝트 요구사항에 적합합니다.

**1. Next.js (App Router)**

- ✅ **합리적**: Vercel 배포, TypeScript 호환성, Client Component 지원 모두 적합
- ✅ **추가 고려사항**: App Router의 Server Components는 타임라인 렌더링에는 불필요하므로 Client Component 중심으로 구성하는 것이 올바름

**2. shadcn/ui**

- ✅ **합리적**: 기본 UI 구축 시간 절약, 스타일 오버라이딩 자유로움
- ✅ **추가 고려사항**: 타임라인 블록은 커스텀 컴포넌트로 직접 구현하되, 모달/폼 등은 shadcn/ui 활용

**3. Tailwind CSS**

- ✅ **합리적**: 동적 값 매핑, 유틸리티 기반 스타일링이 타임라인 구현에 필수
- ✅ **추가 고려사항**: 동적 opacity (`bg-{color}/60`)와 인라인 스타일 조합 사용

**4. React Compiler**

- ✅ **합리적**: 자동 메모이제이션으로 개발 생산성 향상
- ⚠️ **주의사항**: React Compiler는 비교적 최신 기술이므로 안정성 확인 필요
- ✅ **대안**: Compiler 미지원 시 수동 메모이제이션으로 대체 가능 (하지만 자동화가 더 효율적)

**종합 결론**: 제시된 기술 스택은 모두 타임라인 스케줄러 구현에 적합하며, 개발 속도와 유지보수성을 고려한 합리적인 선택입니다.

---

## 2. 레이아웃 구조

### 2.1 전체 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  Header (날짜 선택, 요약 정보)                               │
├──────┬──────────────────────────────────────────────────┤
│ 시간축 │  계획(Plan) 영역      │  실행(Execution) 영역        │
│      │                     │                            │
│      │  [블록1]             │  [블록1]                    │
│ 17:00│                     │                            │
│      │  [블록2]             │  [블록2]                    │
│ 18:00│                     │                            │
│      │  [블록3]             │  [블록3]                    │
│ 19:00│                     │                            │
│      │                     │                            │
└──────┴──────────────────────────────────────────────────┘
```

### 2.2 비율 및 배치

- **시간축 너비**: 고정 80px (모바일: 60px)
- **계획 영역 너비**: `calc((100% - 80px) / 2)` (모바일: `calc((100% - 60px) / 2)`)
- **실행 영역 너비**: `calc((100% - 80px) / 2)` (모바일: `calc((100% - 60px) / 2)`)
- **시간축 위치**: 좌측 고정 (스크롤 시 함께 스크롤)
- **계획/실행 영역**: 수평 스크롤 가능 (시간축은 고정)

### 2.3 반응형 디자인

- **데스크톱 (≥1024px)**: 시간축 80px, 계획/실행 각 50%
- **태블릿 (768px~1023px)**: 시간축 70px, 계획/실행 각 50%
- **모바일 (<768px)**: 시간축 60px, 계획/실행 각 50%

---

## 3. 시간 블록 로직

### 3.1 시간별 격자(Hour Cell) 기반 구조

기존의 전역 절대 좌표 방식(1min = 1px) 대신, **시간별 격자 기반의 상대 위치 방식**을 사용합니다.

**구조 설계**:

```
타임라인 컨테이너
├── 00:00 Row (독립적인 div, 가변 높이: 최소 60px)
│   ├── 00:00 Label
│   └── 일정 블록들 (이 Row 내부에서 상대 위치)
├── 01:00 Row (독립적인 div, 가변 높이: 최소 60px)
│   ├── 01:00 Label
│   └── 일정 블록들 (이 Row 내부에서 상대 위치)
├── ...
└── 23:00 Row (독립적인 div, 가변 높이: 최소 60px)
    ├── 23:00 Label
    └── 일정 블록들 (이 Row 내부에서 상대 위치)
```

### 3.2 시간 Row 구조 및 높이

- **기본 높이**: 각 시간 Row는 최소 60px 높이
- **가변 높이**: 사용자가 특정 시간대를 드래그로 확대/축소 가능
- **동적 리사이징**: 특정 시간 Row만 높이 변경 시, 다른 Row들은 영향 없음
- **표시 가능 시간 범위**: 00:00 ~ 23:59 (총 24개 Row)

**CSS 구조**:

```typescript
// 시간 Row 스타일
.hour-row {
  position: relative;
  min-height: 60px; // 기본 최소 높이
  height: var(--hour-row-height, 60px); // CSS 변수로 동적 제어
  border-bottom: 1px solid #e0e0e0;
}

// 시간 레이블
.hour-label {
  position: absolute;
  left: 0;
  width: 80px; // 시간축 너비
  text-align: center;
}
```

### 3.3 블록 위치 계산 (상대 위치 방식)

각 일정 블록은 **해당 시간 Row 내부에서 CSS percentage(%)를 사용하여 위치**합니다.

#### 3.3.1 단일 Row 내 블록

```typescript
// 예: 9:30 ~ 9:45 (15분) 일정
// → 9시 Row 내부에 위치

interface BlockPosition {
  hour: number; // 9
  top: number; // 50% (9:30 = 9시의 50% 지점)
  height: number; // 25% (15분 / 60분 = 0.25 = 25%)
}

// 계산 공식
const startMinutes = 30; // 9:30의 분
const durationMinutes = 15; // 지속 시간

const topPercent = (startMinutes / 60) * 100; // 50%
const heightPercent = (durationMinutes / 60) * 100; // 25%
```

**예시**:

- 9:30 ~ 9:45 → 9시 Row의 50% 지점, 높이 25%
- 17:00 ~ 18:00 → 17시 Row의 0% 지점, 높이 100%
- 19:15 ~ 19:45 → 19시 Row의 25% 지점, 높이 50%

#### 3.3.2 여러 Row에 걸치는 블록 (시간 분할 로직)

**문제 상황**: 9:40 ~ 10:10 일정은 9시 Row와 10시 Row에 걸쳐서 렌더링되어야 함

**해결 방안**: 일정 데이터를 렌더링 전에 **시간 경계 기준으로 시각적으로 분할(split)**하는 전처리 과정 필요

```typescript
// 일정 분할 함수
interface SplitBlock {
  hour: number; // 속한 시간 Row
  top: number; // 해당 Row 내부에서의 top 위치 (%)
  height: number; // 해당 Row 내부에서의 높이 (%)
  originalItem: ScheduleItem; // 원본 일정 데이터
  isStart: boolean; // 첫 번째 분할 블록인지
  isEnd: boolean; // 마지막 분할 블록인지
}

function splitScheduleItem(item: ScheduleItem): SplitBlock[] {
  const [startHour, startMin] = parseTime(item.startTime); // "9:40" → [9, 40]
  const [endHour, endMin] = parseTime(item.endTime); // "10:10" → [10, 10]

  const startMinutes = startMin;
  const endMinutes = endMin;
  const totalDuration = endHour * 60 + endMin - (startHour * 60 + startMin);

  const blocks: SplitBlock[] = [];

  // 시작 시간 Row (9시 Row)
  if (startHour !== endHour) {
    const firstRowDuration = 60 - startMinutes; // 9:40 ~ 10:00 = 20분
    blocks.push({
      hour: startHour,
      top: (startMinutes / 60) * 100, // 66.67%
      height: (firstRowDuration / 60) * 100, // 33.33%
      originalItem: item,
      isStart: true,
      isEnd: false,
    });

    // 중간 Row들 (있는 경우)
    for (let hour = startHour + 1; hour < endHour; hour++) {
      blocks.push({
        hour: hour,
        top: 0,
        height: 100, // 전체 Row 높이
        originalItem: item,
        isStart: false,
        isEnd: false,
      });
    }

    // 종료 시간 Row (10시 Row)
    blocks.push({
      hour: endHour,
      top: 0,
      height: (endMinutes / 60) * 100, // 16.67% (10:00 ~ 10:10 = 10분)
      originalItem: item,
      isStart: false,
      isEnd: true,
    });
  } else {
    // 같은 Row 내 블록
    const duration = endMinutes - startMinutes;
    blocks.push({
      hour: startHour,
      top: (startMinutes / 60) * 100,
      height: (duration / 60) * 100,
      originalItem: item,
      isStart: true,
      isEnd: true,
    });
  }

  return blocks;
}
```

**예시 분할 결과**:

- **9:40 ~ 10:10**:

  - 9시 Row: `top: 66.67%`, `height: 33.33%`
  - 10시 Row: `top: 0%`, `height: 16.67%`

- **9:30 ~ 11:15**:
  - 9시 Row: `top: 50%`, `height: 50%`
  - 10시 Row: `top: 0%`, `height: 100%`
  - 11시 Row: `top: 0%`, `height: 25%`

#### 3.3.3 CSS 렌더링

```typescript
// 분할된 블록을 각 시간 Row에 배치
{
  hourRows.map((hour) => {
    const blocksInThisHour = splitBlocks.filter((b) => b.hour === hour);

    return (
      <div
        key={hour}
        className="hour-row"
        style={{ height: getRowHeight(hour) }}
      >
        <div className="hour-label">{hour}:00</div>
        {blocksInThisHour.map((block) => (
          <div
            key={`${block.originalItem.id}-${block.hour}`}
            className="schedule-block"
            style={{
              position: "absolute",
              top: `${block.top}%`,
              height: `${block.height}%`,
              left: getLeftPosition(block.originalItem.status), // 계획/실행에 따라
              width: getBlockWidth(block.originalItem, blocksInThisHour), // 겹침 처리
              backgroundColor: block.originalItem.color,
            }}
          >
            {/* 블록 내용 (제목, 설명 등) */}
            {renderBlockContent(block)}
          </div>
        ))}
      </div>
    );
  });
}
```

### 3.4 동적 리사이징 (Dynamic Resizing)

#### 3.4.1 사용자 인터랙션

- **드래그 핸들**: 각 시간 Row의 하단 경계에서 드래그 가능한 핸들 표시
- **드래그 이벤트**: 사용자가 드래그하면 해당 Row의 높이만 변경
- **최소/최대 높이**: 최소 30px, 최대 300px (5배 확대)

#### 3.4.2 구현 방식

```typescript
// Row 높이 상태 관리
const [rowHeights, setRowHeights] = useState<Record<number, number>>({
  0: 60,
  1: 60,
  2: 60, // ... 기본값
});

// 드래그 핸들 이벤트
const handleRowResize = (hour: number, newHeight: number) => {
  setRowHeights((prev) => ({
    ...prev,
    [hour]: Math.max(30, Math.min(300, newHeight)), // 30px ~ 300px 제한
  }));
  // 다른 Row는 영향 없음!
};
```

#### 3.4.3 상대 위치 방식의 장점

- **성능**: 특정 Row만 리사이징 시 다른 Row 재계산 불필요
- **유연성**: 각 시간대를 독립적으로 확대/축소 가능
- **사용자 경험**: 관심 있는 시간대만 상세히 볼 수 있음
- **렌더링 최적화**: 변경된 Row만 리렌더링 가능

### 3.5 가상 스크롤링 (Virtual Scrolling)

- 뷰포트에 보이는 시간 Row만 렌더링
- 각 Row의 높이가 가변적이므로, 스크롤 위치 계산 시 각 Row의 실제 높이를 고려
- Row 높이 변경 시 스크롤 위치 자동 보정

```typescript
// 가상 스크롤링 구현 시
const visibleRows = calculateVisibleRows(
  scrollTop,
  viewportHeight,
  rowHeights // 가변 높이 고려
);
```

---

## 4. 스케줄 입력 로직

### 4.1 입력 방식

#### 4.1.1 클릭 이벤트

- **빈 영역 클릭**: 새 스케줄 생성 모달/폼 열기
- **기존 블록 클릭**: 해당 스케줄 수정 모달/폼 열기
- **드래그 앤 드롭**: 블록 위치 및 시간 변경

#### 4.1.2 입력 폼 구조

```
┌─────────────────────────────────┐
│  스케줄 추가/수정                │
├─────────────────────────────────┤
│  제목 (Title) *                  │
│  [________________________]     │
│                                  │
│  설명 (Description)              │
│  [________________________]     │
│  [________________________]     │
│                                  │
│  색상 (Color) *                   │
│  [🔴] [🟢] [🔵] [🟡] [🟣] [⚪]  │
│                                  │
│  시작 시간 (Start Time) *        │
│  [17:00] [▼]                     │
│                                  │
│  종료 시간 (End Time) *          │
│  [18:30] [▼]                     │
│                                  │
│  상태 (Status) *                  │
│  ( ) 계획 (Plan)                 │
│  ( ) 실행 (Execution)            │
│                                  │
│  [취소]  [저장]                  │
└─────────────────────────────────┘
```

### 4.2 시간 입력 방식

**구현 방식: Dropdown (Select) - 1분 단위**

시간 선택은 텍스트 입력 대신 **Dropdown (Select) 방식을 사용**하며, **1분 단위로 선택 가능**합니다.

#### 4.2.1 UI 구조

```
시작 시간 (Start Time) *
[Hour ▼] [Minute ▼]
 00:00   00:01   ...   23:59

종료 시간 (End Time) *
[Hour ▼] [Minute ▼]
 00:00   00:01   ...   23:59
```

#### 4.2.2 구현 상세

```typescript
// 시간 선택 컴포넌트
interface TimeSelectorProps {
  value: string; // "HH:MM" 형식
  onChange: (time: string) => void;
  label: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  label,
}) => {
  const [hour, minute] = value.split(":").map(Number);

  return (
    <div>
      <label>{label}</label>
      <div className="flex gap-2">
        <select
          value={hour}
          onChange={(e) => {
            const newHour = Number(e.target.value);
            onChange(
              `${String(newHour).padStart(2, "0")}:${String(minute).padStart(
                2,
                "0"
              )}`
            );
          }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
        <span>:</span>
        <select
          value={minute}
          onChange={(e) => {
            const newMinute = Number(e.target.value);
            onChange(
              `${String(hour).padStart(2, "0")}:${String(newMinute).padStart(
                2,
                "0"
              )}`
            );
          }}
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
```

#### 4.2.3 유효성 검사

- **시간 범위**: 00:00 ~ 23:59
- **시작 시간 < 종료 시간**: 종료 시간이 시작 시간보다 이전이면 에러 메시지 표시
- **같은 시간 선택 불가**: 시작 시간과 종료 시간이 같으면 최소 1분 차이 필요

```typescript
const validateTimeRange = (startTime: string, endTime: string): boolean => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;

  return endTotal > startTotal; // 최소 1분 차이 필요
};
```

### 4.3 색상 선택

**구현 방식: 8가지 기본 파스텔 톤 색상 팔레트**

커스텀 컬러 피커는 제외하고, **사전에 정의된 8가지 기본 파스텔 톤 색상** 배열만 사용합니다.

#### 4.3.1 기본 파스텔 색상 팔레트

```typescript
// 8가지 기본 파스텔 톤 색상 팔레트
const COLOR_PALETTE = [
  { name: "Pink", value: "#F8BBD0", tailwind: "bg-pink-200" }, // 파스텔 핑크
  { name: "Lavender", value: "#E1BEE7", tailwind: "bg-purple-200" }, // 파스텔 라벤더
  { name: "Sky", value: "#B3E5FC", tailwind: "bg-sky-200" }, // 파스텔 스카이
  { name: "Mint", value: "#B2DFDB", tailwind: "bg-teal-200" }, // 파스텔 민트
  { name: "Lemon", value: "#FFF9C4", tailwind: "bg-yellow-200" }, // 파스텔 레몬
  { name: "Peach", value: "#FFCCBC", tailwind: "bg-orange-200" }, // 파스텔 피치
  { name: "Rose", value: "#F8BBD0", tailwind: "bg-rose-200" }, // 파스텔 로즈
  { name: "Lilac", value: "#C5CAE9", tailwind: "bg-indigo-200" }, // 파스텔 라일락
] as const;

type ColorValue = (typeof COLOR_PALETTE)[number]["value"];
```

#### 4.3.2 UI 구현

```typescript
// 색상 선택 컴포넌트
const ColorSelector: React.FC<{
  value: string;
  onChange: (color: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <label>색상 (Color) *</label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`w-12 h-12 rounded-lg ${color.tailwind} border-2 ${
              value === color.value ? "border-gray-900" : "border-transparent"
            } hover:scale-110 transition-transform`}
            aria-label={color.name}
          />
        ))}
      </div>
    </div>
  );
};
```

#### 4.3.3 제약 사항

- **커스텀 색상 선택 불가**: 색상 피커는 제공하지 않음
- **팔레트 색상만 사용**: 위에 정의된 8가지 파스텔 톤 색상 중에서만 선택 가능
- **기본값**: 첫 번째 색상 (Pink: `#F8BBD0`)을 기본값으로 사용

---

## 5. 데이터 구조

### 5.1 JSON 스키마

```typescript
// 전체 스케줄 데이터
interface ScheduleData {
  date: string; // "2025-09-10" (YYYY-MM-DD)
  items: ScheduleItem[]; // 모든 스케줄 아이템 (계획 + 실행)
  summary: {
    plannedTotalHours: number; // 계획 총 시간 (시간 단위, 예: 6.5)
    executedTotalHours: number; // 실행 총 시간 (시간 단위, 예: 6)
  };
}

// 개별 스케줄 아이템
interface ScheduleItem {
  id: string; // 고유 ID (UUID)
  title: string; // 제목 (예: "화학1", "영어")
  description?: string; // 설명 (예: "원자 기출 Pick 화학", "Day31~32")
  color: string; // 색상 코드 (예: "#FF6B6B")
  startTime: string; // 시작 시간 (HH:MM 형식, 예: "17:00")
  endTime: string; // 종료 시간 (HH:MM 형식, 예: "18:30")
  status: "plan" | "execution"; // 계획 또는 실행 구분
}

// 예시 데이터
const exampleData: ScheduleData = {
  date: "2025-09-10",
  items: [
    {
      id: "item-1",
      title: "화학1",
      description: "원자 기출 Pick 화학",
      color: "#FF6B6B",
      startTime: "17:00",
      endTime: "17:30",
      status: "plan",
    },
    {
      id: "item-2",
      title: "영어",
      description: "경선식 수능 영단어 Day31~32",
      color: "#FFD43B",
      startTime: "18:00",
      endTime: "19:00",
      status: "plan",
    },
    {
      id: "item-3",
      title: "화학1",
      description: "원자 기출 Pick 화학",
      color: "#FF6B6B",
      startTime: "17:00",
      endTime: "17:25", // 계획보다 5분 짧게 실행
      status: "execution",
    },
  ],
  summary: {
    plannedTotalHours: 6.5,
    executedTotalHours: 6,
  },
};
```

### 5.2 계획과 실행 구분

- **계획 (Plan)**: `status: "plan"`인 스케줄 아이템
- **실행 (Execution)**: `status: "execution"`인 스케줄 아이템
- **렌더링 로직**: `status` 필드 값에 따라 좌측(계획) 또는 우측(실행) 영역에 렌더링

```typescript
// 렌더링 시 필터링
const plans = items.filter((item) => item.status === "plan");
const executions = items.filter((item) => item.status === "execution");
```

### 5.3 드래그 앤 드롭으로 컬럼 간 이동

사용자가 블록을 드래그하여 계획 영역과 실행 영역 간 이동할 때, **`status` 필드만 업데이트**하면 자동으로 렌더링 위치가 변경됩니다.

```typescript
// 드래그 앤 드롭 핸들러
const handleBlockDrop = (
  itemId: string,
  targetColumn: "plan" | "execution"
) => {
  setScheduleData((prev) => ({
    ...prev,
    items: prev.items.map((item) =>
      item.id === itemId
        ? { ...item, status: targetColumn === "plan" ? "plan" : "execution" }
        : item
    ),
  }));
  // status만 변경하면 자동으로 재렌더링됨
};
```

**장점**:

- 데이터 구조가 단순하고 명확함
- 컬럼 간 이동이 `status` 필드 하나만 변경하면 되므로 구현이 간단함
- 상태 관리가 용이함

### 5.3 시간 블록 내부 구조

#### 5.3.1 분할된 블록 데이터 (SplitBlock)

```typescript
// 일정을 시간 경계로 분할한 후의 블록 데이터
interface SplitBlock {
  hour: number; // 속한 시간 Row (0~23)
  top: number; // 해당 Row 내부에서의 top 위치 (%)
  height: number; // 해당 Row 내부에서의 높이 (%)
  originalItem: ScheduleItem; // 원본 일정 데이터
  isStart: boolean; // 첫 번째 분할 블록인지 (시각적으로 연결 표시용)
  isEnd: boolean; // 마지막 분할 블록인지 (시각적으로 연결 표시용)
}
```

#### 5.3.2 Row별 렌더링 데이터

```typescript
// 각 시간 Row에 배치되는 블록 데이터
interface RowBlockRenderData {
  splitBlock: SplitBlock;
  left: number; // px 또는 % 단위 좌측 위치 (계획/실행에 따라)
  width: number; // px 또는 % 단위 너비 (겹침 처리 시 조정됨)
  zIndex: number; // 겹치는 블록의 순서
}
```

#### 5.3.3 Row 높이 관리 데이터

```typescript
// 시간 Row의 높이 정보
interface RowHeightData {
  hour: number; // 0~23
  height: number; // px 단위 높이 (최소 30px, 최대 300px)
  isExpanded: boolean; // 사용자가 확대했는지 여부
}
```

---

## 6. 예외 케이스 처리

### 6.1 텍스트 오버플로우 (Overflow)

#### 문제 상황

- **Row 높이가 가변적**이므로 짧은 시간(예: 10분) 블록에서는 텍스트가 잘릴 수 있음
- 예: 10분 블록 (기본 Row 60px의 16.67% = 10px)에 긴 텍스트
- **새로운 방식의 특성**: Row 높이가 가변적이므로, 동일한 percentage라도 실제 px 높이가 달라질 수 있음

#### 해결 방안: 픽셀 높이 기반 조건부 렌더링

**구현 전략**: 실제 픽셀 높이에 따라 조건부로 텍스트를 렌더링합니다.

```typescript
// 블록의 실제 픽셀 높이 계산 (Row 높이 * 블록 height percentage)
const calculateActualHeight = (
  rowHeight: number,
  blockHeightPercent: number
): number => {
  return (rowHeight * blockHeightPercent) / 100;
};

// 텍스트 truncate 유틸리티
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

// 실제 픽셀 높이에 따라 표시할 텍스트 결정
const getDisplayText = (
  item: ScheduleItem,
  actualHeightPx: number
): { title: string; description: string | null } => {
  if (actualHeightPx < 30) {
    // 높이 < 30px: 제목만 표시 (truncate)
    return {
      title: truncateText(item.title, 10), // 최대 10자
      description: null,
    };
  } else if (actualHeightPx < 60) {
    // 30px ~ 60px: 제목 + 설명 1줄
    return {
      title: item.title,
      description: item.description
        ? truncateText(item.description, 15) // 최대 15자
        : null,
    };
  } else {
    // 60px 이상: 전체 표시
    return {
      title: item.title,
      description: item.description || null,
    };
  }
};

// 블록 렌더링 컴포넌트
const ScheduleBlock: React.FC<{
  splitBlock: SplitBlock;
  rowHeight: number;
}> = ({ splitBlock, rowHeight }) => {
  const actualHeight = calculateActualHeight(rowHeight, splitBlock.height);
  const displayText = getDisplayText(splitBlock.originalItem, actualHeight);

  return (
    <div
      className="schedule-block"
      style={{
        position: "absolute",
        top: `${splitBlock.top}%`,
        height: `${splitBlock.height}%`,
        backgroundColor: splitBlock.originalItem.color,
        padding: "4px 8px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      title={`${splitBlock.originalItem.title}${
        splitBlock.originalItem.description
          ? ` - ${splitBlock.originalItem.description}`
          : ""
      }`} // 툴팁
    >
      <div className="font-semibold text-sm truncate">{displayText.title}</div>
      {displayText.description && (
        <div className="text-xs truncate mt-1">{displayText.description}</div>
      )}
    </div>
  );
};
```

#### 렌더링 규칙 요약

| 블록 높이   | 표시 내용                        | CSS 처리                    |
| ----------- | -------------------------------- | --------------------------- |
| < 30px      | 제목만 (최대 10자, truncate)     | `truncate` 클래스 적용      |
| 30px ~ 60px | 제목 + 설명 1줄 (설명 최대 15자) | 제목과 설명 모두 `truncate` |
| ≥ 60px      | 제목 + 설명 전체                 | 일반 텍스트 표시            |

#### 추가 고려사항

- **툴팁 표시**: 블록에 호버 시 전체 제목과 설명을 툴팁으로 표시
- **반응형 처리**: Row 높이가 변경되면 자동으로 텍스트 표시 방식 재계산

### 6.2 시간 겹침 (Overlap)

#### 문제 상황

- 같은 시간 Row 내부에서 여러 스케줄이 겹침
- 예: 17시 Row에서 17:00~17:30 블록과 17:15~17:45 블록이 겹침
- **새로운 방식의 특성**: 각 Row 내부에서 독립적으로 겹침 처리 (다른 Row에 영향 없음)

#### 해결 방안: 색상 및 투명도 시스템 + 동적 Z-Index 계산

**구현 전략**: 모든 블록을 기본적으로 반투명(60%)으로 표시하고, 동적 z-index 계산으로 가독성을 보장합니다.

##### 6.2.1 색상 및 투명도 시스템

**기본 상태 (Default State)**:

- 모든 시간 블록은 겹치는 영역이 보이도록 **기본적으로 반투명(Opacity 60%)** 상태
- Tailwind 예시: `className="bg-blue-500/60"`

**상호작용 상태 (Interaction State)**:

- **Hover/Click**: 사용자가 블록에 마우스를 올리거나 클릭하여 선택했을 때는 **불투명(Opacity 100%)** 상태로 변경
- Tailwind 예시: `className="bg-blue-500/60 hover:bg-blue-500 transition-opacity"`

##### 6.2.2 동적 Z-Index 계산 로직

같은 시간대(Row) 내에서 블록이 겹칠 때, 가독성을 위해 z-index를 다음 규칙에 따라 동적으로 계산합니다.

**규칙 1: 완전 포함 관계 (Nested Case)**

- **상황**: 블록 A가 블록 B의 시간 내부에 완전히 포함되는 경우
- **예시**: B 09:00~09:50, A 09:10~09:20
- **규칙**: 내부 블록(A)의 z-index > 외부 블록(B)의 z-index
- **이유**: 사용자가 숨겨진 작은 블록을 클릭할 수 있어야 함

**규칙 2: 걸침 관계 (Overlapping Case)**

- **상황**: 블록 A와 B가 일부만 겹치는 경우
- **예시**: B 09:30~10:00, A 09:40~10:10
- **규칙**: 더 늦게 끝나는 블록(A)의 z-index > 먼저 끝나는 블록(B)의 z-index

**구현 알고리즘**:

```typescript
// 블록의 시간 정보 추출
interface BlockTimeInfo {
  block: SplitBlock;
  startMinutes: number; // 해당 Row 내에서의 시작 시간 (분 단위, 0~60)
  endMinutes: number; // 해당 Row 내에서의 종료 시간 (분 단위, 0~60)
  duration: number; // 지속 시간 (분 단위)
}

// Z-Index 계산 유틸리티 함수 (가중치 기반)
const calculateZIndex = (blocks: SplitBlock[]): Map<string, number> => {
  // 각 블록의 시간 정보 계산 (SplitBlock의 top, height 활용)
  const blockInfos: BlockTimeInfo[] = blocks.map((block) => {
    // top과 height는 이미 percentage로 계산되어 있음
    // 이를 분 단위로 변환
    const startMinutes = (block.top / 100) * 60; // top%를 분으로 변환
    const endMinutes = startMinutes + (block.height / 100) * 60; // height%를 분으로 변환
    const duration = (block.height / 100) * 60; // 지속 시간 (분)

    return {
      block,
      startMinutes,
      endMinutes,
      duration,
    };
  });

  // 가중치 기반 Z-Index 계산
  const zIndexMap = new Map<string, number>();
  const baseZIndex = 10;

  blockInfos.forEach((info) => {
    // 규칙 1: 지속 시간이 짧을수록 높은 z-index (완전 포함 관계 해결)
    // 짧은 블록이 위에 오도록: 1000 / (duration + 1)
    const durationWeight = 1000 / (info.duration + 1);

    // 규칙 2: 종료 시간이 늦을수록 높은 z-index (걸침 관계 해결)
    // 늦게 끝나는 블록이 위에 오도록
    const endTimeWeight = info.endMinutes;

    // 최종 가중치 (지속 시간 가중치가 더 중요하도록 가중)
    const totalWeight = durationWeight * 2 + endTimeWeight;

    zIndexMap.set(info.block.originalItem.id, baseZIndex + totalWeight);
  });

  // Z-index 정규화 (10 ~ 100 범위)
  const values = Array.from(zIndexMap.values());
  const minWeight = Math.min(...values);
  const maxWeight = Math.max(...values);
  const normalizedMap = new Map<string, number>();

  if (maxWeight === minWeight) {
    // 모든 블록이 같은 가중치인 경우
    zIndexMap.forEach((_, id) => {
      normalizedMap.set(id, baseZIndex);
    });
  } else {
    zIndexMap.forEach((weight, id) => {
      // 10 ~ 100 범위로 정규화
      const normalized = Math.floor(
        ((weight - minWeight) / (maxWeight - minWeight)) * 90 + 10
      );
      normalizedMap.set(id, normalized);
    });
  }

  return normalizedMap;
};
```

##### 6.2.3 블록 렌더링 구현

```typescript
// 블록 렌더링 컴포넌트
const renderScheduleBlocks = (
  hour: number,
  splitBlocks: SplitBlock[],
  containerWidth: number,
  selectedBlockId: string | null
) => {
  // Z-Index 계산
  const zIndexMap = calculateZIndex(splitBlocks);

  return splitBlocks.map((block) => {
    const zIndex = zIndexMap.get(block.originalItem.id) || 10;
    const isSelected = selectedBlockId === block.originalItem.id;

    // Tailwind 클래스: 기본 60% 투명도, 선택/호버 시 100% 불투명
    const colorClass = getColorTailwindClass(block.originalItem.color);

    return (
      <div
        key={`${block.originalItem.id}-${hour}`}
        className={`schedule-block ${colorClass}/60 hover:${colorClass} transition-opacity duration-200 ${
          isSelected ? `!${colorClass}` : ""
        }`}
        style={{
          position: "absolute",
          top: `${block.top}%`,
          height: `${block.height}%`,
          left: 0,
          width: containerWidth,
          zIndex: zIndex,
          cursor: "pointer",
        }}
        onClick={() => handleBlockClick(block.originalItem.id)}
      >
        {/* 블록 내용 */}
      </div>
    );
  });
};

// 색상 값에서 Tailwind 클래스 추출 (헬퍼 함수)
const getColorTailwindClass = (colorValue: string): string => {
  const color = COLOR_PALETTE.find((c) => c.value === colorValue);
  return color?.tailwind || "bg-gray-500";
};
```

#### 스타일 규칙 요약

| 상태           | Opacity    | Z-Index                             | 설명                  |
| -------------- | ---------- | ----------------------------------- | --------------------- |
| 기본 상태      | 60%        | 동적 계산                           | 모든 블록 기본 반투명 |
| Hover          | 100%       | 동적 계산                           | 마우스 오버 시 불투명 |
| Click/Selected | 100%       | 동적 계산                           | 선택된 블록 불투명    |
| 완전 포함 관계 | 60% (기본) | 내부 > 외부                         | 작은 블록이 위에 표시 |
| 걸침 관계      | 60% (기본) | 늦게 끝나는 블록 > 먼저 끝나는 블록 | 최신 블록이 위에 표시 |

#### 장점

- **시각적 일관성**: 모든 블록이 동일한 투명도 시스템 사용
- **가독성 향상**: 동적 z-index로 중요한 블록이 위에 표시
- **사용자 경험**: Hover/Click으로 현재 관심 블록을 명확히 강조
- **구현 단순**: 복잡한 재배치 로직 없이 CSS와 간단한 계산으로 처리

### 6.3 긴 시간 블록 처리

#### 문제 상황

- 시간 블록이 매우 길어서 여러 Row에 걸쳐서 렌더링됨
- 예: 08:00 ~ 22:00 (14시간) → 8시부터 22시까지 총 15개 Row에 걸쳐서 분할

#### 해결 방안: 시간 단위 분할 로직 활용 (기본 동작)

**구현 전략**: 이전에 논의한 **'시간 단위 분할(Split by Hour)' 로직을 그대로 유지**합니다. 별도 추가 로직은 불필요합니다.

긴 블록은 자동으로 여러 Row로 분할되므로, 각 Row 내부에서는:

1. **자동 분할**: `splitScheduleItem()` 함수가 시간 경계를 기준으로 자동 분할
2. **각 Row 내부 처리**: 각 분할 블록은 해당 Row의 일부만 차지 (0% ~ 100%)
3. **가변 높이 대응**: Row 높이가 가변적이므로 사용자가 특정 Row를 확대하면 해당 부분의 블록도 더 크게 표시됨
4. **시각적 연결**: 여러 Row에 걸친 블록은 동일한 색상과 스타일로 시각적으로 연결됨

```typescript
// 긴 시간 블록 예시: 08:00 ~ 22:00
const longBlock: ScheduleItem = {
  id: "long-block-1",
  title: "장기 프로젝트",
  startTime: "08:00",
  endTime: "22:00",
  // ...
};

// 자동 분할 결과 (splitScheduleItem 함수 사용)
const splitBlocks = splitScheduleItem(longBlock);
// 결과: 8시~22시까지 각 Row에 분할된 블록 배열
// - 8시 Row: top: 0%, height: 100%
// - 9시~21시 Row: top: 0%, height: 100% (각각)
// - 22시 Row: top: 0%, height: 0% (22:00이 종료 시간이므로)

// 각 Row에서 일반 블록과 동일하게 렌더링
splitBlocks.forEach((block) => {
  // 일반 블록과 동일한 렌더링 로직 적용
  renderBlock(block);
});
```

#### 추가 고려사항

- **스크롤**: 타임라인 영역을 스크롤 가능하게 설정하여 긴 블록 전체 확인 가능
- **성능**: 가상 스크롤링으로 뷰포트에 보이는 Row만 렌더링하여 성능 최적화
- **시각적 일관성**: 분할된 블록들이 동일한 색상과 스타일을 유지하여 하나의 연속된 블록처럼 보이도록 처리

### 6.4 현재 시간 표시

#### 요구사항

- 현재 시간을 빨간 선으로 표시
- 스크롤 시 현재 시간으로 자동 이동 옵션
- **새로운 방식의 특성**: 현재 시간이 속한 Row를 찾고, 해당 Row 내부에서 상대 위치로 표시

#### 구현

```typescript
// 현재 시간 계산
const currentTime = new Date();
const currentHour = currentTime.getHours();
const currentMinute = currentTime.getMinutes();

// 현재 시간이 속한 Row 내부에서의 위치 (%)
const currentTopPercent = (currentMinute / 60) * 100;

// 현재 시간 표시 컴포넌트
const CurrentTimeIndicator = ({
  hour,
  rowHeight,
}: {
  hour: number;
  rowHeight: number;
}) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // 현재 시간이 이 Row에 속하는지 확인
  if (currentHour !== hour) {
    return null;
  }

  const topPercent = (currentMinute / 60) * 100;

  return (
    <div
      className="current-time-indicator"
      style={{
        position: "absolute",
        top: `${topPercent}%`,
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "#FF0000",
        zIndex: 1000,
        pointerEvents: "none", // 클릭 이벤트 차단
      }}
    />
  );
};

// 각 Row 렌더링 시 현재 시간 표시 추가
{
  hourRows.map((hour) => (
    <div key={hour} className="hour-row" style={{ height: rowHeights[hour] }}>
      <CurrentTimeIndicator hour={hour} rowHeight={rowHeights[hour]} />
      {/* 다른 블록들... */}
    </div>
  ));
}
```

#### 현재 시간으로 자동 스크롤

```typescript
// 현재 시간이 속한 Row까지 스크롤
const scrollToCurrentTime = () => {
  const currentHour = new Date().getHours();
  const rowElement = document.getElementById(`hour-row-${currentHour}`);

  if (rowElement) {
    rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
```

### 6.5 빈 시간대 처리

#### 요구사항

- 스케줄이 없는 시간대도 명확히 표시
- 시간축은 항상 표시

#### 구현

- 시간축은 전체 시간 범위 표시
- 빈 영역은 회색 배경 또는 그리드 라인으로 구분

---

## 7. 성능 최적화

### 7.1 가상 스크롤링 (Virtual Scrolling)

- 뷰포트에 보이는 영역만 렌더링
- 스크롤 시 동적으로 블록 추가/제거

### 7.2 메모이제이션 (React Compiler)

**구현 전략**: React Compiler를 활성화하여 자동 메모이제이션 적용

- **자동 최적화**: `useMemo`, `useCallback` 등을 수동으로 작성하지 않음
- **컴파일러 단계 최적화**: 컴파일러가 최적의 메모이제이션 전략 자동 적용
- **코드 간소화**: 최적화 로직에 집중하지 않고 비즈니스 로직에 집중

**주의사항**:

- 블록 위치 계산, z-index 계산 등 복잡한 계산 로직은 React Compiler가 자동으로 최적화
- 수동 메모이제이션 코드는 제거하고 컴파일러에 의존

### 7.3 디바운싱/스로틀링

- 스크롤 이벤트 디바운싱
- 리사이즈 이벤트 스로틀링
- Row 높이 변경 이벤트 최적화

---

## 8. 구현 우선순위

### Phase 1 (MVP)

1. 기본 레이아웃 구조
2. 시간축 렌더링
3. 계획/실행 블록 렌더링 (status 필드 기반)
4. 기본 스케줄 추가/수정 기능

### Phase 2

1. 시간 겹침 처리
2. 텍스트 오버플로우 처리
3. 드래그 앤 드롭 (컬럼 간 이동)
4. 현재 시간 표시

### Phase 3

1. 가상 스크롤링
2. 성능 최적화
3. Row 동적 리사이징

---

## 9. 참고 사항

- 모든 시간은 24시간 형식 (HH:MM)
- 날짜는 ISO 8601 형식 (YYYY-MM-DD)
- 색상은 HEX 코드 사용
- 반응형 디자인 필수
- 모바일 터치 제스처 지원 (스와이프, 드래그)
