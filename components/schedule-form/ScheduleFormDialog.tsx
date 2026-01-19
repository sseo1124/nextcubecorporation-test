"use client";

import { useState, useEffect } from "react";
import type { ScheduleItem, ScheduleStatus, ColorPalette } from "@/lib/types";
import type { ScheduleFormData } from "@/hooks/useScheduleData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSelector } from "./TimeSelector";
import { ColorSelector } from "./ColorSelector";

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ScheduleFormData) => void;
  onDelete?: () => void;
  editItem?: ScheduleItem; // 수정 모드일 때 기존 아이템
  defaultStatus?: ScheduleStatus; // 새 아이템 생성 시 기본 status
  defaultStartTime?: string; // 새 아이템 생성 시 기본 시작 시간 "HH:mm"
  defaultEndTime?: string; // 새 아이템 생성 시 기본 종료 시간 "HH:mm"
}

/**
 * 스케줄 추가/수정 폼 다이얼로그
 * 
 * Props:
 * - open: 다이얼로그 열림 상태
 * - onOpenChange: 열림 상태 변경 콜백
 * - onSubmit: 폼 제출 콜백 (역 데이터 흐름)
 * - onDelete: 삭제 콜백 (수정 모드에서만)
 * - editItem: 수정할 아이템 (없으면 새 아이템 생성)
 * - defaultStatus: 새 아이템의 기본 status
 * - defaultStartTime: 새 아이템의 기본 시작 시간 (클릭한 시간대)
 * - defaultEndTime: 새 아이템의 기본 종료 시간
 * 
 * State:
 * - formData: 폼 입력 데이터 (로컬 State)
 */
export function ScheduleFormDialog({
  open,
  onOpenChange,
  onSubmit,
  onDelete,
  editItem,
  defaultStatus = "planned",
  defaultStartTime = "09:00",
  defaultEndTime = "10:00",
}: ScheduleFormDialogProps) {
  const isEditMode = !!editItem;

  // === State 정의 ===
  // formData: 폼 입력 데이터 (로컬 State, 제출 시 부모로 전달)
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    description: "",
    startTime: defaultStartTime,
    endTime: defaultEndTime,
    color: "lavender" as ColorPalette,
    status: defaultStatus,
  });

  // 유효성 검사 에러
  const [errors, setErrors] = useState<Record<string, string>>({});

  // editItem이 변경되면 폼 데이터 초기화
  useEffect(() => {
    if (editItem) {
      setFormData({
        title: editItem.title,
        description: editItem.description || "",
        startTime: editItem.startTime,
        endTime: editItem.endTime,
        color: editItem.color,
        status: editItem.status,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        color: "lavender",
        status: defaultStatus,
      });
    }
    setErrors({});
  }, [editItem, defaultStatus, defaultStartTime, defaultEndTime, open]);

  // === 역 데이터 흐름 (이벤트 핸들러) ===

  // 필드 변경 핸들러
  const handleFieldChange = <K extends keyof ScheduleFormData>(
    field: K,
    value: ScheduleFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 에러 클리어
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요";
    }

    // 시간 유효성 검사 (시작 < 종료)
    const [startHour, startMin] = formData.startTime.split(":").map(Number);
    const [endHour, endMin] = formData.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      newErrors.endTime = "종료 시간은 시작 시간보다 이후여야 합니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
    onOpenChange(false);
  };

  // 삭제
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "스케줄 수정" : "새 스케줄 추가"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "스케줄 정보를 수정하세요."
                : "새로운 스케줄을 추가하세요."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="스케줄 제목"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                placeholder="상세 설명 (선택)"
                rows={2}
              />
            </div>

            {/* 시간 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <TimeSelector
                label="시작 시간"
                value={formData.startTime}
                onChange={(value) => handleFieldChange("startTime", value)}
              />
              <TimeSelector
                label="종료 시간"
                value={formData.endTime}
                onChange={(value) => handleFieldChange("endTime", value)}
                minTime={formData.startTime}
              />
            </div>
            {errors.endTime && (
              <p className="text-xs text-destructive">{errors.endTime}</p>
            )}

            {/* 상태 선택 */}
            <div className="space-y-2">
              <Label>구분</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ScheduleStatus) =>
                  handleFieldChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">계획</SelectItem>
                  <SelectItem value="executed">실행</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 색상 선택 */}
            <ColorSelector
              value={formData.color}
              onChange={(color) => handleFieldChange("color", color)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {isEditMode && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                삭제
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">
              {isEditMode ? "수정" : "추가"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
