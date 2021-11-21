const got = require("got");
const cheerio = require("cheerio");
const utils = require("../.utils")

exports.bypass = function(obj, cb) {
  if (!obj.password) {cb("This bypass requires a password, but there isn't one specified.", null); return;}
  var b = `password=${encodeURIComponent(obj.password)}`
  got.post(obj.url, {
    body: b,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US",
      "Accept-Encoding": "gzip, deflate, br",
      "Connection": "keep-alive",
      "Content-Length": utils.totalBytes(b),
      "Content-Type": "application/x-www-form-urlencoded",
      "DNT": "1",
      "Origin": "https://thinfi.com",
      "Pragma": "no-cache",
      "Referer": obj.url,
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Sec-GPC": "1",
      "TE": "trailers"
    }
  }).then(function(resp) {
    var $ = cheerio.load(resp.body);
    if ($("section a").attr("href") == resp.url) {cb("Your password was invalid.", null); return;}
    cb(null, $("section a").attr("href"));
  }).catch(function(err) {
    cb(err, null);
  });
}
