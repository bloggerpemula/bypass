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
const generic = require("./generic");

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
    case "tei":
      tei.bypass(obj.url, function(err, resp) {
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
        "hasCaptcha": false
      };
    case "linkvertise.com":
    case "linkvertise.net":
    case "up-to-down.net":
    case "link-to.net":
    case "direct-link.net":
      return {
        "site": "linkvertise",
        "hasCaptcha": false
      };
    case "www.shortly.xyz":
    case "shortly.xyz":
      return {
        "site": "shortly",
        "hasCaptcha": false
      }
    case "sub2unlock.com":
    case "www.sub2unlock.com":
    case "sub2unlock.net":
    case "www.sub2unlock.net":
      return {
        "site": "sub2unlock",
        "hasCaptcha": false
      };
    case "shortconnect.com":
    case "www.shortconnect.com":
      return {
        "site": "shortconnect",
        "hasCaptcha": false
      };
    case "boost.ink":
    case "bst.wtf":
    case "booo.st":
    case "bst.gg":
      return {
        "site": "boostink",
        "hasCaptcha": false
      };
    case "adfoc.us":
      return {
        "site": "adfocus",
        "hasCaptcha": false
      };
    case "ity.im":
      return {
        "site": "ityim",
        "hasCaptcha": false
      };
    case "tei.ai":
    case "tii.ai":
      return {
        "site": "tei",
        "hasCaptcha": false
      };
    default:
      return {
        "site": "generic",
        "hasCaptcha": false
      };
  }
}