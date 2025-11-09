import request from "supertest";
import app from "../app"; // path to your Express app
import {resetDB} from './auth.utils'

const testUser = {
  email: "testuser@example.com",
  password: "password123"
};

async function createUser() {
  const res = await request(app)
    .post("/api/auth/regularRegistration")
    .send(testUser)
    .set("Accept", "application/json");
  
  expect(res.statusCode).toEqual(200);
  expect(res.body).toHaveProperty("uid");
  expect(res.body).toHaveProperty("email", testUser.email);
  return res.body.uid;
}

describe("Test Regular Auth Endpoints", () => {
  it("Make regular user", async () => {
    await createUser();
  });

  it("Login the user", async () => {
    const res = await request(app)
      .post("/api/auth/regularLogin") // ✅ login endpoint
      .send(testUser)
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("uid");
    expect(res.body).toHaveProperty("email", testUser.email);

    await resetDB(testUser.email);
  });
});

