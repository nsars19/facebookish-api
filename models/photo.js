const mongoose = require("mongoose");
const { Schema } = mongoose;

const PhotoSchema = new Schema({
  originalname: String,
  destination: String,
  filename: String,
  path: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Photo", PhotoSchema);
