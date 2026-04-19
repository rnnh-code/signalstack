import os
import requests
import base64
from dotenv import load_dotenv

# Load environment variables
print("Testing Reddit API credentials with direct requests...")
load_dotenv()

# Get credentials
client_id = os.getenv("REDDIT_CLIENT_ID")
client_secret = os.getenv("REDDIT_CLIENT_SECRET")

if not client_id or not client_secret:
    print("ERROR: Missing credentials in .env file")
    exit(1)

print(f"Using client_id starting with: {client_id[:4]}****")

# Reddit OAuth endpoint
auth_url = "https://www.reddit.com/api/v1/access_token"

# Create HTTP Basic Auth string (this is how Reddit expects app credentials)
auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()

# Set up headers
headers = {
    "Authorization": f"Basic {auth_header}",
    "User-Agent": "SignalStack/0.1"
}

# Set up data payload
data = {
    "grant_type": "client_credentials",  # For app-only auth without user context
}

try:
    print("\nAttempting to authenticate with Reddit API...")
    response = requests.post(auth_url, headers=headers, data=data)
    
    print(f"Response status code: {response.status_code}")
    
    if response.status_code == 200:
        print("SUCCESS! Credentials authenticated successfully.")
        print(f"Response data: {response.json()}")
    else:
        print(f"ERROR: Authentication failed with status: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 401:
            print("\nPossible causes for 401 Unauthorized:")
            print("1. Client ID or Secret might be incorrect")
            print("2. App may be inactive or suspended on Reddit")
            print("3. Rate limiting or temporary Reddit API issues")
    
except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {str(e)}")
