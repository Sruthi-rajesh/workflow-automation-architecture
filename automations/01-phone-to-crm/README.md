# Phone Call → CRM (Transcribe + Summarize + Update HubSpot)

## Goal
Automatically capture recorded phone calls, generate a transcript + summary + action items, and update the CRM record (contact + call note). This ensures every call is documented with minimal effort.

## Tools
- iPhone Call Recording (iOS 18.1+)
- iOS Shortcuts (Share Sheet workflow)
- Pipedream (workflow + Node.js steps)
- OpenAI Whisper (transcription)
- OpenAI Chat (summary + structured extraction)
- HubSpot (Create/Update Contact + Create Note)
- (Optional) Google Calendar (create follow-up event)
- (Optional) Gmail/Email (draft follow-up email)

## Trigger
A call is recorded on iPhone → user taps Share Sheet → sends recording to a Pipedream Webhook.

## Outputs
- Transcript stored/used in workflow
- CRM Contact created or updated (keyed by caller phone number)
- CRM Note created and attached to the contact (includes summary + action items)
- Optional:
  - Calendar follow-up event created when needed
  - Draft follow-up email created when needed

---

## Why it matters

### What manual work this replaces
- Listening to a full call again to remember details
- Writing call notes manually
- Copy/pasting details into CRM fields
- Creating follow-up tasks/events manually
- Risk of forgetting action items or losing context

### Business impact
- Faster follow-up (less delay after calls)
- Better CRM hygiene (consistent notes + structured data)
- Reduced missed leads and dropped callbacks
- More reliable pipeline tracking and handover
- Minimal friction: “one tap” export from iPhone, then fully automated

(Your PDF notes this is not fully automatic export on iOS yet, but one Share Sheet tap is enough to hand off the recording. On the server side, Pipedream downloads, transcribes, summarizes with GPT, and updates the CRM keyed on caller number.)

---

## Architecture (high-level)

**Source → Processing → Destination**

- **Source**
  - iPhone call recording (iOS 18.1+)
  - iOS Shortcut (Share Sheet → webhook request)
- **Processing**
  - Pipedream receives file → stores/uploads → transcribes (Whisper)
  - GPT summarizes + extracts structured fields
  - Applies matching/upsert logic (phone number as primary key)
- **Destination**
  - HubSpot Contact (create/update)
  - HubSpot Note (call notes + action items)
  - Optional: Google Calendar + email draft

### Error handling / retries / fallbacks
- If transcription fails → log error + stop safely (no bad CRM updates)
- If summary extraction fails → still write raw transcript into CRM note (fallback)
- If contact lookup fails → create new contact with whatever identity data is available
- If API rate limit → retry with backoff (or queue for retry step)
- If file is empty/corrupt → mark as failed + alert (no partial CRM writes)

---

## Data contract

### Inputs
- `call_recording_file` (audio file)
- `caller_phone` (preferred key; may come from shortcut metadata OR be extracted)
- `call_timestamp`
- (Optional) `agent_name`
- (Optional) `source_system` = "iphone_call_recording"

### Outputs
**Objects created/updated**
- HubSpot Contact (create/update)
- HubSpot Note (create and associate to contact)
- Optional: Calendar Event, Email Draft

**Properties written (typical)**
- Contact:
  - `phone`
  - `firstname` / `lastname` (if detected)
  - `email` (if detected)
  - `lead_source` (optional)
  - `last_contacted_date` (optional)
- Note:
  - `call_summary`
  - `key_points`
  - `action_items`
  - `full_transcript` (or link)
  - `call_date_time`

---

## Step-by-step logic
1. **Trigger (Webhook)**
   - Pipedream workflow starts when the iPhone shortcut posts the audio file to the webhook.
2. **Upload / normalize file**
   - Store the file in workflow storage (and/or upload to a drive bucket).
3. **Transcribe**
   - Send audio to Whisper → get `transcript_text`.
4. **Summarize + extract**
   - GPT produces:
     - Summary
     - Action items
     - Customer intent / enquiry type
     - Any detected contact details (name/email)
     - Follow-up recommendation (yes/no + date suggestion)
5. **Find or create Contact**
   - Lookup by `phone`
   - If found → update
   - If not found → create new contact
6. **Create CRM Note**
   - Attach note to the contact:
     - Summary + action items + transcript snippet
7. **Conditional branch: follow-up needed**
   - If follow-up required:
     - create calendar event
     - create email draft (optional)
8. **Log completion**
   - Save run outcome (success/failure + contact id)

---

## Edge cases handled
- **Missing phone number**
  - Fallback to email if present; otherwise create a “Needs Review” record or stop with alert.
- **Duplicate contact**
  - If multiple matches → pick most recently updated OR send to manual review.
- **Empty transcript / bad audio**
  - Write a note: “Transcription failed / empty audio” + log failure.
- **API limits**
  - Backoff + retry; avoid duplicate notes by using an idempotency key.
- **Very long calls**
  - Summarize in chunks, then combine summary.

---

## Monitoring & logging

### Where logs live
- Pipedream: run logs per execution
- (Optional) a Google Sheet / Airtable “Run Log” table:
  - timestamp, status, contact_id, error_message

### How failures are alerted
- Pipedream error notifications (email)
- Optional: Slack alert for failures
- Optional: daily “failed runs” digest

---

## Screenshots
- Pipedream workflow overview: `../../assets/phone-to-crm/pipedream-flow.png`
- HubSpot contact + note example (redacted): `../../assets/phone-to-crm/hubspot-note-redacted.png`
- Shortcut share sheet trigger (optional): `../../assets/phone-to-crm/ios-shortcut-trigger.png`

