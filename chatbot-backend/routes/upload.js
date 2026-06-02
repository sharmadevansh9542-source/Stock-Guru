import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import mammoth from "mammoth";

// Helper: format bytes
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const router = express.Router();

// Store files in memory (up to 25 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "text/markdown",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

/**
 * POST /api/upload
 * Accepts a single file, extracts text content, returns it.
 */
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const { originalname, mimetype, buffer, size } = req.file;

  try {
    let extractedText = "";
    let fileType = "";

    // ─── PDF ───────────────────────────────────────────────
    if (mimetype === "application/pdf") {
      fileType = "PDF";
      const data = await pdfParse(buffer);
      extractedText = data.text?.trim() || "";
      if (!extractedText) {
        extractedText = "[PDF appears to contain only images or scanned content — no extractable text found.]";
      }
    }

    // ─── Word / DOCX ───────────────────────────────────────
    else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword"
    ) {
      fileType = "Word Document";
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value?.trim() || "[No readable text found in document.]";
    }

    // ─── Plain Text / CSV / Markdown ───────────────────────
    else if (mimetype.startsWith("text/")) {
      fileType = mimetype === "text/csv" ? "CSV" : mimetype === "text/markdown" ? "Markdown" : "Text";
      extractedText = buffer.toString("utf-8").trim();
    }

    // ─── Images ────────────────────────────────────────────
    else if (mimetype.startsWith("image/")) {
      fileType = "Image";
      const ext = originalname.split(".").pop()?.toUpperCase() || "IMAGE";
      // Text models cannot view images directly — provide metadata context
      extractedText = `[The user has uploaded an image file: "${originalname}" (${ext} format, ${formatBytes(size)}). ` +
        `As a text-based AI, I cannot directly see the image content. ` +
        `Please describe the image or ask a question about it, and I will help based on your description.]`;
    }

    // Truncate very large texts to protect token limits
    const MAX_CHARS = 80_000;
    const truncated = extractedText.length > MAX_CHARS;
    const finalText = truncated
      ? extractedText.slice(0, MAX_CHARS) + "\n\n[... content truncated due to length ...]"
      : extractedText;

    return res.json({
      success: true,
      fileName: originalname,
      fileType,
      mimeType: mimetype,
      sizeBytes: size,
      extractedText: finalText,
      truncated,
      isImage: mimetype.startsWith("image/"),
    });
  } catch (err) {
    console.error("File extraction error:", err);
    return res.status(500).json({ error: `Failed to process file: ${err.message}` });
  }
});

export default router;
