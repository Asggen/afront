const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

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
