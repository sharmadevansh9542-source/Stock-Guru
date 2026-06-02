import { useState, useRef, useCallback } from "react";
import { Send, Square, Paperclip, X, FileText, Image, File, AlertCircle, Loader2 } from "lucide-react";
import { uploadFile } from "../utils/api";

const ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
].join(",");

function getFileIcon(mimeType) {
  if (!mimeType) return <File size={14} />;
  if (mimeType.startsWith("image/")) return <Image size={14} />;
  if (mimeType === "application/pdf") return <FileText size={14} />;
  return <FileText size={14} />;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChatInput({ onSend, isStreaming, onStop, disabled }) {
  const [value, setValue] = useState("");
  const [attachment, setAttachment] = useState(null);   // { fileName, fileType, mimeType, sizeBytes, extractedText, isImage }
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    const msg = value.trim();
    if ((!msg && !attachment) || isStreaming || disabled || uploading) return;
    onSend(msg || "Please analyse the attached file.", attachment || null);
    setValue("");
    setAttachment(null);
    setUploadError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, attachment, isStreaming, disabled, uploading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  };

  // ── File handling ───────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";

    setUploadError(null);
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setAttachment(result);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setUploadError(null);
  };

  const canSend = !isStreaming && !uploading && !disabled && (value.trim() || attachment);

  return (
    <div className="relative">
      {/* ── Attachment preview chip ── */}
      {(attachment || uploading || uploadError) && (
        <div className="mb-2 flex items-start gap-2">
          {uploading && (
            <div className="flex items-center gap-2 bg-surface-3 border border-surface-4 rounded-xl px-3 py-2 text-xs text-ink-muted">
              <Loader2 size={13} className="animate-spin text-accent" />
              <span>Uploading file…</span>
            </div>
          )}

          {uploadError && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-800/40 rounded-xl px-3 py-2 text-xs text-red-400">
              <AlertCircle size={13} />
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="ml-1 hover:text-red-300">
                <X size={11} />
              </button>
            </div>
          )}

          {attachment && !uploading && (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-3 py-2 text-xs max-w-xs">
              <span className="text-accent shrink-0">
                {getFileIcon(attachment.mimeType)}
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-ink font-medium truncate">{attachment.fileName}</span>
                <span className="text-ink-dim">
                  {attachment.fileType} · {formatBytes(attachment.sizeBytes)}
                  {attachment.truncated && " · truncated"}
                </span>
              </div>
              <button
                onClick={removeAttachment}
                className="ml-1 text-ink-dim hover:text-ink transition-colors shrink-0"
                title="Remove attachment"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Input row ── */}
      <div className="flex items-end gap-2 bg-surface-2 border border-surface-4 rounded-2xl px-4 py-3 focus-within:border-accent/50 focus-within:shadow-[0_0_0_3px_#7c6aff18] transition-all duration-200">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={handleFileChange}
          id="sg-file-input"
        />

        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isStreaming}
          className={`transition-colors mb-0.5 shrink-0 ${
            uploading
              ? "text-ink-dim cursor-not-allowed"
              : attachment
              ? "text-accent hover:text-accent/80"
              : "text-ink-dim hover:text-ink-muted"
          }`}
          title="Attach PDF, Word, text, image…"
          aria-label="Attach file"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={attachment ? "Ask a question about the file…" : "Ask me anything…"}
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-ink text-sm placeholder-ink-dim resize-none focus:outline-none leading-relaxed max-h-[180px] disabled:opacity-50"
          style={{ minHeight: "24px" }}
        />

        {/* Send / Stop button */}
        <button
          onClick={isStreaming ? onStop : handleSubmit}
          disabled={!isStreaming && !canSend}
          className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 mb-0.5 ${
            isStreaming
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
              : canSend
              ? "bg-accent text-white hover:bg-accent/90 glow-accent"
              : "bg-surface-3 text-ink-dim cursor-not-allowed"
          }`}
          aria-label={isStreaming ? "Stop" : "Send"}
        >
          {isStreaming ? <Square size={14} /> : <Send size={14} />}
        </button>
      </div>

      <p className="text-center text-[10px] text-ink-dim mt-2">
        Press <kbd className="px-1 py-0.5 rounded bg-surface-3 text-ink-muted font-mono text-[9px]">Enter</kbd> to send ·{" "}
        <kbd className="px-1 py-0.5 rounded bg-surface-3 text-ink-muted font-mono text-[9px]">Shift+Enter</kbd> for new line ·{" "}
        <span className="text-ink-dim">📎 PDF, Word, TXT, CSV, Image</span>
      </p>
    </div>
  );
}
