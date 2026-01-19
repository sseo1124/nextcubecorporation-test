/**
 * 텍스트 오버플로우 처리 유틸리티
 * 
 * 블록의 실제 픽셀 높이에 따라 표시할 텍스트를 결정합니다.
 * 
 * 렌더링 규칙:
 * | 블록 높이   | 표시 내용                        | CSS 처리                    |
 * | ----------- | -------------------------------- | --------------------------- |
 * | < 30px      | 제목만 (truncate)                | `truncate` 클래스 적용      |
 * | 30px ~ 60px | 제목 + 설명 1줄 (설명 truncate)  | 제목과 설명 모두 `truncate` |
 * | ≥ 60px      | 제목 + 설명 전체                 | 일반 텍스트 표시            |
 */

import { TEXT_DISPLAY_THRESHOLD_SMALL, TEXT_DISPLAY_THRESHOLD_MEDIUM } from "@/lib/constants";

/**
 * 텍스트 표시 모드
 */
export type TextDisplayMode = "title-only" | "title-description-truncate" | "full";

/**
 * 표시할 텍스트 정보
 */
export interface DisplayText {
  title: string;
  description: string | null;
  mode: TextDisplayMode;
}

/**
 * 블록의 실제 픽셀 높이 계산
 * 
 * @param rowHeight - Row의 높이 (픽셀)
 * @param blockHeightPercent - 블록의 높이 비율 (%)
 * @returns 블록의 실제 픽셀 높이
 */
export function calculateActualHeight(
  rowHeight: number,
  blockHeightPercent: number
): number {
  return (rowHeight * blockHeightPercent) / 100;
}

/**
 * 텍스트 truncate 유틸리티
 * 
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns truncate된 텍스트 (필요시 "..." 추가)
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * 실제 픽셀 높이에 따라 텍스트 표시 모드 결정
 * 
 * @param actualHeightPx - 블록의 실제 픽셀 높이
 * @returns 텍스트 표시 모드
 */
export function getTextDisplayMode(actualHeightPx: number): TextDisplayMode {
  if (actualHeightPx < TEXT_DISPLAY_THRESHOLD_SMALL) {
    return "title-only";
  } else if (actualHeightPx < TEXT_DISPLAY_THRESHOLD_MEDIUM) {
    return "title-description-truncate";
  } else {
    return "full";
  }
}

/**
 * 실제 픽셀 높이에 따라 표시할 텍스트 결정
 * 
 * @param title - 제목
 * @param description - 설명 (optional)
 * @param actualHeightPx - 블록의 실제 픽셀 높이
 * @returns 표시할 텍스트 정보
 */
export function getDisplayText(
  title: string,
  description: string | undefined | null,
  actualHeightPx: number
): DisplayText {
  const mode = getTextDisplayMode(actualHeightPx);

  switch (mode) {
    case "title-only":
      // 높이 < 30px: 제목만 표시
      return {
        title,
        description: null,
        mode,
      };

    case "title-description-truncate":
      // 30px ~ 60px: 제목 + 설명 1줄 (truncate)
      return {
        title,
        description: description || null,
        mode,
      };

    case "full":
      // 60px 이상: 전체 표시
      return {
        title,
        description: description || null,
        mode,
      };
  }
}
