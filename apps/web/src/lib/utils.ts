import { log } from "@repo/logger";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  RecurringAvailability,
  ServiceAvailability,
} from "../../../api/src/types";
import { daysofWeek } from "@repo/shared/src/server";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
export const SUPABASE_URL = isProd()
  ? process.env.NEXT_PUBLIC_SUPABASE_URL!
  : process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = isProd()
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  : process.env.NEXT_PUBLIC_LOCAL_SUPABASE_ANON_KEY!;
const PROJECT_URL = isProd()
  ? process.env.SB_AUTH_URL!
  : process.env.LOCAL_SB_AUTH_URL!;

function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function handleErrorBadRequest(response: Response) {
  let errorMessage = "";

  switch (response.headers.get("content-type")) {
    case "application/json": {
      const data = await response.json();
      errorMessage = `Error, Bad Request: ${JSON.stringify(data)}`;
      break;
    }
    case "text/plain": {
      errorMessage = `Error, Bad Request: ${await response.text()}`;
      break;
    }
    default: {
      errorMessage = `Error, Bad Request: ${response.status} ${response.statusText}`;
      break;
    }
  }

  log(errorMessage);
  return errorMessage;
}

async function fetcher<T>({
  url,
  options = { method: "GET" },
}: {
  url: string;
  options?: RequestInit;
}): Promise<T> {
  const response = await fetch(url, options).catch((e) => {
    const errorMessage = handleError("", e);
    throw new Error(errorMessage);
  });

  if (!response.ok) {
    const errorMessage = await handleErrorBadRequest(response);
    throw new Error(errorMessage);
  }

  const data: T = await response.json();

  return data;
}

/**
 * ERROR HANDLING
 */

export type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

// function getAuthHeaders(headers: Headers) {
//   "use server";
//   const authCookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
//   headers.append("Authorization", `Bearer ${authCookies?.value}`);
//
//   return headers;
// }

/** Pass in empty string and unkown error.
 * Log error via e.message or entire unkown e
 * return errormsg for user throwing if desired.
 */
function handleError(errorMsg: string, e: unknown) {
  log(`handleError: ${JSON.stringify(e, null, 2)}`);
  if (e instanceof Error) errorMsg += e.message;
  else {
    errorMsg += JSON.stringify(e);
  }
  console.error(errorMsg);
  return errorMsg;
}

/** Server response type */
export type GeneralResponse<T, E> =
  | { data: T; success: true }
  | { error: E; success: false };

/* Client response type */
export type ClientResponse<T> = { data: T; error: null | string };

export function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is { status: "fulfilled"; value: T } {
  return result.status === "fulfilled";
}

function isProd() {
  return process.env.NODE_ENV === "production";
}

//TODO: Add to shared repo. This is copied from API
// RecurringServiceAvailability type guard
function isRecurringServiceAvailability(
  availability: ServiceAvailability | RecurringAvailability,
): availability is RecurringAvailability {
  return (
    (availability as RecurringAvailability).dayOfWeek !== undefined &&
    daysofWeek.includes((availability as RecurringAvailability).dayOfWeek) &&
    (availability as any).date === undefined
  );
}

function isNonRecurringServiceAvailability(
  availability: ServiceAvailability | RecurringAvailability,
): availability is ServiceAvailability {
  return !isRecurringServiceAvailability(availability);
}

// pretty print camelCased strings
function prettyPrint(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export {
  API_HOST,
  fetcher,
  getErrorMessage,
  // getAuthHeaders,
  handleError,
  isError,
  isNonRecurringServiceAvailability,
  isRecurringServiceAvailability,
  mergeClassNames,
  handleErrorBadRequest,
  prettyPrint,
  PROJECT_URL,
};
