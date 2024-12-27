import { Scheduler } from "@/components/ux/Scheduler";
import {
  SchedulerType,
  transformAvailabilityToScheduleType,
  transformRecurringToScheduleType,
} from "@/lib/types";
import {
  isNonRecurringServiceAvailability,
  isRecurringServiceAvailability,
} from "@/lib/utils";
import { getAllAvailability } from "./actions";

export default async function Page() {
  const serviceAvailability = await getAllAvailability();
  if (serviceAvailability.error) {
    console.error(`serviceAvailability.error`, serviceAvailability.error);
  }
  const allAvailability = serviceAvailability.data.reduce((acc, curr) => {
    if (isNonRecurringServiceAvailability(curr))
      return [...acc, transformAvailabilityToScheduleType(curr)];
    else if (isRecurringServiceAvailability(curr))
      return [...acc, ...transformRecurringToScheduleType(curr)];
    else {
      console.log("unknown type found, curr:", curr);
      return acc;
    }
  }, [] as SchedulerType[]);

  return (
    <div>
      <h1>Booking</h1>
      <Scheduler
        availableTimeslots={allAvailability}
        eventDurationInMinutes={30}
      />
    </div>
  );
}
