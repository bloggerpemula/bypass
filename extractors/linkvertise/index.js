const got = require("got");
const u = require("url");

exports.bypass = function(url, cb) {
  if (u.parse(url, true).host == "linkvertise.download") {
    var i = "/" + u.parse(url, true).pathname.split("/").slice(2, 4).join("/");
  } else {
    var i = u.parse(url, true).pathname.split("/").slice(0, 3).join("/");
  }
  got(`https://publisher.linkvertise.com/api/v1/redirect/link/static${i}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
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
    if (resp.headers["content-type"] == "text/html; charset=UTF-8") {cb("The link seems to not work.", null); return;}
    var s = Buffer.from(JSON.stringify({
      timestamp: new Date() * 1,
      random: "6548307",
      link_id: JSON.parse(resp.body).data.link.id
    })).toString("base64");
    got.post(`https://publisher.linkvertise.com/api/v1/redirect/link${i}/target?serial=${s}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
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
      if (JSON.parse(resp.body).data.target !== null) {
        cb(null, JSON.parse(resp.body).data.target);
      } else {
        got.post(`https://publisher.linkvertise.com/api/v1/redirect/link${i}/paste`, {
          body: `{"serial":"${s}"}`,
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",           
            "Accept-Encoding": "gzip, deflate, br",
            "Content-Type": "application/json",
            "DNT": "1",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-GPC": "1",
            "Cache-Control": "max-age=0",
            "TE": "Trailers"
          }
        }).then(function(resp) {
          var j = JSON.parse(resp.body);
          if (isURL(j.data.paste)) {
            cb(null, j.data.paste);
          } else {
            cb("Invalid type of link, not URL.", null);
          }
        }).catch(function(err) {
          cb(err, null);
        });
      }
    }).catch(function(err) {
      cb(err, null);
    });
  }).catch(function(err) {
    cb(err, null);
  });
}

function isURL(url) {
  return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.exec(url)
}