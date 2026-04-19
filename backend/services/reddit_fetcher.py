import requests
import time

# This version uses Reddit's public JSON API instead of PRAW to avoid authentication issues

def fetch_subreddit_posts(subreddit_name: str, limit: int = 10):
    """Fetches posts from a subreddit using Reddit's public JSON API.
    
    This method doesn't require authentication, which avoids the 401 issues
    with the Reddit API credentials.
    
    Args:
        subreddit_name: Name of the subreddit without the 'r/' prefix
        limit: Maximum number of posts to return
        
    Returns:
        List of post dictionaries or error dictionary
    """
    print(f"Fetching {limit} posts from r/{subreddit_name} using public JSON API...")
    
    # Construct the URL for the subreddit's JSON feed
    url = f"https://www.reddit.com/r/{subreddit_name}/hot.json?limit={limit}"
    
    # Set a custom user agent to avoid 429 rate limiting issues
    headers = {
        "User-Agent": "SignalStack MVP v0.1 (by u/deepgrowthtrader)"
    }
    
    try:
        # Make the request to the Reddit API
        response = requests.get(url, headers=headers)
        
        # Check if request was successful
        if response.status_code == 200:
            # Parse the JSON response
            data = response.json()
            
            # Extract the posts from the response
            posts = data.get("data", {}).get("children", [])
            
            # Process the posts into a format similar to what we had with PRAW
            results = []
            for post in posts:
                post_data = post.get("data", {})
                
                # Skip stickied posts if needed
                # if post_data.get("stickied", False):
                #     continue
                
                # Extract relevant data
                results.append({
                    "title": post_data.get("title", ""),
                    "score": post_data.get("score", 0),
                    "url": post_data.get("url", ""),
                    "permalink": post_data.get("permalink", ""),
                    "created_utc": post_data.get("created_utc", 0),
                    "text": post_data.get("selftext", "")
                })
            
            print(f"Successfully fetched {len(results)} posts from r/{subreddit_name}")
            # Print the titles of posts for better debugging
            print("Posts fetched:")
            for i, post in enumerate(results[:5]):
                print(f"  {i+1}. {post['title'][:60]}{'...' if len(post['title']) > 60 else ''}")
            if len(results) > 5:
                print(f"  ... and {len(results) - 5} more posts")
            return results
        else:
            print(f"Error: Reddit API returned status code {response.status_code}")
            return {"error": f"Reddit API returned status code {response.status_code}: {response.text}"}
            
    except requests.RequestException as e:
        print(f"Request error while fetching from Reddit: {e}")
        return {"error": f"Network error while fetching Reddit data: {str(e)}"}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": f"Unexpected error: {str(e)}"}

# Example usage (for testing directly)
if __name__ == "__main__":
    test_subreddit = "oralcare"
    print(f"Fetching top 5 posts from r/{test_subreddit}...")
    data = fetch_subreddit_posts(test_subreddit, limit=5)
    if isinstance(data, list):
        for i, post_data in enumerate(data):
            print(f"\n--- Post {i+1} ---")
            print(f"Title: {post_data['title']}")
            print(f"Score: {post_data['score']}")
            print(f"URL: {post_data['url']}")
    else:
        print(f"Error: {data}")
