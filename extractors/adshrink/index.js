const got = require("got");
const cheerio = require("cheerio");

exports.bypass = function(url, cb) {
  got(url, {
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
    for (var c in $("script")) {
      if (
        $("script")[c] !== undefined &&
        $("script")[c].children !== undefined &&
        $("script")[c].children[0] !== undefined &&
        $("script")[c].children[0].data !== undefined &&
        $("script")[c].children[0].data.includes("_sharedData")
      ) {
        var json = $("script")[c].children[0].data.split("_sharedData = ")[1].split("};")[0]
        json = JSON.parse(json + "}");
        json = JSON.parse(json[0].metadata);
        cb(null, json.url);
      } else {
        continue;
      }
    }
  }).catch(function(err) {
    cb(err, null);
  })
}