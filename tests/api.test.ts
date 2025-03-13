import request from "supertest";
import { app } from "../src/server"; // Ensure this exports `app`

describe("API Health Check", () => {
  it("should return API health status", async () => {
    const response = await request(app).get("/api/admin/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("OK");
  });
});

describe("Auth - Signup & Login", () => {
  it("should reject invalid signup (missing email)", async () => {
    const response = await request(app).post("/api/auth/signup").send({
      password: "Test123!",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Email is required");
  });

  it("should reject login with wrong credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "doesnotexist@example.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
  });
});