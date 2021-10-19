const got = require("got");
const cheerio = require("cheerio");
const scp = require("set-cookie-parser");
const utils = require("../.utils");

// tba

exports.bypass = function(obj, cb) {
  if (obj.url.includes("exe.io")) {obj.url = obj.url.replace("exe.io", "exey.io");}
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
    var m = encodeURIComponent($("#before-captcha [name=_method]").val());
    var c = encodeURIComponent($("#before-captcha [name=_csrfToken]").val());
    var e = encodeURIComponent($("#before-captcha [name=extraPage]").val());
    var r = encodeURIComponent($("#before-captcha [name=ref]").val());
    var f = encodeURIComponent($("#before-captcha [name=f_n]").val());
    var tf = encodeURIComponent($("#before-captcha [name='_Token[fields]']").val());
    var tu = encodeURIComponent($("#before-captcha [name='_Token[unlocked]']").val());
    var b = `_method=${m}&_csrfToken=${c}&extraPage=${e}&ref=${r}&f_n=${f}&_Token%5Bfields%5D=${tf}&_Token%5Bunlocked%5D=${tu}`;
    var cook = utils.cookieString(scp.parse(resp.headers["set-cookie"]));
    setTimeout(function() {
      got.post(`https://exey.io${$("#before-captcha").attr("action")}`, {
        body: b,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Alt-Used": "exey.io",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Content-Length": utils.totalBytes(b),
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": `${cook}; ab=1`,
          "Origin": "https://exey.io",
          "Pragma": "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1",
          "TE": "trailers",
          "Upgrade-Insecure-Requests": "1"
        }
      }).then(function(resp) {
        var $ = cheerio.load(resp.body);
        var m = encodeURIComponent($("#before-captcha [name=_method]").val());
        var c = encodeURIComponent($("#before-captcha [name=_csrfToken]").val());
        var e = encodeURIComponent($("#before-captcha [name=extraPage]").val());
        var r = encodeURIComponent($("#before-captcha [name=ref]").val());
        var f = encodeURIComponent($("#before-captcha [name=f_n]").val());
        var tf = encodeURIComponent($("#before-captcha [name='_Token[fields]']").val());
        var tu = encodeURIComponent($("#before-captcha [name='_Token[unlocked]']").val());
        var sk = resp.body.split(`"invisible_reCAPTCHA_site_key":"`)[1].split(`",`)[0]
        utils.captcha({
          ref: obj.url,
          meta: {
            sitekey: sk,
            type: "recaptcha"
          },
          service: obj.captcha
        }, function(err, response) {
          if (typeof response.token == "object") {
            var re = response.token.data;
          } else {
            var re = response.token;
          }
          var b = `_method=${m}&_csrfToken=${c}&extraPage=${e}&ref=${r}&f_n=${f}&g-recaptcha-response=${re}&_Token%5Bfields%5D=${tf}&_Token%5Bunlocked%5D=${tu}`;
          setTimeout(function() {
            got.post(`https://exey.io${$("#link-view").attr("action")}`, {
              body: b,
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Alt-Used": "exey.io",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Length": utils.totalBytes(b),
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": `${cook}; ab=1`,
                "Origin": "https://exey.io",
                "Pragma": "no-cache",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "TE": "trailers",
                "Upgrade-Insecure-Requests": "1"
              }
            }).then(function(resp) {
              var $ = cheerio.load(resp.body);
              var m = encodeURIComponent($("#before-captcha [name=_method]").val());
              var c = encodeURIComponent($("#before-captcha [name=_csrfToken]").val());
              var a = encodeURIComponent($("#before-captcha [name=ad_from_data]").val());
              var tf = encodeURIComponent($("#before-captcha [name='_Token[fields]']").val());
              var tu = encodeURIComponent($("#before-captcha [name='_Token[unlocked]']").val());
              var b = `_method=${m}&_csrfToken=${c}&ad_form_data=${a}&_Token%5Bfields%5D=${tf}&_Token%5Bunlocked%5D=${tu}`;
              var cook2 = utils.cookieString(scp.parse(resp.headers["set-cookie"]));
              console.log(cook2)
              console.log(b)
              setTimeout(function() {
                got.post("https://exey.io/links/go", {
                  body: b,
                  headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Alt-Used": "exey.io",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Length": utils.totalBytes(b),
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": `${cook}; ab=1; ${cook2}`,
                    "Origin": "https://exey.io",
                    "Pragma": "no-cache",
                    "Referer": obj.url,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "TE": "trailers",
                    "X-Requested-With": "XMLHttpRequest"
                  }
                }).then(function(resp) {
                  var j = JSON.parse(resp.body);
                  console.log(j);
                }).catch(function(err) {
                  console.log(err.response.body)
                  cb(err, null);
                });
              }, 12000);
            }).catch(function(err) {
              cb(err, null);
            });
          }, 3000);
        });
      }).catch(function(err) {
        cb(err, null);
      });
    }, 3000);
  }).catch(function(err) {
    cb(err, null);
  });
}