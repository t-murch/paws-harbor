"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { signupFormSchema } from "@/components/ux/formSchema";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const dirtyData = Object.fromEntries(formData);
  const parsed = signupFormSchema.safeParse(dirtyData);

  console.log("loginAction invoked.");

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

  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export type FormState = {
  message: string;
  fields?: Record<string, string>;
};

export type LoginAction = typeof loginAction;

export async function signupAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // export async function signup(formData: z.infer<typeof formSchema>) {
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

  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirm: formData.get("confirm") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("error on login/signup. Error: ", error.message);
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export type SignupAction = typeof signupAction;
