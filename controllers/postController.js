const Post = require("./../models/post");
const User = require("./../models/user");

// INDEX
exports.getPosts = async (req, res) => {
  await Post.find({})
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// SHOW
exports.showPost = async (req, res) => {
  const { postId } = req.params;

  await Post.findById(postId)
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

// USER POSTS
exports.getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ author: userId })
    .populate("author", { firstName: 1, lastName: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    });
  res.json(posts);
};

// FRIEND POSTS
exports.getFriendsPosts = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  const friends = user.friends.concat(userId);
  const posts = await Post.find({
    author: {
      $in: friends,
    },
  })
    .populate("author", { firstName: 1, lastName: 1 })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    });

  res.json(posts);
};

// CREATE
exports.createPost = async (req, res) => {
  const { text, author } = req.body;

  const user = await User.findById(author);
  const createdAt = Date.now();
  const post = new Post({
    text,
    author,
    createdAt,
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
