import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../utils/api";

const STORAGE_KEY = "ai_chatbot_conversations";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useChat() {
  const [conversations, setConversations] = useState(() => loadFromStorage());
  const [activeConvId, setActiveConvId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  // Persist conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // Storage quota exceeded or unavailable
    }
  }, [conversations]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  // Create a new conversation
  const newConversation = useCallback(() => {
    const id = uuidv4();
    const conv = { id, title: "New Chat", messages: [], createdAt: Date.now() };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(id);
    return id;
  }, []);

  // Update conversation state helpers
  const updateConv = useCallback((id, updater) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? updater(c) : c))
    );
  }, []);

  // Send a message (optionally with a file attachment)
  const send = useCallback(
    async (message, attachment = null) => {
      if (!message.trim() && !attachment) return;
      if (isStreaming) return;

      let convId = activeConvId;

      // Auto-create conversation if none active
      if (!convId) {
        convId = uuidv4();
        const conv = {
          id: convId,
          title: message.slice(0, 40) + (message.length > 40 ? "…" : ""),
          messages: [],
          createdAt: Date.now(),
        };
        setConversations((prev) => [conv, ...prev]);
        setActiveConvId(convId);
      }

      const userMsg = { id: uuidv4(), role: "user", content: message, ts: Date.now(), attachment: attachment || undefined };
      const assistantMsg = { id: uuidv4(), role: "assistant", content: "", ts: Date.now() };

      // Append user message immediately
      updateConv(convId, (c) => ({
        ...c,
        messages: [...c.messages, userMsg, assistantMsg],
        // Update title from first message
        title:
          c.messages.length === 0
            ? message.slice(0, 40) + (message.length > 40 ? "…" : "")
            : c.title,
      }));

      setIsStreaming(true);
      const aId = assistantMsg.id;

      const ctrl = await sendMessage({
        message,
        fileContext: attachment?.extractedText || null,
        conversationId: convId,
        onChunk: (text) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === aId ? { ...m, content: m.content + text } : m
                    ),
                  }
                : c
            )
          );
        },
        onDone: () => {
          setIsStreaming(false);
          abortRef.current = null;
        },
        onError: (err) => {
          console.error("Stream error:", err);
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === aId
                        ? { ...m, content: `⚠️ Error: ${err.message}`, error: true }
                        : m
                    ),
                  }
                : c
            )
          );
          setIsStreaming(false);
        },
      });

      abortRef.current = ctrl;
    },
    [activeConvId, isStreaming, updateConv]
  );

  // Stop streaming
  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(
    (id) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
      }
    },
    [activeConvId]
  );

  // Clear all conversations
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConvId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConv,
    activeConvId,
    isStreaming,
    setActiveConvId,
    newConversation,
    send,
    stopStreaming,
    deleteConversation,
    clearAllConversations,
  };
}
