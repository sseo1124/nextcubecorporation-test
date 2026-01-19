import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";

interface TimeAxisProps {
  startHour?: number;
  endHour?: number;
  rowHeight?: number;
}

/**
 * 시간축 컴포넌트
 * 00:00 ~ 23:00 시간 레이블 표시 + 현재 시간 인디케이터
 * 
 * Props:
 * - startHour: 시작 시간 (기본값: 0)
 * - endHour: 종료 시간 (기본값: 23)
 * - rowHeight: Row 높이 (픽셀)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 */
export function TimeAxis({
  startHour = 0,
  endHour = 23,
  rowHeight = DEFAULT_ROW_HEIGHT,
}: TimeAxisProps) {
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  return (
    <div className={cn(
      "flex-shrink-0 w-14 md:w-16 border-r border-border",
      "bg-muted/20"
    )}>
      {/* 헤더 공간 (ScheduleColumn 헤더와 높이 맞춤) */}
      <div className="h-[34px] border-b border-border" />
      
      {/* 시간 레이블 */}
      {hours.map((hour) => (
        <div
          key={hour}
          className={cn(
            "relative flex items-start justify-end pr-2",
            "text-xs font-medium text-muted-foreground",
            "border-b border-border"
          )}
          style={{ height: `${rowHeight}px` }}
          data-hour={hour}
        >
          <span className="tabular-nums">
            {String(hour).padStart(2, "0")}:00
          </span>
          {/* 현재 시간 인디케이터 */}
          <CurrentTimeIndicator hour={hour} rowHeight={rowHeight} />
        </div>
      ))}
    </div>
  );
}
