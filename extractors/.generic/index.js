const got = require("got");
const u = require("url");
const cheerio = require("cheerio");
const scp = require("set-cookie-parser");
const utils = require("../.utils");

exports.bypass = function(obj, cb) {
  if (
    obj.url.split("//").slice(1)[0].split("/")[0] == "href.li" ||
    obj.url.split("//").slice(1)[0].split("/")[0] == "www.href.li"
  ) {
    cb(null, obj.url.split("?").slice(1).join("?"));
    return;
  }
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
    // adfly detection
    if (resp.body.includes(`var ysmm = `)) {
      let a, m, I = "",
        X = "",
      r = resp.body.split(`var ysmm = `)[1].split('\'')[1];
      for (m = 0; m < r.length; m++) {
        if (m % 2 == 0) {
          I += r.charAt(m);
        } else {
          X = r.charAt(m) + X;
        }
      }
      r = I + X;
      a = r.split("");
      for (m = 0; m < a.length; m++) {
        if (!isNaN(a[m])) {
          for (var R = m + 1; R < a.length; R++) {
            if (!isNaN(a[R])) {
              let S = a[m] ^ a[R]
              if (S < 10) {
                a[m] = S
              }
              m = R
              R = a.length
            }
          }
        }
      }
      r = a.join("")
      r = Buffer.from(r, "base64").toString("ascii");
      r = r.substring(r.length - (r.length - 16));
      r = r.substring(0, r.length - 16);
      if (new URL(r).search.includes("dest=")) {
        r = decodeURIComponent(r.split("dest=")[1]);
      }
      cb(null, r);
    } else if (u.parse(resp.url, true).query.url) {
      if (isUrl(u.parse(resp.url, true).query.url)) {
        cb(null, u.parse(resp.url, true).query.url);
      } else if (isUrl(Buffer.from(u.parse(resp.url, true).query.url, "base64").toString("ascii"))) {
        cb(null, Buffer.from(u.parse(resp.url, true).query.url, "base64").toString("ascii"));
      } else {
        cont(resp.url, resp, obj, cb);
      }
    } else {
      cont(resp.url, resp, obj, cb);
    }
  }).catch(function(err) {
    cb(err, null);
  });
}

function isUrl(url) {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.exec(url)
}

