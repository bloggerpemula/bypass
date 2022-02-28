const got = require("got");
const scp = require("set-cookie-parser");
const utils = require("../.utils");

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
    var r = resp.body.split("function redirect() {")[1].split("}")[0].split("\n");
    for (var c in r) {
      if (!r[c].startsWith("  //") && r[c] !== "") {var h = r[c].split("?u=")[1].split("',")[0]}
    }
    var cook = `${utils.cookieString(scp(resp.headers["set-cookie"]))}; aid=${encodeURIComponent(JSON.stringify([new URL(url).pathname.substring(1)]))};`
    var u = `${url}?u=${h}`;
    if (h == undefined) {
      cb("No redirects found.", null);
    } else {
      // this timer is as low as the site allows you to access the link, sorry :/
      setTimeout(function() {
        got(u, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Cookie": cook,
            "DNT": "1",
            "Connection": "keep-alive",
            "Referer": "https://cshort.org",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1"
          },
          followRedirect: false
        }).then(function(resp) {
          if (resp.headers["location"] && resp.headers["location"] !== "https://cshort.org/404") {
            cb(null, resp.headers["location"]);
          } else {
            cb("No redirects found.", null);
          }
        }).catch(function(err) {
          cb(err, null);
        })
      }, (10 * 1000))
    }
  }).catch(function(err) {
    cb(err, null);
  });
  
}