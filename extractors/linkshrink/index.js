const got = require("got");
const utils = require("../.utils");
const scp = require("set-cookie-parser");

exports.bypass = function(url, cb) {
  got(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    }
  }).then(function(resp) {
    let b = resp.body.split(`window.open(revC("`)[1].split(`"),`)[0];
    b = Buffer.from(b, "base64").toString("ascii");
    b = `https://linkshrink.net/${b}`;
    let c = `${utils.cookieString(scp(resp.headers["set-cookie"]))}; s=32`;

    console.log(c);
    console.log(b);
    setTimeout(function() {
      got(b, {
        followRedirect: false,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "Cookie": c,
          "DNT": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "TE": "trailers",
          "Upgrade-Insecure-Requests": "1",
        }
      }).then(function(resp) {
        console.log(resp.headers);
      }).catch(function(err) {
        cb(err, null);
      });
    }, 5000);
  }).catch(function(err) {
    cb(err, null);
  });
}