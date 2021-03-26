const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, red: "Post", required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
