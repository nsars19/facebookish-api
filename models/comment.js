const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, red: "Post", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
});

module.exports = mongoose.model("Comment", CommentSchema);
