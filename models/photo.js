const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhotoSchema = new Schema({
  originalname: String,
  location: String,
  key: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
