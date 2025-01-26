"use server";

import { log } from "@repo/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  loginFormSchema,
  signupFormSchema,
} from "../../components/ux/formSchema";
import { supabaseServerClient } from "../../lib/supabase/server";
import { API_HOST } from "../../lib/utils";

export type FormStateUno = {
  message: string;
  fields?: Record<string, string>;
};

// TODO: Strengthen type-security of api endpoints.
// interface PawsEndpoints {
//   "/users/login": {};
//   "/users/logout": {};
//   "/users/signup": {};
// }

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_HOST}/users/login`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const responseJSON = await res.json();
  log(`responseJSON-loginUser=${JSON.stringify(responseJSON)}`);
  return responseJSON;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_HOST}/users/login`, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const responseJSON = await res.json();
  if (responseJSON.error) {
    throw new Error(responseJSON.error);
  }
  return responseJSON;
};

export async function loginActionOld(
  _prevState: FormStateUno,
  formData: FormData,
): Promise<FormStateUno> {
  const dirtyData = Object.fromEntries(formData);
  const parsed = loginFormSchema.safeParse(dirtyData);
  log("loginAction invoked.");

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      fields,
      message: "Invalid form data",
    };
  }

  const loginCreds = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } =
    await supabaseServerClient.auth.signInWithPassword(loginCreds);
  if (error) {
    log(`Login error: ${error.message}`);
    redirect("/login");
  }

  revalidatePath("/", "layout");
  redirect((formData.get("redirect") as string) ?? "/");
}

export type LoginAction = typeof loginActionOld;

export async function signupAction(
  _prevState: FormStateUno,
  formData: FormData,
): Promise<FormStateUno> {
  const dirtyData = Object.fromEntries(formData);
  const parsed = signupFormSchema.safeParse(dirtyData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      fields,
      message: "Invalid form data",
    };
  }

  const signupCreds = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabaseServerClient.auth.signUp(signupCreds);
  if (error) {
    log(`Signup error: ${error.message}`);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export type SignupAction = typeof signupAction;

export async function logoutAction() {
  const { error } = await supabaseServerClient.auth.signOut();
  if (error) {
    log(`Logout error: ${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
