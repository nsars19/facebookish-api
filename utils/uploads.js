const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Setup Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId, imgPath } = req.params;
    const path = `public/images/${imgPath}/${userId}`;
    makeDir(path);
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(".")[0];
    return cb(
      null,
      Date.now() + "-" + fileName + path.extname(file.originalname)
    );
  },
  fileFilter: (req, file, cb) => {
    const isGoodType = checkFileType(file);
    isGoodType ? cb(null, true) : cb(null, false);
  },
  limits: {
    fileSize: 5000000,
  },
});

function makeDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function checkFileType(file) {
  const types = /jpg|jpeg|png/;
  return types.test(file.mimetype);
}

module.exports = multer({ storage: storage }).single("file");
