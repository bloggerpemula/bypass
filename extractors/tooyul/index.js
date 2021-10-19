exports.bypass = function(u, cb) {
  cb(null, Buffer.from(u.split("url=")[1], "base64").toString("ascii").split("`}")[0]);
}