const got = require("got");

exports.bypass = function(url, cb) {
  got(url, {
    headers: {
      "User-Agent": "",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    }
  }).then(function(resp) {
    cb(null, resp.body.split(`originating_url&quot;:&quot;`)[1].split("&quot;")[0]);
  }).catch(function(err) {
    cb(err, null);
  })
}