const express = require("express");
const launchesController = require("../../controller/launches/launches.controller");

const launchesRouter = express.Router();

launchesRouter.get("/", launchesController.httpGetAllLaunches);
launchesRouter.post("/", launchesController.addLaunches);
launchesRouter.delete("/:id", launchesController.deleteLaunches);

module.exports = launchesRouter;
