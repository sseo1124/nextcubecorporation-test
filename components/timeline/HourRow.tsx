import type { SplitBlock } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ScheduleBlock } from "./ScheduleBlock";

interface HourRowProps {
  hour: number;
  blocks: SplitBlock[];
  height?: number;
}

/**
 * 시간 Row 컴포넌트
 * 특정 시간대(hour)에 해당하는 블록들을 렌더링
 * 
 * Props:
 * - hour: 시간 (0~23)
 * - blocks: 해당 시간대의 SplitBlock 배열
 * - height: Row 높이 (픽셀)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 */
export function HourRow({ hour, blocks, height = DEFAULT_ROW_HEIGHT }: HourRowProps) {
  return (
    <div
      className={cn(
        "relative border-b border-border",
        "hover:bg-muted/30 transition-colors"
      )}
      style={{ height: `${height}px` }}
      data-hour={hour}
    >
      {/* 블록들 렌더링 */}
      {blocks.map((block) => (
        <ScheduleBlock key={block.id} block={block} />
      ))}
    </div>
  );
}
