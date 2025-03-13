import request from "supertest";
import { app } from "../src/server";

let testUser: any;
let testWorkout: any;
let testFeedEntry: any;

beforeAll(async () => {
  const userRes = await request(app).post("/api/auth/signup").send({
    email: "feeduser@example.com",
    password: "FeedPass123"
  });
  testUser = userRes.body;

  const workoutRes = await request(app).post("/api/workouts").send({
    title: "Chest Workout",
    userId: testUser.id
  });
  testWorkout = workoutRes.body;

  testFeedEntry = await request(app).post("/api/feed/create").send({
    userId: testUser.id,
    message: "Completed a new workout!",
    type: "workout",
    workoutId: testWorkout.id
  });
});

describe("Feed API Tests", () => {
  it("should allow users to like a post", async () => {
    const res = await request(app).post("/api/feed/like").send({
      userId: testUser.id,
      feedEntryId: testFeedEntry.id
    });
    expect(res.status).toBe(201);
  });

  it("should allow users to comment on a post", async () => {
    const res = await request(app).post("/api/feed/comment").send({
      userId: testUser.id,
      feedEntryId: testFeedEntry.id,
      text: "Great workout!"
    });
    expect(res.status).toBe(201);
  });

  it("should fetch all feed entries", async () => {
    const res = await request(app).get("/api/feed");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
  it("should reject liking a post that does not exist", async () => {
    const res = await request(app).post("/api/feed/like").send({
      userId: "user1-id",
      feedEntryId: "nonexistent-id"
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post not found");
  });

  it("should reject commenting on a non-existent post", async () => {
    const res = await request(app).post("/api/feed/comment").send({
      userId: "user1-id",
      feedEntryId: "nonexistent-id",
      text: "Awesome!"
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Post not found");
  });

  it("should reject posting a comment without text", async () => {
    const res = await request(app).post("/api/feed/comment").send({
      userId: "user1-id",
      feedEntryId: "post-id"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Comment cannot be empty");
  });
});