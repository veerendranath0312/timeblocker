import admin from "./firebaseAdmin";
import {ENV} from '../config/config.env'

/**
 * Creates a secure Firebase session cookie from an ID token
 */
export const createSessionCookie = async (idToken: string): Promise<string> => {
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn: ENV.SESSION_EXPIRATION_MS });

  return sessionCookie;
};
