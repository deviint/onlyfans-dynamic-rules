### If you use this, give this repo a star to keep it live

Rules are checked for updates every hour.

Direct link: `https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json`

Usage (JavaScript)
```javascript
const time = +new Date()
const url = new URL(fullUrl)
const msg = [
    dynamicRules["static_param"],
    time,
    url.path + url.query,
    userId
].join("\n")
const shaHash = sha1(msg);
const hashAscii = Buffer.from(shaHash, 'ascii');

const checksum = dynamicRules["checksum_indexes"].reduce((result, value) => result + hashAscii[value], 0) + dynamicRules["checksum_constant"];
const sign = [dynamicRules["start"], shaHash, Math.abs(checksum).toString(16), dynamicRules["end"]].join(":")
// output: {sign, time}
```


For OnlyFans API inquiries, OnlyFans consulting, OnlyFans product/server advice DM me [@onlyfansrich ![@onlyfansrich](https://img.icons8.com/color/18/twitter--v1.png)](http://twitter.com/onlyfansrich)
I have deep and extensive knowledge of all things related to OnlyFans' inner workings and API.
