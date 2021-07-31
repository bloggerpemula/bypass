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
    var cook = utils.cookieString(scp.parse(resp.headers["set-cookie"]));
    for (var c in $("head script")) {
      if ($("head script")[c].attribs && $("head script")[c].attribs.src && $("head script")[c].attribs.src.includes("?render")) {
        var sk = u.parse($("head script")[c].attribs.src, true).query.render;
      } else {
        continue;
      }
    }
    utils.captcha({
      ref: obj.url,
      meta: {
        sitekey: sk,
        type: "recaptcha"
      },
      service: obj.captcha
    }, function(err, response) {
      if (err) {cb(err, null);} else {
        var b = `_token=${encodeURIComponent($("#form-captcha [name=_token]").val())}&x-token=${response.token}&v-token=${$("#v-token").val()}`;
        got.post($("#form-captcha").attr("action"), {
          followRedirect: false,
          body: b,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            "Referer": obj.url,
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": utils.totalBytes(b),
            "Origin": obj.url.split("/").slice(2),
            "DNT": "1",
            "Connection": "keep-alive",
            "Cookie": cook,
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1",
            "TE": "Trailers"
          }
        }).then(function(resp) {
          if (resp.headers.location) {
            cb(null, resp.headers.location);
          } else {
            var $ = cheerio.load(resp.body);
            var b = `_token=${$("#form-go [name=_token]").val()}&x-token=${$("#x-token").val()}`;
            got.post($("#form-go").attr("action"), {
              body: b,
              followRedirect: false,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": obj.url,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": utils.totalBytes(b),
                "Origin": obj.url.split("/").slice(2),
                "DNT": "1",
                "Connection": "keep-alive",
                "Cookie": cook,
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1",
                "TE": "Trailers"
              }
            }).then(function(resp) {
              if (resp.headers.location) {
                cb(null, resp.headers.location);
              } else {
                cb("No redirects found.")
              }
            }).catch(function(err) {
              cb(err, null);
            });
          }
        }).catch(function(err) {
          cb(err, null);
        });
      }
    });
  })
}