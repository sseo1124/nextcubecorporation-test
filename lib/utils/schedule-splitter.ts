import type { ScheduleItem, SplitBlock } from "../types";
import { parseTimeString, compareTime } from "./time-utils";

/**
 * 스케줄 아이템을 시간 경계 기준으로 분할
 * 종료 시간은 Exclusive(미만)로 처리됨
 * 예: 09:30 ~ 11:45 -> [09:30-10:00, 10:00-11:00, 11:00-11:45] 3개 블록
 * 예: 09:00 ~ 10:00 -> [09:00-10:00] 1개 블록 (10:00는 10시 Row에 포함되지 않음)
 * 
 * @param item 분할할 스케줄 아이템
 * @returns 분할된 SplitBlock 배열
 */
export function splitScheduleItem(item: ScheduleItem): SplitBlock[] {
  const startTime = parseTimeString(item.startTime);
  const endTime = parseTimeString(item.endTime);
  
  // 시작 시간이 종료 시간보다 크거나 같으면 빈 배열 반환
  if (compareTime(startTime, endTime) >= 0) {
    return [];
  }

  const blocks: SplitBlock[] = [];
  
  // 시간(Hour) 기준으로 직접 반복하여 각 Row에 속하는 블록 생성
  // 종료 시간은 Exclusive(미만)로 처리: endTime이 10:00이면 10시 Row에는 포함되지 않음
  let currentHour = startTime.hour;
  const endHour = endTime.hour;
  
  while (currentHour <= endHour) {
    // 현재 시간 Row의 범위: [currentHour:00, currentHour+1:00)
    // 즉, currentHour:00 포함, currentHour+1:00 미포함
    
    // 이 Row에서 블록이 시작하는 분 결정
    // - 첫 번째 Row이면 startTime.minute
    // - 그 외는 0분
    const blockStartMinute = currentHour === startTime.hour ? startTime.minute : 0;
    
    // 이 Row에서 블록이 끝나는 분 결정
    // - 마지막 Row이고 endTime이 현재 시간 내에 있으면 endTime.minute
    // - 그 외는 60분 (다음 시간의 0분, exclusive)
    const blockEndMinute = currentHour === endHour ? endTime.minute : 60;
    
    // 블록이 실제로 이 Row에 존재하는지 확인
    // blockStartMinute < blockEndMinute 이어야 함
    if (blockStartMinute < blockEndMinute) {
      // Row 내 상대 위치 계산 (topPercent)
      // Row는 0분부터 60분까지이므로, 시작 분을 퍼센트로 변환
      const topPercent = (blockStartMinute / 60) * 100;
      
      // Row 내 상대 높이 계산 (heightPercent)
      // 블록이 차지하는 분을 퍼센트로 변환
      const blockDurationMinutes = blockEndMinute - blockStartMinute;
      const heightPercent = (blockDurationMinutes / 60) * 100;
      
      // SplitBlock 생성
      // endMinute는 0~60 범위 (60은 다음 시간의 0분, 즉 시간 경계를 의미)
      const block: SplitBlock = {
        id: `${item.id}-${currentHour}-${blockStartMinute}`, // 고유 ID 생성
        originalId: item.id,
        title: item.title,
        description: item.description,
        color: item.color,
        status: item.status,
        hour: currentHour,
        startMinute: blockStartMinute,
        endMinute: blockEndMinute, // 60은 시간 경계(다음 시간의 0분)를 의미
        topPercent,
        heightPercent,
      };
      
      blocks.push(block);
    }
    
    // 다음 시간으로 이동
    currentHour++;
  }
  
  return blocks;
}

/**
 * 여러 스케줄 아이템을 분할하여 하나의 SplitBlock 배열로 반환
 * @param items 스케줄 아이템 배열
 * @returns 분할된 SplitBlock 배열
 */
export function splitScheduleItems(items: ScheduleItem[]): SplitBlock[] {
  return items.flatMap(splitScheduleItem);
}

/**
 * SplitBlock 배열을 시간(hour)별로 그룹화
 * @param blocks SplitBlock 배열
 * @returns hour를 키로 하는 SplitBlock 배열 맵
 */
export function groupBlocksByHour(blocks: SplitBlock[]): Map<number, SplitBlock[]> {
  const grouped = new Map<number, SplitBlock[]>();
  
  for (const block of blocks) {
    const hour = block.hour;
    if (!grouped.has(hour)) {
      grouped.set(hour, []);
    }
    grouped.get(hour)!.push(block);
  }
  
  // 각 시간별로 블록을 startMinute 순으로 정렬
  for (const [hour, hourBlocks] of grouped.entries()) {
    hourBlocks.sort((a, b) => a.startMinute - b.startMinute);
  }
  
  return grouped;
}
