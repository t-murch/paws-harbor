"use client";

import { SchedulerType } from "@/lib/types";
import Color from "color";
import { useEffect, useState } from "react";
import { ScheduleMeeting } from "react-schedule-meeting";
import { SelectServiceAvailability } from "../../../../api/src/db/availability";
import { BASE_SERVICES } from "../../../../api/src/types";
import ScheduleControl, { DropdownItem } from "./ScheduleControl";

const allFilters = BASE_SERVICES.map((val, idx) => {
  return {
    id: idx,
    name: val,
  };
});

export type ScheduleMeetingProps = React.ComponentProps<typeof ScheduleMeeting>;

export type SchedulerProps = {
  timeSlots: SchedulerType[];
};

export function Scheduler({ timeSlots }: SchedulerProps) {
  const [activeFilters] =
    useState<{ id: number; name: SelectServiceAvailability["serviceType"] }[]>(
      allFilters,
    );
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<SchedulerType[]>(
    timeSlots.filter((val) => val.serviceType === activeFilters[0].name),
  );
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

  function filterTimeSlots(types: DropdownItem[]) {
    if (types.length === 0) {
      setFilteredTimeSlots(timeSlots);
      return;
    }
    const typeNames = types.map((val) => val.name);
    setFilteredTimeSlots(
      timeSlots.filter((val) => typeNames.includes(val.serviceType)),
    );
  }

  if (!primaryColor || !backgroundColor || !borderRadius) {
    return null;
  }

  return (
    <>
      <ScheduleControl
        filters={activeFilters}
        onServiceTypeChange={filterTimeSlots}
      />
      <ScheduleMeeting
        availableTimeslots={filteredTimeSlots}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        eventDurationInMinutes={30}
        onStartTimeSelect={console.log}
        primaryColor={primaryColor}
      />
    </>
  );
}
