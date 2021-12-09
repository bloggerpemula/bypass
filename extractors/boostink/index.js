const got = require("got");
const cheerio = require("cheerio");

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
    var $ = cheerio.load(resp.body);
    // sorry for party rockin
    // in all seriousness, i wouldn't have a problem with your site enough to make this if you didn't use
    // invasive popup ads on your site, or make it possible to use this site without javascript.
    // idk if you even mean mine or universal bypass tbh
    for (var c in $("script")) {
      if (
        $("script")[c] !== undefined &&
        $("script")[c].attribs !== undefined && 
        $("script")[c].attribs["kekw"] !== undefined
      ) { 
        cb(null, Buffer.from($("script")[c].attribs["kekw"], "base64").toString("ascii"));
      } else {
        continue;
      }
    }
  }).catch(function(err) {
    cb(err, null);
  })
}