import type { Time } from "../types";

/**
 * "HH:mm" 형식의 시간 문자열을 Time 객체로 파싱
 * @param timeString "HH:mm" 형식 (예: "09:30")
 * @returns Time 객체
 */
export function parseTimeString(timeString: string): Time {
  const [hour, minute] = timeString.split(":").map(Number);
  return { hour, minute };
}

/**
 * Time 객체를 "HH:mm" 형식의 문자열로 변환
 * @param time Time 객체
 * @returns "HH:mm" 형식 문자열
 */
export function formatTime(time: Time): string {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(
    2,
    "0"
  )}`;
}

/**
 * Time 객체를 분 단위로 변환 (00:00 기준)
 * @param time Time 객체
 * @returns 분 단위 (0~1439)
 */
export function timeToMinutes(time: Time): number {
  return time.hour * 60 + time.minute;
}

/**
 * 분 단위를 Time 객체로 변환
 * @param minutes 분 단위 (0~1439)
 * @returns Time 객체
 */
export function minutesToTime(minutes: number): Time {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return { hour, minute };
}

/**
 * 두 시간을 비교
 * @param time1 첫 번째 시간
 * @param time2 두 번째 시간
 * @returns time1이 time2보다 이전이면 -1, 같으면 0, 이후면 1
 */
export function compareTime(time1: Time, time2: Time): number {
  const minutes1 = timeToMinutes(time1);
  const minutes2 = timeToMinutes(time2);

  if (minutes1 < minutes2) return -1;

  if (minutes1 > minutes2) return 1;
  return 0;
}

/**
 * 시간 문자열이 유효한지 검증
 * @param timeString "HH:mm" 형식 문자열
 * @returns 유효하면 true
 */
export function isValidTimeString(timeString: string): boolean {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!regex.test(timeString)) return false;

  const time = parseTimeString(timeString);
  return (
    time.hour >= 0 && time.hour <= 23 && time.minute >= 0 && time.minute <= 59
  );
}

/**
 * 두 시간 사이의 차이를 분 단위로 계산
 * @param start 시작 시간
 * @param end 종료 시간
 * @returns 분 단위 차이 (end - start)
 */
export function getTimeDifference(start: Time, end: Time): number {
  return timeToMinutes(end) - timeToMinutes(start);
}

/**
 * 현재 시간을 Time 객체로 반환
 * @returns 현재 시간의 Time 객체
 */
export function getCurrentTime(): Time {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
  };
}
