const anticaptcha = require("@antiadmin/anticaptchaofficial");
const two = require("2captcha");

exports.totalBytes = function(string) {
  return encodeURI(string).split(/%..|./).length - 1;
}

exports.cookieString = function (cookie) {
  var s = "";
  for (var c in cookie) {
    if (cookie[c].value == "deleted") {continue;}
    s = `${s} ${cookie[c].name}=${encodeURIComponent(cookie[c].value)};`;
  }
  var s = s.substring(1);
  return s.substring(0, s.length - 1)
}

exports.captcha = function(obj, cb) {
  /*
    object reference

    ref: referer href,
    meta: {
      sitekey: sk,
      type: "recaptcha", "hcaptcha"
    },
    service: {
      needed: true, 
      service: [solving service],
      key: [solver key]
    }
  */
  switch (obj.service.service) {
    case "anticaptcha":
      anticaptcha.setAPIKey(obj.service.key);
      anticaptcha.shutUp();
      if (obj.meta.type == "recaptcha") {
        anticaptcha.solveRecaptchaV2Proxyless(obj.ref, obj.meta.sitekey).then(function(resp) {
          cb(null, {
            token: resp
          });
        }).catch(function(err) {
          cb(err, null);
        });
      } else if (obj.meta.type == "hcaptcha") {
        anticaptcha.solveHCaptchaProxyless(obj.ref, obj.meta.sitekey).then(function(resp) {
          cb(null, {
            token: resp
          });
        }).catch(function(err) {
          cb(err, null);
        });
      } else if (obj.meta.type == "image") {
        anticaptcha.solveImage(obj["meta"]["image"]).then(function(resp) {
          cb(null, {
            token: resp  
          });
        }).catch(function(err) {
          cb(err, null);
        })
      } else {
        cb("Unsupported CAPTCHA type.", null);
      }
    return;

    case "2captcha":
      const tc = new two.Solver(obj.service.key);
      if (obj.meta.type == "recaptcha") {
        tc.recaptcha(obj.meta.sitekey, obj.ref).then(function(resp) {
          cb(null, {
            token: resp.data
          });
        }).catch(function(err) {
          cb(err, null);
        });
      } else if (obj.meta.type == "hcaptcha") {
        tc.hcaptcha(obj.meta.sitekey, obj.ref).then(function(resp) {
          cb(null, {
            token: resp.data  
          });
        }).catch(function(err) {
          cb(err, null);
        });
      } else if (obj.meta.type == "image") {
        tc.imageCaptcha(obj["meta"]["image"], obj["meta"]["options"]).then(function(resp) {
          cb(null, {
            data: resp.data  
          })
        }).catch(function(err) {
          cb(err, null);
        });
      } else {
        cb("Unsupported CAPTCHA type.", null);
      }
    return;

    default:
      cb("Captcha service is not yet supported.", null);
    return;
  }
}

exports.supportedCaptcha = function(n) {
  switch(n) {
    case "2captcha":
    case "anticaptcha":
      return true;
    default:
      return false;
  }
}

exports.decodeCFEmail = function(a) {
  var a = `/cdn-cgi/l/email-protection#${a}`;
  var s = a.indexOf(`/cdn-cgi/l/email-protection`);
  var m = a.length;

  if (a && s > -1 && m > 28) {
    var j = 28 + s;
    var s = '';
    if (j < m) {
      r = '0x' + a.substr(j, 2) | 0;
      for (j += 2; j < m && a.charAt(j) != 'X'; j += 2) s += '%' + ('0' + ('0x' + a.substr(j, 2) ^ r).toString(16)).slice(-2);
      j++;
      s = decodeURIComponent(s) + a.substr(j, m - j);
    }
    return s;
  } else {
    return null;
  }
}