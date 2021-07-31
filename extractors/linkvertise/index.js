const got = require("got");
const u = require("url");

exports.bypass = function(url, cb) {
  got(`https://publisher.linkvertise.com/api/v1/redirect/link/static${u.parse(url, true).pathname}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",           
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-GPC": "1",
      "Cache-Control": "max-age=0",
      "TE": "Trailers"
    }
  }).then(function(resp) {
    var s = Buffer.from(JSON.stringify({
      timestamp: new Date() * 1,
      random: "6548307",
      link_id: JSON.parse(resp.body).data.link.id
    })).toString("base64");
    got.post(`https://publisher.linkvertise.com/api/v1/redirect/link${u.parse(url, true).pathname}/target?serial=${s}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",           
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-GPC": "1",
        "Cache-Control": "max-age=0",
        "TE": "Trailers"
      }
    }).then(function(resp) {
      cb(null, JSON.parse(resp.body).data.target);
    }).catch(function(err) {
      cb(err, null);
    });
  }).catch(function(err) {
    cb(err, null);
  });
}