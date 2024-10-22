import { log } from "@repo/logger";
import { type ClassValue, clsx } from "clsx";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";
const PROJECT_URL = process.env.SB_AUTH_URL!;

function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  if (e instanceof Error) errorMsg += e.message;
  else {
    errorMsg += JSON.stringify(e);
  }
  log(errorMsg);
  return errorMsg;
}

export type GeneralResponse<T, E> =
  | { data: T; success: true }
  | { error: E; success: false };

export {
  API_HOST,
  // getAuthHeaders,
  handleError,
  mergeClassNames,
  getErrorMessage,
  PROJECT_URL,
};
