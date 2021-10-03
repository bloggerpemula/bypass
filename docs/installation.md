# Installation
This guide assumes you have Node, NPM, and Git installed and working on your system.

## Setup
Setup is really simple on your server. You only need to run a few commands in your terminal.

```
git clone https://git.files.gay/tacohitbox/bypass-it-for-me
cd bypass-it-for-me
npm i 
node .
```

The final command, ``node .``, generates a ``config.json`` file that configures your server for you. The default file should look like this: 

```json
{
  "externalCaptchaProvider": {
    "active": false,
    "service": "n/a",
    "key": "n/a"
  },
  "port": 32333
}
```

Some sites need a Captcha solving service to work properly. Here's how you can set that up:

1. Set ``active`` in ``externalCaptchaProvider`` to ``true``.
2. Set ``service`` in ``externalCaptchaProvider`` to either ``2captcha`` or ``anticaptcha``, depending on what service you use.
3. Set ``key`` in ``externalCaptchaProvider`` to your API key.

You can also set your port in the ``port`` option.