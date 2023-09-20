const { Schema, model } = require("mongoose");

const planetSchema = new Schema({
  kepler_name: {
    type: String,
    required: true,
  },
});

module.exports = model("Planet", planetSchema);
