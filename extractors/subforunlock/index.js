const got = require("got");

exports.bypass = function(url, cb) {
  got(url, {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "DNT": "1",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
  }).then(function(resp) {
    cb(null, resp.body.split(`window.location='`)[1].split(`'`)[0]);
  }).catch(function(err) {
    cb(err, null);
  });
}