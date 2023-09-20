const supertest = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Test GET planets", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  test("It should 200 success", async () => {
    const res = await supertest(app)
      .get("/v1/planets")
      .expect("Content-Type", /json/);
    expect(res.statusCode).toBe(200);
  });
});
