const url = require("url");
const adshrink = require("./adshrink");
const linkvertise = require("./linkvertise");
const shortly = require("./shortly");
const sub2unlock = require("./sub2unlock");
const shortconnect = require("./shortconnect");
const boostink = require("./boostink");
const adfocus = require("./adfocus");
const ityim = require("./ityim");
const tei = require("./teiai");
const adyoume = require("./adyoume");
const ouo = require("./ouo");
const generic = require("./.generic");

exports.bypass = function(obj, cb) {
  switch(obj.site) {
    case "adshrink":
      adshrink.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "linkvertise":
      linkvertise.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "generic":
      generic.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "shortly":
      shortly.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "sub2unlock":
      sub2unlock.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "shortconnect":
      shortconnect.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "boostink":
      boostink.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "adfocus":
      adfocus.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "ityim":
      ityim.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "teiai":
      tei.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "adyoume":
      adyoume.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "ouo":
      ouo.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;
    default:
      cb("No valid site specified.", null);
    return;
  }
}

exports.getType = function(link) {
  var u = url.parse(link, true);
  switch(u.host) {
    case "adshrink.it":
      return {
        "site": "adshrink",
        "needsExternalCaptchaSolving": false
      };
    case "linkvertise.com":
    case "linkvertise.net":
    case "up-to-down.net":
    case "link-to.net":
    case "direct-link.net":
      return {
        "site": "linkvertise",
        "needsExternalCaptchaSolving": false
      };
    case "www.shortly.xyz":
    case "shortly.xyz":
      return {
        "site": "shortly",
        "needsExternalCaptchaSolving": false
      }
    case "sub2unlock.com":
    case "www.sub2unlock.com":
    case "sub2unlock.net":
    case "www.sub2unlock.net":
      return {
        "site": "sub2unlock",
        "needsExternalCaptchaSolving": false
      };
    case "shortconnect.com":
    case "www.shortconnect.com":
      return {
        "site": "shortconnect",
        "needsExternalCaptchaSolving": false
      };
    case "boost.ink":
    case "bst.wtf":
    case "booo.st":
    case "bst.gg":
      return {
        "site": "boostink",
        "needsExternalCaptchaSolving": false
      };
    case "adfoc.us":
      return {
        "site": "adfocus",
        "needsExternalCaptchaSolving": false
      };
    case "ity.im":
      return {
        "site": "ityim",
        "needsExternalCaptchaSolving": false
      };
    case "tei.ai":
    case "tii.ai":
      return {
        "site": "teiai",
        "needsExternalCaptchaSolving": false
      };
    case "adyou.me":
      return {
        "site": "adyoume",
        "needsExternalCaptchaSolving": true
      };
    case "ouo.io":
    case "ouo.press":
      return {
        "site": "ouo",
        "needsExternalCaptchaSolving": true
      };
    default:
      return {
        "site": "generic",
        "needsExternalCaptchaSolving": false
      };
  }
}