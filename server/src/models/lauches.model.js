const { response } = require("../app");
const launchesModel = require("./launches.schema");
const planetsSchema = require("./planets.schema");
const axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 1;

const launch = {
  flightNumber: 100,
  mission: "Kepler hue",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      page: 2,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
}

async function saveLaunch(launch) {
  const isMatchPlanet = await planetsSchema.findOne({
    kepler_name: launch.target,
  });

  if (!isMatchPlanet) {
    throw new Error("No matching planet found");
  }
  await launchesModel.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function getAllLaunches() {
  return await launchesModel.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function existLaunchWithId(id) {
  return await launchesModel.find({ flightNumber: id });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "YAR"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function deleteLaunchById(id) {
  const aborted = await launchesModel.deleteOne({ flightNumber: id });
  aborted.upcoming = false;
  aborted.success = false;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  deleteLaunchById,
  deleteLaunchById,
  loadLaunchData,
};
