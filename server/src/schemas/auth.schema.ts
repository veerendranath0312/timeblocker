// src/schemas/auth.schema.ts
import { z } from "zod";

// Schema for login/register request
export const emailPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

// Type inferred from schema
export type EmailPasswordRequest = z.infer<typeof emailPasswordSchema>;

// Schema for OAuth login request with ID token
export const idTokenSchema = z.object({
  idToken: z.string().min(1, { message: "ID token is required" })
});

// Type inferred from schema
export type IdTokenRequest = z.infer<typeof idTokenSchema>;