import type { SplitBlock, ScheduleStatus } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HourRow } from "./HourRow";

interface ScheduleColumnProps {
  status: ScheduleStatus;
  title: string;
  totalHours: number;
  blocksByHour: Map<number, SplitBlock[]>;
  startHour?: number;
  endHour?: number;
  rowHeight?: number;
  selectedBlockId?: string | null;
  onBlockClick?: (originalId: string) => void;
  onEmptyClick?: (hour: number, status: ScheduleStatus) => void;
}

/**
 * 스케줄 컬럼 컴포넌트
 * 계획(planned) 또는 실행(executed) 영역
 * 
 * Props:
 * - status: 스케줄 상태 ("planned" | "executed")
 * - title: 컬럼 제목
 * - totalHours: 총 시간
 * - blocksByHour: 시간별 블록 맵
 * - startHour/endHour: 표시할 시간 범위
 * - rowHeight: Row 높이
 * - selectedBlockId: 현재 선택된 블록 ID
 * - onBlockClick: 블록 클릭 콜백 (역 데이터 흐름)
 * - onEmptyClick: 빈 영역 클릭 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 */
export function ScheduleColumn({
  status,
  title,
  totalHours,
  blocksByHour,
  startHour = 0,
  endHour = 23,
  rowHeight = DEFAULT_ROW_HEIGHT,
  selectedBlockId,
  onBlockClick,
  onEmptyClick,
}: ScheduleColumnProps) {
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  // 빈 영역 클릭 시 status 정보와 함께 전달
  const handleEmptyClick = (hour: number) => {
    if (onEmptyClick) {
      onEmptyClick(hour, status);
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col">
      {/* 컬럼 헤더 */}
      <div className={cn(
        "sticky top-0 z-10",
        "bg-background/95 backdrop-blur-sm",
        "border-b border-border",
        "px-2 py-1.5"
      )}>
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-sm">{title}</span>
          <Badge variant="secondary" className="text-xs font-normal">
            총 {totalHours.toFixed(1)}h
          </Badge>
        </div>
      </div>

      {/* 시간별 Row */}
      <div className="flex-1">
        {hours.map((hour) => {
          // 해당 시간대의 블록들 필터링 (status 일치하는 것만)
          const hourBlocks = (blocksByHour.get(hour) || []).filter(
            (block) => block.status === status
          );

          return (
            <HourRow
              key={hour}
              hour={hour}
              blocks={hourBlocks}
              height={rowHeight}
              selectedBlockId={selectedBlockId}
              onBlockClick={onBlockClick}
              onEmptyClick={handleEmptyClick}
            />
          );
        })}
      </div>
    </div>
  );
}
