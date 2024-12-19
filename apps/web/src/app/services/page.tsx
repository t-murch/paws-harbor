import Pricelist from "@/components/ux/Services/PriceList";
import { BASE_PRICES } from "../../../../api/src/types/pricing";
import { getAllServices } from "../admin/actions";

export default async function Services() {
  let services = await getAllServices();

  //TODO: improve loading and error state.
  if (!services.length) return <div>No services found</div>;
  return <Pricelist pricing={BASE_PRICES} services={services} />;
}
