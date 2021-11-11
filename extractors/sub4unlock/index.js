const got = require("got");
const u = require("url");

exports.bypass = function(url, cb) {
  if (u.parse(url, true).host == "shorte.be") {
    var url = `https://sub4unlock.com/LP.php?$=${u.parse(url, true).query["$"]}` 
  }
  if (url.includes("LPD786.php")) {
    got(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    }).then(function(resp) {
      cb(null, resp.body.split(`fun2`)[1].split(`window.open('`)[1].split(`');`)[0]);
    }).catch(function(err) {
      cb(err, null);
    });
  } else {
    got(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    }).then(function(resp) {
      var ur = resp.body.split(`fun2`)[resp.body.split(`fun2`).length - 1].split(`window.open('`)[1].split(`'`)[0];
      require(".").bypass(ur, function(err, resp) {
        cb(err, resp);
      });
    }).catch(function(err) {
      cb(err, null);
    });
  }
  
}