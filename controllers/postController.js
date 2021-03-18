const Post = require("./../models/post");

// INDEX
exports.getPosts = async (req, res) => {
  await Post.find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// SHOW
exports.showPost = async (req, res) => {
  const { postId } = req.body;

  await Post.findById(postId)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// CREATE
exports.createPost = async (req, res) => {
  const { text, author } = req.body;

  const user = await User.findById(author);

  const post = new Post({
    text,
    author,
  });

  const savedPost = await post.save();
  user.posts = user.posts.concat(savedPost._id);
  await user.save();

  res.json(savedPost);
};

// UPDATE
exports.updatePost = async (req, res) => {
  const { postId, newInfo } = req.body;

  const post = await Post.findByIdAndUpdate(postId, newInfo);
  const savedPost = await post.save();

  res.json(savedPost);
};

// DELETE
exports.deletePost = async (req, res) => {
  const { postId, userId } = req.body;

  const user = await User.findById(userId);
  const postIdx = user.posts.indexOf(postId);
  const updatedPosts = [...user.posts];
  updatedPosts.splice(postIdx, 1);
  user.posts = updatedPosts;

  await user.save();

  await Post.findByIdAndDelete(postId)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};