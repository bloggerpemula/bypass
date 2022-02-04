# API

Here are all the API endpoints you can use with BypassItForMe. If you plan on using the [main instance](https://bifm.tacohitbox.com), please [contact me](https://tacohitbox.com/contact) as I'm interested in seeing what you're doing with it..

## GET ``/cache-enabled``

Determines if a server [has their cache DB enabled](./cache.md).

### Response

Either a plain text ``true`` or ``false``. ``true`` meaning that the server **does** have their cache enabled. ``false`` meaning that the server has their cache disabled.

## GET ``/fastforward-enabled``

Determines if a server gets and shares responses from the [FastFoward Crowd Bypass service.](https://github.com/FastForwardTeam/FastForward/blob/main/PRIVACY.md#crowd-bypass)

### Response

Either a plain text ``true`` or ``false``. ``true`` meaning that the server **does** have their cache enabled. ``false`` meaning that the server has their cache disabled.

## GET ``/api/bypass``

Bypasses one link given by the parameters below.

### Parameters

|Parameter|Meaning|Required|
|---|---|---|
|``url``|[``string``]A base-64 encoded string containing the requested URL to be bypassed|Yes
|``pass``|[``string``] A base-64 encoded string containing the password to unlock the URL|If applicable|
|``bypassCache``|[``true``/``false``] Determines if you want to bypass the server cache. ``true`` meaning you **want** to bypass the server's cache. Only applicable to cache-enabled server.|No
|``allowCache``|[``true``/``false``] Determines if you want the server to cache your answer. ``false`` meaning to **not** cache the answer. Only applicable to cache-enabled server.|No
|``incorrectCache``|[``true``/``false``] Determines if the response previously given was incorrect. Removes link in cache to replace it with a new one. With ``true`` meaning that the previous response **was** incorrect. Only applicable to FF-enabled server.|No
|``bypassFF``|[``true``/``false``] Determines if you want to bypass checking the FastForward servers for a bypassed link.|No
|``allowFF``|[``true``/``false``] Determines if you want the server to send the response to FastForward's Crowd Bypass service. With ``false`` meaning to **not** send the answer. Only applicable to cache-enabled server.|No
|``incorrectFF``|[``true``/``false``] Determines if the response previously given from FastForward was incorrect. With``true`` meaning that the previous response **was** incorrect. Only applicable to FF-enabled server.|No

### Response

Successful response that was in the cache with one link.

```json
{
  "success": true,
  "cache": true,
  "fastforward": false,
  "destination": "http://github.com/tacohitbox/bypass-it-for-me"
}
```

Successful response with more than one link, wasn't previously in cache.
```json
{
  "success": true,
  "cache": false,
  "fastforward": false,
  "destinations": [
    "http://github.com/tacohitbox/bypass-it-for-me",
    "https://tacohitbox.com"
  ]
}
```

Error response.

```json
{
  "success": false,
  "err": "No redirects found."
}
```