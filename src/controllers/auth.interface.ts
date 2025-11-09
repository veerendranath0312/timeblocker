import { Request, Response } from "express";
import { ZodSchema } from "zod";
import { User } from "../models/user.model";
import { ENV } from "../config/config.env";

const parseRequest = <T>(schema: ZodSchema<T>, req: Request): T => {
  return schema.parse(req.body);
};

export const handleAuth = async <T>(
  req: Request,
  res: Response,
  schema: ZodSchema<T>,
  serviceFn: (data: T) => Promise<{ user: User; sessionCookie?: string }>,
  setCookie = false
) => {
  console.log('received post req')
  try {
    const data = parseRequest(schema, req);
    const result = await serviceFn(data);

    if (setCookie && result.sessionCookie) {
      // TS now recognizes cookie after using cookie-parser
      res.cookie("session", result.sessionCookie, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        maxAge: ENV.SESSION_EXPIRATION_MS,
      });
    }

    res.status(200).json({ uid: result.user.uid, email: result.user.email });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
