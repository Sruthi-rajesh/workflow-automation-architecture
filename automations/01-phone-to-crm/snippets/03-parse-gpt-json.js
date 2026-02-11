export default defineComponent({
  async run({ steps }) {
    const gptRaw =
      steps.chat?.$return_value?.generated_message?.content ||
      steps.chat?.$return_value?.original_messages_with_assistant_response?.[1]?.content ||
      "";

    if (!gptRaw) throw new Error("No GPT content found. Check Chat step output.");

    const cleaned = gptRaw.replace(/```json|```/g, "").trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No valid JSON object found in GPT output.");

    let data;
    try {
      data = JSON.parse(match[0]);
    } catch (err) {
      throw new Error("Failed to parse GPT JSON: " + err.message);
    }

    return {
      contact_name: data.contact_name || null,
      company_name: data.company_name || null,
      phone_number: data.phone_number || null,
      email_address: data.email_address || null,
      lead_summary: data.lead_summary || null,
      action_items: Array.isArray(data.action_items) ? data.action_items : [],
      intent: data.intent || "other",
      calendar_event: {
        date_time: data.calendar_event?.date_time || null,
        end_time: data.calendar_event?.end_time || null,
        subject: data.calendar_event?.subject || null,
        attendee_email: data.calendar_event?.attendee_email || null,
      },
      confidence_score: data.confidence_score || null,
    };
  },
});

