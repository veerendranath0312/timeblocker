/**
 * This file contains the authentication service/business logic functions.
 * Services contain the core business logic and interact with models to perform
 * data operations. They are called by controllers and handle operations like:
 * - User registration logic
 * - Password hashing and verification
 * - Token generation and validation
 * - User authentication logic
 * Services separate business logic from HTTP request/response handling.
 */

// Authentication service functions will be implemented here
// Example:
// export const registerUser = async (email: string, password: string): Promise<User> => {
//   // Implementation
// };

import {User} from '../models/user.model';
import {firebaseRegisterUser, firebaseLoginUser, firbaseVerifyToken} from '../firebase/firebaseUser';
import { createSessionCookie } from "../firebase/firebaseSession";
import {findOrCreateUser} from './auth.utils'

/**
 * Registers a regular user in Firebase and stores it in the database
 * @param email - User's email
 * @param password - User's password
 * @returns The created User object
 */
export const regularUserRegistration = async (
  email: string,
  password: string
): Promise<{ user: User; sessionCookie?: string }> => {
  console.log('making new user')
  // 1️⃣ Create user in Firebase
  const userRecord = await firebaseRegisterUser(email, password);
  // 2️⃣ Construct User object and save into DB
  const user = await findOrCreateUser(userRecord.uid, userRecord.email!);
  return { user };
};

/**
 * Logs in a regular user:
 * - Authenticates with Firebase
 * - Creates a secure session cookie
 * - Returns user info and cookie
 */
export const regularUserLogin = async (email: string, password: string): Promise<{ user: User; sessionCookie: string }> => {
  // 1️⃣ Firebase login → get ID token and UID
  const { uid, idToken } = await firebaseLoginUser(email, password);

  // 2️⃣ Create secure session cookie
  const sessionCookie = await createSessionCookie(idToken);

  // 3️⃣ Check if user exists in DB
  const user = await findOrCreateUser(uid, email ?? "");
  return { user, sessionCookie };
};


export const oauthLoginService = async (idToken: string): Promise<{ user: User; sessionCookie: string }> => {
  // 1️⃣ Verify Firebase ID token
  const decodedToken = await firbaseVerifyToken(idToken);

  // 2️⃣ Create session cookie
  const sessionCookie = await createSessionCookie(idToken);

  // 3️⃣ Check if user exists in DB
  const user = await findOrCreateUser(decodedToken.uid, decodedToken.email ?? "");
  return { user, sessionCookie };
};
