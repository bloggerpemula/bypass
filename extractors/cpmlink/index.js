const got = require("got");
const cheerio = require("cheerio");
const scp = require("set-cookie-parser");
const u = require("url");
const utils = require("../.utils");

exports.bypass = function(obj, cb) {
  got(obj.url, {
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
    var k = $("#skip [name=key]").val();
    var t = $("#skip [name=time]").val();
    var r = $("#skip [name=ref]").val();
    var w = "960";
    var h = "927";
    var sk = $("#captcha").attr("data-sitekey");
    var cook = utils.cookieString(scp.parse(resp.headers["set-cookie"]));
    utils.captcha({
      ref: obj.url,
      meta: {
        sitekey: sk,
        type: "recaptcha"
      },
      service: obj.captcha
    }, function(err, response) {
      if (err) {cb(err, null);} else {
        if (typeof response.token == "object") {
          var c = response.token.data;
        } else {
          var c = response.token;
        }
        var b = `key=${k}&time=${t}&ref=${r}&s_width=${w}&s_height=${h}&g-recaptcha-response=${c}`;
        got.post($("#skip").attr("action"), {
          body: b,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Length": utils.totalBytes(b),
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cook,
            "Origin": "https://cpmlink.net",
            "Pragma": "no-cache",
            "Referer": obj.url,
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Site": "navigate",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1"
          }
        }).then(function(resp) {
          var $ = cheerio.load(resp.body);
          cb(null, $("#continue a").attr("href"));
        }).catch(function(err) {
          cb(err, null);
        });
      }
    });
  }).catch(function(err) {
    cb(err, null);
  });
}