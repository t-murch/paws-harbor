"use client";

import { ScheduleMeeting } from "react-schedule-meeting";

export type SchedulerProps = React.ComponentProps<typeof ScheduleMeeting>;

export function Scheduler({
  availableTimeslots,
  eventDurationInMinutes,
}: SchedulerProps) {
  return (
    <ScheduleMeeting
      availableTimeslots={availableTimeslots}
      eventDurationInMinutes={eventDurationInMinutes}
      onStartTimeSelect={console.log}
    />
  );
}
