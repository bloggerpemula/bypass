const got = require("got");
const u = require("url");
const cheerio = require("cheerio");

exports.bypass = function(url, cb) {
  if (
    url.split("//").slice(1)[0].split("/")[0] == "href.li" ||
    url.split("//").slice(1)[0].split("/")[0] == "www.href.li"
  ) {
    cb(null, url.split("?").slice(1).join("?"));
    return;
  }
  got(url, {
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
    } else if (resp.headers.location) {
      if (resp.url.includes("//adf.ly")) {
        require(".").bypass(resp.headers.location, function(err, res) {
          if (err) {
            cb(null, resp.headers.location);
          } else {
            cb(null, res);
          }
        })
      } else {
        cb(null, resp.headers.location);
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
      } else {
        cb("No redirects found.", null);
      }
    }
  }).catch(function(err) {
    cb(err, null);
  });
}