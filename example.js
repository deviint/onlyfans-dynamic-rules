// TODO: Implement error handling!

// Example library to fetch data from the OF API
class OFAPI {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._baseUrl = "https://api.ofapi.xyz";
    }

    // Method to get rules
    async getRules() {
        const response = await fetch(this._baseUrl + `/rules`, {
            headers: {
                'apiKey': this._apiKey
            }
        });
        return response.json();
    }

    // Method to sign a request
    async signRequest(endpoint) {
        const response = await fetch(this._baseUrl + `/sign`, {
            method: 'POST',
            headers: {
                'apiKey': this._apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({endpoint: endpoint})
        });
        return response.json();
    }

    // Wrapper function to fetch data from any URL
    async fetch(url, userData) {
        // Sign the request first
        const signedHeaders = await this.signRequest(url);

        // Fetch the OF API data using the signed headers
        const response = await fetch(url, {
            headers: {...signedHeaders, ...userData}
        });

        return response.json();
    }
}


const ofapi = new OFAPI("MY_API_KEY");

// Example usage
const streams = await ofapi.fetch(
    "https://onlyfans.com/api2/v2/streams/feed?limit=10&skip_users=all", 
    {
        "x-bc": '8g6756r78hioe45e65tuhads12',
        cookie: 'sess=37892uhdfoskjdsiagyiqewads1',
        "user-agent": 'Mozilla .........'
    }
)

// do something with the fetched data...
