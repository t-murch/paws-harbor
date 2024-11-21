"use server";

import { NewService, Service } from "@/../../api/src/db/services";
import { PROJECT_URL } from "@/lib/utils";
import { cookies } from "next/headers";
export const createService = async (service: NewService) => {
  const mycookies = cookies().get(`sb-${PROJECT_URL}-auth-token`);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
  myHeaders.append("Content-Type", "application/json");
};

// export const createPet = async (
//   newPet: CreateReadyPet,
// ): Promise<CreatePetResponse> => {
//   const mycookies = cookies().get(`sb-${projectUrl}-auth-token`);
//   const myHeaders = new Headers();
//   myHeaders.append("Authorization", `Bearer ${mycookies?.value}`);
//   myHeaders.append("Content-Type", "application/json");
//
//   const res = await fetch(`${API_HOST}/pets/new`, {
//     body: JSON.stringify(newPet),
//     headers: myHeaders,
//     method: "POST",
//   });
//
//   if (!res.ok) {
//     log(`Failed to create Pet.name=${newPet.name}. Status=${res.statusText}`);
//   }
//
//   const respnseJSON: CreatePetResponse = await res.json();
//   // if (respnseJSON.error) {
//   //   log(`Create Pet failure. Error=${respnseJSON.error}`);
//   // }
//   return respnseJSON;
// };
//
// export const createPetFormAction = async (
//   _prevState: FormStateUno,
//   formData: FormData,
// ) => {
//   const dirtyData = Object.fromEntries(formData);
//   const parsedPet = newPetSchema.safeParse(dirtyData);
//
//   log("**NEW** petCreate invoked.");
//   log(`input pet=${JSON.stringify(dirtyData, null, 2)}`);
//
//   if (!parsedPet.success) {
//     // log(`parsed error=${JSON.stringify(parsedPet.error, null, 2)}`);
//     const fields: Record<string, string> = {};
//     for (const key of Object.keys(dirtyData)) {
//       fields[key] = dirtyData[key].toString();
//     }
//
//     return {
//       fields,
//       message: "Invalid form data",
//     };
//   }
//
//   const newPet: CreateReadyPet = {
//     age: parsedPet.data.age,
//     breed: parsedPet.data.breed,
//     name: parsedPet.data.name,
//     sex: parsedPet.data.sex,
//     size: parsedPet.data.size,
//     species: parsedPet.data.species,
//   };
//
//   log(`newPet Create Pet=${JSON.stringify(newPet)}`);
//   const res = await createPet(newPet);
//   // Somehow TS-lsp does not recognize data != null if I used
//   // if (res.error) despite the discriminated union return
//   // type of createPet
//   if (!res.data) {
//     log(`Create Pet failure. Error=${res.error}`);
//     const fields: Record<string, string> = {};
//     for (const key of Object.keys(dirtyData)) {
//       fields[key] = dirtyData[key].toString();
//     }
//
//     return {
//       fields,
//       message: res.error,
//     };
//   }
//
//   revalidatePath("/", "layout");
//   // redirect("/");
//
//   return {
//     fields: { id: res.data?.insertId },
//     message: "success",
//   };
// };
