import express from "express";

const app = express();

// Railway injects PORT at runtime. Fall back to 3000 for local dev.
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Railway pings this to decide when a new deploy is live.
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Bind to 0.0.0.0, not localhost — Railway's proxy can't reach a container
// that only listens on the loopback interface.
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on port ${port}`);
});

// Railway sends SIGTERM before replacing a container on redeploy.
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down");
  server.close(() => process.exit(0));
});
