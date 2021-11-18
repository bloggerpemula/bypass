const got = require("got");
const cheerio = require("cheerio");
const unembed = require("../.unembed");

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
    for (var c in $(".page-item-wrap a")) {
      if ($(".page-item-wrap a")[c] !== undefined && $(".page-item-wrap a")[c].attribs !== undefined && $(".page-item-wrap a")[c].attribs.href !== undefined) {
        if ($(".page-item-wrap a")[c].attribs.href == "javascript:void(0)") {continue;}
        l.push($(".page-item-wrap a")[c].attribs.href);
      } else {
        continue;
      }
    }
    for (var c in $(".show-embed-item iframe")) {
      if ($(".show-embed-item iframe")[c] !== undefined && $(".show-embed-item iframe")[c].attribs !== undefined && $(".show-embed-item iframe")[c].attribs["data-src"] !== undefined) {
        l.push(unembed.unembed($(".show-embed-item iframe")[c].attribs["data-src"]));
      } else {
        continue;
      }
    }
    
    cb(null, l);
  }).catch(function(err) {
    cb(err, null);
  })
}