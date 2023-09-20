require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.log("Db is connected");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

function mongoConnect() {
  mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
