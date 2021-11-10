const got = require("got");
const cheerio = require("cheerio");
const scp = require("set-cookie-parser");
const u = require("url");
const utils = require("../.utils");
const fs = require("fs");

exports.bypass = function(obj, cb) {
  if (u.parse(obj.url, true).pathname.includes("view.php")) {
    var i = u.parse(obj.url, true).query.l;
    var url = obj.url;
  } else if (u.parse(obj.url, true).pathname.includes("away4.php")) {
    cb(null, Buffer.from(u.parse(obj.url, true).query.a, "base64").toString("ascii"));
    return;
  } else {
    var i = u.parse(obj.url, true).pathname.substring(1);
    var url = `https://catcut.net/go/view.php?l=${i}&s=1`;
  }
  got(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Pragma": "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Sec-GPC": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    }
  }).then(function(resp) {
    var aw = resp.body.split(`go_url = decodeURIComponent('`)[1].split(`'`)[0];
    aw = decodeURIComponent(aw);
    aw = `${aw}&q=0&r=2&p=0&t=1&s=1&u14=9&v14=32&w7=52`;
    var sk = resp.body.split(`'sitekey' : '`)[1].split(`'`)[0];
    utils.captcha({
      ref: url,
      meta: {
        type: "recaptcha",
        sitekey: sk
      },
      service: obj.captcha
    }, function(err, res) {
      if (err) {cb(err, null); return;} else {
        aw = `${aw}&x=${res.token}`;
        got.get(aw, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "DNT": "1",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Sec-GPC": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
          }
        }).then(function(resp) {
          cb(null, Buffer.from(u.parse(decodeURIComponent(resp.body), true).query.a, "base64").toString("ascii"));
        }).catch(function(err) {
          cb(err, null);
        });
      }
    });
  }).catch(function(err) {
    cb(err, null);
  });
}