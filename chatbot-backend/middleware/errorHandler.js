export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Anthropic API specific errors
  if (err.name === "APIError") {
    return res.status(err.status || 500).json({
      error: "AI service error",
      detail: err.message,
    });
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
