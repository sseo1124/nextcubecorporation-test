"use client";

import { useMemo } from "react";
import type { SplitBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HOVER_Z_INDEX_BONUS } from "@/lib/utils/z-index-calculator";
import { 
  calculateActualHeight, 
  getDisplayText, 
  type TextDisplayMode 
} from "@/lib/utils/text-display";

interface ScheduleBlockProps {
  block: SplitBlock;
  rowHeight?: number;
  zIndex?: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (originalId: string) => void;
  onHover?: (originalId: string | null) => void;
}

/**
 * 스케줄 블록 컴포넌트
 * Row 내부에서 상대 위치(top%, height%)로 렌더링됨
 * 
 * Props:
 * - block: SplitBlock (분할된 블록 데이터)
 * - rowHeight: Row의 높이 (픽셀) - 텍스트 표시 모드 계산에 사용
 * - zIndex: 동적으로 계산된 z-index 값
 * - isSelected: 선택된 블록인지 여부
 * - isHovered: hover 상태 (상위에서 관리, 분할 블록 통합 hover용)
 * - onClick: 블록 클릭 콜백 (역 데이터 흐름)
 * - onHover: 블록 hover 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (제어 컴포넌트 - hover 상태는 상위에서 관리)
 * 
 * 투명도 시스템:
 * - 기본: 60% 투명도 (겹치는 블록이 보이도록)
 * - Hover/Selected: 100% 불투명 (강조)
 * 
 * 연속 블록 시각적 연결:
 * - isFirstBlock: 상단 border + 상단 rounded
 * - isLastBlock: 하단 border + 하단 rounded
 * - 중간 블록: border 없음, rounded 없음
 * - 단일 블록 (isFirstBlock && isLastBlock): 전체 border + 전체 rounded
 * 
 * 텍스트 오버플로우 처리 (동적 Row 높이 기반):
 * - < 30px: 제목만 표시 (truncate)
 * - 30px ~ 60px: 제목 + 설명 1줄 (truncate)
 * - ≥ 60px: 제목 + 설명 전체
 */
