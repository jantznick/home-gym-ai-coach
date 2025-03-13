import request from "supertest";
import { app } from "../src/server";

let sessionToken: string;

describe("QR Authentication API Tests", () => {
  it("should generate a QR code session", async () => {
    const res = await request(app).post("/api/qr-login/init");
    expect(res.status).toBe(201);
    expect(res.body.sessionToken).toBeDefined();
    sessionToken = res.body.sessionToken;
  });

  it("should check session status (should be pending)", async () => {
    const res = await request(app).get(`/api/qr-login/status/${sessionToken}`);
    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(false);
  });

  it("should confirm authentication", async () => {
    const userRes = await request(app).post("/api/auth/signup").send({
      email: "qruser@example.com",
      password: "QRPass123"
    });
    const testUser = userRes.body;

    const confirmRes = await request(app).post("/api/qr-login/confirm").send({
      sessionToken,
      userId: testUser.id
    });
    expect(confirmRes.status).toBe(200);
  });

  it("should verify authenticated status", async () => {
    const res = await request(app).get(`/api/qr-login/status/${sessionToken}`);
    expect(res.status).toBe(200);
    expect(res.body.authenticated).toBe(true);
  });
  it("should return 404 if session does not exist", async () => {
    const res = await request(app).get("/api/qr-login/status/nonexistent-session");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Session not found");
  });

  it("should reject confirming a session with a missing token", async () => {
    const res = await request(app).post("/api/qr-login/confirm").send({
      userId: "user123"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Session token is required");
  });

  it("should reject confirming a session without userId", async () => {
    const res = await request(app).post("/api/qr-login/confirm").send({
      sessionToken: "some-valid-token"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("User ID is required");
  });
});
