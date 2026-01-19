"use client";

import { useMemo } from "react";
import type { SplitBlock } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScheduleBlock } from "./ScheduleBlock";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import { RowResizeHandle } from "./RowResizeHandle";
import { calculateZIndex } from "@/lib/utils/z-index-calculator";

interface HourRowProps {
  hour: number;
  blocks: SplitBlock[];
  height?: number;
  selectedBlockId?: string | null;
  hoveredBlockId?: string | null;
  onBlockClick?: (originalId: string) => void;
  onBlockHover?: (originalId: string | null) => void;
  onEmptyClick?: (hour: number) => void;
  onResize?: (hour: number, newHeight: number) => void;
}

/**
 * 시간 Row 컴포넌트
 * 특정 시간대(hour)에 해당하는 블록들을 렌더링
 * 
 * Props:
 * - hour: 시간 (0~23)
 * - blocks: 해당 시간대의 SplitBlock 배열
 * - height: Row 높이 (픽셀)
 * - selectedBlockId: 현재 선택된 블록 ID
 * - hoveredBlockId: 현재 hover 중인 블록 ID
 * - onBlockClick: 블록 클릭 콜백 (역 데이터 흐름)
 * - onBlockHover: 블록 hover 콜백 (역 데이터 흐름)
 * - onEmptyClick: 빈 영역 클릭 콜백 (역 데이터 흐름)
 * - onResize: Row 높이 변경 콜백 (역 데이터 흐름)
 * 
 * 파생 데이터:
 * - zIndexMap: 블록별 z-index 맵 (겹침 처리용)
 */
export function HourRow({ 
  hour, 
  blocks, 
  height = DEFAULT_ROW_HEIGHT,
  selectedBlockId,
  hoveredBlockId,
  onBlockClick,
  onBlockHover,
  onEmptyClick,
  onResize,
}: HourRowProps) {
  // 블록별 z-index 계산 (파생 데이터)
  const zIndexMap = useMemo(() => calculateZIndex(blocks), [blocks]);

  // 빈 영역 클릭 핸들러 (블록이 아닌 영역 클릭 시)
  const handleRowClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 타겟이 Row 자체인 경우에만 (블록 클릭이 아닌 경우)
    if (e.target === e.currentTarget && onEmptyClick) {
      onEmptyClick(hour);
    }
  };

  return (
    <div
      className={cn(
        "relative border-b border-border",
        "hover:bg-muted/30 transition-colors cursor-pointer"
      )}
      style={{ height: `${height}px` }}
      data-hour={hour}
      onClick={handleRowClick}
    >
      {/* 블록들 렌더링 (z-index 적용, rowHeight 전달로 텍스트 표시 모드 계산) */}
      {blocks.map((block) => (
        <ScheduleBlock 
          key={block.id} 
          block={block}
          rowHeight={height}
          zIndex={zIndexMap.get(block.id) || 10}
          isSelected={selectedBlockId === block.originalId}
          isHovered={hoveredBlockId === block.originalId}
          onClick={onBlockClick}
          onHover={onBlockHover}
        />
      ))}
      
      {/* 현재 시간 인디케이터 */}
      <CurrentTimeIndicator hour={hour} rowHeight={height} />

      {/* 리사이즈 핸들 */}
      {onResize && (
        <RowResizeHandle
          hour={hour}
          currentHeight={height}
          onResize={onResize}
        />
      )}
    </div>
  );
}
