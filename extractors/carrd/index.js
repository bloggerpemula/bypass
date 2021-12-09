const got = require("got");
const cheerio = require("cheerio");
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
    var $ = cheerio.load(resp.body);
    var l = [];
    for (var c in $("a")) {
      if ($("a")[c] !== undefined && $("a")[c].attribs !== undefined) {
        if ($("a")[c].attribs.href !== undefined || $("a")[c].attribs["data-cfemail"] !== undefined) {
          if ($("a")[c].attribs["data-cfemail"]) {
            l.push(`mailto:${utils.decodeCFEmail($("a")[c].attribs["data-cfemail"])}`);
          } else {
            if ($("a")[c].attribs.href.startsWith("#") || $("a")[c].attribs.href == "https://carrd.co") {continue;}
            l.push($("a")[c].attribs.href);
          } 
        }
      } else {  
        continue;
      }
    }
    cb(null, l);
  }).catch(function(err) {
    cb(err, null);
  });
}
