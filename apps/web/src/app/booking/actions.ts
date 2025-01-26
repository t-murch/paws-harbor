import { type SelectServiceAvailability } from "@repo/shared/db/schemas/schema";
import { API_HOST, ClientResponse, fetcher, isError } from "../../lib/utils";

async function getAllAvailability(
  daysFromToday = 30,
): Promise<ClientResponse<SelectServiceAvailability[]>> {
  try {
    const data = await fetcher<{ data: SelectServiceAvailability[] }>({
      url: `${API_HOST}/availability/service/all?days=${daysFromToday}`,
    });
    return { data: data.data, error: null };
  } catch (e) {
    const errorMessage = isError(e) ? e.message : JSON.stringify(e);
    return {
      data: new Array<SelectServiceAvailability>(),
      error: errorMessage,
    };
  }
}

export { getAllAvailability };
