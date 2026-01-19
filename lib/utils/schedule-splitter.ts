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
  
  // 먼저 총 블록 수를 계산하여 isLastBlock 판단에 사용
  const tempBlocks: Array<{
    hour: number;
    blockStartMinute: number;
    blockEndMinute: number;
  }> = [];
  
  let tempHour = currentHour;
  while (tempHour <= endHour) {
    const blockStartMinute = tempHour === startTime.hour ? startTime.minute : 0;
    const blockEndMinute = tempHour === endHour ? endTime.minute : 60;
    
    if (blockStartMinute < blockEndMinute) {
      tempBlocks.push({ hour: tempHour, blockStartMinute, blockEndMinute });
    }
    tempHour++;
  }
  
  const totalBlocks = tempBlocks.length;
  
  // 실제 블록 생성
  tempBlocks.forEach((temp, index) => {
    const { hour, blockStartMinute, blockEndMinute } = temp;
    
    // Row 내 상대 위치 계산 (topPercent)
    const topPercent = (blockStartMinute / 60) * 100;
    
    // Row 내 상대 높이 계산 (heightPercent)
    const blockDurationMinutes = blockEndMinute - blockStartMinute;
    const heightPercent = (blockDurationMinutes / 60) * 100;
    
    const isFirstBlock = index === 0;
    const isLastBlock = index === totalBlocks - 1;
    
    // SplitBlock 생성
    const block: SplitBlock = {
      id: `${item.id}-${hour}-${blockStartMinute}`,
      originalId: item.id,
      title: item.title,
      description: item.description,
      color: item.color,
      status: item.status,
      hour,
      startMinute: blockStartMinute,
      endMinute: blockEndMinute,
      topPercent,
      heightPercent,
      isFirstBlock,
      isLastBlock,
      originalStartTime: item.startTime, // 원본 시작 시간
      originalEndTime: item.endTime, // 원본 종료 시간
    };
    
    blocks.push(block);
  });
  
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
