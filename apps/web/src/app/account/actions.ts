"use server";

import { UserProfile } from "@/components/ux/atoms";
import { UserJSONResponse } from "@/components/ux/Profile/ProfileForm";
import { API_HOST } from "@/lib/utils";
import { log } from "@repo/logger";
import { cookies } from "next/headers";

const projectUrl = process.env.SB_AUTH_URL!;

export const getUserProfile = async (): Promise<{
  user: UserProfile | null;
} | null> => {
  const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  const res = await fetch(`${API_HOST}/users/profile`, {
    method: "GET",
    headers: myHeaders,
  });

  if (!res.ok) {
    log(`res!ok=${res.statusText}`);
    return null;
  }

  const { data, error }: UserJSONResponse = await res.json();
  if (error) throw new Error(error.message);

  return data;
};

export const updateUserProfile = async (profile: UserProfile) => {
  const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");
  const res = await fetch(`${API_HOST}/users/profile`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    log(
      `Failed to update profile w/email=${profile.email}. Status=${res.statusText}`,
    );
  }

  const respnseJSON: { data: UserProfile | null; error: string | null } =
    await res.json();
  return respnseJSON.data;
};
