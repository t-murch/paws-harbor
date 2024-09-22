import { atom } from "jotai";

export type UserProfile = {
  email: string;
  name: string | null;
  id: string;
  address: string | null;
  role: string;
  phoneNumber: string | null;
  profilePictureUrl: string | null;
  bio: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type InsertProfile = {
  email: string;
  name?: string;
  address?: string | null;
  role?: "owner";
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
};

// export const userAtom = atom(null);
export const userAtom = atom<UserProfile | null>(null);
