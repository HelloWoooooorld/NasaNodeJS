const launchesModel = require("../../models/lauches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await launchesModel.getAllLaunches());
}

async function addLaunches(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid launch date",
    });
  }

  await launchesModel.scheduleNewLaunch(req.body);
  return res.status(201).json(launch);
}

function deleteLaunches(req, res) {
  const id = Number(req.params.id);

  if(!launchesModel.existLaunchWithId(id)) {
    return res.status(404).json({
      error: 'Launch not found'
    })
  }

  launchesModel.deleteLaunchById(id)
  return res.status(201).json({
    success: `Launch ${id} deleted`
  });
}

module.exports = {
  httpGetAllLaunches,
  addLaunches,
  deleteLaunches, 
};
