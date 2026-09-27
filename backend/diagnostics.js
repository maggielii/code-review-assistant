console.log("Starting server...");
console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET set:", !!process.env.JWT_SECRET);
console.log("GEMINI_API_KEY set:", !!process.env.GEMINI_API_KEY);
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});