import { z } from "zod";

export const signupFormSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(32),
    confirm: z.string().trim().min(8).max(32),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8).max(32),
  redirect: z.string().optional(),
});
