const supertest = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const mockLaunchData = {
  mission: "Kepler hue",
  rocket: "Explorer IS1",
  launchDate: "December 27, 2030",
  target: "Kepler-62 f",
};

const mockWithoutDate = {
  mission: "Kepler hue",
  rocket: "Explorer IS1",
  target: "Kepler-62 f",
};

const launchDataWithInvalidDate = {
  mission: "Kepler hue",
  rocket: "Explorer IS1",
  launchDate: "date",
  target: "Kepler-62 f",
};

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
  });

  describe("GET /launches", () => {
    test("It should 200 success", async () => {
      const res = await supertest(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/);
      expect(res.statusCode).toBe(200);
    });
  });

  describe("POST /launches", () => {
    test("It should 201 created", async () => {
      const res = await supertest(app)
        .post("/v1/launches")
        .send(mockLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(mockLaunchData.launchDate).valueOf();
      const responseDate = new Date(res.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(res.body).toMatchObject(mockWithoutDate);
    });

    test("It should catch invalid dates", async () => {
      const res = await supertest(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);
      expect(res.body).toStrictEqual({
        error: "invalid launch date",
      });
    });

    test("Should catch missing required properties", async () => {
      const res = await supertest(app)
        .post("/v1/launches")
        .send(mockWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(res.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
  });
});
