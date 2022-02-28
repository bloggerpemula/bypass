const got = require("got");
const utils = require("../.utils");
const scp = require("set-cookie-parser");

exports.bypass = function(obj, cb) {
  try {
    got(obj.url, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.5",
        "Alt-Used": "lnk2.cc",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "DNT": "1",
        "Pragma": "no-cache",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Upgrade-Insecure-Requests": "1"
      }
    }).then(function(resp) {
      var sk = resp.body.split(`class="g-recaptcha" data-sitekey="`)[1].split(`"`)[0];
      var cook = utils.cookieString(scp(resp.headers["set-cookie"]));
      utils.captcha({
        ref: obj.url,
        meta: {
          sitekey: sk,
          type: "recaptcha"
        },
        service: obj.captcha
      }, function(err, res) {
        if (err) {
          cb(err, null);
        } else {
          if (typeof res.token == "object") {
            var tk = res.token.data;
          } else {
            var tk = res.token;
          }
          var u = `https://lnk2.cc/go/${new URL(obj.url).pathname.substring(1)}`;
          var b = `g-recaptcha-response=${encodeURIComponent(tk)}`;
          got.post(u, {
            body: b,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Cookie": cook,
              "Cache-Control": "no-cache",
              "Referer": obj.url,
              "Content-Type": "application/x-www-form-urlencoded",
              "Content-Length": utils.totalBytes(b),
              "Origin": obj.url.split("/").slice(2).join("/"),
              "DNT": "1",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-GPC": "1",
              "TE": "Trailers"
            }
          }).then(function(resp) {
            var nu = `https://lnk2.cc/ts/${new URL(obj.url).pathname.substring(1)}`;
            var h = `token=${encodeURIComponent(resp.body.split(`name="token"`)[1].split(`value="`)[1].split(`">`)[0])}`;
            got.post(nu, {
              body: h,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Cache-Control": "no-cache",
                "Referer": u,
                "Cookie": cook,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": utils.totalBytes(h),
                "Origin": obj.url.split("/").slice(2).join("/"),
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-GPC": "1",
                "TE": "Trailers"
              },
              followRedirect: false
            }).then(function(resp) {
              if (resp.headers["location"] && resp.headers["location"] !== "https://lnk2.cc/") {
                cb(null, resp.headers["location"]);
              } else {
                cb("No redirects found.", null);
              }
            }).catch(function(err) {
              cb(err, null);
            })
          }).catch(function(err) {
            cb(err, null);
          })
        }
      });
    }).catch(function(err) {
      cb(err, null);
    })
  } catch(e) {
    cb(e, null);
  }
}