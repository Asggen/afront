const express = require("express");
const path = require("path");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.set("trust proxy", 1);

// Disable the X-Powered-By header to avoid exposing Express
app.disable("x-powered-by");

// Use Helmet to set various HTTP headers for better security
app.use(helmet());

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply rate limiter to all requests
app.use(limiter);

// Serve static files from the build-prod-static directory
app.use(express.static(path.join(__dirname, "build-prod-static")));

// Serve index.html for all other routes (except static files)
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "build-prod-static", "index.html");
  res.sendFile(indexPath);
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
