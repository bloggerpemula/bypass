const express = require("express");
const app = express();
const fs = require("fs");
const extractors = require("./extractors");
const {MongoClient} = require("mongodb");
const fastforward = require("./fastforward");
const e = require("express");

if (!fs.existsSync(`${__dirname}/config.json`)) {
  var base_conf = JSON.parse(fs.readFileSync(`${__dirname}/config.example.json`))
  if (process.env.CAPTCHA_ENABLED) base_conf.externalCaptchaProvider.active = process.env.CAPTCHA_ENABLED;
  if (process.env.CAPTCHA_SERVICE) base_conf.externalCaptchaProvider.service = process.env.CAPTCHA_SERVICE;
  if (process.env.CAPTCHA_KEY) base_conf.externalCaptchaProvider.key = process.env.CAPTCHA_KEY;
  if (process.env.PORT) base_conf.port = process.env.PORT;
  if (process.env.FASTFORWARD) base_conf.port = process.env.FASTFORWARD;
  fs.writeFileSync(`${__dirname}/config.json`,JSON.stringify(base_conf, null, 2));
}

const config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`));

if (!config["db"]) {
  config["db"] = {enable: false, url: "mongodb://127.0.0.1:27017/bifm"};
  fs.writeFileSync(`${__dirname}/config.json`, JSON.stringify(config, null, 2));
  console.log("Please restart the server.");
  process.exit();
}

const client = new MongoClient(config["db"]["url"]);

if (config["db"]["enable"]) {
  (async function() {
    await client.connect();
    console.log("Successfully connected to DB.")
  })()
}

app.listen(config.port, function() {
  console.log(`Server is listening on ${config.port}`);
});

app.use(express.static(`${__dirname}/static/`));

app.get("/api/bypass", async function(req, res) {
  if (req.query.url) {
    var requestedUrl = Buffer.from(req.query.url, "base64").toString("ascii");
    if (req.query.pass) {
      var pass = Buffer.from(req.query.pass, "base64").toString("ascii");
    } else {
      var pass = null;
    }

    if (config["db"]["enable"] && req.query.bypassCache !== "true" && req.query.incorrectCache !== "true" && req.query.incorrectFF !== "true") {
      const db = client.db("bifm");
      const cl = db.collection("links");
      const f = await cl.find({url: requestedUrl}).toArray();
      if (f[0]) {
        if (f[0].hadPassword == false || f[0].hadPassword == true && f[0].password == pass) {
          if (typeof f[0].response == "object" && f[0].response.length > 1) {
            res.send({
              success: true,
              cache: true,
              fastforward: false,
              destinations: f[0].response,
              "cache-date": f[0].date
            });
            return;
          } else if (typeof f[0].response == "string" || typeof f[0].response == "object" && f[0].response.length == 1) {
            res.send({
              success: true,
              cache: true,
              fastforward: false,
              destination: f[0].response,
              "cache-date": f[0].date
            });
            return;
          }
        }
      }
    } else if (config["db"]["enable"] && req.query.incorrectCache == "true") {
      const db = client.db("bifm");
      const cl = db.collection("links");
      cl.findOneAndDelete({url: requestedUrl}).catch(function(err) {
        res.send({
          success: false,
          err: (err.stack || err.message || err.code || err)
        });
      });
    }

    if (config["fastforward"] == true && req.query.ignoreFF !== "true" && req.query.incorrectFF !== "true" && pass == null) {
      fastforward.query(requestedUrl, async function(err, resp) {
        if (err) {
          if (typeof err == "string") {
            if (err !== "Not in database." && err !== "Not crowd-bypassable.") console.log(err);
          } else if (typeof err == "object"){
            if (err.event !== "response") console.log(err);
          }
          bypass(requestedUrl, pass, req, res);
        } else {
          if (config["db"]["enable"] && req.query.allowCache !== "false") {
            const db = client.db("bifm");
            const cl = db.collection("links");
            const f = await cl.find({url: requestedUrl}).toArray();
            if (!f[0] || req.query.incorrectCache == "true") {
              cl.insertOne({
                url: requestedUrl,
                response: resp,
                date: new Date().toTimeString(),
                hadPassword: false,
                password: null
              });
            }
          }
          res.send({
            success: true,
            destination: resp,
            cache: false,
            fastforward: true
          });
        }
      });
    } else {
      bypass(requestedUrl, pass, req, res);
    }
  } else {
    res.send({
      success: false,
      err: "URL is required for this parameter."
    });
  }
});

app.get("/api/officially-supported", function(req, res) {
  if (req.query.url) {
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
});

app.get("/cache-enabled", function(req, res) {
  res.send(config["db"]["enable"])
});

app.get("/fastforward-enabled", function(req, res) {
  res.send((config["fastforward"] || false));
});

function bypass(requestedUrl, pass, req, res) {
  if (extractors.getType(requestedUrl).needsExternalCaptchaSolving == true && config.externalCaptchaProvider.active == false) {
    res.send({
      success: false,
      err: "This bypass requires a CAPTCHA solver, but this instance doesn't support them."
    });
  } else {
    extractors.bypass({
      url: requestedUrl,
      site: extractors.getType(requestedUrl).site,
      password: pass,
      captcha: {
        needed: extractors.getType(requestedUrl).needsExternalCaptchaSolving,
        service: config.externalCaptchaProvider.service,
        key: config.externalCaptchaProvider.key
      }
    }, async function(err, resp, pw) {
      if (err && err !== null) {
        res.send({
          success: false,
          err: err.stack || err.message || err
        });
      } else {
        if (typeof resp == "string" && resp !== "") {
          if (config["db"]["enable"] && req.query.allowCache !== "false") {
            const db = client.db("bifm");
            const cl = db.collection("links");
            const f = await cl.find({url: requestedUrl}).toArray();
            if (!f[0] || req.query.incorrectCache == "true") {
              p = pw;
              if (p == undefined) p = false;
              cl.insertOne({
                url: requestedUrl,
                response: resp,
                date: new Date().toTimeString(),
                hadPassword: p,
                password: pass
              });
            }
          }
          if (config["fastforward"] == true) {
            fastforward.add(requestedUrl, resp, function(err, resp) {
              if (err) {
                if (typeof err == "string" && err !== "Not reported." && err !== "Not add-able.") {
                  console.log(err);
                } else if (typeof err !== "string") {
                  console.log(err);
                }
              }
            });
          }
          res.send({
            success: true,
            destination: resp,
            cache: false,
            fastforward: false
          });
        } else if (typeof resp == "object") {
          if (config["db"]["enable"] && req.query.allowCache !== "false") {
            const db = client.db("bifm");
            const cl = db.collection("links");
            const f = await cl.find({url: requestedUrl}).toArray();
            if (!f[0] || req.query.incorrectCache == "true") {
              p = pw;
              if (p == undefined) p = false;
              cl.insertOne({
                url: requestedUrl,
                response: resp,
                date: new Date().toTimeString(),
                hadPassword: p,
                password: pass
              });
            }
          }
          if (resp.length > 1) {
            res.send({
              success: true,
              destinations: resp,
              cache: false,
              fastforward: false
            });
          } else if (resp.length == 1) {
            if (config["fastforward"] == true && req.query.allowFF !== "false") {
              fastforward.add(requestedUrl, resp[0], function(err, resp) {
                if (err) {
                  if (typeof err == "string" && err !== "Not reported." && err !== "Not add-able.") {
                    console.log(err);
                  } else if (typeof err !== "string") {
                    console.log(err);
                  }
                }
              });
            }
            res.send({
              success: true,
              destination: resp[0],
              cache: false,
              fastforward: false
            });
          } else {
            res.send({
              success: false,
              err: "Recieved invalid response from backend."
            });
          }
        } else {
          res.send({
            success: false,
            err: "Recieved invalid response from backend."
          });
        }
      }
    });
  }
}