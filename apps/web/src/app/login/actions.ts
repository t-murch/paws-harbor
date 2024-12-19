"use server";

import { log } from "@repo/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { loginFormSchema, signupFormSchema } from "@/components/ux/formSchema";
import { supabaseServerClient } from "@/lib/supabase/server";
import { API_HOST } from "@/lib/utils";
import { cookies } from "next/headers";

export type FormStateUno = {
  message: string;
  fields?: Record<string, string>;
};

interface PawsEndpoints {
  "/users/login": {};
  "/users/logout": {};
  "/users/signup": {};
}

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_HOST}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const responseJSON = await res.json();
  log(`responseJSON-loginUser=${JSON.stringify(responseJSON)}`);
  return responseJSON; // Assuming it contains user and token info
};

export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_HOST}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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
  // getting query params from url
  const dirtyData = Object.fromEntries(formData);
  const parsed = loginFormSchema.safeParse(dirtyData);

  log("**NEW** loginAction invoked.");

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

  // type-casting here for convenience
  // in practice, you should validate your inputs
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
      message: "Invalid form data",
      fields,
    };
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
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
