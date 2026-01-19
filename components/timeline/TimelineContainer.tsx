"use client";

import { useState, useMemo } from "react";
import type { ScheduleData, ScheduleStatus } from "@/lib/types";
import { DEFAULT_ROW_HEIGHT } from "@/lib/constants";
import { splitScheduleItems, groupBlocksByHour } from "@/lib/utils/schedule-splitter";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TimelineHeader } from "./TimelineHeader";
import { TimeAxis } from "./TimeAxis";
import { ScheduleColumn } from "./ScheduleColumn";
import { ScheduleFormDialog } from "@/components/schedule-form";
import { useScheduleData, type ScheduleFormData } from "@/hooks/useScheduleData";
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
 * - items: 스케줄 아이템 배열 (useScheduleData 훅으로 관리)
 * - isFormOpen: 폼 다이얼로그 열림 상태
 * - editingItem: 수정 중인 아이템
 * - selectedBlockId: 현재 선택된 블록 ID (겹침 처리용)
 * - hoveredBlockId: 현재 hover 중인 블록 ID (분할 블록 통합 hover용)
 * - defaultStatus: 새 아이템 생성 시 기본 status
 * - defaultStartTime/defaultEndTime: 새 아이템 생성 시 기본 시간
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

  // 스케줄 데이터 관리 (useScheduleData 훅)
  const {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
  } = useScheduleData(scheduleData.items);

  // 폼 다이얼로그 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<ScheduleStatus>("planned");
  const [defaultStartTime, setDefaultStartTime] = useState("09:00");
  const [defaultEndTime, setDefaultEndTime] = useState("10:00");

  // 선택된 블록 ID (겹침 처리 시 z-index 상승용)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // hover 중인 블록 ID (분할 블록 통합 hover용)
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);

  // 수정 중인 아이템
  const editingItem = editingItemId ? getItemById(editingItemId) : undefined;

  // === 파생 데이터 (계산 가능하므로 State 아님) ===
  // 일주일 날짜 배열
  const weekDates = useMemo(
    () => getWeekDates(new Date(selectedDate)),
    [selectedDate]
  );

  // 스케줄 아이템을 시간별 블록으로 분할
  const splitBlocks = useMemo(
    () => splitScheduleItems(items),
    [items]
  );

  // 시간별로 그룹화
  const blocksByHour = useMemo(
    () => groupBlocksByHour(splitBlocks),
    [splitBlocks]
  );

  // 총 시간 계산
  const plannedTotalHours = useMemo(
    () => calculateTotalHours(items, "planned"),
    [items]
  );

  const executedTotalHours = useMemo(
    () => calculateTotalHours(items, "executed"),
    [items]
  );

  // 시간 범위: 항상 00:00 ~ 23:00 (24개 Row)
  const startHour = 0;
  const endHour = 23;

  // === 역 데이터 흐름 (이벤트 핸들러) ===
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // 빈 영역 클릭 시 새 스케줄 추가 다이얼로그 열기
  const handleEmptyClick = (hour: number, status: ScheduleStatus) => {
    setEditingItemId(null);
    setDefaultStatus(status);
    // 클릭한 시간대를 기본 시작/종료 시간으로 설정
    const startTime = `${String(hour).padStart(2, "0")}:00`;
    const endTime = `${String(hour + 1).padStart(2, "0")}:00`;
    setDefaultStartTime(startTime);
    setDefaultEndTime(endTime);
    setIsFormOpen(true);
  };

  // 블록 클릭 시 선택 및 수정 다이얼로그 열기
  const handleBlockClick = (itemId: string) => {
    setSelectedBlockId(itemId);
    setEditingItemId(itemId);
    setIsFormOpen(true);
  };

  // 블록 hover 시 (분할 블록 통합 hover)
  const handleBlockHover = (itemId: string | null) => {
    setHoveredBlockId(itemId);
  };

  // 다이얼로그 닫힐 때 선택 해제
  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedBlockId(null);
    }
  };

  // 폼 제출 핸들러
  const handleFormSubmit = (data: ScheduleFormData) => {
    if (editingItemId) {
      updateItem(editingItemId, data);
    } else {
      addItem(data);
    }
  };

  // 삭제 핸들러
  const handleDelete = () => {
    if (editingItemId) {
      deleteItem(editingItemId);
    }
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
              selectedBlockId={selectedBlockId}
              hoveredBlockId={hoveredBlockId}
              onBlockClick={handleBlockClick}
              onBlockHover={handleBlockHover}
              onEmptyClick={handleEmptyClick}
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
              selectedBlockId={selectedBlockId}
              hoveredBlockId={hoveredBlockId}
              onBlockClick={handleBlockClick}
              onBlockHover={handleBlockHover}
              onEmptyClick={handleEmptyClick}
            />
          </div>
        </ScrollArea>
      </Card>

      {/* 스케줄 추가/수정 다이얼로그 */}
      <ScheduleFormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        onDelete={editingItemId ? handleDelete : undefined}
        editItem={editingItem}
        defaultStatus={defaultStatus}
        defaultStartTime={defaultStartTime}
        defaultEndTime={defaultEndTime}
      />
    </TooltipProvider>
  );
}
