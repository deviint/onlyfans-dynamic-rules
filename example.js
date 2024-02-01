// TODO: Implement error handling!

// Example library to fetch data from the OF API
class OFAPI {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._baseUrl = "https://ofapi.xyz";
    }

    // Method to check token balance
    async checkTokenBalance() {
        const response = await fetch(this._baseUrl + `/balance`, {
            headers: {
                'api-key': this._apiKey
            }
        });
        return response.json();
    }

    // Method to get rules
    async getRules() {
        const response = await fetch(this._baseUrl + `/rules`, {
            headers: {
                'api-key': this._apiKey
            }
        });
        return response.json();
    }

    // Method to sign a request
    async signRequest(data) {
        const response = await fetch(this._baseUrl + `/sign`, {
            method: 'POST',
            headers: {
                'api-key': this._apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    // Wrapper function to fetch data from any URL
    async fetch(url, userData) {
        // Sign the request first
        const signedHeaders = await this.signRequest({
            url: url,
            method: 'GET',
            ...userData
        });

        // Fetch the OF API data using the signed headers
        const response = await fetch(url, {
            headers: signedHeaders
        });

        return response.json();
    }
}


const ofapi = new OFAPI("MY_API_KEY");

// Example usage
const streams = await ofapi.fetch(
    "https://onlyfans.com/api2/v2/streams/feed?limit=10&skip_users=all", 
    {
        xbc: '8g6756r78hioe45e65tuhads12',
        sess: '37892uhdfoskjdsiagyiqewads1',
        user_id: '123456789',
        user_agent: 'Mozilla .........'
    }
)

// do something with the fetched data...
