const got = require("got");
const utils = require("../.utils");

exports.bypass = async function (url, cb) {
  let resp = await got(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1"
    }
  })
  var l = [];
  var j = resp.body.split(`<script id="__NEXT_DATA__" type="application/json" crossorigin="anonymous">`)[1].split(`</script>`)[0];
  j = JSON.parse(j);
  for (var c in j.props.pageProps.links) {
    if (j.props.pageProps.links[c].url) {
      l.push(j.props.pageProps.links[c].url);
    } else {
      var a = j.props.pageProps.account.id;
      var lk = parseInt(j.props.pageProps.links[c].id);
      var final = await ageGate(a, lk, url);
      if (typeof final == "string") {
        l.push(final);
      }
    }
  }
  for (var c in j.props.pageProps.socialLinks) {
    if (j.props.pageProps.socialLinks[c].url) {
      l.push(j.props.pageProps.socialLinks[c].url);
    } else {
      var a = j.props.pageProps.account.id;
      var lk = parseInt(j.props.pageProps.socialLinks[c].id);
      var final = await ageGate(a, lk, url);
      if (typeof final == "string") {
        l.push(final);
      }
    }
  }
  cb(null, l);
}

async function ageGate(account, link_id, ref) {
  var b = JSON.stringify({
    "accountId": account,
    "requestSource": { "referer": null },
    "validationInput": { "acceptedSensitiveContent": [link_id] }
  });
  let resp = await got.post("https://linktr.ee/api/profiles/validation/gates", {
    body: b,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      "Content-Length": utils.totalBytes(b),
      "DNT": "1",
      "Origin": "https://linktr.ee",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
      "Connection": "keep-alive",
      "Pragma": "no-cache",
      "Sec-GPC": "1",
      "Referer": ref,
      "Upgrade-Insecure-Requests": "1"
    }
  })
  return JSON.parse(resp.body).links[0].url;
}