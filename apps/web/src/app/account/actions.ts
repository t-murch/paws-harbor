"use server";

import { UserProfile } from "@/components/ux/atoms";
import { UserJSONResponse } from "@/components/ux/Profile/ProfileForm";
import {
  CreateReadyPet,
  existingPetSchema,
  newPetSchema,
  Pet,
} from "@/lib/types";
import { API_HOST, PROJECT_URL } from "@/lib/utils";
import { log } from "@repo/logger";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { FormStateUno } from "../login/actions";

export const getUserProfile = async (): Promise<{
  user: UserProfile | null;
} | null> => {
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  const res = await fetch(`${API_HOST}/users/profile`, {
    headers: myHeaders,
    method: "GET",
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
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");
  const res = await fetch(`${API_HOST}/users/profile`, {
    body: JSON.stringify(profile),
    headers: myHeaders,
    method: "POST",
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
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);

  const res = await fetch(`${API_HOST}/pets/user`, {
    headers: myHeaders,
    method: "GET",
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
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");

  const res = await fetch(`${API_HOST}/pets/new`, {
    body: JSON.stringify(newPet),
    headers: myHeaders,
    method: "POST",
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
      fields,
      message: "Invalid form data",
    };
  }

  const newPet: CreateReadyPet = {
    age: parsedPet.data.age,
    breed: parsedPet.data.breed,
    name: parsedPet.data.name,
    sex: parsedPet.data.sex,
    size: parsedPet.data.size,
    species: parsedPet.data.species,
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
      fields,
      message: res.error,
    };
  }

  revalidatePath("/", "layout");
  // redirect("/");

  return {
    fields: { id: res.data?.insertId },
    message: "success",
  };
};

export const updatePetInfoAction = async (
  _prevState: FormStateUno,
  formData: FormData,
) => {
  const dirtyData = Object.fromEntries(formData);
  const parsedPet = existingPetSchema.safeParse(dirtyData);
  const fields: Record<string, string> = {};
  for (const key of Object.keys(dirtyData)) {
    fields[key] = dirtyData[key].toString();
  }
  let pet: Pet;

  log("**NEW** petEdit invoked.");
  // log(`input pet=${JSON.stringify(dirtyData, null, 2)}`);

  if (!parsedPet.success) {
    log(`parsed error=${JSON.stringify(parsedPet.error, null, 2)}`);

    return {
      fields,
      message: "Invalid form data",
    };
  }

  pet = parsedPet.data;

  const res = await updatePet(pet).catch((e) => {
    log(`error catch`);
    let errorMsg = "";
    if (e instanceof Error) {
      errorMsg += e.message;
    } else {
      errorMsg += JSON.stringify(e);
    }
    log(errorMsg);
    throw new Error(errorMsg);
    // return { fields, message: errorMsg };
  });

  // log(`res response=${JSON.stringify(res)}`);

  if (!res || !res.data) {
    log(`Update Pet failure. Error=${res.error}`);

    return {
      fields,
      message: res.error,
    };
  }

  revalidatePath("/", "layout");
  // redirect("/");

  return {
    fields: { id: res.data?.updateId },
    message: "success",
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
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");

  log(`${API_HOST}/pets/${pet.id}`);
  const res = await fetch(`${API_HOST}/pets/${pet.id}`, {
    body: JSON.stringify(pet),
    headers: myHeaders,
    method: "PUT",
  });

  if (!res.ok) {
    log(`Failed to update Pet.name=${pet.name}. Status=${res.statusText}`);
  }

  const responseJSON: UpdatePetResponse = await res.json().catch((e) => {
    let errorMsg = "";
    if (e instanceof Error) {
      errorMsg += e.message;
    } else {
      errorMsg += JSON.stringify(e);
    }
    log(`error parsing JSON. errror: ${errorMsg}`);
    throw new Error(errorMsg);
  });
  // if (responseJSON.error) {
  //   log(`Create Pet failure. Error=${responseJSON.error}`);
  // }
  return responseJSON;
};

//TODO: migrate these return types
//to user generics
type DefaultReturn<T, E> =
  | { data: T; success: true }
  | { error: E; success: false };
type GeneralError = {
  message: string;
};

export const deletePet = async (
  petId: string,
): Promise<DefaultReturn<{ deletedId: string }, GeneralError>> => {
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");

  const res = await fetch(`${API_HOST}/pets/${petId}`, {
    headers: myHeaders,
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    let errorMsg = `Failed to delete Pet.id=${petId}.`;
    if (data?.error) {
      errorMsg = errorMsg.concat(`error= ${data.error}`);
    }
    console.error(errorMsg);
  }

  const response = await res.json();

  revalidatePath("/", "layout");
  return response;
};
