"use client";

import { useState, useCallback } from "react";
import type { ScheduleItem, ScheduleStatus } from "@/lib/types";

/**
 * 스케줄 폼 데이터 타입 (id 제외)
 */
export type ScheduleFormData = Omit<ScheduleItem, "id">;

/**
 * useScheduleData 훅 반환 타입
 */
export interface UseScheduleDataReturn {
  items: ScheduleItem[];
  addItem: (data: ScheduleFormData) => ScheduleItem;
  updateItem: (id: string, data: Partial<ScheduleFormData>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => ScheduleItem | undefined;
  getItemsByStatus: (status: ScheduleStatus) => ScheduleItem[];
}

/**
 * 고유 ID 생성 함수
 */
function generateId(): string {
  return `schedule-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 스케줄 데이터 관리 훅
 * 
 * State:
 * - items: 스케줄 아이템 배열 (변경 가능)
 * 
 * 역 데이터 흐름:
 * - addItem: 새 아이템 추가
 * - updateItem: 기존 아이템 수정
 * - deleteItem: 아이템 삭제
 * 
 * 파생 데이터:
 * - getItemById: ID로 아이템 조회
 * - getItemsByStatus: status로 필터링
 * 
 * @param initialItems 초기 스케줄 아이템 배열
 */
export function useScheduleData(initialItems: ScheduleItem[] = []): UseScheduleDataReturn {
  // === State 정의 ===
  const [items, setItems] = useState<ScheduleItem[]>(initialItems);

  // === 역 데이터 흐름 (이벤트 핸들러) ===
  
  /**
   * 새 스케줄 아이템 추가
   */
  const addItem = useCallback((data: ScheduleFormData): ScheduleItem => {
    const newItem: ScheduleItem = {
      ...data,
      id: generateId(),
    };
    
    setItems((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  /**
   * 기존 스케줄 아이템 수정
   */
  const updateItem = useCallback((id: string, data: Partial<ScheduleFormData>): void => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...data } : item
      )
    );
  }, []);

  /**
   * 스케줄 아이템 삭제
   */
  const deleteItem = useCallback((id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // === 파생 데이터 (계산 함수) ===
  
  /**
   * ID로 아이템 조회
   */
  const getItemById = useCallback(
    (id: string): ScheduleItem | undefined => {
      return items.find((item) => item.id === id);
    },
    [items]
  );

  /**
   * status로 아이템 필터링
   */
  const getItemsByStatus = useCallback(
    (status: ScheduleStatus): ScheduleItem[] => {
      return items.filter((item) => item.status === status);
    },
    [items]
  );

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByStatus,
  };
}
