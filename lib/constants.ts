import type { ColorPalette } from "./types";

/**
 * 8가지 파스텔 색상 팔레트
 * Tailwind CSS 클래스명과 대응되는 색상 정의
 */
export const COLOR_PALETTE: Record<ColorPalette, { name: string; class: string }> = {
  lavender: {
    name: "라벤더",
    class: "bg-lavender",
  },
  mint: {
    name: "민트",
    class: "bg-mint",
  },
  peach: {
    name: "피치",
    class: "bg-peach",
  },
  sky: {
    name: "스카이",
    class: "bg-sky",
  },
  rose: {
    name: "로즈",
    class: "bg-rose",
  },
  butter: {
    name: "버터",
    class: "bg-butter",
  },
  lilac: {
    name: "라일락",
    class: "bg-lilac",
  },
  sage: {
    name: "세이지",
    class: "bg-sage",
  },
};

/**
 * 색상 팔레트 배열 (순서 보장)
 */
export const COLOR_PALETTE_ARRAY: ColorPalette[] = [
  "lavender",
  "mint",
  "peach",
  "sky",
  "rose",
  "butter",
  "lilac",
  "sage",
];

/**
 * 기본 Row 높이 (픽셀)
 */
export const DEFAULT_ROW_HEIGHT = 60;

/**
 * Row 높이 최소/최대 값 (픽셀)
 */
export const MIN_ROW_HEIGHT = 30;
export const MAX_ROW_HEIGHT = 300;

/**
 * 시간축 너비 (픽셀)
 */
export const TIME_AXIS_WIDTH_DESKTOP = 80;
export const TIME_AXIS_WIDTH_MOBILE = 60;

/**
 * 텍스트 표시 기준 높이 (픽셀)
 */
export const TEXT_DISPLAY_THRESHOLD_SMALL = 30; // 이보다 작으면 제목만
export const TEXT_DISPLAY_THRESHOLD_MEDIUM = 60; // 이보다 크면 전체 표시
