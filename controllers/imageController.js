const { getFileStream } = require("./../s3");

exports.getImage = async (req, res) => {
  const { key } = req.params;
  const readStream = getFileStream(key);

  readStream.pipe(res);
};
