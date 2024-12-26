import { Scheduler } from "@/components/ux/Scheduler";
import { getAllAvailability } from "./actions";
import { transformAvailabilityToScheduleType } from "@/lib/types";

export default async function Page() {
  const serviceAvailability = await getAllAvailability();
  if (serviceAvailability.error) {
    console.error(`serviceAvailability.error`, serviceAvailability.error);
  }

  return (
    <div>
      <h1>Booking</h1>
      <Scheduler
        availableTimeslots={serviceAvailability.data.map(
          transformAvailabilityToScheduleType,
        )}
        eventDurationInMinutes={30}
      />
    </div>
  );
}
