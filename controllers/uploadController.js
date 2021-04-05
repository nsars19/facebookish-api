const Post = require("./../models/post");
const Photo = require("./../models/photo");
const photoItem = require("./../utils/storage")();
const upload = require("./../utils/uploads");

exports.handleUpload = [uploadImage, buildPhoto, buildPost];

async function uploadImage(req, res, next) {
  upload(req, res, (err) => {
    if (err) res.sendStatus(500);
    next();
  });
}

// BUILD MONGO DOCUMENT & SAVE
async function buildPhoto(req, res, next) {
  const { originalname, destination, filename, path } = req.file;

  const photo = new Photo({
    originalname,
    destination,
    filename,
    path,
  });

  photo.save();
  photoItem.set(photo);
  next();
}

// BUILD MONGO DOCUMENT, SAVE, AND HANDLE RESPONSE
async function buildPost(req, res, next) {
  const { text } = req.body;
  const { userId } = req.params;

  const post = new Post({
    text,
    author: userId,
    photo: photoItem.get()._id,
  });

  post.save();
  photoItem.set({});
  postController.getFriendsPosts(req, res);
}

async function handleProfilePictureChange(userId, res) {
  const path = photoItem.get().path;

  await User.findByIdAndUpdate(userId, { profilePhotoSrc: path }, { new: true })
    .then((user) => res.send({ src: user.profilePhotoSrc }))
    .catch((err) => res.send(err));
}
