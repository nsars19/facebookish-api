const Post = require("./../models/post");
const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const getTokenFromRequest = require("./../utils/getToken");

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
    .populate("author", { firstName: 1, lastName: 1, profilePhotoSrc: 1 })
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
    .populate("photo", { path: 1 })
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
    .populate("author", { firstName: 1, lastName: 1, profilePhotoSrc: 1 })
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
    .populate("photo", { path: 1 })
    .sort({ createdAt: "descending" });

  res.json(posts);
};

// CREATE
exports.createPost = async (req, res) => {
  const { homeFeed, text } = req.body;

  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken.id) {
    res.sendStatus(401);
  }

  const author = decodedToken.id;
  const createdAt = Date.now();
  const post = new Post({
    text,
    author,
    createdAt,
  });

  const savedPost = await post.save();

  await User.findByIdAndUpdate(author, {
    $push: { posts: savedPost._id },
  });

  if (homeFeed) {
    this.getFriendsPosts({ params: { userId: author } }, res);
  } else {
    this.getUserPosts({ params: { userId: author } }, res);
  }
};

// UPDATE
exports.updatePost = async (req, res) => {
  const { postId, newData } = req.body;

  const post = await Post.findByIdAndUpdate(postId, { text: newData });

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
  const { postId } = req.body;

  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken.id) {
    res.sendStatus(401);
  }

  await Post.deleteOne({ _id: postId })
    .then((result) => res.sendStatus(200))
    .catch((err) => res.send(err));

  await User.findByIdAndUpdate(decodedToken.id, {
    $pull: { posts: postId },
  }).catch((err) => console.log(err));
};
