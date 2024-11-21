import ServiceList from "@/components/ux/Services/ServiceList";
import { getAllServices } from "./actions";

export default async function Admin() {
  let services = await getAllServices();

  return (
    <div className="flex-1">
      <ServiceList initialServices={{ services: services }} />
    </div>
  );
}
