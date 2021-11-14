const got = require("got");
const cheerio = require("cheerio");
const scp = require("set-cookie-parser");
const utils = require("../.utils");

// tba - cant get around /get/tk

exports.bypass = function(url, cb) {
  got(url, {
    headers: {
      "User-Agent": "User-Agent: Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    }
  }).then(function(resp) {
    var _a = resp.body.split(`let _a = '`)[1].split(`',`)[0];
    var _t = resp.body.split(`_t = '`)[1].split(`';`)[0];
    var $ = cheerio.load(resp.body);
    var csrf = $("#go-link input[name=csrf]").val();
    var alias = $("#go-link input[name=alias]").val();
    var b = `_a=${encodeURIComponent(_a)}&t=${encodeURIComponent(_t)}`;
    console.log(utils.cookieString(scp(resp.headers["set-cookie"])))
    setTimeout(function() {
      got.post("https://aylink.co/get/tk", {
        body: b,
        headers: {
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
          "Cookie": `${utils.cookieString(scp(resp.headers["set-cookie"]))}; click=1; TRLink=emf9gd74om3ngu63d61352ol0r`,
          "Connection": "keep-alive",
          "Content-Length": utils.totalBytes(b),
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "DNT": "1",
          "Origin": "https://aylink.co",
          "Pragma": "no-cache",
          "Referer": url,
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Sec-GPC": "1",
          "TE": "trailers",
          "User-Agent": "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then(function(resp) {
        var j = JSON.parse(resp.body);
        console.log(j);
      }).catch(function(err) {
        cb(err, null);
      });
    }, 5230);
  }).catch(function(err) {
    cb(err, null);
  });
}