import time
from urllib.parse import urlparse
import hashlib
import os
import aiohttp
from typing import TypedDict

from typing import List, TypedDict

class Rules(TypedDict):
    static_param: str
    checksum_indexes: List[int]
    checksum_constant: int
    start: str
    end: str

class Body(TypedDict):
    endpoint: str
    time: str
    user_id: str

class Sign(TypedDict):
    sign: str
    time: str

async def sign_request(rules: Rules, body: Body) -> Sign:
    current_time: str = body.get('time') or str(int(time.time() * 1000))
    url = urlparse(body['endpoint'])

    msg: str = "\n".join([
        rules["static_param"],
        current_time,
        url.path + ('?' + url.query if url.query else ''),
        str(body.get("user-id", 0))
    ])

    sha_hash: str = hashlib.sha1(msg.encode('utf-8')).hexdigest()
    hash_ascii: bytes = sha_hash.encode('ascii')

    checksum: int = sum(hash_ascii[i] for i in rules["checksum_indexes"]) + rules["checksum_constant"]
    sign: str = ":".join([rules["start"], sha_hash, format(abs(checksum), 'x'), rules["end"]])

    return {
        "sign": sign,
        "time": current_time
    }


async def get_rules():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://api.ofauth.com/rules", headers={
            "apiKey": os.environ.get("OFAUTH_KEY")
        }) as res:
            if res.status != 200:
                raise Exception("Failed to fetch rules")
            else:
                data = await res.json()
                return data["rules"]

async def main():
    rules = await get_rules()

    make_of_request("https://onlyfans.com/api2/v2/users/me", {
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "xbc": "9fdshdiah9283odsjsjkdfhkdssdkjfh",
        "cookie": "sess=9fdshdiah9283odsjsjkdfhkdssdkjfh"
    }, rules)


class User(TypedDict):
    id: str
    userAgent: str
    xbc: str
    cookie: str


async def make_of_request(url: str, user: User, rules: Rules) -> aiohttp.ClientResponse:
    sign = await sign_request(rules, {"endpoint": url, "user-id": user["id"]})
    headers = {
        "access-token": rules["access_token"],
        "user-id": user["id"],
        "user-agent": user["userAgent"],
        "x-bc": user["xbc"],
        "cookie": user["cookie"],
        **sign
    }
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url, headers=headers) as response:
            return response
