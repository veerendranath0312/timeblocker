// src/schemas/auth.schema.ts
import { z } from "zod";

// Schema for signup request
export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

// Type inferred from schema
export type SignupRequest = z.infer<typeof signupSchema>;

// Schema for login request
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" })
});

// Type inferred from schema
export type LoginRequest = z.infer<typeof loginSchema>;