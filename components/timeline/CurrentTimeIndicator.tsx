"use client";

import { useState, useEffect } from "react";

interface CurrentTimeIndicatorProps {
  hour: number;
  rowHeight: number;
}

/**
 * 현재 시간 인디케이터 컴포넌트
 * 현재 시간이 속한 Row에 빨간 선으로 표시
 * 
 * Props:
 * - hour: 이 컴포넌트가 속한 Row의 시간 (0~23)
 * - rowHeight: Row 높이 (픽셀)
 * 
 * State:
 * - currentMinute: 현재 분 (1분마다 업데이트)
 * 
 * 렌더링 조건:
 * - 현재 시간(hour)이 이 Row의 시간과 일치할 때만 렌더링
 */
export function CurrentTimeIndicator({ hour, rowHeight }: CurrentTimeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // 1분마다 현재 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date());
    };

    // 다음 분 시작까지의 시간 계산
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // 다음 분 시작 시 업데이트 후, 1분마다 반복
    const initialTimeout = setTimeout(() => {
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }, msUntilNextMinute);

    return () => clearTimeout(initialTimeout);
  }, []);

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // 현재 시간이 이 Row에 속하지 않으면 렌더링하지 않음
  if (currentHour !== hour) {
    return null;
  }

  // Row 내 상대 위치 계산 (%)
  const topPercent = (currentMinute / 60) * 100;

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        top: `${topPercent}%`,
        zIndex: 50,
      }}
    >
      {/* 빨간 선 */}
      <div className="h-0.5 bg-red-500 w-full" />
      {/* 왼쪽 원형 마커 (선택적) */}
      <div 
        className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full"
        style={{ transform: "translateY(-25%)" }}
      />
    </div>
  );
}
