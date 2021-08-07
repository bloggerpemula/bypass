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
      type: "recaptcha"
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
      anticaptcha.solveRecaptchaV2Proxyless(obj.ref, obj.meta.sitekey).then(function(resp) {
        cb(null, {
          token: resp
        });
      }).catch(function(err) {
        cb(err, null);
      })
    return;

    case "2captcha":
      const tc = new two.Solver(obj.service.key);
      tc.recaptcha(obj.meta.sitekey, obj.ref).then(function(resp) {
        cb(null, {
          token: resp
        });
      }).catch(function(err) {
        cb(err, null);
      });
    return;

    default:
      cb("Captcha service is not yet supported.", null);
    return;
  }
}