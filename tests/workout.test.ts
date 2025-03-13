import request from "supertest";
import { app } from "../src/server";

describe("Workout API Error Cases", () => {
  it("should return 400 error for missing title", async () => {
    const res = await request(app).post("/api/workouts").send({
      userId: "some-user-id"
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Title is required");
  });

  it("should return 404 error for fetching non-existent workout", async () => {
    const res = await request(app).get("/api/workouts/nonexistent-id");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Workout not found");
  });

  it("should return 403 error when deleting another user’s workout", async () => {
    const workoutRes = await request(app).post("/api/workouts").send({
      title: "Sample Workout",
      userId: "user1-id"
    });

    const res = await request(app).delete(`/api/workouts/${workoutRes.body.id}`).send({
      userId: "user2-id"
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Not authorized to delete this workout");
  });
});