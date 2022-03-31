const got = require("got");
const cheerio = require("cheerio");

exports.bypass = function(url, cb) {
  if (url.includes("/download/")) {
    url = url.replace("/download/", "/en/mirror/")
  } else if (!url.includes("/mirror/")) {
    cb("No redirects found.", null);
    return;
  }
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
    var l = [];
    for (var c in $("form input[name=link]")) {
      if ($("form input[name=link]")[c] !== undefined && $("form input[name=link]")[c].attribs !== undefined && $("form input[name=link]")[c].attribs.value !== undefined) {
        l.push($("form input[name=link]")[c].attribs.value);
      }
    }
    cb(null, l);
  }).catch(function(err) {
    cb(err, null);
  });
}