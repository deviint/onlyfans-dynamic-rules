Rules are checked for updates every hour, and automatically updated here.

Direct link: `https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json`

Usage (JavaScript)
```javascript
const time = +new Date()
const msg = [
    dynamicRules["static_param"],
    time,
    url,
    userId
].join("\n")
const shaHash = sha1(msg);
const hashAscii = Buffer.from(shaHash, 'ascii');

const checksum = dynamicRules["checksum_indexes"].reduce((result, value) => result + hashAscii[value], 0) + dynamicRules["checksum_constant"];
const sign = [dynamicRules["start"], shaHash, Math.abs(checksum), dynamicRules["end"]].join(":")
// output: {sign, time}
```


coders who want to build OF tools dm [@onlyfansrich ![@onlyfansrich](https://img.icons8.com/color/18/twitter--v1.png)](http://twitter.com/onlyfansrich)
