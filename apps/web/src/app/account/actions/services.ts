"use server";

import { Service2 } from "@/lib/types";
import {
  API_HOST,
  GeneralResponse,
  handleError,
  PROJECT_URL,
} from "@/lib/utils";
import { log } from "console";
import { cookies } from "next/headers";

export async function getUserServices(): Promise<Service2[]> {
  // get the user from supabase
  // attach auth cookie headers
  // call API
  //
  // only on create/mutations will i need
  // to have the `form-wrapper`
  // -- { fields,}

  const authHeaders = new Headers();
  const authCookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  authHeaders.append("Authorization", `Bearer ${authCookies?.value}`);
  authHeaders.append("Content-Type", "application/json");

  const res = await fetch(`${API_HOST}/services/all`, {
    headers: authHeaders,
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

  const r: GeneralResponse<Service2[], { message: string }> = await res
    .json()
    .catch((e) => {
      const errorMsg = handleError("", e);
      throw new Error(errorMsg);
    });
  if (!r.success) {
    throw new Error(r.error.message);
  }

  return r.data;
}
