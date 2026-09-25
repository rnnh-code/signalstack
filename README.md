# SignalStack

Finds topics that are suddenly picking up on Reddit, then drafts a landing page for one of them.

**Status: archived side project from early 2026.** Kept for reference. Not maintained, and not tested against Reddit's current API.

## How it works

1. **Fetch.** Pulls recent posts from the subreddits you pick, using PRAW (the Python Reddit library).
2. **Group.** Turns each post into a sentence embedding with `sentence-transformers`, so posts about the same idea land near each other even when the wording differs.
3. **Spot bursts.** Runs Kleinberg's burst detection (2003) over post timing to flag topics whose activity jumps above their normal rate.
4. **Draft a page.** A React + Vite front end shows the trends and generates a simple landing page for the one you choose.

## Layout

- `backend/`: FastAPI service. `services/reddit_fetcher.py` fetches, `services/analysis/` embeds, scores and detects bursts.
- `frontend/`: React + Vite app with the trend view and landing page generator.
- `netlify.toml`: front-end deploy config.

## Run it

You need your own Reddit API app. Put `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` in `backend/.env`.

```sh
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

cd ../frontend
npm install
npm run dev
```

## License

MIT
