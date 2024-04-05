const mongoose = require("mongoose");

const cronofySchema = new mongoose.Schema({
  accessToken: {
    type: String,
    default: ""
  },
 
});

module.exports = mongoose.model("Cronofy", cronofySchema);
