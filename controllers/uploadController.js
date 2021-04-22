const Post = require("./../models/post");
const Photo = require("./../models/photo");
const User = require("./../models/user");
const photoItem = require("./../utils/storage")();
const upload = require("./../utils/uploads");
const postController = require("./../controllers/postController");
const jwt = require("jsonwebtoken");
const getTokenFromRequest = require("./../utils/getToken");
const { uploadFile } = require("./../s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const sharp = require("sharp");

exports.handleUpload = [
  verifyToken,
  uploadImage,
  processImage,
  uploadToS3,
  unlink,
  buildPhoto,
  buildPost,
];

async function verifyToken(req, res, next) {
  const token = getTokenFromRequest(req);
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

  if (!token || !decodedToken.id) {
    res.sendStatus(401);
  } else {
    next();
  }
}

async function uploadImage(req, res, next) {
  upload(req, res, (err) => {
    if (err) res.sendStatus(500);
    next();
  });
}

async function processImage(req, res, next) {
  const { file } = req;
  const [originalFileName, originalExtention] = file.originalname.split(".");
  const updatedFileName =
    originalExtention === "jpeg"
      ? `${originalFileName}2.jpeg`
      : `${originalFileName}.jpeg`;
  const newPath = file.destination + "/" + updatedFileName;

  const newImageFile = await sharp(file.path)
    .jpeg({ mozjpeg: true, quality: 80 })
    .toFile(newPath, (err, info) => {
      if (err) res.send(err);
    })
    .toBuffer();

  req.file = {
    fieldname: "file",
    originalname: req.file.originalname,
    encoding: req.file.encoding,
    mimetype: "image/jpeg",
    destination: req.file.destination,
    filename: updatedFileName,
    path: newPath,
    size: newImageFile.size,
  };

  next();
}

async function uploadToS3(req, res, next) {
  const result = await uploadFile(req.file);
  const key = result.key;
  const location = result.Location;

  // Attach returned s3 info to file object
  req.file = { ...req.file, key, location };

  next();
}

async function unlink(req, res, next) {
  await unlinkFile(req.file.path);
  await unlinkFile(req.file.destination + "/" + req.file.originalname);
  fs.rmdirSync(req.file.destination);
  next();
}

// BUILD MONGO DOCUMENT & SAVE
async function buildPhoto(req, res, next) {
  const { originalname, location, key, path } = req.file;
  const { imgPath, userId } = req.params;

  const photo = new Photo({
    originalname,
    location,
    key,
    path,
  });

  photo.save();
  photoItem.set(photo);

  if (imgPath === "banner") handleBannerChange(userId, res);
  else if (imgPath === "profile") handleProfilePictureChange(userId, res);
  else next();
}

// BUILD MONGO DOCUMENT, SAVE, AND HANDLE RESPONSE
async function buildPost(req, res, next) {
  const { text } = req.body;
  const { userId } = req.params;

  const post = new Post({
    text: text || " ",
    author: userId,
    photo: photoItem.get()._id,
  });

  post.save();
  photoItem.set({});
  postController.getFriendsPosts(req, res);
}

async function handleProfilePictureChange(userId, res) {
  const path = photoItem.get().key;

  await User.findByIdAndUpdate(userId, { profilePhotoSrc: path }, { new: true })
    .then((user) => res.send({ src: user.profilePhotoSrc }))
    .catch((err) => res.send(err));
}

async function handleBannerChange(userId, res) {
  const path = photoItem.get().key;

  await User.findByIdAndUpdate(userId, { bannerSrc: path }, { new: true })
    .then((user) => res.send({ src: user.bannerSrc }))
    .catch((err) => res.send(err));
}
