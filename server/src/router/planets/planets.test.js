const supertest = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Test GET planets", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
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
