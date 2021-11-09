const anticaptcha = require("@antiadmin/anticaptchaofficial");
const two = require("2captcha");

exports.totalBytes = function(string) {
  return encodeURI(string).split(/%..|./).length - 1;
}

exports.cookieString = function (cookie) {
  var s = "";
  for (var c in cookie) {
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
      } else {
        cb("Unsupported CAPTCHA type.", null);
      }
      
    return;

    default:
      cb("Captcha service is not yet supported.", null);
    return;
  }
}