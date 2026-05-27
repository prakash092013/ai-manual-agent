# Manual Agent Functions (Browser Demo)

This is a small, browser-run demo of a **tool-calling loop** (“Thought → Action → PAUSE → Observation → … → Answer”) using the OpenAI JS SDK.

It simulates an “agent” that answers:
> “What are some activity ideas that I can do this afternoon based on my location and weather?”

by calling two local “tools”:
- `getLocation()` (returns your location)
- `getCurrentWeather(location)` (returns weather for that location)

## How it works

- `index.html` loads `index.js` as an ES module.
- An **import map** tells the browser how to resolve the bare import `"openai"`.
- `index.js`:
  - Builds a `systemPrompt` that *forces* the model into the loop format.
  - Sends messages to `openai.chat.completions.create(...)`.
  - Parses the assistant text for an `Action: <tool>: <arg>` line.
  - Calls the matching function from `tools.js`.
  - Feeds the result back as an `Observation: ...` message.
  - Stops when the model returns an `Answer:` without an `Action:`.

The loop is capped by `MAX_ITERATIONS = 5` to prevent infinite cycles.

## Files

- `index.html`
  - Provides the import map:
    - `"openai"` → `https://esm.sh/openai@4?bundle`
  - Loads `index.js`.

- `index.js`
  - Creates the OpenAI client in the browser using `dangerouslyAllowBrowser: true`.
  - Runs the agent loop and logs each iteration to the console.

- `tools.js`
  - Contains the “tools” the model is allowed to call.
  - Right now these are simple stubs:
    - `getLocation()` returns `"San Diego, CA"`
    - `getCurrentWeather()` returns a JSON string (currently hardcoded)

## Run locally

1. Serve this folder from your local web server (you’re using XAMPP already).
2. Open `index.html` in the browser:
   - `http://localhost/ai-projects/manual-agent-functions/index.html`
3. Set your API key in DevTools → Console:

```js
localStorage.setItem("OPENAI_API_KEY", "sk-...")
```

4. Reload the page and open DevTools → Console to see the iteration logs.

## Example console output (sample run)

Your run shows the model performing a 3-iteration loop:

- **Iteration #1**
  - Thought: it needs location
  - Action: `getLocation: null`
- **Iteration #2**
  - Thought: it has location; needs weather
  - Action: `getCurrentWeather: San Diego, CA`
- **Iteration #3**
  - Answer: activity ideas tailored to San Diego + weather

Example (excerpt):

```text
Iteration #1
Thought: I need to gather information about the user's location and current weather in order to provide tailored activity ideas.
Action: getLocation: null
PAUSE
Calling function getLocation with argument null

Iteration #2
Thought: Now that I have the user's location (San Diego, CA), I should retrieve the current weather...
Action: getCurrentWeather: San Diego, CA
PAUSE
Calling function getCurrentWeather with argument San Diego, CA

Iteration #3
Answer: Enjoy the sunny weather in San Diego, CA by going for a beach day, visiting Balboa Park, or taking a hike at Torrey Pines State Natural Reserve.
Agent finished with task
```

## Notes / caveats

- **API key security**: this demo reads `OPENAI_API_KEY` from `localStorage` and sends requests from the browser. This is fine for a local experiment, but **do not** ship this pattern to production. In a real app, call OpenAI from a server you control so your key is never exposed to users.
- **Model choice**: the current code uses `model: "gpt-3.5-turbo"` in the loop. If that model name isn’t enabled/available for your account, switch it to a model you have access to.

## Next steps (optional improvements)

- Make `getCurrentWeather(location)` actually use the `location` argument (it’s currently ignored in `tools.js`).
- Return structured observations (real JSON objects) and add stricter parsing/validation.
- Move the OpenAI call to a small local server endpoint to avoid exposing API keys in the browser.
