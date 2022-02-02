exports.bypass = function(url, cb) {
  cb(null, Buffer.from(url.split("/#/link/")[1].split(".")[0], "base64").toString("ascii"));
}