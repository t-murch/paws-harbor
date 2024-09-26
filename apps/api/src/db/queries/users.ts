import { log } from "@repo/logger";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  UserResponse,
} from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import z from "zod";
import { db } from "..";
import { authClient } from "../auth";
import { InsertProfile, profilesTable, SelectProfile } from "../users";

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8).max(32),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

/**
 * AUTH
 */
async function createUser(
  context: Context,
  data: LoginFormSchema,
): Promise<AuthResponse> {
  const auth = authClient(context);
  return await auth.auth.signUp(data);
}

/**
 * I believe this is only needed if the user is updating specific values:
 * email
 * phone
 * password
 * auth-provider <- NOT AN OPTION
 */
async function updateUser(
  context: Context,
  data: SelectProfile,
): Promise<UserResponse> {
  const auth = authClient(context);
  return auth.auth.admin.updateUserById(data.id, {
    email: data.email,
  });
}

async function loginUser(
  context: Context,
  data: LoginFormSchema,
): Promise<AuthTokenResponsePassword> {
  const auth = authClient(context);
  return await auth.auth.signInWithPassword(data);
}

export const emailSchema = z.object({
  email: z.string().trim().email().min(1, "email is required"),
});

const MyEmailOtp = [
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
] as const;
const MyEmailOtpTypeEnum = z.enum([...MyEmailOtp]);
const verifyEmailSchema = z.object({
  token_hash: z.string().trim(),
  type: MyEmailOtpTypeEnum,
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export type _VerifyResponse =
  | {
      error: AuthError;
      success: null;
    }
  | {
      error: null;
      success: boolean;
    };

async function verifyEmail(
  context: Context,
  data: VerifyEmailSchema,
): Promise<AuthResponse> {
  const { token_hash, type } = data;

  return await authClient(context).auth.verifyOtp({
    token_hash,
    type,
  });
}
/**
 * END AUTH
 */

async function createProfile(
  data: InsertProfile,
): Promise<{ userId: string }[]> {
  return await db
    .insert(profilesTable)
    .values(data)
    .returning({ userId: profilesTable.id });
}

async function updateProfile(
  data: SelectProfile,
): Promise<SelectProfile | null> {
  log(`query-level-profile=${JSON.stringify(data)}`);
  const profiles = await db
    .update(profilesTable)
    .set({ ...data, updatedAt: new Date(Date.now()) })
    .where(eq(profilesTable.id, data.id))
    .returning();

  return profiles.length ? profiles[0] : null;
}

export async function getUserByEmail(
  email: SelectProfile["email"],
): Promise<SelectProfile | null> {
  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.email, email))
    .catch((error) => {
      console.error("Error fetching user by email:", error);
      return null;
    });

  return result?.[0] ?? null;
}

export async function getUserById(
  id: SelectProfile["id"],
): Promise<SelectProfile[]> {
  return await db.select().from(profilesTable).where(eq(profilesTable.id, id));
}

const UserService = {
  createProfile,
  createUser,
  getUserByEmail,
  getUserById,
  loginUser,
  updateProfile,
  updateUser,
  verifyEmail,
};

export default UserService;
