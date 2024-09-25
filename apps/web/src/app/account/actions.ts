"use server";

import { UserProfile } from "@/components/ux/atoms";
import { UserJSONResponse } from "@/components/ux/Profile/ProfileForm";
import {
  CreateReadyPet,
  existingPetSchema,
  newPetSchema,
  Pet,
} from "@/lib/types";
import { API_HOST } from "@/lib/utils";
import { log } from "@repo/logger";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormStateUno } from "../login/actions";

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
  if (respnseJSON.error)
    log(`Update Profile Failure. Error=${respnseJSON.error}`);
  return respnseJSON.data;
};

export const getUserPets = async () => {
  const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);

  const res = await fetch(`${API_HOST}/pets/user`, {
    method: "GET",
    headers: myHeaders,
  });

  if (!res.ok) {
    log(`res!ok=${res.statusText}`);
    return null;
  }

  const respnseJSON = await res.json();

  return respnseJSON.data;
};

type CreatePetResponse =
  | {
      data: { insertId: string };
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export const createPet = async (
  newPet: CreateReadyPet,
): Promise<CreatePetResponse> => {
  const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");

  const res = await fetch(`${API_HOST}/pets/new`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(newPet),
  });

  if (!res.ok) {
    log(`Failed to create Pet.name=${newPet.name}. Status=${res.statusText}`);
  }

  const respnseJSON: CreatePetResponse = await res.json();
  // if (respnseJSON.error) {
  //   log(`Create Pet failure. Error=${respnseJSON.error}`);
  // }
  return respnseJSON;
};

export const createPetFormAction = async (
  _prevState: FormStateUno,
  formData: FormData,
) => {
  const dirtyData = Object.fromEntries(formData);
  const parsedPet = newPetSchema.safeParse(dirtyData);

  log("**NEW** petCreate invoked.");
  log(`input pet=${JSON.stringify(dirtyData, null, 2)}`);

  if (!parsedPet.success) {
    // log(`parsed error=${JSON.stringify(parsedPet.error, null, 2)}`);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      message: "Invalid form data",
      fields,
    };
  }

  const newPet: CreateReadyPet = {
    size: parsedPet.data.size,
    name: parsedPet.data.name,
    species: parsedPet.data.species,
    breed: parsedPet.data.breed,
    age: parsedPet.data.age,
    sex: parsedPet.data.sex,
  };

  log(`newPet Create Pet=${JSON.stringify(newPet)}`);
  const res = await createPet(newPet);
  // Somehow TS-lsp does not recognize data != null if I used
  // if (res.error) despite the discriminated union return
  // type of createPet
  if (!res.data) {
    log(`Create Pet failure. Error=${res.error}`);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      message: res.error,
      fields,
    };
  }

  revalidatePath("/", "layout");
  // redirect("/");

  return {
    message: "success",
    fields: { id: res.data?.insertId },
  };
};

export const updatePetInfoAction = async (
  _prevState: FormStateUno,
  formData: FormData,
) => {
  const dirtyData = Object.fromEntries(formData);
  const parsedPet = existingPetSchema.safeParse(dirtyData);
  let pet: Pet;

  log("**NEW** petEdit invoked.");
  log(`input pet=${JSON.stringify(dirtyData, null, 2)}`);

  if (!parsedPet.success) {
    // log(`parsed error=${JSON.stringify(parsedPet.error, null, 2)}`);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      message: "Invalid form data",
      fields,
    };
  }

  pet = parsedPet.data;

  const res = await updatePet(pet);
  if (!res.data) {
    log(`Update Pet failure. Error=${res.error}`);
    const fields: Record<string, string> = {};
    for (const key of Object.keys(dirtyData)) {
      fields[key] = dirtyData[key].toString();
    }

    return {
      message: res.error,
      fields,
    };
  }

  revalidatePath("/", "layout");
  // redirect("/");

  return {
    message: "success",
    fields: { id: res.data?.updateId },
  };
};

type UpdatePetResponse =
  | {
      data: { updateId: string };
      error: null;
    }
  | {
      data: null;
      error: string;
    };

const updatePet = async (pet: Pet): Promise<UpdatePetResponse> => {
  const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");

  const res = await fetch(`${API_HOST}/pets/new`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(pet),
  });

  if (!res.ok) {
    log(`Failed to create Pet.name=${pet.name}. Status=${res.statusText}`);
  }

  const respnseJSON: UpdatePetResponse = await res.json();
  // if (respnseJSON.error) {
  //   log(`Create Pet failure. Error=${respnseJSON.error}`);
  // }
  return respnseJSON;
};
