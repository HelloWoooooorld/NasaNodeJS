const { parse } = require("csv-parse");
const fs = require("fs");
const planets = require("./planets.schema");
const path = require("path");
const planetsSchema = require("./planets.schema");

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "keplerdata.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPLanetFound = (await getAll()).length;
        console.log("found:", countPLanetFound);
        resolve();
      });
  });
}

async function getAll() {
  return await planetsSchema.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (e) {
    console.lot("Can`t save planet", e);
  }
}

module.exports = {
  loadPlanetsData,
  getAll,
};
