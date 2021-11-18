const u = require("url");

exports.unembed = function(url) {
  var h = u.parse(url, true).host;
  switch(h) {
    case "open.spotify.com":
      if (url.includes("/embed")) {url = url.split("/embed").join("");}
      return url;
    default:
      return url;
  }
}