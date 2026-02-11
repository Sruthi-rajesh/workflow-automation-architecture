## Implementation 
The live workflow runs in Pipedream using a mix of built-in actions and Node.js steps.  

Node.js snippets (see `/snippets`):
1. `01-validate-m4a.js` — validates audio file type (extension + MIME).
2. `02-deepgram-transcribe.js` — transcribes audio (sync vs async based on file size). Uses `process.env.DEEPGRAM_API_KEY`.
3. `03-parse-gpt-json.js` — parses GPT output into a strict JSON object.
4. `04-parse-filename-timestamp.js` — converts filenames into a timestamp for logging/sorting (example utility).

> Note: The “Chat” and “Create Transcription” steps are configured using Pipedream’s OpenAI actions.  
> The prompt template and model choice are documented, but raw tokens/URLs are not included in this repo.

