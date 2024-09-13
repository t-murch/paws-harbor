"use server";

import { log } from "@repo/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { loginFormSchema, signupFormSchema } from "@/components/ux/formSchema";
import { API_HOST } from "@/lib/utils";

export type FormStateUno = {
  message: string;
  fields?: Record<string, string>;
};

export async function loginAction(
  _prevState: FormStateUno,
  formData: FormData,
): Promise<FormStateUno> {
  const dirtyData = Object.fromEntries(formData);
  const parsed = loginFormSchema.safeParse(dirtyData);

  log("**NEW** loginAction invoked.");

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
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await fetch(`${API_HOST}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    log(`Login error: ${error.message}`);
    redirect("/login");
    // redirect("/error");
  });

  const responseJSON = await res.json();
  if (responseJSON?.error) {
    log(`Login error: ${JSON.stringify(responseJSON.error)}`);
    redirect("/login");
  }

  console.log(`responseJSON = ${JSON.stringify(responseJSON)}`);
  revalidatePath("/", "layout");
  redirect("/");
}

export type LoginAction = typeof loginAction;

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
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await fetch(`${API_HOST}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    log(`Signup error: ${error.message}`);
    redirect("/error");
  });

  const responseJSON = await res.json();
  console.log(`responseJSON = ${JSON.stringify(responseJSON)}`);

  revalidatePath("/", "layout");
  redirect("/");
}

export type SignupAction = typeof signupAction;

export async function logoutAction();
