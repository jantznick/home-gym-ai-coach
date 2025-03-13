import request from "supertest";
import { app } from "../src/server";

describe("Friends API Error Cases", () => {
  it("should reject sending friend request to yourself", async () => {
    const res = await request(app).post("/api/friends/request").send({
      senderId: "user1-id",
      receiverId: "user1-id"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("You cannot send a friend request to yourself");
  });

  it("should reject duplicate friend requests", async () => {
    await request(app).post("/api/friends/request").send({
      senderId: "user1-id",
      receiverId: "user2-id"
    });

    const res = await request(app).post("/api/friends/request").send({
      senderId: "user1-id",
      receiverId: "user2-id"
    });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Friend request already sent");
  });

  it("should reject accepting non-existent friend request", async () => {
    const res = await request(app).post("/api/friends/accept").send({
      requestId: "nonexistent-request-id"
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Friend request not found");
  });
});