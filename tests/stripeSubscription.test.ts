import request from "supertest";
import { app } from "../src/server";

let testUserId: string;
let testAccessToken: string;

beforeAll(async () => {
  // Create test user
  const signupRes = await request(app).post("/api/auth/signup").send({
    email: "premiumuser@example.com",
    password: "SecurePass123"
  });
  testUserId = signupRes.body.id;

  // Log in as user
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "premiumuser@example.com",
    password: "SecurePass123"
  });
  testAccessToken = loginRes.body.token;
});

describe("Stripe Subscription API Tests", () => {
  it("should return subscription status for a user", async () => {
    const res = await request(app)
      .get("/api/stripe/subscription/status")
      .set("Authorization", `Bearer ${testAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("isPremium");
    expect(res.body).toHaveProperty("subscriptionId");
  });

  it("should reject subscription status request without auth token", async () => {
    const res = await request(app).get("/api/stripe/subscription/status");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized - Login required");
  });

  it("should allow user to cancel subscription", async () => {
    const res = await request(app)
      .post("/api/stripe/subscription/cancel")
      .set("Authorization", `Bearer ${testAccessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Subscription cancellation scheduled");
  });

  it("should reject cancel request for non-premium users", async () => {
    const res = await request(app)
      .post("/api/stripe/subscription/cancel")
      .set("Authorization", `Bearer ${testAccessToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No active subscription to cancel");
  });

  it("should allow user to update subscription", async () => {
    const res = await request(app)
      .post("/api/stripe/subscription/update")
      .set("Authorization", `Bearer ${testAccessToken}`)
      .send({ newPriceId: "price_abc123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Subscription updated successfully");
  });

  it("should reject subscription update for non-existent subscription", async () => {
    const res = await request(app)
      .post("/api/stripe/subscription/update")
      .set("Authorization", `Bearer ${testAccessToken}`)
      .send({ newPriceId: "price_invalid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No active subscription to update");
  });
});