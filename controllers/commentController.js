const Post = require("./../models/post");
const User = require("./../models/user");
const Comment = require("./../models/comment");
const jwt = require("jsonwebtoken");
const getTokenFromRequest = require("./../utils/getToken");

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

exports.getCommentById = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId).populate("author", {
    firstName: 1,
    lastName: 1,
  });

  res.send(comment);
};

// CREATE
exports.createComment = async (req, res) => {
  const { post, text } = req.body;

  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken.id) {
    res.sendStatus(401);
  }

  const author = decodedToken.id;
  const commentData = {
    createdAt: Date.now(),
    post,
    text,
    author,
  };

  const comment = new Comment(commentData);
  comment.save();

  const postObj = await Post.findByIdAndUpdate(
    post,
    {
      $push: { comments: comment._id },
    },
    { new: true }
  )
    .populate("comments")
    .then((post) => {
      res.send(post);
    })
    .catch((err) => res.send(err));
};

exports.createChildComment = async (req, res) => {
  const { text, post, comment, parentId } = req.body;

  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken) {
    res.sendStatus(401);
  }

  const author = decodedToken.id;
  const data = {
    createdAt: Date.now(),
    text,
    post,
    author,
    parentId,
  };

  const newComment = new Comment(data);
  newComment.save();

  await Comment.findById(comment).then((cmt) => {
    cmt.comments = [...cmt.comments].concat(newComment._id);
    cmt.save();
  });

  if (comment !== parentId) {
    await Comment.findById(parentId).then((cmt) => {
      cmt.comments = [...cmt.comments].concat(newComment._id);
      cmt.save();
    });
  }

  const returnObj = await Post.findById(post).populate({
    path: "comments",
    populate: {
      path: "comments",
      model: "Comment",
    },
  });

  res.send(returnObj);
};

// UPDATE
exports.updateComment = async (req, res) => {
  const { newData, commentId } = req.body;

  const comment = await Comment.findByIdAndUpdate(commentId, { text: newData });
  await comment.save();
  const returnObj = await Comment.findById(commentId);

  res.json(returnObj);
};

// DELETE
exports.deleteComment = async (req, res) => {
  const { post, author, commentId, parentId } = req.body;

  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken.id) {
    res.sendStatus(401);
  }

  await Comment.findByIdAndDelete(commentId);

  const postObj = await Post.findById(post);
  const user = await User.findById(decodedToken.id);

  if (parentId) {
    const parentComment = await Comment.findById(parentId);
    const cmtIdx = parentComment.comments.indexOf(commentId);
    const newCmts = [...parentComment.comments];
    newCmts.splice(cmtIdx, 1);
    parentComment.comments = newCmts;
    parentComment.save();
  } else {
    const postIdx = postObj.comments.indexOf(commentId);
    const newPostComments = [...postObj.comments];
    newPostComments.splice(postIdx, 1);
    postObj.comments = newPostComments;
    postObj.save();
  }

  const userIdx = user.comments.indexOf(commentId);
  const newUserComments = [...user.comments];
  newUserComments.splice(userIdx, 1);
  user.comments = newUserComments;
  user.save();

  const returnObj = await Post.findById(postObj._id).populate({
    path: "comments",
    populate: {
      path: "comments",
      model: "Comment",
    },
  });

  res.json(returnObj);
};
