exports.bypass = function(url, cb) {
  try {
    cb(null, Buffer.from(Buffer.from(Buffer.from(new URL(url).searchParams.get("asu"), "base64").toString("ascii"), "base64").toString("ascii"), "base64").toString("ascii"))
  } catch(e) {
    cb(e, null);
  }
}