function cont(url, resp, obj, cb) {
  if (resp.headers.location) {
    if (resp.url.includes("//adf.ly") || resp.url.includes("tinyurl.com/") && resp.headers.location.includes("preview.tinyurl.com")) {
      obj.url = resp.headers.location;
      require(".").bypass(obj, function(err, res) {
        if (err) {
          cb(null, resp.headers.location);
        } else {
          cb(null, res);
        }
      });
    } else {
      if (resp.headers.location == `${url}/`) {
        obj.url = resp.headers.location;
        require(".").bypass(obj, function(err, res) {
          if (err) {
            cb(null, resp.headers.location);
          } else {
            cb(null, res);
          }
        });
      } else {
        cb(null, resp.headers.location);
      }
    } 
  } else if (resp.body.includes(`content="0;URL=`)) {
    cb(null, resp.body.split(`content="0;URL=`)[1].split(`"`)[0]);
  } else {
    var $ = cheerio.load(resp.body);
    if ($("#wpsafe-link a").attr("href") && $("#wpsafe-link a").attr("href").includes("safelink_redirect")) {
      var a = u.parse($("#wpsafe-link a").attr("href"), true).query["safelink_redirect"];
      a = Buffer.from(a, "base64").toString("ascii");
      a = JSON.parse(a);
      a = decodeURIComponent(a.safelink);
      cb(null, a);
    } else if ($(".bl-logo-br").length > 0) {
      var bl = require("../biolink");
      bl.bypass(url, function(err, res) {cb(err, res);})
    } else if ($("#footer").length > 0 && $("#footer").text().split("DaddyScripts").length > 0) {
      // daddy's link protector
      var c = utils.cookieString(scp(resp.headers["set-cookie"]));
      if ($("form img").length > 0) {
        if (utils.supportedCaptcha(obj.captcha.service)) {
          var i = `https://${u.parse(url, true).host}/${$("form img").attr("src")}`;
          getImage(i, resp.url, c, function(err, res) {
            if (err) {cb(err, null);} else {
              utils.captcha({
                ref: resp.url,
                meta: {
                  type: "image",
                  image: res,
                  options: {}
                },
                service: obj.captcha
              }, function(err, re) {
                if (err) {cb(err, null);} else {
                  var b = `security_code=${re}&submit1=Submit`;
                  got.post(resp.url, {
                    body: b,
                    headers: {
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
                      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                      "Accept-Language": "en-US,en;q=0.5",
                      "Accept-Encoding": "gzip, deflate, br",
                      "Connection": "keep-alive",
                      "Cache-Control": "no-cache",
                      "Content-Length": utils.totalBytes(b),
                      "Content-Type": "application/x-www-form-urlencoded",
                      "Cookie": c,
                      "DNT": "1",
                      "Pragma": "no-cache",
                      "Referer": resp.url,
                      "Sec-Fetch-Dest": "document",
                      "Sec-Fetch-Mode": "navigate",
                      "Sec-Fetch-Site": "same-origin",
                      "Sec-Fetch-User": "?1",
                      "Sec-GPC": "1",
                      "Upgrade-Insecure-Requests": "1"
                    }
                  }).then(function(resp) {
                    var $ = cheerio.load(resp.body);
                    var l = [];
                    for (var c in $("center p a")) {
                      if ($("center p a")[c] !== undefined && $("center p a")[c].attribs !== undefined && $("center p a")[c].attribs.href !== undefined) {l.push($("center p a")[c].attribs.href);}
                    }
                    cb(null, l);
                  }).catch(function(err) {
                    cb(err, null);
                  });
                }
              })
            }
          });
        } else {
          cb("This bypass requires a CAPTCHA, but this instance doesn't support them.", null);
        }
      } else {
        if (obj.password == null) {
          cb("This bypass requires a password, but there isn't one specified.", null);
        } else {
          var b = `Pass1=${obj.password}&Submit0=Submit`;
          got.post(resp.url, {
            body: b,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Connection": "keep-alive",
              "Cache-Control": "no-cache",
              "Content-Length": utils.totalBytes(b),
              "Content-Type": "application/x-www-form-urlencoded",
              "Cookie": c,
              "DNT": "1",
              "Pragma": "no-cache",
              "Referer": resp.url,
              "Sec-Fetch-Dest": "document",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              "Sec-Fetch-User": "?1",
              "Sec-GPC": "1",
              "Upgrade-Insecure-Requests": "1"
            }
          }).then(function(resp) {
            var $ = cheerio.load(resp.body);
            var l = [];
            for (var c in $("center p a")) {
              if ($("center p a")[c] !== undefined && $("center p a")[c].attribs !== undefined && $("center p a")[c].attribs.href !== undefined) {l.push($("center p a")[c].attribs.href);}
            }
            cb(null, l);
          }).catch(function(err) {
            cb(err, null);
          });
        }
      }
    } else if ($("#redirecturl").length > 0) {
      cb(null, $("#redirecturl").attr("href"));
    } else {
      console.log(resp);
      cb("No redirects found.", null);
    }
  }
}

function getImage(url, ref, cook, cb) {
  got(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "image/avif,image/webp,*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Referer": ref,
      "Cookie": cook,
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      "Pragma": "no-cache"
    }
  }).then(function(resp) {
    require("fs").writeFileSync(`./captcha.png`, resp.rawBody);
    cb(null, Buffer.from(resp.rawBody).toString("base64"));
  }).catch(function(err) {
    cb(err, null);
  });
}