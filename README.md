# If you use this, please give this repo a star to keep it live!

This free version is maintained and updated a few days after OFAPI subscribers have received them.

- [Info about this repo](https://github.com/deviint/onlyfans-dynamic-rules/discussions/15)
- If your use case requires the latest signing values, check out [<img src=".github/OFAPI.png" alt="OF API" width="10%">](https://ofapi.xyz)

-----------------

Direct link: `https://raw.githubusercontent.com/deviint/onlyfans-dynamic-rules/main/dynamicRules.json`

Usage (JavaScript)
```javascript
const time = +new Date()
const url = new URL(fullUrl)
const msg = [
    dynamicRules["static_param"],
    time,
    url.pathname + url.search,
    userId
].join("\n")
const shaHash = sha1(msg);
const hashAscii = Buffer.from(shaHash, 'ascii');

const checksum = dynamicRules["checksum_indexes"].reduce((result, value) => result + hashAscii[value], 0) + dynamicRules["checksum_constant"];
const sign = [dynamicRules["start"], shaHash, Math.abs(checksum).toString(16), dynamicRules["end"]].join(":")
// output: {sign, time}
```
-----------------

> For OnlyFans API inquiries, OnlyFans consulting, OnlyFans product/service advice [email deviint@proton.me](mailto:deviint@proton.me) .
> I have extensive knowledge of all things related to OnlyFans' inner workings and API.

[@onlyfansrich ![@onlyfansrich](https://img.icons8.com/color/18/twitter--v1.png)](http://twitter.com/onlyfansrich)
