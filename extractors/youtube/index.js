const got = require("got");
const cheerio = require("cheerio");
const {parse} = require("url");

exports.bypass = function(url, cb) {
  var u = parse(url, true);
  if (u.query.q && u.pathname == "/redirect") {
    cb(null, decodeURIComponent(u.query.q));
  } else {
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
      if (url == resp.url) {
        cb("No redirects found.", null);
      } else {
        cb(null, resp.url);
      }
    }).catch(function(err) {
      cb(err, null);
    });
  }
}