const mongoose = require("mongoose");
const { Schema } = mongoose;

const LikeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
});

module.exports = mongoose.model("Like", LikeSchema);
