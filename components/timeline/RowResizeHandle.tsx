"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MIN_ROW_HEIGHT, MAX_ROW_HEIGHT, Z_INDEX } from "@/lib/constants";

interface RowResizeHandleProps {
  hour: number;
  currentHeight: number;
  onResize: (hour: number, newHeight: number) => void;
}

/**
 * Row 리사이즈 핸들 컴포넌트
 * 각 시간 Row의 하단에 위치하여 드래그로 높이 조절
 * 
 * Props:
 * - hour: 시간 (0~23)
 * - currentHeight: 현재 Row 높이 (픽셀)
 * - onResize: 리사이즈 콜백 (역 데이터 흐름)
 * 
 * State:
 * - isDragging: 드래그 중인지 여부
 * - startY: 드래그 시작 Y 좌표
 * - startHeight: 드래그 시작 시 높이
 */
export function RowResizeHandle({
  hour,
  currentHeight,
  onResize,
}: RowResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(currentHeight);

  // 드래그 시작
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(currentHeight);
  };

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    if (!isDragging) return;

    // 드래그 중
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(
        MIN_ROW_HEIGHT,
        Math.min(MAX_ROW_HEIGHT, startHeight + deltaY)
      );
      onResize(hour, newHeight);
    };

    // 드래그 종료
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, startY, startHeight, hour, onResize]);

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 h-2 cursor-row-resize",
        "group/handle",
        // hover 시 핸들 표시
        "hover:bg-primary/10",
        // 드래그 중 강조
        isDragging && "bg-primary/20"
      )}
      style={{ zIndex: Z_INDEX.ROW_RESIZE_HANDLE }}
      onMouseDown={handleMouseDown}
    >
      {/* 드래그 핸들 시각적 표시 (hover 시에만 보임) */}
      <div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2",
          "w-12 h-1 rounded-full",
          "bg-muted-foreground/30",
          "opacity-0 group-hover/handle:opacity-100",
          "transition-opacity duration-150",
          isDragging && "opacity-100 bg-primary"
        )}
      />
    </div>
  );
}
