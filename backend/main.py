from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.reddit_fetcher import fetch_subreddit_posts

# Define request body model
class SearchQuery(BaseModel):
    query: str

app = FastAPI(
    title="SignalStack API",
    description="API for CPG trend analysis and validation.",
    version="0.1.0",
)

# Add CORS middleware
origins = [
    "http://localhost:5173",  # Default Vite dev server port
    "http://127.0.0.1:5173", # Alternative for localhost
    "http://localhost:5174",  # Current Vite server port (port 5173 was in use)
    "http://127.0.0.1:5174", # Alternative for localhost on port 5174
    # Add any other origins if needed (e.g., production frontend URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def read_root():
    return {"message": "Welcome to SignalStack API"}


# Import trend analysis components
from services.analysis import TrendAnalyzer

# Initialize the trend analyzer (lazy loaded when needed)
_trend_analyzer = None

def get_trend_analyzer():
    """Get or create the trend analyzer instance."""
    global _trend_analyzer
    if _trend_analyzer is None:
        _trend_analyzer = TrendAnalyzer()
    return _trend_analyzer

# Advanced search endpoint with trend analysis
@app.post("/search")
async def search_trends(search_request: SearchQuery):
    """Endpoint to search for trends using NLP and burst detection."""
    query = search_request.query
    print(f"Received search query: {query}")
    
    # Fetch relevant data from Reddit
    subreddit_name = "oralcare"  # Default for the MVP
    posts_data = fetch_subreddit_posts(subreddit_name, limit=30)
    
    # Check if we got actual post data or an error
    if isinstance(posts_data, dict) and "error" in posts_data:
        return {
            "query": query,
            "error": posts_data["error"],
            "status": "failed"
        }
    
    # Initialize the trend analyzer
    analyzer = get_trend_analyzer()
    
    # Analyze trends in the data
    try:
        # Extract a subset of post data to return to frontend
        sample_posts = []
        if posts_data and isinstance(posts_data, list):
            for post in posts_data[:5]:  # Only include first 5 for brevity
                sample_posts.append({
                    "title": post.get("title", ""),
                    "score": post.get("score", 0),
                    "url": post.get("url", ""),
                    "created_utc": post.get("created_utc", 0)
                })
        
        # Run the actual trend analysis
        analysis_results = analyzer.analyze_trends(query, posts_data)
        
        # Include the actual data in the response for transparency
        return {
            "query": query,
            "status": "completed",
            "reddit_data_used": {
                "post_count": len(posts_data) if isinstance(posts_data, list) else 0,
                "sample_posts": sample_posts
            },
            "results": analysis_results
        }
    except Exception as e:
        print(f"Error during trend analysis: {e}")
        return {
            "query": query,
            "error": str(e),
            "status": "failed"
        }


# New endpoint to fetch Reddit data
@app.get("/fetch-reddit/{subreddit_name}")
async def get_reddit_data(subreddit_name: str, limit: int = 10): # Add limit parameter
    """Endpoint to fetch posts from a specified subreddit."""
    print(f"Fetching data for subreddit: r/{subreddit_name} with limit: {limit}")
    posts_data = fetch_subreddit_posts(subreddit_name, limit=limit)
    return {"subreddit": subreddit_name, "limit": limit, "data": posts_data}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
