const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const toobusy = require("toobusy-js");
const path = require("path");
const api = require("./router/api");
const app = express();

app.use((req, res, next) => {
  if (toobusy()) {
    res.send(503, "Im busy sorry");
  } else {
    next();
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
