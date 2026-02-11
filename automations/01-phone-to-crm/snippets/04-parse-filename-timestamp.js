export default defineComponent({
  async run({ steps }) {
    const filename =
      steps.trigger?.event?.body?.filename ||
      steps.trigger?.event?.body?.created_at?.filename ||
      steps.trigger?.event?.body?.file?.name ||
      null;

    if (!filename) {
      throw new Error("No filename found. Check trigger output structure.");
    }

    const dateString = String(filename)
      .replace(/ at /i, " ")
      .replace(/\.txt$/i, "")
      .trim();

    const dateObject = new Date(dateString);
    const timestamp = dateObject.getTime();

    if (Number.isNaN(timestamp)) {
      throw new Error(`Failed to parse timestamp from filename: "${dateString}"`);
    }

    return { timestamp };
  },
});

