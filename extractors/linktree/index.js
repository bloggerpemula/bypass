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
    var l = [];
    for (var c in $(".sc-eCssSg")) {
      if ($(".sc-eCssSg")[c] !== undefined && $(".sc-eCssSg")[c].attribs !== undefined && $(".sc-eCssSg")[c].attribs.href !== undefined) {
        if ($(".sc-eCssSg")[c].attribs.href == "https://linktr.ee/") {continue}
        l.push($(".sc-eCssSg")[c].attribs.href);
      } else {
        continue;
      }
    }
    var j = resp.body.split(`<script id="__NEXT_DATA__" type="application/json" crossorigin="anonymous">`)[1].split(`</script>`)[0];
    j = JSON.parse(j);
    for (var c in j.props.pageProps.links) {
      l.push(j.props.pageProps.links[c].url);
    }
    cb(null, l);
  }).catch(function(err) {
    cb(err, null);
  })
}