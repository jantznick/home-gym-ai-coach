import request from "supertest";
import { app } from "../src/server";

describe("Auth API Error Cases", () => {
  it("should reject signup without password", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "user@example.com"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Password is required");
  });

  it("should reject signup with an already existing email", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "duplicate@example.com",
      password: "TestPass123"
    });

    const res = await request(app).post("/api/auth/signup").send({
      email: "duplicate@example.com",
      password: "TestPass123"
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already exists");
  });

  it("should reject login with incorrect credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "wrongpassword"
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("should reject login without email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "Test123!"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email is required");
  });
});