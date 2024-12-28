"use client";

import Color from "color";
import { useEffect, useState } from "react";
import { ScheduleMeeting } from "react-schedule-meeting";

export type SchedulerProps = React.ComponentProps<typeof ScheduleMeeting>;

export function Scheduler({
  availableTimeslots,
  eventDurationInMinutes,
}: SchedulerProps) {
  const [backgroundColor, setBackgroundColor] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState<string>("");
  const [borderRadius, setBorderRadius] = useState<number>(0);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primary = rootStyles.getPropertyValue("--primary").trim().split(" ");
    setPrimaryColor(
      Color(`hsl(${primary[0]}, ${primary[1]}, ${primary[2]})`).hex(),
    );
  }, []);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const background = rootStyles
      .getPropertyValue("--background")
      .trim()
      .split(" ");
    setBackgroundColor(
      Color(`hsl(${background[0]}, ${background[1]}, ${background[2]})`).hex(),
    );
  }, []);

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const border =
      Number(
        rootStyles.getPropertyValue("--radius").trim().replace("rem", ""),
      ) * 16;
    setBorderRadius(border);
  }, []);

  if (!primaryColor || !backgroundColor || !borderRadius) {
    return null;
  }

  return (
    <div className="schedule-wrapper">
      <ScheduleMeeting
        availableTimeslots={availableTimeslots}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        eventDurationInMinutes={eventDurationInMinutes}
        onStartTimeSelect={console.log}
        primaryColor={primaryColor}
      />
    </div>
  );
}
