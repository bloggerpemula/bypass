const got = require("got");
const scp = require("set-cookie-parser");
const utils = require("../.utils");
const fs = require("fs");

// tba - can't find CSRF token

exports.bypass = function(obj, cb) {
  got(obj.url, {
    followRedirect: false,
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
    got(resp.headers["location"], {
      followRedirect: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-GPC": "1",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    }).then(function(resp) {
      var c = scp(resp.headers["set-cookie"]);
      var u = resp.headers["location"]
      got(u, {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Cookie": utils.cookieString(c),
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Sec-GPC": "1",
        "TE": "trailers",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }).then(function(resp) {
        var s = resp.body.split(`"reCAPTCHA_site_key":"`)[1].split(`"`)[0];
        utils.captcha({
          ref: resp.url,
          meta: {
            sitekey: s,
            type: "recaptcha"
          }, 
          service: obj.captcha
        }, function(err, res) {
          if (err) {cb(err, null); return;}
          var b = `_method=POST&_csrfToken=${decodeURIComponent("2oZN8vAlEN5dyslr9Rgf1dBx2eYAU+acl4O1nClwuBM=")}&g-recaptcha-response=${decodeURIComponent(res)}`;
          got.post(u, {
            body: b,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Cookie": utils.cookieString(c),
              "Cache-Control": "no-cache",
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": utils.totalBytes(b),
              "Pragma": "no-cache",
              "Referer": u,
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-Fetch-User": "?1",
              "Sec-GPC": "1",
              "DNT": "1",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1"
            }
          }).then(function(resp) {
            fs.writeFileSync("./test2.html", resp.body)
            cb(null, null)
          }).catch(function(err) {
            cb(err, null);
          });
        });
      }).catch(function(err) {
        cb(err, null);
      });
    }).catch(function(err) {
      cb(err, null);
    });
  }).catch(function(err) {
    cb(err, null);
  });
}