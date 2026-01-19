import type { SplitBlock } from "@/lib/types";

/**
 * 블록 시간 정보 인터페이스
 */
interface BlockTimeInfo {
  block: SplitBlock;
  startMinutes: number; // Row 내 시작 시간 (분, 0~60)
  endMinutes: number; // Row 내 종료 시간 (분, 0~60)
  duration: number; // 지속 시간 (분)
}

/**
 * Z-Index 계산 결과 타입
 */
export type ZIndexMap = Map<string, number>;

/**
 * 같은 시간대(Row) 내 블록들의 Z-Index를 계산합니다.
 * 
 * 규칙 1: 완전 포함 관계 (Nested Case)
 * - 내부 블록(짧은 블록)의 z-index > 외부 블록(긴 블록)의 z-index
 * - 이유: 작은 블록이 위에 표시되어야 클릭 가능
 * 
 * 규칙 2: 걸침 관계 (Overlapping Case)
 * - 더 늦게 끝나는 블록의 z-index > 먼저 끝나는 블록의 z-index
 * 
 * @param blocks 같은 시간대의 SplitBlock 배열
 * @returns 블록 ID별 z-index 맵
 */
export function calculateZIndex(blocks: SplitBlock[]): ZIndexMap {
  if (blocks.length === 0) {
    return new Map();
  }

  if (blocks.length === 1) {
    return new Map([[blocks[0].id, 10]]);
  }

  // 각 블록의 시간 정보 계산
  const blockInfos: BlockTimeInfo[] = blocks.map((block) => ({
    block,
    startMinutes: block.startMinute,
    endMinutes: block.endMinute,
    duration: block.endMinute - block.startMinute,
  }));

  // 가중치 기반 Z-Index 계산
  const zIndexMap = new Map<string, number>();
  const baseZIndex = 10;

  blockInfos.forEach((info) => {
    // 규칙 1: 지속 시간이 짧을수록 높은 z-index (완전 포함 관계 해결)
    // 짧은 블록이 위에 오도록: 1000 / (duration + 1)
    const durationWeight = 1000 / (info.duration + 1);

    // 규칙 2: 종료 시간이 늦을수록 높은 z-index (걸침 관계 해결)
    // 늦게 끝나는 블록이 위에 오도록
    const endTimeWeight = info.endMinutes;

    // 최종 가중치 (지속 시간 가중치가 더 중요하도록 가중)
    const totalWeight = durationWeight * 2 + endTimeWeight;

    zIndexMap.set(info.block.id, baseZIndex + totalWeight);
  });

  // Z-index 정규화 (10 ~ 100 범위)
  return normalizeZIndex(zIndexMap, baseZIndex);
}

/**
 * Z-Index 값을 10~100 범위로 정규화합니다.
 */
function normalizeZIndex(zIndexMap: ZIndexMap, baseZIndex: number): ZIndexMap {
  const values = Array.from(zIndexMap.values());
  const minWeight = Math.min(...values);
  const maxWeight = Math.max(...values);
  const normalizedMap = new Map<string, number>();

  if (maxWeight === minWeight) {
    // 모든 블록이 같은 가중치인 경우
    zIndexMap.forEach((_, id) => {
      normalizedMap.set(id, baseZIndex);
    });
  } else {
    zIndexMap.forEach((weight, id) => {
      // 10 ~ 100 범위로 정규화
      const normalized = Math.floor(
        ((weight - minWeight) / (maxWeight - minWeight)) * 90 + 10
      );
      normalizedMap.set(id, normalized);
    });
  }

  return normalizedMap;
}

/**
 * 두 블록이 시간적으로 겹치는지 확인합니다.
 */
export function blocksOverlap(blockA: SplitBlock, blockB: SplitBlock): boolean {
  // 같은 시간대(hour)가 아니면 겹치지 않음
  if (blockA.hour !== blockB.hour) {
    return false;
  }

  // 시간 범위가 겹치는지 확인
  return blockA.startMinute < blockB.endMinute && blockB.startMinute < blockA.endMinute;
}

/**
 * 블록 배열에서 겹치는 블록 그룹을 찾습니다.
 */
export function findOverlappingGroups(blocks: SplitBlock[]): SplitBlock[][] {
  if (blocks.length === 0) return [];

  const groups: SplitBlock[][] = [];
  const visited = new Set<string>();

  blocks.forEach((block) => {
    if (visited.has(block.id)) return;

    // 현재 블록과 겹치는 모든 블록 찾기
    const group: SplitBlock[] = [block];
    visited.add(block.id);

    blocks.forEach((other) => {
      if (visited.has(other.id)) return;
      
      // 그룹 내 어떤 블록과도 겹치면 그룹에 추가
      if (group.some((g) => blocksOverlap(g, other))) {
        group.push(other);
        visited.add(other.id);
      }
    });

    if (group.length > 1) {
      groups.push(group);
    }
  });

  return groups;
}

/**
 * 시간대별로 그룹화된 블록들에 z-index를 할당합니다.
 */
export function assignZIndexToBlocks(
  blocksByHour: Map<number, SplitBlock[]>
): Map<string, number> {
  const allZIndexMap = new Map<string, number>();

  blocksByHour.forEach((blocks) => {
    const zIndexMap = calculateZIndex(blocks);
    zIndexMap.forEach((zIndex, id) => {
      allZIndexMap.set(id, zIndex);
    });
  });

  return allZIndexMap;
}

/**
 * Hover/Click 시 z-index를 상승시킵니다.
 * 기본 z-index에 hover 보너스를 추가합니다.
 */
export const HOVER_Z_INDEX_BONUS = 100;
export const SELECTED_Z_INDEX_BONUS = 200;
