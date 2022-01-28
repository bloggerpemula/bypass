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
    for (var c in $("script")) {
      if (
        $("script")[c] !== undefined &&
        $("script")[c].attribs !== undefined && 
        $("script")[c].attribs["src"] !== undefined &&
        $("script")[c].attribs["src"].includes("assets/js/unlock.js")
      ) { 
        var a = $("script")[c].attribs;
        got(`https://boost.ink${a["src"]}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
          }
        }).then(function(res) {
          var attr = res.body.split(`document.currentScript.removeAttribute("`)[1].split(`");`)[0];
          if (!a[attr]) {cb("Boost.ink script is broken. Please report this issue.", null);}
          var l = Buffer.from(a[attr], "base64").toString("ascii");
          cb(null, l);
        })
      } else {
        continue;
      }
    }
  }).catch(function(err) {
    cb(err, null);
  })
}