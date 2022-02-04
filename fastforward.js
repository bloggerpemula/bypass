const got = require("got");
const utils = require("./extractors/.utils");

exports.query = function(url, cb) {
  var u = new URL(url);
  var b = `domain=${u.hostname}&path=${u.pathname.substring(1)}`;
  got.post("https://crowd.fastforward.team/crowd/query_v1", {
    body: b,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": utils.totalBytes(b)
    },
    timeout: {
      response: 10000
    }
  }).then(function(resp) {
    if (resp.statusCode == 200 || resp.statusCode == 201) {
      cb(null, resp.body);
    } else {
      cb("Not in database.", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
}

exports.add = function(original, target, cb) {
  var o = new URL(original);
  var b = `domain=${o.hostname}&path=${o.pathname.substring(1)}&target=${encodeURIComponent(target)}`;
  got.post("https://crowd.fastforward.team/crowd/contribute_v1", {
    body: b,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": utils.totalBytes(b)
    }
  }).then(function(resp) {
    if (resp.statusCode == 201) {
      cb(null, "Reported.");
    } else {
      cb("Not reported.", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
}