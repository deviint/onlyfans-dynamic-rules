// type Rules = {
//     static_param: string
//     checksum_indexes: number[]
//     checksum_constant: number
//     start: string
//     end: string
//     [key: string]: any ... the other keys
// }

// type Body = {
//     endpoint: string
//     "user-id"?: string
//     time?: string
// }

async function signRequest(rules, body) {
    const time = body?.time || (+new Date()).toString()
    const url = new URL(body.endpoint, "https://onlyfans.com")

    const msg = [
        rules["static_param"],
        time,
        url.pathname + url.search,
        body?.["user-id"] || 0
    ].join("\n")
    const shaHash = sha1(msg);
    const hashAscii = Buffer.from(shaHash, 'ascii');

    const checksum = rules["checksum_indexes"].reduce((result, value) => result + hashAscii[value], 0) + rules["checksum_constant"];
    const sign = [rules["start"], shaHash, Math.abs(checksum).toString(16), rules["end"]].join(":")

    return {
        sign, time
    }
}

async function getRules() {
    const res = await fetch("https://api.ofauth.com/rules", {
        headers: {
            "apiKey": process.env.OFAUTH_KEY
        }
    })

    if (res.status !== 200) {
        throw new Error("Failed to fetch rules")
    }else{
        const data = await res.json()
        return data.rules
    }
}

const rules = await getRules()

// type User = {
//     id: string
//     userAgent: string
//     xbc: string
// }
export async function makeOFRequest(url, user) {
    const sign = await signRequest(rules, {endpoint: url, "user-id": user.id})
    const res = await fetch(url, {
        headers: {
            "access-token": rules.access_token,
            "user-id": user.id,
            "user-agent": user.userAgent,
            "x-bc": user.xbc,
            ...sign
        }
    })

    return res
}
