const Post = require("./../models/post");
const User = require("./../models/user");
const Comment = require("./../models/comment");

// SHOW
exports.getCommentsByPostId = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId });
  res.json(comments);
};

exports.getCommentsByUserId = async (req, res) => {
  const { userId } = req.params;
  const comments = await Comment.find({ author: userId });
  res.json(comments);
};

// CREATE
exports.createComment = async (req, res) => {
  const { post } = req.body;

  const postObj = await Post.findById(post);
  const comment = new Comment(req.body);
  const savedComment = await comment.save();

  postObj.comments = postObj.comments.concat(savedComment._id);
  postObj.save();
  res.json(postObj);
};

// UPDATE
exports.updateComment = async (req, res) => {
  const { newText, commentId } = req.body;

  const comment = await Comment.findByIdAndUpdate(commentId, newText);
  res.json(comment);
};

// DELETE
exports.deleteComment = async (req, res) => {
  const { post, author, commentId } = req.body;

  await Comment.findByIdAndDelete(commentId);
  const postObj = await Post.findById(post);
  const user = await User.findById(author);

  const postIdx = postObj.comments.indexOf(commentId);
  const newPostComments = [...postObj.comments];
  newPostComments.splice(postIdx, 1);
  postObj.comments = newPostComments;
  postObj.save();

  const userIdx = user.comments.indexOf(commentId);
  const newUserComments = [...user.comments];
  newUserComments.splice(userIdx, 1);
  user.comments = newUserComments;
  user.save();

  res.json(postObj);
};
