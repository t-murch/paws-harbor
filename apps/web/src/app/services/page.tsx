import Pricelist from "@/components/ux/Services/PriceList";
import { BASE_PRICES } from "../../../../api/src/types/pricing";

export default async function Services() {
  return <Pricelist {...BASE_PRICES} />;
}
