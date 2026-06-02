export const validateChatRequest = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required and must be a string" });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({ error: "message cannot be empty" });
  }

  // Raised limit to 200k to accommodate file context prefixed messages
  if (message.length > 200_000) {
    return res.status(400).json({ error: "message is too long (max 200,000 characters)" });
  }

  next();
};
