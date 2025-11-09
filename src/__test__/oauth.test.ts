// import request from "supertest";
// import app from "../app";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   deleteUser,
//   connectAuthEmulator
// } from "firebase/auth";

// // Firebase client config (from your Firebase web app settings)
// const firebaseConfig = {
//   apiKey: "fake-api-key", // Doesn't matter for emulator
//   authDomain: "timeblocker-100d6.firebaseapp.com",
//   projectId: "timeblocker-100d6",
//   storageBucket: "timeblocker-100d6.firebasestorage.app",
//   messagingSenderId: "196871317175",
//   appId: "1:196871317175:web:285227644f9dfdd0ec0f32",
//   measurementId: "G-NDQXMEVK47"
// };

// const TEST_USER = { email: "testuser@example.com", password: "password123" };

// describe("OAuth Login Endpoint (Emulator, Email/Password fake Google)", () => {
//   let idToken: string;
//   let auth: ReturnType<typeof getAuth>;

//   beforeAll(async () => {
//     const firebaseApp = initializeApp(firebaseConfig);
//     auth = getAuth(firebaseApp);
//     connectAuthEmulator(auth, "http://localhost:9099/");

//     // Delete user if exists in emulator
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
//       await deleteUser(userCredential.user);
//     } catch (err) {
//       // ignore if user doesn't exist
//     }

//     // Create user in emulator
//     await createUserWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);

//     // Sign in to get ID token
//     const userCredential = await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
//     idToken = await userCredential.user.getIdToken();
//   });

//   it("should login a user via Firebase token", async () => {
//     const res = await request(app)
//       .post("/api/auth/oauthLogin")
//       .send({ idToken })
//       .set("Accept", "application/json");

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("uid");
//     expect(res.body).toHaveProperty("email", TEST_USER.email);
//   });
// });

