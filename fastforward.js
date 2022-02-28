const got = require("got");
const utils = require("./extractors/.utils");

exports.query = function(url, cb) {
  var u = new URL(url);
  if (!isCrowdBypass(u.hostname)) {cb("Not crowd-bypassable.", null); return;}
  var b = `domain=${u.hostname}&path=${u.pathname.substring(1)}`;
  got.post("https://crowd.fastforward.team/crowd/query_v1", {
    body: b,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": utils.totalBytes(b)
    },
    timeout: {
      response: 2000
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
  if (!isCrowdBypass(o.hostname)) {cb("Not add-able.", null); return;}
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

function isCrowdBypass(host) {
  switch(host) {
    case "za.gl":
    case "za.uy":
    case "fc-lc.com":
    case "lompat.in":
    case "elil.cc":
    case "squidssh.com":
    case "goodssh.com":
    case "cpmlink.net":
    case "shon.xyz":
    case "likn.xyz":
    case "sloomp.space":
    case "shorten.sh":
    case "expertvn.com":
    case "mediafile.cloud":
    case "gplinks.co":
    case "wadoo.com":
    case "gotravelgo.space":
    case "pantauterus.me":
    case "liputannubi.net":
    case "rom.io":
      return true;
    default: 
      return false;
  }
}