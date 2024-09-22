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
import { log } from "@repo/logger";

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
const myEmail = z.string().email();
type MyEmail = z.infer<typeof emailSchema>;

// async function logoutUser(
//   context: Context,
//   { email }: MyEmail,
// ): Promise<
//   { data: null; error: AuthError | null } | { data: null; error: string }
// > {
//   const auth = authClient(context);
//   const user = await getUserByEmail(email);
//   if (!user) {
//     // handle no user
//     log(`No user found for email: ${email}. Unable to logoutUser`);
//     return { data: null, error: `No user found for email: ${email}` };
//   }
//   log(`log out user=${JSON.stringify(user)}`);
//
//   const { data, error } = auth.auth.getSession();
//   log(`session data?? - ${JSON.stringify(data)}`);
//   log(`session error?? - ${JSON.stringify(error)}`);
//   return await auth.auth.admin.signOut(user.id);
// }

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
    type,
    token_hash,
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
  createUser,
  createProfile,
  updateProfile,
  getUserById,
  getUserByEmail,
  loginUser,
  // logoutUser,
  updateUser,
  verifyEmail,
};

export default UserService;
