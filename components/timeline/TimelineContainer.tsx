"use client";

import { useState, useMemo } from "react";
import type { ScheduleData } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { splitScheduleItems, groupBlocksByHour } from "@/lib/utils/schedule-splitter";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimelineHeader } from "./TimelineHeader";
import { TimeAxis } from "./TimeAxis";
import { ScheduleColumn } from "./ScheduleColumn";
import { getWeekDates, calculateTotalHours } from "@/mock/schedule-data";

interface TimelineContainerProps {
  scheduleData: ScheduleData;
  defaultDate?: string;
}

/**
 * 타임라인 메인 컨테이너 컴포넌트
 * State 관리 및 전체 레이아웃 구성
 * 
 * Props:
 * - scheduleData: 스케줄 데이터 (ScheduleData 타입)
 * - defaultDate: 기본 선택 날짜 (없으면 scheduleData.date 사용)
 * 
 * State:
 * - selectedDate: 사용자가 선택한 날짜 (변경 가능)
 * 
 * 파생 데이터 (useMemo로 계산):
 * - weekDates: 일주일 날짜 배열
 * - splitBlocks: 시간별로 분할된 블록 배열
 * - blocksByHour: 시간별 블록 그룹
 * - plannedTotalHours/executedTotalHours: 총 시간
 * 
 * 상수:
 * - startHour/endHour: 항상 0~23 (24개 Row, PRD 명세)
 */
export function TimelineContainer({
  scheduleData,
  defaultDate,
}: TimelineContainerProps) {
  // === State 정의 ===
  // selectedDate: 사용자가 선택한 날짜 (변경 가능, State)
  const [selectedDate, setSelectedDate] = useState(
    defaultDate || scheduleData.date
  );

  // === 파생 데이터 (계산 가능하므로 State 아님) ===
  // 일주일 날짜 배열
  const weekDates = useMemo(
    () => getWeekDates(new Date(selectedDate)),
    [selectedDate]
  );

  // 스케줄 아이템을 시간별 블록으로 분할
  const splitBlocks = useMemo(
    () => splitScheduleItems(scheduleData.items),
    [scheduleData.items]
  );

  // 시간별로 그룹화
  const blocksByHour = useMemo(
    () => groupBlocksByHour(splitBlocks),
    [splitBlocks]
  );

  // 총 시간 계산
  const plannedTotalHours = useMemo(
    () => calculateTotalHours(scheduleData.items, "planned"),
    [scheduleData.items]
  );

  const executedTotalHours = useMemo(
    () => calculateTotalHours(scheduleData.items, "executed"),
    [scheduleData.items]
  );

  // 시간 범위: 항상 00:00 ~ 23:00 (24개 Row)
  // PRD 명세: "표시 가능 시간 범위: 00:00 ~ 23:59 (총 24개 Row)"
  // 상수이므로 State나 useMemo 불필요
  const startHour = 0;
  const endHour = 23;

  // === 역 데이터 흐름 (이벤트 핸들러) ===
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // TODO: 날짜 변경 시 API 호출하여 해당 날짜의 데이터 로드
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="flex flex-col h-screen rounded-none border-0 md:border md:rounded-lg md:m-4 md:h-[calc(100vh-2rem)]">
        {/* 헤더 */}
        <TimelineHeader
          selectedDate={selectedDate}
          weekDates={weekDates}
          onDateSelect={handleDateSelect}
        />

        {/* 타임라인 본문 */}
        <ScrollArea className="flex-1">
          <div className="flex min-h-full">
            {/* 시간축 */}
            <TimeAxis
              startHour={startHour}
              endHour={endHour}
              rowHeight={DEFAULT_ROW_HEIGHT}
            />

            {/* 계획 영역 */}
            <ScheduleColumn
              status="planned"
              title="계획"
              totalHours={plannedTotalHours}
              blocksByHour={blocksByHour}
              startHour={startHour}
              endHour={endHour}
              rowHeight={DEFAULT_ROW_HEIGHT}
            />

            {/* 구분선 */}
            <div className="w-px bg-border flex-shrink-0" />

            {/* 실행 영역 */}
            <ScheduleColumn
              status="executed"
              title="실행"
              totalHours={executedTotalHours}
              blocksByHour={blocksByHour}
              startHour={startHour}
              endHour={endHour}
              rowHeight={DEFAULT_ROW_HEIGHT}
            />
          </div>
        </ScrollArea>
      </Card>
    </TooltipProvider>
  );
}
