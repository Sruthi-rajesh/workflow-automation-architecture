# Phone Call to CRM
Transcribe and summarize iPhone call recordings and push structured notes to your CRM via a webhook.

## Goal
To capture recorded phone calls, generate a transcript, summary with action items, and update the matching CRM contact (e.g., create/update contact and create a call note). This reduces manual note-taking and improves follow-up consistency and requires no additional call-recording applications.

## Tools
- iPhone Call Recording (requires iOS 18.1+ and region support)
- iOS Shortcuts (Share Sheet workflow)
- Pipedream (HTTP trigger and workflow steps)
- Transcription (e.g., Whisper / Deepgram)
- LLM summarization and structured extraction (e.g., OpenAI Chat)
- CRM (example: HubSpot API)

## Trigger
1) A call is recorded on iPhone (stored in Notes).
2) User exports the audio using the Share Sheet to an iOS Shortcut.
3) Shortcut sends the audio and metadata to a Pipedream webhook.

## Outputs
- Transcript (stored/used in workflow)
- CRM contact created or updated (matched primarily by phone)
- CRM note created and associated with the contact:
  - summary
  - key points
  - action items
  - transcript (full or partial)

## Architecture (high-level)
**iPhone (Notes) → Share Sheet Shortcut → Pipedream Webhook → Transcribe → Summarize/Extract → CRM update**

## Data contract (minimal)
The Share Sheet shortcut POSTs a form payload to your webhook with fields like:
- `audio` (file)
- `filename`
- `phone_raw`
- `duration_seconds`
- `created_at`

