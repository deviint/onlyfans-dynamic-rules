import requests
import json

# Example library to fetch data from the OF API
class OFAPI:
    def __init__(self, apiKey):
        self._apiKey = apiKey
        self._baseUrl = "https://ofapi.xyz"

    # Method to check token balance
    def checkTokenBalance(self):
        response = requests.get(self._baseUrl + "/balance", headers={'api_key': self._apiKey})
        return response.json()

    # Method to get rules
    def getRules(self):
        response = requests.get(self._baseUrl + "/rules", headers={'api_key': self._apiKey})
        return response.json()

    # Method to sign a request
    def signRequest(self, data):
        response = requests.post(self._baseUrl + "/sign", headers={'api_key': self._apiKey, 'Content-Type': 'application/json'}, data=json.dumps(data))
        return response.json()

    # Wrapper function to fetch data from any URL
    def fetch(self, url, userData):
        # Sign the request first
        signedHeaders = self.signRequest({
            'url': url,
            'method': 'GET',
            **userData
        })

        # Fetch the OF API data using the signed headers
        response = requests.get(url, headers=signedHeaders)

        return response.json()


ofapi = OFAPI("MY_API_KEY")

# Example usage
streams = ofapi.fetch(
    "https://onlyfans.com/api2/v2/streams/feed?limit=10&skip_users=all", 
    {
        'xbc': '8g6756r78hioe45e65tuhads12',
        'sess': '37892uhdfoskjdsiagyiqewads1',
        'user_id': '123456789',
        'user_agent': 'Mozilla .........'
    }
)

# do something with the fetched data...
