const Post = require("./../models/post");
const Comment = require("./../models/comment");

exports.likePost = async (req, res) => {
  const { user, post } = req.body;
  const postObj = await Post.findById(post);

  if (postObj.likes.includes(user)) {
    const idx = postObj.likes.indexOf(user);
    const newLikes = [...postObj.likes];
    newLikes.splice(idx, 1);
    postObj.likes = newLikes;
  } else {
    postObj.likes = postObj.likes.concat(user);
  }

  postObj
    .save()
    .then((data) => res.send(postObj))
    .catch((error) => res.send(error));
};

exports.likeComment = async (req, res) => {
  const { user, comment } = req.body;
  const commentObj = await Comment.findById(comment);

  if (commentObj.likes.includes(user)) {
    const idx = commentObj.likes.indexOf(user);
    const newLikes = [...commentObj.likes];
    newLikes.splice(idx, 1);
    commentObj.likes = newLikes;
  } else {
    commentObj.likes = commentObj.likes.concat(user);
  }

  commentObj
    .save()
    .then((data) => res.send(commentObj))
    .catch((error) => res.send(error));
};
