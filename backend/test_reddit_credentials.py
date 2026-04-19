import os
import praw
from dotenv import load_dotenv

# Load environment variables
print("Testing Reddit API credentials...")
env_path = os.path.join(os.getcwd(), '.env')
print(f"Looking for .env file at: {env_path}")
load_dotenv(dotenv_path=env_path)

# Get credentials
client_id = os.getenv("REDDIT_CLIENT_ID")
client_secret = os.getenv("REDDIT_CLIENT_SECRET")
user_agent = os.getenv("REDDIT_USER_AGENT", "SignalStack Test v0.1")

print(f"Client ID loaded: {bool(client_id)}")
print(f"Client Secret loaded: {bool(client_secret)}")

if not client_id or not client_secret:
    print("ERROR: Missing credentials in .env file")
    exit(1)

try:
    print("\nAttempting to initialize Reddit API with read-only access...")
    # The simplest possible initialization
    reddit = praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent
    )
    
    print(f"PRAW initialized in read-only mode: {reddit.read_only}")
    
    # Try a simple API call
    print("\nAttempting to fetch subreddit info...")
    subreddit = reddit.subreddit("oralcare")
    print(f"Subreddit name: {subreddit.display_name}")
    print(f"Subreddit title: {subreddit.title}")
    
    # Try fetching a post
    print("\nAttempting to fetch a post...")
    for post in subreddit.hot(limit=1):
        print(f"Post title: {post.title}")
        print(f"Post score: {post.score}")
    
    print("\nSUCCESS: Reddit API credentials are valid and working!")
    
except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {str(e)}")
    print("\nPossible solutions:")
    print("1. Verify your client_id and client_secret are correct")
    print("2. Ensure you created a 'script' type application on Reddit")
    print("3. Check if your Reddit account has verified email")
    print("4. Ensure your Reddit app is properly configured on https://www.reddit.com/prefs/apps")
