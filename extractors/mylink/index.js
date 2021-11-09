const got = require("got");
const scp = require("set-cookie-parser");
const cheerio = require("cheerio");
const utils = require("../.utils");
const u = require("url");

// tba

exports.bypass = function(obj, cb) {
  var r = u.parse(obj.url, true);
  if (r.query["url"] && r.pathname !== "/get.php") {
    cb(null, decodeURIComponent(r.query["url"]));
  } else if (r.query["url"] && r.pathname == "/get.php") {
    cb(null, Buffer.from(decodeURIComponent(r.query["url"]), "base64").toString("ascii"));
  } else {
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
      if (resp.body.includes(`http-equiv="refresh"`)) {
        var y = resp.body.split(`http-equiv="refresh"`)[1].split(`url=`)[1].split(`"`)[0];
        var b = `https://${y.split("//")[1].split("/")[0]}`;
        got(y, {
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
          var c = utils.cookieString(scp(resp.headers["set-cookie"]));
          got(`${b}${resp.headers.location}`, {
            followRedirect: false,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Cookie": c,
              "DNT": "1",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1"
            }
          }).then(function(resp) {
            var $ = cheerio.load(resp.body)
            var uri = $("form input[name=uri]").val();
            var hash = $("form input[name=hash]").val();
            var sk = $(".g-recaptcha").attr("data-sitekey");
            utils.captcha({
              ref: resp.url,
              meta: {
                type: "recaptcha",
                sitekey: sk
              },
              service: obj.captcha
            }, function(err, res) {
              console.log("captcha")
              if (err) {cb(err, null); return;}
              var b = `uri=${uri}&hash=${hash}&g-recaptcha-response=${res}`;
              repeat(`${resp.url}`, {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Cache-Control": "max-age=0",
                "Cookie": c,
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": utils.totalBytes(b),
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1"
              }, b);
            })
          }).catch(function(err) {
            cb(err, null);
          });
        }).catch(function(err) {
          cb(err, null);
        });
      }     
    }).catch(function(err) {
      cb(err, null);
    });
  }
}

function repeat(u, h, b) {
  var j = {headers: h, followRedirect: false}
  if (b) {j.body = b;} 
  got.post(u, j).then(function(resp) {
    console.log(resp.body) 
  }).catch(function(err) {
    console.log(err)
  });
}