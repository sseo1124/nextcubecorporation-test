import { TimelineContainer } from "@/components/timeline";
import { MOCK_SCHEDULE_DATA } from "@/mock/schedule-data";

export default function Home() {
  return <TimelineContainer scheduleData={MOCK_SCHEDULE_DATA} />;
}
