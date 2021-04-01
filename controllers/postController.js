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
    })
    .populate({
      path: "comments",
      populate: {
        path: "comments",
        model: "Comment",
        populate: {
          path: "author",
          model: "User",
        },
      },
    })
    .sort({ createdAt: "descending" });

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
    })
    .populate({
      path: "comments",
      populate: {
        path: "comments",
        model: "Comment",
        populate: {
          path: "author",
          model: "User",
        },
      },
    })
    .sort({ createdAt: "descending" });

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
  const { postId, newData } = req.body;

  const post = await Post.findByIdAndUpdate(postId, { text: newData });
  await post.save();

  const returnObj = await Post.findById(postId)
    .populate("author")
    .populate({
      path: "comments",
      populate: {
        path: "comments",
        model: "Comment",
        populate: {
          path: "author",
          model: "User",
        },
      },
    })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    });

  res.json(returnObj);
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
