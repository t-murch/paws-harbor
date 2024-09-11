import { eq } from "drizzle-orm";
import { db } from "..";
import { InsertProfile, profilesTable, SelectProfile } from "../users";
import { authClient } from "../auth";
import z from "zod";
import { AuthError } from "@supabase/supabase-js";

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8).max(32),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

/**
 * AUTH
 */
async function createUser(data: LoginFormSchema) {
  return await authClient.auth.signUp(data);
}

async function loginUser(data: LoginFormSchema) {
  return await authClient.auth.signInWithPassword(data);
}

const MyEmailOtp = [
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
] as const;
const MyEmailOtpTypeEnum = z.enum([...MyEmailOtp]);
type MyEmailOtpType = (typeof MyEmailOtp)[number];
type MyEmailOtpTypeZod = z.infer<typeof MyEmailOtpTypeEnum>;
const verifyEmailSchema = z.object({
  token_hash: z.string().trim(),
  type: MyEmailOtpTypeEnum,
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export type VerifyResponse =
  | {
      error: AuthError;
      success: null;
    }
  | {
      error: null;
      success: boolean;
    };

async function verifyEmail(data: VerifyEmailSchema): Promise<VerifyResponse> {
  const { token_hash, type } = data;

  const { error } = await authClient.auth.verifyOtp({
    type,
    token_hash,
  });
  if (error) return { error, success: null };
  return { error: null, success: true };
}
/**
 * END AUTH
 */

async function createProfile(data: InsertProfile) {
  return await db
    .insert(profilesTable)
    .values(data)
    .returning({ userId: profilesTable.id });
}

// export async function getUserBySingleProp(prop: SelectProfile['email'])
export async function getUserById(id: SelectProfile["id"]): Promise<
  {
    id: string;
    name: string | null;
    email: string;
    address: string | null;
    role: string;
    phoneNumber: string | null;
    profilePictureUrl: string | null;
    bio: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }[]
> {
  return await db.select().from(profilesTable).where(eq(profilesTable.id, id));
}

const UserService = {
  createUser,
  createProfile,
  getUserById,
  loginUser,
  verifyEmail,
};

export default UserService;
