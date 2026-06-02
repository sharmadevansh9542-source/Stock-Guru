import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests — please slow down.",
    retryAfter: "1 minute",
  },
  skip: (req) => process.env.NODE_ENV === "development",
});
