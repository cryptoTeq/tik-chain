module.exports = Object.freeze({
  port: process.env["PORT"] || 3000,
  protocol: process.env["HTTPS"] === "TRUE" ? "https" : "http",
  serverUrl: process.env["SERVER_URL"] || "localhost",
});
