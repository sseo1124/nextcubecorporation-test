/**
 * 스케줄 상태 타입
 * - planned: 계획 영역 (좌측)
 * - executed: 실행 영역 (우측)
 */
export type ScheduleStatus = "planned" | "executed";

/**
 * 색상 팔레트 타입 (8가지 파스텔 색상)
 */
export type ColorPalette =
  | "lavender"
  | "mint"
  | "peach"
  | "sky"
  | "rose"
  | "butter"
  | "lilac"
  | "sage";

/**
 * 스케줄 아이템 타입
 * 사용자가 입력하는 원본 스케줄 데이터
 */
export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  startTime: string; // "HH:mm" 형식 (예: "09:30")
  endTime: string; // "HH:mm" 형식 (예: "11:45")
  color: ColorPalette;
  status: ScheduleStatus;
}

/**
 * 분할된 블록 타입
 * 시간 경계 기준으로 분할된 블록 (시간 Row에 배치됨)
 */
export interface SplitBlock {
  id: string; // 원본 ScheduleItem의 id
  originalId: string; // 원본 ScheduleItem의 id (추적용)
  title: string;
  description?: string;
  color: ColorPalette;
  status: ScheduleStatus;
  hour: number; // 0~23, 이 블록이 속한 시간 Row
  startMinute: number; // 0~59, 해당 시간 내 시작 분
  endMinute: number; // 0~60, 해당 시간 내 종료 분 (60은 다음 시간의 0분, 즉 시간 경계)
  topPercent: number; // Row 내 상대 위치 (0~100%)
  heightPercent: number; // Row 내 상대 높이 (0~100%)
  zIndex?: number; // 겹침 처리용 z-index
}

/**
 * 스케줄 데이터 타입
 * 전체 스케줄 데이터 구조
 */
export interface ScheduleData {
  items: ScheduleItem[];
  date: string; // "YYYY-MM-DD" 형식
}

/**
 * 시간 유틸리티 타입
 */
export interface Time {
  hour: number; // 0~23
  minute: number; // 0~59
}

/**
 * Row 높이 설정 타입
 */
export interface RowHeight {
  hour: number; // 0~23
  height: number; // 픽셀 단위 (30~300px)
}
