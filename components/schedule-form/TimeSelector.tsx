"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimeSelectorProps {
  label: string;
  value: string; // "HH:mm" 형식
  onChange: (value: string) => void;
  minTime?: string; // 최소 시간 제한 (시작 시간보다 이후만 선택 가능)
}

/**
 * 시간 선택 컴포넌트
 * Hour/Minute 드롭다운 (5분 단위)
 * 
 * Props:
 * - label: 레이블 텍스트
 * - value: 현재 선택된 시간 ("HH:mm")
 * - onChange: 시간 변경 콜백 (역 데이터 흐름)
 * - minTime: 최소 시간 제한
 * 
 * State: 없음 (제어 컴포넌트)
 */
export function TimeSelector({
  label,
  value,
  onChange,
  minTime,
}: TimeSelectorProps) {
  // 현재 값 파싱
  const [currentHour, currentMinute] = value.split(":").map(Number);

  // 시간 옵션 생성 (0~23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // 분 옵션 생성 (0, 5, 10, ..., 55) - 5분 단위
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  // 최소 시간 파싱
  const minHour = minTime ? parseInt(minTime.split(":")[0], 10) : 0;
  const minMinute = minTime ? parseInt(minTime.split(":")[1], 10) : 0;

  // 시간 변경 핸들러
  const handleHourChange = (hour: string) => {
    const newHour = parseInt(hour, 10);
    let newMinute = currentMinute;
    
    // 최소 시간 제한 적용
    if (minTime && newHour === minHour && newMinute <= minMinute) {
      // 최소 시간보다 5분 이후로 설정
      newMinute = Math.ceil((minMinute + 1) / 5) * 5;
      if (newMinute >= 60) {
        newMinute = 0;
      }
    }
    
    onChange(`${String(newHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`);
  };

  // 분 변경 핸들러
  const handleMinuteChange = (minute: string) => {
    const newMinute = parseInt(minute, 10);
    onChange(`${String(currentHour).padStart(2, "0")}:${String(newMinute).padStart(2, "0")}`);
  };

  // 시간 옵션 필터링 (최소 시간 이후만)
  const filteredHours = minTime
    ? hours.filter((h) => h >= minHour)
    : hours;

  // 분 옵션 필터링 (같은 시간대일 때 최소 분 이후만)
  const filteredMinutes = minTime && currentHour === minHour
    ? minutes.filter((m) => m > minMinute)
    : minutes;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {/* 시간 선택 */}
        <Select
          value={String(currentHour)}
          onValueChange={handleHourChange}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="시" />
          </SelectTrigger>
          <SelectContent>
            {filteredHours.map((hour) => (
              <SelectItem key={hour} value={String(hour)}>
                {String(hour).padStart(2, "0")}시
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="flex items-center">:</span>

        {/* 분 선택 */}
        <Select
          value={String(currentMinute)}
          onValueChange={handleMinuteChange}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="분" />
          </SelectTrigger>
          <SelectContent>
            {filteredMinutes.map((minute) => (
              <SelectItem key={minute} value={String(minute)}>
                {String(minute).padStart(2, "0")}분
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
