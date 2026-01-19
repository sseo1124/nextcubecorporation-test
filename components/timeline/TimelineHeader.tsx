import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimelineHeaderProps {
  selectedDate: string;
  weekDates: string[];
  onDateSelect: (date: string) => void;
}

/**
 * 타임라인 헤더 컴포넌트
 * 날짜 선택 및 요약 정보 표시
 * 
 * Props:
 * - selectedDate: 선택된 날짜 (YYYY-MM-DD)
 * - weekDates: 일주일 날짜 배열
 * - onDateSelect: 날짜 선택 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (부모에서 관리)
 */
export function TimelineHeader({
  selectedDate,
  weekDates,
  onDateSelect,
}: TimelineHeaderProps) {
  // 날짜 포맷팅 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      weekday: ["일", "월", "화", "수", "목", "금", "토"][date.getDay()],
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };

  const selected = formatDate(selectedDate);

  // 이전/다음 주 이동 핸들러
  const handlePrevWeek = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 7);
    onDateSelect(date.toISOString().split("T")[0]);
  };

  const handleNextWeek = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 7);
    onDateSelect(date.toISOString().split("T")[0]);
  };

  return (
    <div className="border-b border-border bg-background">
      {/* 타이틀 */}
      <div className="text-center py-2 font-bold text-lg">
        공부 화이팅!!
      </div>

      {/* 날짜 네비게이션 */}
      <div className="flex items-center justify-center gap-1 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handlePrevWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium min-w-[120px] text-center">
          {selected.year}. {String(selected.month).padStart(2, "0")}. {String(selected.day).padStart(2, "0")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleNextWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 주간 날짜 선택 */}
      <div className="flex justify-center gap-1 px-2 pb-3">
        {weekDates.map((date) => {
          const { day, weekday } = formatDate(date);
          const isSelected = date === selectedDate;
          const isToday = date === new Date().toISOString().split("T")[0];
          const isSunday = new Date(date).getDay() === 0;
          const isSaturday = new Date(date).getDay() === 6;

          return (
            <Button
              key={date}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center h-auto py-1.5 px-2 min-w-[40px]",
                isToday && !isSelected && "ring-1 ring-primary",
                isSunday && !isSelected && "text-red-500",
                isSaturday && !isSelected && "text-blue-500"
              )}
            >
              <span className="text-[10px] leading-none">{weekday}</span>
              <span className="text-sm font-semibold leading-tight">{day}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
