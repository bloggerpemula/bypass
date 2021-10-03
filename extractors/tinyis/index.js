const got = require("got");
const cheerio = require("cheerio");

exports.bypass = function(url, cb) {
  got(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Sec-GPC": "1",
      "Cache-Control": "max-age=0",
      "TE": "trailers"
    }
  }).then(function(resp) {
    var $ = cheerio.load(resp.body);
    cb(null, $("#skip-btn").attr("href"));
  }).catch(function(err) {
    cb(err, null);
  })
}
