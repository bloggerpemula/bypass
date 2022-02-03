exports.bypass = function(url, cb) {
  try {
    if (url.split("/redirect/").length > 1) {
      cb(null, decodeURIComponent(url.split("/redirect/")[1].split("/").slice(1).join("/")))
    } else {
      cb("No redirects found", null);
    }
  } catch(e) {
    cb(e, null);
  }
}