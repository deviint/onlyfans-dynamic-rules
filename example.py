import requests
import json

class OFAPI:
    def __init__(self, api_key):
        self._api_key = api_key
        self._base_url = "https://api.ofapi.xyz"
    
    def get_rules(self):
        try:
            response = requests.get(f"{self._base_url}/rules", headers={'apiKey': self._api_key})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting rules: {e}")
            return None
    
    def sign_request(self, endpoint):
        try:
            response = requests.post(f"{self._base_url}/sign", 
                                     headers={
                                         'apiKey': self._api_key,
                                         'Content-Type': 'application/json'
                                     },
                                     data=json.dumps({'endpoint': endpoint}))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error signing request: {e}")
            return None
    
    def fetch(self, url, user_data):
        try:
            signed_headers = self.sign_request(url)
            if signed_headers is None:
                return None
            
            headers = {**signed_headers, **user_data}
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from {url}: {e}")
            return None

# Example usage
ofapi = OFAPI("MY_API_KEY")

streams = ofapi.fetch(
    "https://onlyfans.com/api2/v2/streams/feed?limit=10&skip_users=all", 
    {
        "x-bc": '8g6756r78hioe45e65tuhads12',
        "cookie": 'sess=37892uhdfoskjdsiagyiqewads1',
        "user-agent": 'Mozilla .........'
    }
)

if streams:
    # do something with the fetched data...
    print(streams)
else:
    print("Failed to fetch streams.")
