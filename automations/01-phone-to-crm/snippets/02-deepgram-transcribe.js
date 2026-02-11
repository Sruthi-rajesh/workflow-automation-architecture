import axios from "axios";

export default defineComponent({
  async run({ steps, $ }) {
    const prev = steps.code?.$return_value || {};
    const fileId = prev.fileId;

    if (!fileId) throw new Error("No fileId found from previous step.");

    const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const fileSize = prev.fileSize || 0; 
    const useAsync = fileSize > 25 * 1024 * 1024; // >25MB

    const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
    if (!DEEPGRAM_API_KEY) throw new Error("Missing DEEPGRAM_API_KEY env var.");

    $.export("$summary", `Deepgram transcription starting (${useAsync ? "async" : "sync"})`);

    try {
      if (useAsync) {
        
        const callbackUrl = "https://<PIPEDREAM_WEBHOOK_URL>";

        const res = await axios({
          method: "POST",
          url: `https://api.deepgram.com/v1/listen?punctuate=true&callback=${encodeURIComponent(callbackUrl)}`,
          headers: {
            Authorization: `Token ${DEEPGRAM_API_KEY}`,
            "Content-Type": "application/json",
          },
          data: { url: fileUrl },
        });

        $.export("$summary", `Deepgram async submitted (request_id: ${res.data.request_id || "n/a"})`);
        return { mode: "async", request_id: res.data.request_id || null, status: res.data.status || "submitted" };
      }

      
      const res = await axios({
        method: "POST",
        url: `https://api.deepgram.com/v1/listen?punctuate=true`,
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": "application/json",
        },
        data: { url: fileUrl },
      });

      const transcript =
        res.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

      $.export("$summary", " Deepgram sync complete");
      return { mode: "sync", transcript };
    } catch (error) {
      const msg = error.response ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Deepgram transcription failed: ${msg}`);
    }
  },
});

