const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  // likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
});

module.exports = mongoose.model("Post", PostSchema);
