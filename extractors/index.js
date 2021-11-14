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
const tinyis = require("./tinyis");
const youtube = require("./youtube");
const cpmlink = require("./cpmlink");
const tooyul = require("./tooyul");
const exe = require("./exe");
//const ml = require("./mylink");
const boostme = require("./boostme");
const mboost = require("./mboost");
const catcut = require("./catcut");
const sub2get = require("./sub2get");
const reko = require("./rekonise");
const lb = require("./letsboost");
const s4u = require("./sub4unlock");
const sfu = require("./subforunlock");
//const al = require("./aylink");
const cutwin = require("./cutwin");

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
    case "tinyis":
      tinyis.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "youtube":
      youtube.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "cpmlink":
      cpmlink.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "tooyul":
      tooyul.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    /*case "exe":
      exe.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;*/
    /*case "mylink":
      ml.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;*/
    case "catcut":
      catcut.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "boostme":
      boostme.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "mboost":
      mboost.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "sub2get":
      sub2get.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "rekonise":
      reko.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "letsboost":
      lb.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "sub4":
      s4u.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    case "subfor":
      sfu.bypass(obj.url, function(err, resp) {
        cb(err, resp);
      });
    return;
    /*case "aylink":
      al.bypass(obj, function(err, resp) {
        cb(err, resp);
      });
    return;*/
    case "cutwin":
      cutwin.bypass(obj, function(err, resp) {
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
    case "linkvertise.download":
    case "file-link.net":
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
    case "adyou.co":
    case "adyou.ws":
      return {
        "site": "adyoume",
        "needsExternalCaptchaSolving": false
      };
    case "ouo.io":
    case "ouo.press":
      return {
        "site": "ouo",
        "needsExternalCaptchaSolving": true
      };
    case "tinyurl.is":
      return {
        "site": "tinyis",
        "needsExternalCaptchaSolving": false
      };
    case "yt.be":
    case "youtu.be":
    case "youtube.com":
    case "www.youtube.com":
      return {
        "site": "youtube",
        "needsExternalCaptchaSolving": false
      };
    case "cpmlink.net":
      return {
        "site": "cpmlink",
        "needsExternalCaptchaSolving": true
      };
    case "tooyul.co":
      return {
        "site": "tooyul",
        "needsExternalCaptchaSolving": false
      };
    /*case "exe.io":
    case "exey.io":
      return {
        "site": "exe",
        "needsExternalCaptchaSolving": true
      };*/
    /*case "mylink.cloud":
    case "mylink.vc":
    case "mylink.name":
    case "mylink.cx":
    case "mylink.st":
    case "myl.li":
      return {
        "site": "mylink",
        "needsExternalCaptchaSolving": true
      };*/
    case "boostme.link":
    case "boost.fusedgt.com":
      return {
        "site": "boostme",
        "needsExternalCaptchaSolving": false
      };
    case "mboost.me":
      return {
        "site": "mboost",
        "needsExternalCaptchaSolving": false
      };
    case "catcut.net":
      return {
        "site": "catcut",
        "needsExternalCaptchaSolving": true
      };
    case "sub2get.com":
      return {
        "site": "sub2get",
        "needsExternalCaptchaSolving": false
      };
    case "rekonise.com":
      return {
        "site": "rekonise",
        "needsExternalCaptchaSolving": false
      };
    case "letsboost.net":
      return {
        "site": "letsboost",
        "needsExternalCaptchaSolving": false
      };
    case "sub4unlock.com":
    case "shorte.be":
      return {
        "site": "sub4",
        "needsExternalCaptchaSolving": false
      };
    case "subforunlock.com":
      return {
        "site": "subfor",
        "needsExternalCaptchaSolving": false
      };
    /*case "aylink.co":
      return {
        "site": "aylink",
        "needsExternalCaptchaSolving": false
      };*/
    case "cutw.in": 
    //https://cutw.in/EEghr
      return {
        "site": "cutwin",
        "needsExternalCaptchaSolving": true
      };
    default:
      return {
        "site": "generic",
        "needsExternalCaptchaSolving": false
      };
  }
}