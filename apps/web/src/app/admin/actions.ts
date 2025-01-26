"use server";

import { log } from "@repo/logger";
import { AllServices, NewService } from "@repo/shared/db/schemas/services";
import {
  ServicePricingDetails,
  ServicePricingService,
} from "@repo/shared/types/servicePricing";
import { cookies } from "next/headers";
import { z } from "zod";
import { CreateResponse, transformServiceFormToSchema } from "../../lib/types";
import {
  API_HOST,
  GeneralResponse,
  handleError,
  PROJECT_URL,
} from "../../lib/utils";

export async function getAllServices(): Promise<ServicePricingDetails[]> {
  // get the user from supabase
  // attach auth cookie headers
  // call API
  //
  // only on create/mutations will i need
  // to have the `form-wrapper`
  // -- { fields,}

  const res = await fetch(`${API_HOST}/admin/services/all`, {
    method: "GET",
  }).catch((e) => {
    let errorMsg = "";
    if (e instanceof Error) errorMsg += e.message;
    else {
      errorMsg += JSON.stringify(e);
    }
    log(errorMsg);
    throw new Error(errorMsg);
  });

  if (!res.ok) {
    let errorMsg = JSON.stringify(res.statusText);
    log(errorMsg);
    return [];
  }

  const r: GeneralResponse<ServicePricingDetails[], { message: string }> =
    await res.json().catch((e) => {
      const errorMsg = handleError("", e);
      throw new Error(errorMsg);
    });
  if (!r.success) {
    console.log(`Error: ${JSON.stringify(r.error)}`);
    throw new Error(r.error.message);
  }

  return r.data;
}

export async function createServiceAction(_prevState: any, formData: FormData) {
  const parsedServices: z.infer<
    typeof ServicePricingService.NewServicePricingSchema
  >[] = [];
  const formFields: Record<string, string> = {};
  const dirtyData = Object.fromEntries(formData);
  const data = transformServiceFormToSchema(dirtyData);
  log(`transformedData=${JSON.stringify(data, null, 2)}`);

  data.forEach((s) => {
    const parsed = ServicePricingService.NewServicePricingSchema.safeParse(s);
    if (parsed.success) {
      parsedServices.push(parsed.data);
    } else {
      log(`parsed error=${JSON.stringify(parsed.error, null, 2)}`);
      for (const key of Object.keys(dirtyData)) {
        formFields[key] = dirtyData[key].toString();
      }
    }
  });

  if (Object.entries(formFields).length > 0) {
    return {
      formFields,
      message: "Invalid form data",
    };
  }

  const res = await bulkServiceUpdate(parsedServices);
  if (!res.success || res?.data?.error) {
    log(`Create Service failure. Error=${JSON.stringify(res, null, 2)}`);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      error: res,
      formFields,
    };
  } else {
    // be better typescript....
    const { ids } = res.data!;

    return {
      formFields: { ids: ids },
      message: "success",
    };
  }
}

export async function createService(
  service: NewService,
): Promise<CreateResponse<{ id: string }>> {
  const authHeaders = new Headers();
  const authCookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  authHeaders.append("Authorization", `Bearer ${authCookies?.value}`);
  authHeaders.append("Content-Type", "application/json");

  // log(`service=${JSON.stringify(service, null, 2)}`);
  const res = await fetch(`${API_HOST}/admin/services/new`, {
    body: JSON.stringify(service),
    headers: authHeaders,
    method: "POST",
  }).catch((e) => {
    let errorMsg = "";
    if (e instanceof Error) errorMsg += e.message;
    else {
      errorMsg += JSON.stringify(e);
    }
    log(errorMsg);
    throw new Error(errorMsg);
  });

  if (!res.ok) {
    let errorMsg = JSON.stringify(res.statusText);
    log(errorMsg);
    return {
      error: errorMsg,
      success: false,
    };
  }

  const r: CreateResponse<{ id: string }> = await res.json();
  return r;
}

export async function bulkServiceUpdate(
  services: AllServices[],
): Promise<CreateResponse<any>> {
  const authHeaders = new Headers();
  const authCookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  authHeaders.append("Authorization", `Bearer ${authCookies?.value}`);
  authHeaders.append("Content-Type", "application/json");
  console.log(`services=${JSON.stringify(services, null, 2)}`);

  const res = await fetch(`${API_HOST}/admin/services/bulk`, {
    body: JSON.stringify(services),
    headers: authHeaders,
    method: "POST",
  }).catch((e) => {
    let errorMsg = "";
    if (e instanceof Error) errorMsg += e.message;
    else {
      errorMsg += JSON.stringify(e);
    }
    log(errorMsg);
    throw new Error(errorMsg);
  });

  if (!res.ok) {
    let errorMsg = JSON.stringify(res.statusText);
    log(errorMsg);
    return {
      error: errorMsg,
      success: false,
    };
  }

  const r: CreateResponse<{ ids: string[] }> = await res.json();
  return r;
}
