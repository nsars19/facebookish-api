const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  readStatus: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  notificationType: String, // eg. comment/like
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Notification", NotificationSchema);