export function ScheduleBlock({ 
  block, 
  rowHeight = DEFAULT_ROW_HEIGHT,
  zIndex = 10, 
  isSelected = false,
  isHovered = false,
  onClick,
  onHover,
}: ScheduleBlockProps) {

  // 색상별 배경색 클래스 매핑 (60% 투명도 버전)
  const colorClasses: Record<string, { base: string; solid: string }> = {
    lavender: { base: "bg-lavender/60", solid: "bg-lavender" },
    mint: { base: "bg-mint/60", solid: "bg-mint" },
    peach: { base: "bg-peach/60", solid: "bg-peach" },
    sky: { base: "bg-sky/60", solid: "bg-sky" },
    rose: { base: "bg-rose/60", solid: "bg-rose" },
    butter: { base: "bg-butter/60", solid: "bg-butter" },
    lilac: { base: "bg-lilac/60", solid: "bg-lilac" },
    sage: { base: "bg-sage/60", solid: "bg-sage" },
  };

  const colorClass = colorClasses[block.color] || { base: "bg-gray-200/60", solid: "bg-gray-200" };
  
  // hover 또는 selected 상태일 때 불투명(solid) 색상 사용
  const bgColorClass = (isHovered || isSelected) ? colorClass.solid : colorClass.base;

  // 블록의 실제 픽셀 높이 계산 및 텍스트 표시 모드 결정 (파생 데이터)
  const displayText = useMemo(() => {
    const actualHeight = calculateActualHeight(rowHeight, block.heightPercent);
    return getDisplayText(block.title, block.description, actualHeight);
  }, [rowHeight, block.heightPercent, block.title, block.description]);

  // 연속 블록 시각적 연결을 위한 border/rounded 클래스 결정
  const isSingleBlock = block.isFirstBlock && block.isLastBlock;
  const isMiddleBlock = !block.isFirstBlock && !block.isLastBlock;

  const borderClasses = cn(
    // 좌우 border는 항상 표시
    "border-l border-r border-black/10",
    // 상단 border: 첫 번째 블록만
    block.isFirstBlock && "border-t",
    // 하단 border: 마지막 블록만
    block.isLastBlock && "border-b",
    // 중간 블록은 상하 border 없음
    isMiddleBlock && "border-t-0 border-b-0"
  );

  const roundedClasses = cn(
    // 단일 블록: 전체 rounded
    isSingleBlock && "rounded-sm",
    // 첫 번째 블록만: 상단만 rounded
    block.isFirstBlock && !block.isLastBlock && "rounded-t-sm rounded-b-none",
    // 마지막 블록만: 하단만 rounded
    block.isLastBlock && !block.isFirstBlock && "rounded-b-sm rounded-t-none",
    // 중간 블록: rounded 없음
    isMiddleBlock && "rounded-none"
  );

  // Tooltip에 원본 시간 정보 표시
  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-medium">{block.title}</div>
      <div className="text-xs opacity-80">
        {block.originalStartTime} ~ {block.originalEndTime}
      </div>
      {block.description && (
        <div className="text-xs whitespace-pre-line">{block.description}</div>
      )}
    </div>
  );

  // 클릭 핸들러
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 빈 영역 클릭 이벤트 전파 방지
    if (onClick) {
      onClick(block.originalId);
    }
  };

  // hover 핸들러 (상위 컴포넌트로 전달)
  const handleMouseEnter = () => {
    if (onHover) {
      onHover(block.originalId);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  // 동적 z-index 계산 (hover/selected 시 상승)
  const computedZIndex = isHovered || isSelected 
    ? zIndex + HOVER_Z_INDEX_BONUS 
    : zIndex;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute left-0 right-0 px-1.5 py-0.5 overflow-hidden",
            "text-xs leading-tight",
            "cursor-pointer transition-all duration-150",
            (isHovered || isSelected) && "shadow-md",
            bgColorClass,
            borderClasses,
            roundedClasses,
            // 선택된 블록 강조
            isSelected && "ring-2 ring-primary ring-offset-1"
          )}
          style={{
            top: `${block.topPercent}%`,
            height: `${block.heightPercent}%`,
            minHeight: "18px",
            zIndex: computedZIndex,
          }}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* 첫 번째 블록에만 title과 description 표시 */}
          {block.isFirstBlock && (
            <TextContent displayText={displayText} />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[200px]">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * 텍스트 콘텐츠 컴포넌트
 * 텍스트 표시 모드에 따라 다르게 렌더링
 * 
 * 모드별 렌더링:
 * - title-only: 제목만 (truncate)
 * - title-description-truncate: 제목 + 설명 1줄 (둘 다 truncate)
 * - full: 제목 + 설명 전체 (line-clamp로 제한)
 */
interface TextContentProps {
  displayText: {
    title: string;
    description: string | null;
    mode: TextDisplayMode;
  };
}

function TextContent({ displayText }: TextContentProps) {
  const { title, description, mode } = displayText;

  switch (mode) {
    case "title-only":
      // 높이 < 30px: 제목만 표시 (truncate)
      return (
        <div className="font-medium truncate text-[11px] leading-tight">
          {title}
        </div>
      );

    case "title-description-truncate":
      // 30px ~ 60px: 제목 + 설명 1줄 (truncate)
      return (
        <>
          <div className="font-medium truncate text-xs leading-tight">
            {title}
          </div>
          {description && (
            <div className="text-[10px] text-black/70 truncate mt-0.5">
              {description}
            </div>
          )}
        </>
      );

    case "full":
      // 60px 이상: 제목 + 설명 전체 (line-clamp로 제한)
      return (
        <>
          <div className="font-medium text-xs leading-tight">
            {title}
          </div>
          {description && (
            <div className="text-[10px] text-black/70 mt-0.5 line-clamp-3 whitespace-pre-line">
              {description}
            </div>
          )}
        </>
      );
  }
}
