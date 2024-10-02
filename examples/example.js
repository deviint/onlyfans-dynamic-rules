/**
 * @typedef {Object} Rules
 * @property {string} static_param - Static parameter for signing
 * @property {number[]} checksum_indexes - Indexes used for checksum calculation
 * @property {number} checksum_constant - Constant value added to checksum
 * @property {string} start - Start string for the signature
 * @property {string} end - End string for the signature
 * @property {*} [key: string] - Other potential keys in the rules object
 */

/**
 * @typedef {Object} Body
 * @property {string} endpoint - The API endpoint
 * @property {string} [user-id] - Optional user ID
 * @property {string} [time] - Optional timestamp
 */

/**
 * @typedef {Object} Sign
 * @property {string} sign - The generated signature
 * @property {string} time - The timestamp used for signing
 */

/**
 * Signs a request to the OnlyFans API
 * @param {Rules} rules - The rules for signing the request
 * @param {Body} body - The request body
 * @returns {Promise<Sign>} The signed request
 */
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

/**
 * @typedef {Object} User
 * @property {string} id - The user's ID
 * @property {string} userAgent - The user's user agent string
 * @property {string} xbc - The user's XBC value
 * @property {string} cookie - The user's cookie
 */

/**
 * Makes a request to OnlyFans API
 * @param {string} url - The URL to make the request to
 * @param {User} user - The user object containing necessary information
 * @returns {Promise<Response>} The response from the API
 */
export async function makeOFRequest(url, user) {
    const sign = await signRequest(rules, {endpoint: url, "user-id": user.id})
    const res = await fetch(url, {
        headers: {
            "access-token": rules.access_token,
            "user-id": user.id,
            "user-agent": user.userAgent,
            "x-bc": user.xbc,
            "cookie": user.cookie,
            ...sign
        }
    })

    return res
}

