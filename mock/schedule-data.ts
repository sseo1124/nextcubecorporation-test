import type { ScheduleData, ScheduleItem } from "@/lib/types";

/**
 * 일주일 날짜 생성 (오늘 기준)
 */
export function getWeekDates(baseDate: Date = new Date()): string[] {
  const dates: string[] = [];
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // 일요일 시작

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD" 형식
  }

  return dates;
}

/**
 * Mock 스케줄 아이템
 * 하루 전체 시간대에 걸쳐 다양하게 분포
 * 시간대: 새벽(00~05), 아침(06~08), 오전(09~11), 점심(12~13), 오후(14~17), 저녁(18~21), 밤(22~23)
 */
export const MOCK_SCHEDULE_ITEMS: ScheduleItem[] = [
  // ========================================
  // 계획 (planned)
  // ========================================

  // 🌙 새벽 (00:00 ~ 05:59)
  {
    id: "plan-1",
    title: "새벽 명상",
    description: "마음 정리 시간",
    startTime: "05:00",
    endTime: "05:30",
    color: "lilac",
    status: "planned",
  },

  // 🌅 아침 (06:00 ~ 08:59)
  {
    id: "plan-2",
    title: "기상 및 스트레칭",
    startTime: "06:00",
    endTime: "06:30",
    color: "butter",
    status: "planned",
  },
  {
    id: "plan-3",
    title: "아침 식사",
    startTime: "07:00",
    endTime: "07:30",
    color: "peach",
    status: "planned",
  },
  {
    id: "plan-4",
    title: "영어 단어 암기",
    description: "Day 31~35",
    startTime: "07:30",
    endTime: "08:30",
    color: "sky",
    status: "planned",
  },

  // 🌞 오전 (09:00 ~ 11:59)
  {
    id: "plan-5",
    title: "수학 문제풀이",
    description: "쎈 공통수학1\n45~60번",
    startTime: "09:00",
    endTime: "11:00",
    color: "mint",
    status: "planned",
  },
  {
    id: "plan-6",
    title: "국어 비문학",
    description: "수능특강 3강",
    startTime: "11:00",
    endTime: "12:00",
    color: "rose",
    status: "planned",
  },

  // 🍽️ 점심 (12:00 ~ 13:59)
  {
    id: "plan-7",
    title: "점심 식사",
    startTime: "12:00",
    endTime: "13:00",
    color: "butter",
    status: "planned",
  },
  {
    id: "plan-8",
    title: "낮잠",
    startTime: "13:00",
    endTime: "13:30",
    color: "lavender",
    status: "planned",
  },

  // 🌤️ 오후 (14:00 ~ 17:59)
  {
    id: "plan-9",
    title: "화학1",
    description: "완자 기출Pick\n32~38",
    startTime: "14:00",
    endTime: "16:00",
    color: "lavender",
    status: "planned",
  },
  {
    id: "plan-10",
    title: "사회문화",
    description: "수행평가 준비",
    startTime: "16:00",
    endTime: "17:30",
    color: "sage",
    status: "planned",
  },

  // 🌆 저녁 (18:00 ~ 21:59)
  {
    id: "plan-11",
    title: "저녁 식사",
    startTime: "18:00",
    endTime: "19:00",
    color: "peach",
    status: "planned",
  },
  {
    id: "plan-12",
    title: "영어 독해",
    description: "수능특강 영어\n5~6강",
    startTime: "19:00",
    endTime: "20:30",
    color: "sky",
    status: "planned",
  },
  {
    id: "plan-13",
    title: "수학 오답노트",
    startTime: "20:30",
    endTime: "21:30",
    color: "mint",
    status: "planned",
  },

  // 🌙 밤 (22:00 ~ 23:59)
  {
    id: "plan-14",
    title: "하루 정리",
    description: "내일 계획 세우기",
    startTime: "22:00",
    endTime: "22:30",
    color: "lilac",
    status: "planned",
  },
  {
    id: "plan-15",
    title: "취침 준비",
    startTime: "23:00",
    endTime: "23:30",
    color: "lavender",
    status: "planned",
  },

  // ========================================
  // 실행 (executed)
  // ========================================

  // 🌙 새벽
  {
    id: "exec-1",
    title: "새벽 명상",
    description: "10분 늦게 시작",
    startTime: "05:10",
    endTime: "05:40",
    color: "lilac",
    status: "executed",
  },

  // 🌅 아침
  {
    id: "exec-2",
    title: "늦잠",
    startTime: "06:00",
    endTime: "06:45",
    color: "butter",
    status: "executed",
  },
  {
    id: "exec-3",
    title: "아침 식사",
    startTime: "07:00",
    endTime: "07:20",
    color: "peach",
    status: "executed",
  },
  {
    id: "exec-4",
    title: "영어 단어",
    description: "Day 31~33만 완료",
    startTime: "07:30",
    endTime: "08:15",
    color: "sky",
    status: "executed",
  },

  // 🌞 오전
  {
    id: "exec-5",
    title: "수학 문제풀이",
    description: "쎈 공통수학1\n45~55번",
    startTime: "09:00",
    endTime: "10:30",
    color: "mint",
    status: "executed",
  },
  {
    id: "exec-6",
    title: "휴식",
    startTime: "10:30",
    endTime: "11:00",
    color: "butter",
    status: "executed",
  },
  {
    id: "exec-7",
    title: "국어 비문학",
    description: "수능특강 3강 절반",
    startTime: "11:00",
    endTime: "11:45",
    color: "rose",
    status: "executed",
  },

  // 🍽️ 점심
  {
    id: "exec-8",
    title: "점심 식사",
    description: "친구와 외식",
    startTime: "12:00",
    endTime: "13:30",
    color: "butter",
    status: "executed",
  },

  // 🌤️ 오후
  {
    id: "exec-9",
    title: "화학1",
    description: "완자 기출Pick\n32~35",
    startTime: "14:00",
    endTime: "15:30",
    color: "lavender",
    status: "executed",
  },
  {
    id: "exec-10",
    title: "SNS 확인",
    startTime: "15:30",
    endTime: "16:00",
    color: "sage",
    status: "executed",
  },
  {
    id: "exec-11",
    title: "사회문화",
    description: "수행평가 자료조사",
    startTime: "16:00",
    endTime: "17:00",
    color: "sage",
    status: "executed",
  },
  {
    id: "exec-12",
    title: "편의점 다녀오기",
    startTime: "17:00",
    endTime: "17:30",
    color: "peach",
    status: "executed",
  },

  // 🌆 저녁
  {
    id: "exec-13",
    title: "저녁 식사",
    startTime: "18:00",
    endTime: "18:45",
    color: "peach",
    status: "executed",
  },
  {
    id: "exec-14",
    title: "영어 독해",
    description: "수능특강 영어 5강",
    startTime: "19:00",
    endTime: "20:00",
    color: "sky",
    status: "executed",
  },
  {
    id: "exec-15",
    title: "유튜브 시청",
    startTime: "20:00",
    endTime: "20:30",
    color: "rose",
    status: "executed",
  },
  {
    id: "exec-16",
    title: "수학 오답노트",
    startTime: "20:30",
    endTime: "21:15",
    color: "mint",
    status: "executed",
  },

  // 🌙 밤
  {
    id: "exec-17",
    title: "하루 정리",
    startTime: "22:00",
    endTime: "22:20",
    color: "lilac",
    status: "executed",
  },
  {
    id: "exec-18",
    title: "게임",
    startTime: "22:30",
    endTime: "23:30",
    color: "lavender",
    status: "executed",
  },
];

/**
 * Mock 스케줄 데이터
 */
export const MOCK_SCHEDULE_DATA: ScheduleData = {
  date: "2025-09-10",
  items: MOCK_SCHEDULE_ITEMS,
};

/**
 * 날짜별 Mock 데이터 조회 함수 (API 시뮬레이션)
 */
export function getMockScheduleData(date: string): ScheduleData {
  // 실제로는 날짜별로 다른 데이터를 반환하겠지만,
  // 현재는 모든 날짜에 동일한 Mock 데이터 반환
  return {
    date,
    items: MOCK_SCHEDULE_ITEMS,
  };
}

/**
 * 총 시간 계산 함수
 */
export function calculateTotalHours(
  items: ScheduleItem[],
  status: "planned" | "executed"
): number {
  const filteredItems = items.filter((item) => item.status === status);

  let totalMinutes = 0;
  for (const item of filteredItems) {
    const [startHour, startMin] = item.startTime.split(":").map(Number);
    const [endHour, endMin] = item.endTime.split(":").map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    totalMinutes += duration;
  }

  return totalMinutes / 60;
}
