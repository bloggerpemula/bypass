# MongoDB Caching

You can now cache results using a MongoDB database to save bandwidth or money on your Captcha solver.

## Installation

1. [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/) for your OS.
2. Open a terminal and run ``mongo`` to open the Mongo shell, and make a DB for BIFM via ``use bifm``.
3. Edit your ``config.json`` file to something like it's shown below.

```json
{
  "externalCaptchaProvider": {
    "active": true,
    "service": "[redacted]",
    "key": "[redacted]"
  },
  "port": 32333,
  "db": {
    "enable": true,
    "url": "mongodb://127.0.0.1:27017/bifm"
  }
}
```

## Differences

These are the key differences, both visually and behind the scenes to BIFM with this option enabled in the config.

### Off

#### Visual

![A BIFM instance with the database turned off.](https://i.ibb.co/fn5FFv2/image.png)

As you can see, it looks like BIFM pre-the February 1st update.

#### BTS

Generally, highly requested links with Captchas both on and off will be slower with this cache off.

### On

#### Visual

![A BIFM instance with the database turned on.](https://i.ibb.co/tmWKMsb/image.png)

As you can see, this option gives the user the option to ignore the database's cache and to not cache their response.

#### BTS

New options are given on the API and frontend of our server.

These options include ignoring our server's cache and not allowing the server to cache the response given.

Users may want to do this for their privacy's sake so the instance operator can't see the links they ask for. 

Although we only log the links requested, the response our server gave out, and the time of the request, if the request is successful. This may make users uncomfortable, hence why this option exists.

Users may also notice a boost in speed because of the server not needing to request a page *everytime* a URL is requested, if they choose to allow our cache.