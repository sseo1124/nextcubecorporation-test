"use client";

import type { SplitBlock } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScheduleBlockProps {
  block: SplitBlock;
}

/**
 * 스케줄 블록 컴포넌트
 * Row 내부에서 상대 위치(top%, height%)로 렌더링됨
 * 
 * Props:
 * - block: SplitBlock (분할된 블록 데이터)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 */
export function ScheduleBlock({ block }: ScheduleBlockProps) {
  // 색상별 배경색 클래스 매핑
  const colorClasses: Record<string, string> = {
    lavender: "bg-lavender",
    mint: "bg-mint",
    peach: "bg-peach",
    sky: "bg-sky",
    rose: "bg-rose",
    butter: "bg-butter",
    lilac: "bg-lilac",
    sage: "bg-sage",
  };

  const bgColorClass = colorClasses[block.color] || "bg-gray-200";

  // 시간 포맷팅
  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  };

  const startTimeStr = formatTime(block.hour, block.startMinute);
  const endTimeStr = block.endMinute === 60 
    ? formatTime(block.hour + 1, 0)
    : formatTime(block.hour, block.endMinute);

  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-medium">{block.title}</div>
      <div className="text-xs opacity-80">
        {startTimeStr} ~ {endTimeStr}
      </div>
      {block.description && (
        <div className="text-xs whitespace-pre-line">{block.description}</div>
      )}
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute left-0 right-0 rounded-sm px-1.5 py-0.5 overflow-hidden",
            "text-xs leading-tight",
            "border border-black/10",
            "cursor-pointer transition-all duration-150",
            "opacity-80 hover:opacity-100 hover:shadow-sm",
            bgColorClass
          )}
          style={{
            top: `${block.topPercent}%`,
            height: `${block.heightPercent}%`,
            minHeight: "18px",
          }}
        >
          <div className="font-medium truncate">{block.title}</div>
          {block.heightPercent > 30 && block.description && (
            <div className="text-[10px] text-black/70 truncate whitespace-pre-line line-clamp-2">
              {block.description}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[200px]">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
