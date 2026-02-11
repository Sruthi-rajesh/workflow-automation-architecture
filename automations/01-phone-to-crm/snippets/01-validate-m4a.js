export default defineComponent({
  async run({ steps, $ }) {
    // File object from a previous step (e.g., Google Drive upload)
    const file = steps.upload_file?.$return_value;

    if (!file) throw new Error("No file object from previous step");

    const fileName = (file.name || "").trim();
    const mimeType = (file.mimeType || "").trim();
    const fileId = file.id || file.fileId;

    // Strict M4A detection
    const isM4AByExt = /\.m4a(\?.*)?$/i.test(fileName);
    const M4A_MIME_TYPES = new Set(["audio/mp4", "audio/x-m4a", "audio/m4a", "audio/aac"]);
    const isM4AByMime = M4A_MIME_TYPES.has(mimeType);

    if (!(isM4AByExt || isM4AByMime)) {
      $.export("$summary", `Skipped: not M4A (${fileName || "unnamed"} / ${mimeType || "unknown"})`);
      return { skipped: true, reason: "not_m4a", fileName, mimeType };
    }

    $.export("$summary", `M4A detected: ${fileName || fileId} (${mimeType || "unknown"})`);
    return { fileId, fileName, mimeType: mimeType || "audio/mp4" };
  }
});

