"use client";

import type { ColorPalette } from "@/lib/types";
import { COLOR_PALETTE, COLOR_PALETTE_ARRAY } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ColorSelectorProps {
  value: ColorPalette;
  onChange: (color: ColorPalette) => void;
}

/**
 * 색상 선택 컴포넌트
 * 8가지 파스텔 색상 팔레트 그리드
 * 
 * Props:
 * - value: 현재 선택된 색상
 * - onChange: 색상 변경 콜백 (역 데이터 흐름)
 * 
 * State: 없음 (제어 컴포넌트)
 */
export function ColorSelector({ value, onChange }: ColorSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>색상</Label>
      <div className="grid grid-cols-4 gap-2">
        {COLOR_PALETTE_ARRAY.map((color) => {
          const isSelected = color === value;
          const colorInfo = COLOR_PALETTE[color];

          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                "relative h-10 rounded-md border-2 transition-all",
                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                colorInfo.class,
                isSelected ? "border-primary" : "border-transparent"
              )}
              title={colorInfo.name}
            >
              {isSelected && (
                <Check className="absolute inset-0 m-auto h-5 w-5 text-primary" />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        선택: {COLOR_PALETTE[value].name}
      </p>
    </div>
  );
}
