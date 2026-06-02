import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { v4 as uuidv4 } from "uuid";
import Groq from "groq-sdk";
import { validateChatRequest } from "../middleware/validateRequest.js";
import { buildSystemPrompt } from "../utils/promptBuilder.js";

const router = express.Router();

// Lazy-init Groq client
let _groq = null;
const getClient = () => {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
};

// In-memory conversation store
const conversations = new Map();

// POST /api/chat/message — send a message, get a streaming response
router.post("/message", validateChatRequest, async (req, res) => {
  const { message, conversationId, systemPrompt } = req.body;

  const convId = conversationId || uuidv4();
  const history = conversations.get(convId) || [];

  // Set up SSE streaming
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Conversation-Id", convId);
  res.flushHeaders();

  const messages = [
    { role: "system", content: systemPrompt || buildSystemPrompt() },
    ...history,
    { role: "user", content: message },
  ];

  let assistantMessage = "";

  try {
    const stream = await getClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      stream: true,
      max_tokens: 4096,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        assistantMessage += text;
        res.write(
          `data: ${JSON.stringify({ type: "chunk", content: text, conversationId: convId })}\n\n`
        );
      }
    }

    // Save updated conversation
    conversations.set(convId, [
      ...history,
      { role: "user", content: message },
      { role: "assistant", content: assistantMessage },
    ]);

    // Signal completion
    res.write(
      `data: ${JSON.stringify({ type: "done", conversationId: convId })}\n\n`
    );
    res.end();
  } catch (err) {
    console.error("Groq API error:", err);
    res.write(
      `data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`
    );
    res.end();
  }
});

// GET /api/chat/:conversationId — fetch conversation history
router.get("/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  const history = conversations.get(conversationId);

  if (!history) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  res.json({ conversationId, messages: history });
});

// DELETE /api/chat/:conversationId — clear a conversation
router.delete("/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  conversations.delete(conversationId);
  res.json({ success: true, message: "Conversation cleared" });
});

// GET /api/chat — list all conversation IDs
router.get("/", (req, res) => {
  const ids = [...conversations.keys()];
  res.json({ conversations: ids, total: ids.length });
});

export default router;
