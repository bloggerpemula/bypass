exports.bypass = function(url, cb) {
  try {
    if (url.split("/#/link/").length > 1) {
      cb(null, Buffer.from(url.split("/#/link/")[1].split(".")[0], "base64").toString("ascii"));
    } else {
      cb("No redirects found", null);
    }
  } catch(e) {
    cb(e, null);
  }
}