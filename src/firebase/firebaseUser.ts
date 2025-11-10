
import { ENV } from "../config/config.env";
import admin from "./firebaseAdmin";
import axios from "axios";

export const firebaseRegisterUser = async (email: string, password: string) => {
  console.log('registering new user via firebase ...')
  const userRecord = await admin.auth().createUser({ email, password });
  // Save UID/email in your DB
  console.log('registered user info', userRecord)
  return { uid: userRecord.uid, email: userRecord.email };
};


export const firebaseLoginUser = async (email: string, password: string) => {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ENV.FIREBASE_API_KEY}`,
    { email, password, returnSecureToken: true }
  );

  const { localId: uid, idToken } = response.data;
  // Optionally create session cookie here
  return { uid, email, idToken };
};

/**
 * Verifies a Firebase ID token and returns the decoded token.
 * @param {string} idToken - The Firebase ID token to verify.
 * @returns {Promise<object>} - The decoded token if verification succeeds.
 * @throws {Error} - Throws if verification fails.
 */
export const firbaseVerifyToken = async (idToken: string) => {
  try {
    if (ENV.NODE_ENV === "test") {
      // Bypass verification for emulator tests
      return { uid: "fake-uid", email: "testuser@example.com" };
    } else {
      return await admin.auth().verifyIdToken(idToken);
    }
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    throw new Error("Invalid Firebase ID token");
  }
}

export const firebaseGetUserByUid = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    console.log("Firebase user found:", userRecord);
    return { uid: userRecord.uid, email: userRecord.email };
  } catch (error) {
    console.error("Error fetching Firebase user by UID:", error);
    return null;
  }
};

/**
 * Deletes a Firebase user by UID
 * @param uid - Firebase UID of the user to delete
 * @returns true if deletion was successful, false otherwise
 */
export const firebaseDeleteUserByUid = async (uid: string): Promise<boolean> => {
  try {
    await admin.auth().deleteUser(uid);
    console.log(`Firebase user with UID ${uid} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting Firebase user with UID ${uid}:`, error);
    return false;
  }
};

/**
 * Deletes a Firebase user by email
 * @param email - Email of the user to delete
 * @returns true if deletion was successful, false otherwise
 */
export const firebaseDeleteUserByEmail = async (email: string): Promise<boolean> => {
  try {
    // Get user by email first
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(userRecord.uid);
    console.log(`Firebase user with email ${email} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting Firebase user with email ${email}:`, error);
    return false;
  }
};

/**
 * Fetches a Firebase user by email
 * @param email - Email of the user to fetch
 * @returns Firebase user record or null if not found
 */
export const firebaseGetUserByEmail = async (email: string) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log(`Firebase user found:`, userRecord);
    return userRecord;
  } catch (error) {
    if ((error as any).code === "auth/user-not-found") {
      console.log(`No Firebase user found with email: ${email}`);
      return null;
    }
    console.error(`Error fetching Firebase user by email:`, error);
    throw error;
  }
};