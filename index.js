const e = require("express");
const express = require("express");
const app = express();
const fs = require("fs");
const url = require("url");
const extractors = require("./extractors");

if (!fs.existsSync(`${__dirname}/config.json`)) {
  fs.copyFileSync(`${__dirname}/config.example.json`, `${__dirname}/config.json`);
}

const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

app.listen(config.port, function() {
  console.log(`Server is listening on ${config.port}`);
});

app.use(express.static(`${__dirname}/static/`));

app.get("/api/bypass", function(req, res) {
  var u = url.parse(req.url, true);
  if (u.query.url) {
    var requestedUrl = Buffer.from(u.query.url, "base64").toString("ascii");
    if (extractors.getType(requestedUrl).needsExternalCaptchaSolving == true && config.externalCaptchaProvider.active == false) {
      res.send({
        success: false,
        err: "This type of link is not supported by this instance."
      });
    } else {
      extractors.bypass({
        url: requestedUrl,
        site: extractors.getType(requestedUrl).site,
        captcha: {
          needed: extractors.getType(requestedUrl).needsExternalCaptchaSolving,
          service: config.externalCaptchaProvider.service,
          key: config.externalCaptchaProvider.key
        }
      }, function(err, resp) {
        if (err && err !== null) {
          res.send({
            success: false,
            err: err.stack || err.message || err
          });
        } else {
          if (typeof resp == "string") {
            res.send({
              success: true,
              destination: resp
            });
          } else if (typeof resp == "object") {
            if (resp.length > 1) {
              res.send({
                success: true,
                destinations: resp
              });
            } else {
              res.send({
                success: true,
                destination: resp[0]
              });
            }
          } else {
            res.send({
              success: false,
              err: "Recieved invalid response from backend."
            });
          }
        }
      })
    }
    
  } else {
    res.send({
      success: false,
      err: "URL is required for this parameter."
    });
  }
});

app.get("/api/officially-supported", function(req, res) {
  var u = url.parse(req.url, true);
  if (u.query.url) {
    var requestedUrl = Buffer.from(u.query.url, "base64").toString("ascii");
    var t = extractors.getType(requestedUrl);
    if (t == "generic") {
      res.send({
        "success": true,
        "result": "maybe"
      });
    } else {
      res.send({
        "success": true,
        "result": "yes"
      });
    }
  } else {
    res.send({
      "success": false,
      "result": "no"
    });
  }
})