# API

Here are all the API endpoints you can use with BypassItForMe. If you plan on using the [main instance](https://bifm.tacohitbox.com), please [contact me](https://tacohitbox.com/) as I'm interested in seeing.

## GET ``/api/bypass``

### Parameters

- ``url`` is a **BASE 64 encoded** string containing the requested URL to be bypassed

### Response

Successful response with one link.

```json
{
  "success": true,
  "destination": "https://git.foreskin.live/tacohitbox/bypass-it-for-me"
}
```

Error response.

```json
{
  "success": false,
  "err": "No redirects found."
}
```