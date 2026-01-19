"use client";

import type { SplitBlock } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScheduleBlock } from "./ScheduleBlock";

interface HourRowProps {
  hour: number;
  blocks: SplitBlock[];
  height?: number;
  onBlockClick?: (originalId: string) => void;
  onEmptyClick?: (hour: number) => void;
}

/**
 * 시간 Row 컴포넌트
 * 특정 시간대(hour)에 해당하는 블록들을 렌더링
 * 
 * Props:
 * - hour: 시간 (0~23)
 * - blocks: 해당 시간대의 SplitBlock 배열
 * - height: Row 높이 (픽셀)
 * - onBlockClick: 블록 클릭 콜백 (역 데이터 흐름)
 * - onEmptyClick: 빈 영역 클릭 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 */
export function HourRow({ 
  hour, 
  blocks, 
  height = DEFAULT_ROW_HEIGHT, 
  onBlockClick,
  onEmptyClick,
}: HourRowProps) {
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
      {/* 블록들 렌더링 */}
      {blocks.map((block) => (
        <ScheduleBlock key={block.id} block={block} onClick={onBlockClick} />
      ))}
    </div>
  );
}
