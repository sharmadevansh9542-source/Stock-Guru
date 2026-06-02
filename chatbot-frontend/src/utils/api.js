const API_BASE = "/api";

/**
 * Send a message and stream the response via SSE.
 * @param {Object} params
 * @param {string} params.message - User message text
 * @param {string|null} params.conversationId - Existing conversation ID (or null to start new)
 * @param {string|null} params.systemPrompt - Optional custom system prompt
 * @param {string|null} params.fileContext - Optional extracted file text to prepend as context
 * @param {function} params.onChunk - Called for each text chunk: (text) => void
 * @param {function} params.onDone - Called when stream ends: (conversationId) => void
 * @param {function} params.onError - Called on error: (error) => void
 * @returns {AbortController} - Call .abort() to cancel the stream
 */
export async function sendMessage({ message, conversationId, systemPrompt, fileContext, onChunk, onDone, onError }) {
  const controller = new AbortController();

  // If there's file context, prefix the message so the AI sees both
  const fullMessage = fileContext
    ? `${fileContext}\n\n---\nUser question: ${message}`
    : message;

  try {
    const res = await fetch(`${API_BASE}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: fullMessage, conversationId, systemPrompt }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // Keep incomplete line

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6));

          if (data.type === "chunk") {
            onChunk?.(data.content, data.conversationId);
          } else if (data.type === "done") {
            onDone?.(data.conversationId);
          } else if (data.type === "error") {
            onError?.(new Error(data.error));
          }
        } catch {
          // Skip malformed lines
        }
      }
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      onError?.(err);
    }
  }

  return controller;
}

/**
 * Upload a file and extract its text content.
 * @param {File} file - The File object from an <input type="file">
 * @returns {Promise<{fileName, fileType, mimeType, sizeBytes, extractedText, truncated, isImage}>}
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch conversation history
 */
export async function getConversation(conversationId) {
  const res = await fetch(`${API_BASE}/chat/${conversationId}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

/**
 * Delete a conversation
 */
export async function deleteConversation(conversationId) {
  const res = await fetch(`${API_BASE}/chat/${conversationId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete conversation");
  return res.json();
}

/**
 * Health check
 */
export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
