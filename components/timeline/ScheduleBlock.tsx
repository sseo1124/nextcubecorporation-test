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
  onClick?: (originalId: string) => void;
}

/**
 * 스케줄 블록 컴포넌트
 * Row 내부에서 상대 위치(top%, height%)로 렌더링됨
 * 
 * Props:
 * - block: SplitBlock (분할된 블록 데이터)
 * - onClick: 블록 클릭 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (순수 프레젠테이션 컴포넌트)
 * 
 * 연속 블록 시각적 연결:
 * - isFirstBlock: 상단 border + 상단 rounded
 * - isLastBlock: 하단 border + 하단 rounded
 * - 중간 블록: border 없음, rounded 없음
 * - 단일 블록 (isFirstBlock && isLastBlock): 전체 border + 전체 rounded
 */
export function ScheduleBlock({ block, onClick }: ScheduleBlockProps) {
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
  const handleClick = () => {
    if (onClick) {
      onClick(block.originalId);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "absolute left-0 right-0 px-1.5 py-0.5 overflow-hidden",
            "text-xs leading-tight",
            "cursor-pointer transition-all duration-150",
            "opacity-80 hover:opacity-100 hover:shadow-sm",
            bgColorClass,
            borderClasses,
            roundedClasses
          )}
          style={{
            top: `${block.topPercent}%`,
            height: `${block.heightPercent}%`,
            minHeight: "18px",
          }}
          onClick={handleClick}
        >
          {/* 첫 번째 블록에만 title과 description 표시 */}
          {block.isFirstBlock && (
            <>
              <div className="font-medium truncate">{block.title}</div>
              {block.heightPercent > 30 && block.description && (
                <div className="text-[10px] text-black/70 truncate whitespace-pre-line line-clamp-2">
                  {block.description}
                </div>
              )}
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[200px]">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
}
