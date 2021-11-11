const got = require("got");
const u = require("url");

exports.bypass = function(url, cb) {
  var id = u.parse(url, true).path
  console.log(id);
  got(`https://api.rekonise.com/unlocks${id}`, {
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
    var j = JSON.parse(resp.body);
    cb(null, j.url);
  }).catch(function(err) {
    cb(err, null);
  });
}